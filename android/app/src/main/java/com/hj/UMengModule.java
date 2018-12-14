package com.hj;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.umeng.analytics.MobclickAgent;

/**
 * Created by eddie104 on 2018/11/14.
 */

public class UMengModule extends ReactContextBaseJavaModule {
    public UMengModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @ReactMethod
    public void onEvent(String eventID) {
        MobclickAgent.onEvent(getReactApplicationContext(), eventID);
    }

    @ReactMethod
    public void onEventWithLabel(String eventID, String eventLabel) {
        MobclickAgent.onEvent(getReactApplicationContext(), eventID, eventLabel);
    }

    @Override
    public String getName() {
        return "UMengModule";
    }
}
