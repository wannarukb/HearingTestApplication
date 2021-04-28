package com.hearingtest;

import android.app.Activity;
import android.content.Intent;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;

import java.io.IOException;


public class HearingTestModule extends ReactContextBaseJavaModule {
    private final ReactApplicationContext reactContext;
    public HearingTestModule(@NonNull ReactApplicationContext reactContext){
        super(reactContext);
        this.reactContext = reactContext;
    }

    @NonNull
    @Override
    public String getName() {
        return "HearingTestModule";
    }


    @ReactMethod
    public void GotoActivity(String userInfo, String testSet) {
        System.out.println("Hearing UserInfo = " + userInfo);
        System.out.println("Hearing Test Set = " + testSet);
        Intent intent = new Intent(reactContext, HearingActivity.class);
        if(intent.resolveActivity(reactContext.getPackageManager()) != null){
            String filePath = ""+getReactApplicationContext().getFilesDir().getAbsolutePath();
            intent.putExtra("FilePath", filePath);
            intent.putExtra("UserId", userInfo);
            intent.putExtra("TestToneList", testSet);
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            reactContext.startActivity(intent);
        }
    }


}
