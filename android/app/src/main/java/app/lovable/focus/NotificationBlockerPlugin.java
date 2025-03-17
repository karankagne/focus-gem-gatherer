
package app.lovable.focus;

import android.Manifest;
import android.app.Activity;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.os.Build;
import android.provider.Settings;
import android.util.Log;
import androidx.core.app.ActivityCompat;
import androidx.core.app.NotificationManagerCompat;
import androidx.core.content.ContextCompat;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@CapacitorPlugin(
    name = "NotificationBlocker",
    permissions = {
        @Permission(
            alias = "notifications",
            strings = { Manifest.permission.POST_NOTIFICATIONS }
        )
    }
)
public class NotificationBlockerPlugin extends Plugin {
    private static final String TAG = "NotificationBlocker";
    private static final int REQUEST_NOTIFICATION_PERMISSION = 1;
    private static final int REQUEST_NOTIFICATION_POLICY_ACCESS = 2;
    private static final int REQUEST_NOTIFICATION_LISTENER_SETTINGS = 3;
    
    private PluginCall savedCall;

    @PluginMethod
    public void checkNotificationPermission(PluginCall call) {
        Log.d(TAG, "Checking notification permission");
        
        boolean hasPermission = false;
        
        if (Build.VERSION.SDK_INT >= 33) { // Android 13+ (Tiramisu)
            hasPermission = ContextCompat.checkSelfPermission(getContext(), Manifest.permission.POST_NOTIFICATIONS) 
                == PackageManager.PERMISSION_GRANTED;
            Log.d(TAG, "Android 13+ permission check: " + hasPermission);
        } else {
            // For older versions, we don't need POST_NOTIFICATIONS permission
            hasPermission = true;
            Log.d(TAG, "Pre-Android 13 device, no permission needed");
        }
        
        // Check also if we have notification listener access
        boolean hasListenerAccess = hasNotificationListenerAccess();
        Log.d(TAG, "Notification listener access: " + hasListenerAccess);
        
        JSObject ret = new JSObject();
        ret.put("hasPermission", hasPermission && hasListenerAccess);
        call.resolve(ret);
    }

    @PluginMethod
    public void requestNotificationPermission(PluginCall call) {
        Log.d(TAG, "Requesting notification permission");
        
        // Save the call for later
        savedCall = call;
        
        // For Android 13+, request POST_NOTIFICATIONS permission
        if (Build.VERSION.SDK_INT >= 33) {
            if (ContextCompat.checkSelfPermission(getContext(), Manifest.permission.POST_NOTIFICATIONS) 
                    != PackageManager.PERMISSION_GRANTED) {
                
                Log.d(TAG, "POST_NOTIFICATIONS permission not granted, requesting permission");
                
                // Request the permission
                String[] permissions = { Manifest.permission.POST_NOTIFICATIONS };
                ActivityCompat.requestPermissions(getActivity(), permissions, REQUEST_NOTIFICATION_PERMISSION);
                return;
            }
        }
        
        // If we don't have notification listener access, request it
        if (!hasNotificationListenerAccess()) {
            Log.d(TAG, "Notification listener access not granted, opening settings");
            openNotificationListenerSettings();
            return;
        }
        
        // If we reach here, permissions are granted
        JSObject ret = new JSObject();
        ret.put("granted", true);
        call.resolve(ret);
    }
    
    private boolean hasNotificationListenerAccess() {
        Context context = getContext();
        Set<String> packageNames = NotificationManagerCompat.getEnabledListenerPackages(context);
        return packageNames.contains(context.getPackageName());
    }
    
    private void openNotificationListenerSettings() {
        Intent intent = new Intent();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP_MR1) {
            intent.setAction(Settings.ACTION_NOTIFICATION_LISTENER_SETTINGS);
        } else {
            intent.setAction("android.settings.ACTION_NOTIFICATION_LISTENER_SETTINGS");
        }
        
        try {
            getActivity().startActivityForResult(intent, REQUEST_NOTIFICATION_LISTENER_SETTINGS);
        } catch (Exception e) {
            Log.e(TAG, "Error opening notification listener settings", e);
            if (savedCall != null) {
                savedCall.reject("Failed to open notification listener settings: " + e.getMessage());
                savedCall = null;
            }
        }
    }
    
    @Override
    protected void handleRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.handleRequestPermissionsResult(requestCode, permissions, grantResults);
        
        if (savedCall == null) {
            Log.e(TAG, "Null saved call in permission result");
            return;
        }
        
        if (requestCode == REQUEST_NOTIFICATION_PERMISSION) {
            boolean granted = grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED;
            
            Log.d(TAG, "Permission result: " + (granted ? "GRANTED" : "DENIED"));
            
            if (granted) {
                // Now check for notification listener access
                if (!hasNotificationListenerAccess()) {
                    openNotificationListenerSettings();
                    return;
                }
            }
            
            JSObject ret = new JSObject();
            ret.put("granted", granted);
            savedCall.resolve(ret);
            savedCall = null;
        }
    }
    
    @Override
    protected void handleOnActivityResult(int requestCode, int resultCode, Intent data) {
        super.handleOnActivityResult(requestCode, resultCode, data);
        
        if (requestCode == REQUEST_NOTIFICATION_LISTENER_SETTINGS) {
            if (savedCall == null) {
                Log.e(TAG, "Null saved call in activity result");
                return;
            }
            
            boolean hasAccess = hasNotificationListenerAccess();
            Log.d(TAG, "Notification listener settings result: " + (hasAccess ? "GRANTED" : "DENIED"));
            
            JSObject ret = new JSObject();
            ret.put("granted", hasAccess);
            savedCall.resolve(ret);
            savedCall = null;
        }
    }

    @PluginMethod
    public void getInstalledApps(PluginCall call) {
        JSObject ret = new JSObject();
        JSArray apps = new JSArray();
        
        try {
            PackageManager pm = getContext().getPackageManager();
            List<ApplicationInfo> packages = pm.getInstalledApplications(PackageManager.GET_META_DATA);
            
            for (ApplicationInfo packageInfo : packages) {
                if ((packageInfo.flags & ApplicationInfo.FLAG_SYSTEM) == 0) {
                    // Only add non-system apps
                    JSObject app = new JSObject();
                    app.put("packageName", packageInfo.packageName);
                    app.put("appName", pm.getApplicationLabel(packageInfo).toString());
                    apps.put(app);
                }
            }
            
            ret.put("apps", apps);
            call.resolve(ret);
        } catch (Exception e) {
            Log.e(TAG, "Error getting installed apps: " + e.getMessage());
            call.reject("Error getting installed apps: " + e.getMessage());
        }
    }

    @PluginMethod
    public void blockAppNotifications(PluginCall call) {
        String packageName = call.getString("packageName");
        if (packageName == null) {
            call.reject("Package name is required");
            return;
        }
        
        if (!hasNotificationListenerAccess()) {
            Log.d(TAG, "No notification listener access, opening settings");
            savedCall = call;
            openNotificationListenerSettings();
            return;
        }
        
        // On newer Android, we need to send a broadcast to our NotificationListenerService
        // This implementation assumes you have a NotificationListenerService set up
        try {
            Context context = getContext();
            Intent intent = new Intent("app.lovable.focus.BLOCK_NOTIFICATIONS");
            intent.putExtra("packageName", packageName);
            intent.putExtra("block", true);
            context.sendBroadcast(intent);
            
            JSObject ret = new JSObject();
            ret.put("success", true);
            call.resolve(ret);
        } catch (Exception e) {
            Log.e(TAG, "Error blocking notifications: " + e.getMessage());
            call.reject("Error blocking notifications: " + e.getMessage());
        }
    }
    
    @PluginMethod
    public void unblockAppNotifications(PluginCall call) {
        String packageName = call.getString("packageName");
        if (packageName == null) {
            call.reject("Package name is required");
            return;
        }
        
        if (!hasNotificationListenerAccess()) {
            Log.d(TAG, "No notification listener access, opening settings");
            savedCall = call;
            openNotificationListenerSettings();
            return;
        }
        
        try {
            Context context = getContext();
            Intent intent = new Intent("app.lovable.focus.BLOCK_NOTIFICATIONS");
            intent.putExtra("packageName", packageName);
            intent.putExtra("block", false);
            context.sendBroadcast(intent);
            
            JSObject ret = new JSObject();
            ret.put("success", true);
            call.resolve(ret);
        } catch (Exception e) {
            Log.e(TAG, "Error unblocking notifications: " + e.getMessage());
            call.reject("Error unblocking notifications: " + e.getMessage());
        }
    }
}
