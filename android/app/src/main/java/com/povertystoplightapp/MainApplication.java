package com.povertystoplightapp;
import com.povertystoplightapp.CustomDeletePackage;
import android.app.Application;
import com.facebook.react.ReactApplication;
import com.bugsnag.BugsnagReactNative;
import com.testfairy.react.TestFairyPackage;
import com.christopherdro.htmltopdf.RNHTMLtoPDFPackage;
import com.christopherdro.RNPrint.RNPrintPackage;
import com.mapbox.rctmgl.RCTMGLPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.reactnativecommunity.netinfo.NetInfoPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.reactnativecommunity.geolocation.GeolocationPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.delightfulstudio.wheelpicker.WheelPickerPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.reactcommunity.rnlanguages.RNLanguagesPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.facebook.react.modules.storage.ReactDatabaseSupplier;

import androidx.multidex.MultiDex;
import android.content.Context;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
        
          new MainReactPackage(),
            BugsnagReactNative.getPackage(),
            new TestFairyPackage(),
          new CustomDeletePackage(),
            new RNHTMLtoPDFPackage(),
            new RNPrintPackage(),
            new RCTMGLPackage(),
            new AsyncStoragePackage(),
            new NetInfoPackage(),
            new RNGestureHandlerPackage(),
            new GeolocationPackage(),
          new RNDeviceInfo(),
          new WheelPickerPackage(),
          new SplashScreenReactPackage(),
          new VectorIconsPackage(),
          new RNLanguagesPackage(),
          new RNFetchBlobPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    long size = 250L * 1024L * 1024L; // 250 MB
    com.facebook.react.modules.storage.ReactDatabaseSupplier.getInstance(getApplicationContext()).setMaximumSize(size);
  }
   @Override
     protected void attachBaseContext(Context base) {
     super.attachBaseContext(base);
     MultiDex.install(this);
  }
}



