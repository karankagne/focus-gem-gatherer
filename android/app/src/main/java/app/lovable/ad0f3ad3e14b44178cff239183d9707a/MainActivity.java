package app.lovable.ad0f3ad3e14b44178cff239183d9707a;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import app.lovable.focus.NotificationBlockerPlugin;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Register our plugins
        registerPlugin(NotificationBlockerPlugin.class);
    }
}
