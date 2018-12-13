package com.starcu;

import android.app.Application;
import android.util.Log;

import com.facebook.react.ReactApplication;
import cn.qiuxiang.react.baidumap.BaiduMapPackage;
import com.hj.MyPackage;
import com.imagepicker.ImagePickerPackage;
import com.beefe.picker.PickerViewPackage;
import com.meiqia.core.callback.OnInitCallback;
import com.meiqia.meiqiasdk.util.MQConfig;
import com.rnfs.RNFSPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.reactnativecomponent.splashscreen.RCTSplashScreenPackage;
import com.remobile.zip.RCTZipPackage;
import com.remobile.toast.RCTToastPackage;
import com.remobile.filetransfer.RCTFileTransferPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.umeng.commonsdk.UMConfigure;

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
            new BaiduMapPackage(),
            new ImagePickerPackage(),
            new PickerViewPackage(),
            new RNFSPackage(),
            new RNDeviceInfo(),
            new RCTZipPackage(),
            new RCTToastPackage(),
            new RCTFileTransferPackage(),
            new RCTSplashScreenPackage(),
            new MyPackage()
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
    // 美洽
    MQConfig.init(this, "319f14696c1359601a0014fcb14fca3f", new OnInitCallback() {
      @Override
      public void onSuccess(String clientId) {
//        Toast.makeText(MainActivity.this, "init success", Toast.LENGTH_SHORT).show();
        Log.i("meiQia", "init success");
      }

      @Override
      public void onFailure(int code, String message) {
//        Toast.makeText(MainActivity.this, "int failure", Toast.LENGTH_SHORT).show();
        Log.i("meiQia", "init failure");
      }
    });
    // 友盟
    UMConfigure.init(this.getApplicationContext(), "5bebb480b465f52f110004ee", "Test", UMConfigure.DEVICE_TYPE_PHONE, "");
  }
}
