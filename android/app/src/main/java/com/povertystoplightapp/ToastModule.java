package com.povertystoplightapp;

import android.widget.Toast;
import android.content.Context;
import java.io.File;
import android.app.ActivityManager;
import android.app.Activity;

import android.util.Log;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.Map;
import java.util.HashMap;

public class ToastModule extends ReactContextBaseJavaModule {

  private static final String DURATION_SHORT_KEY = "SHORT";
  private static final String DURATION_LONG_KEY = "LONG";

  public ToastModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }
  @Override
  public String getName() {
     return "ToastExample";
  }

 @ReactMethod
  public void show(String message, int duration) {
    Toast.makeText(getReactApplicationContext(), message, duration).show();
  }


@ReactMethod
    public void deleteCache() {
    try {



        Context context = getReactApplicationContext();
        File dir = context.getCacheDir();
 File applicationDirectory = new File(dir.getParent());
  ((ActivityManager)context.getSystemService(Context.ACTIVITY_SERVICE))
                        .clearApplicationUserData();
    } catch (Exception e) { e.printStackTrace();}
}

 public static boolean deleteFile(File file) {
        boolean deletedAll = true;
        if (file != null) {
            if (file.isDirectory()) {
                String[] children = file.list();
                for (int i = 0; i < children.length; i++) {
                    deletedAll = deleteFile(new File(file, children[i])) && deletedAll;
                }
            } else {
                deletedAll = file.delete();
            }
        }

        return deletedAll;
    }
}