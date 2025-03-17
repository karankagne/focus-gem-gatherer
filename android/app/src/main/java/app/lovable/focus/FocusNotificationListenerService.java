
package app.lovable.focus;

import android.app.Notification;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Build;
import android.service.notification.NotificationListenerService;
import android.service.notification.StatusBarNotification;
import android.util.Log;

import java.util.HashSet;
import java.util.Set;

public class FocusNotificationListenerService extends NotificationListenerService {
    private static final String TAG = "FocusNotificationListenerService";
    private Set<String> blockedPackages = new HashSet<>();
    private NotificationReceiver receiver;

    @Override
    public void onCreate() {
        super.onCreate();
        Log.d(TAG, "NotificationListenerService created");
        
        // Register broadcast receiver to receive blocking commands
        receiver = new NotificationReceiver();
        IntentFilter filter = new IntentFilter();
        filter.addAction("app.lovable.focus.BLOCK_NOTIFICATIONS");
        registerReceiver(receiver, filter);
    }
    
    @Override
    public void onDestroy() {
        super.onDestroy();
        if (receiver != null) {
            unregisterReceiver(receiver);
            receiver = null;
        }
    }

    @Override
    public void onNotificationPosted(StatusBarNotification sbn) {
        String packageName = sbn.getPackageName();
        
        if (blockedPackages.contains(packageName)) {
            Log.d(TAG, "Blocking notification from: " + packageName);
            
            // Cancel the notification
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                cancelNotification(sbn.getKey());
            } else {
                cancelNotification(packageName, sbn.getTag(), sbn.getId());
            }
        }
    }

    public void addBlockedPackage(String packageName) {
        blockedPackages.add(packageName);
        Log.d(TAG, "Added to blocked packages: " + packageName);
        Log.d(TAG, "Current blocked packages: " + blockedPackages.toString());
        
        // Also remove any existing notifications from this package
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            StatusBarNotification[] activeNotifications = getActiveNotifications();
            if (activeNotifications != null) {
                for (StatusBarNotification notification : activeNotifications) {
                    if (notification.getPackageName().equals(packageName)) {
                        cancelNotification(notification.getKey());
                    }
                }
            }
        }
    }

    public void removeBlockedPackage(String packageName) {
        blockedPackages.remove(packageName);
        Log.d(TAG, "Removed from blocked packages: " + packageName);
        Log.d(TAG, "Current blocked packages: " + blockedPackages.toString());
    }

    private class NotificationReceiver extends BroadcastReceiver {
        @Override
        public void onReceive(Context context, Intent intent) {
            String action = intent.getAction();
            if ("app.lovable.focus.BLOCK_NOTIFICATIONS".equals(action)) {
                String packageName = intent.getStringExtra("packageName");
                boolean block = intent.getBooleanExtra("block", true);
                
                if (packageName == null) {
                    Log.e(TAG, "Received block notification intent with null package name");
                    return;
                }
                
                Log.d(TAG, "Received broadcast to " + (block ? "block" : "unblock") + " notifications for: " + packageName);
                
                if (block) {
                    addBlockedPackage(packageName);
                } else {
                    removeBlockedPackage(packageName);
                }
            }
        }
    }
}
