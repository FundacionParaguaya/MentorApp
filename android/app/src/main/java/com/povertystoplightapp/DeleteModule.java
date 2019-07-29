package com.povertystoplightapp;

import android.content.Context;
import android.app.ActivityManager;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class DeleteModule extends ReactContextBaseJavaModule {


    public DeleteModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }
    @Override
    public String getName() {
        return "DeleteModule";
    }

    @ReactMethod
    public void deleteCache() {
        try {
            Context context = getReactApplicationContext();
            ((ActivityManager)context.getSystemService(Context.ACTIVITY_SERVICE)).clearApplicationUserData();
        } catch (Exception e) { 
            e.printStackTrace();}
    }
}