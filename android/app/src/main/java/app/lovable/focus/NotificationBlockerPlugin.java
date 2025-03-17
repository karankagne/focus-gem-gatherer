package app.lovable.focus;

import android.Manifest;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.os.Build;
import android.provider.Settings;
import android.util.Log;
import androidx.core.app.ActivityCompat;
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
        
        JSObject ret = new JSObject();
        ret.put("hasPermission", hasPermission);
        call.resolve(ret);
    }

    @PluginMethod
    public void requestNotificationPermission(PluginCall call) {
        Log.d(TAG, "Requesting notification permission");
        
        if (Build.VERSION.SDK_INT >= 33) { // Android 13+ (Tiramisu)
            // Save the call for later
            savedCall = call;
            
            if (ContextCompat.checkSelfPermission(getContext(), Manifest.permission.POST_NOTIFICATIONS) 
                    != PackageManager.PERMISSION_GRANTED) {
                
                Log.d(TAG, "Permission not granted, requesting permission");
                
                // Request the permission
                String[] permissions = { Manifest.permission.POST_NOTIFICATIONS };
                
                // Use standard Android permission request
                ActivityCompat.requestPermissions(getActivity(), permissions, REQUEST_NOTIFICATION_PERMISSION);
                return;
            } else {
                Log.d(TAG, "Permission already granted");
            }
        } else {
            Log.d(TAG, "Pre-Android 13 device, no permission needed");
        }
        
        // If we reach here, either permission is granted or not needed
        JSObject ret = new JSObject();
        ret.put("granted", true);
        call.resolve(ret);
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
            JSObject ret = new JSObject();
            ret.put("granted", granted);
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
        
        // This is a simplified implementation
        // In a real app, you would need to use NotificationListenerService
        // which requires special permissions and setup
        JSObject ret = new JSObject();
        ret.put("success", true);
        ret.put("message", "Mock implementation, no actual blocking performed");
        call.resolve(ret);
    }
    
    @PluginMethod
    public void unblockAppNotifications(PluginCall call) {
        String packageName = call.getString("packageName");
        if (packageName == null) {
            call.reject("Package name is required");
            return;
        }
        
        // Similar to blockAppNotifications, this is simplified
        JSObject ret = new JSObject();
        ret.put("success", true);
        ret.put("message", "Mock implementation, no actual unblocking performed");
        call.resolve(ret);
    }
} 