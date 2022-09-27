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
    public void GotoActivity(String userId, String userInfo, String testSet, String translateMenu) {
        System.out.println("HearingTestModule");
        System.out.println("Hearing UserInfo = " + userInfo);
        System.out.println("Hearing Test Set = " + testSet);
        System.out.println("Hearing TranslateMenu = " + translateMenu);

        Intent intent = new Intent(reactContext, HearingActivity.class);
        if(intent.resolveActivity(reactContext.getPackageManager()) != null){
            String filePath = ""+getReactApplicationContext().getFilesDir().getAbsolutePath();
            intent.putExtra("FilePath", filePath);
            intent.putExtra("UserId", userId);
            intent.putExtra("UserInfo" , userInfo);
            intent.putExtra("TestToneList", testSet);
            intent.putExtra("TranslateMenu" , translateMenu);
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            reactContext.startActivity(intent);
        }
    }


}
