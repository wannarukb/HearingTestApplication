package com.hearingtest;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.annotation.RequiresApi;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;

import android.Manifest;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.graphics.Typeface;
import android.media.AudioAttributes;
import android.media.AudioDeviceInfo;
import android.media.AudioFormat;
import android.media.AudioManager;
import android.media.AudioTrack;
import android.media.MediaRecorder;
import android.os.AsyncTask;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.os.Handler;
import android.os.Parcelable;
import android.util.ArrayMap;
import android.util.Log;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TableLayout;
import android.widget.TableRow;
import android.widget.TextView;
import android.widget.Toast;
//import android.widget.TextView;

import com.facebook.react.ReactActivity;

import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.ObjectOutputStream;
import java.io.OutputStreamWriter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Iterator;
import java.util.List;
import java.util.ListIterator;
import java.util.Map;

import com.facebook.react.bridge.Callback;
import com.fasterxml.jackson.core.JsonGenerationException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.google.gson.Gson;

import org.w3c.dom.Text;

import com.fasterxml.jackson.databind.ObjectMapper;

public class HearingActivity extends ReactActivity {

    private final int       SAMPLE_RATE = 44100;
    private final int       RESULT_VALIDATION_DECEIBEL = 35; //dB HL
    private final int       PASS_RESULT_CRITERIA_MAX = 2;
    public int              pass_result_criteria  = 0;
    public AudioTrack       mAudioTrack;
    public List<TestTone>   testToneList;
    public List<TestResultItem> testResultList;
    public Boolean          isCanHearClick;
    public TestTone         currentRunTone;
    public TestResultItem   currentTestResult;
    public int              noOfLatestResult;

    public int              runningIndex;
    public int              currentTestRound;
    public Button           startButton, cancelButton;
    Thread m_PlayThread = null;
    boolean m_bStop = false;
    Integer noOfClick;
    AudioManager mAudioManager;
    AudioDeviceInfo[] devices;
    public Integer          playExecuteCount;

    public int       userId;
    public int       protocolId;
    public String       saveHearingPath;
    public long     startPlayToneFromStart;
    public long     startPlayToneByTonePlayed;
    public TestResultHeader userHearingTest;
    public ImageView testToneImage;

    public Integer  result_pass_validation_time;
    public Map<String, Object> transalationMap;

    public TextView playToneHeader, playToneDescription, suggestionLine1, suggestionLine2, warningLabel, warningText;
    public LinearLayout suggestionLayout, warningLayout;
    public String translationMenu;
    public String testToneJSON;


    @RequiresApi(api = Build.VERSION_CODES.M)
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_hearing);

        this.isCanHearClick = false;


        testResultList = new ArrayList<TestResultItem>();
        testToneList   = new ArrayList<TestTone>();
        runningIndex        = 0;
        playExecuteCount    = 0;
        noOfLatestResult    = 0;
        testToneImage       = (ImageView) findViewById(R.id.testToneImage);
        playToneHeader      = (TextView) findViewById(R.id.tonePlayHeaderLabel);
        playToneDescription = (TextView) findViewById(R.id.tonePlayDescription);
        startButton         = (Button) findViewById(R.id.start);
        cancelButton        = (Button) findViewById(R.id.cancel);

        suggestionLayout    = (LinearLayout) findViewById(R.id.suggestionLayout);
        warningLayout       = (LinearLayout) findViewById(R.id.warninglayout);
        suggestionLine1     = (TextView) findViewById(R.id.suggestionLine1);
        suggestionLine2     = (TextView) findViewById(R.id.suggestionLine2);
        warningLabel        = (TextView) findViewById(R.id.warningLabel);
        warningText         = (TextView) findViewById(R.id.warningText);

        Bundle extras = getIntent().getExtras();
        if(extras != null) {
            Gson gson = new Gson();
            testToneJSON = extras.getString("TestToneList");
            String translateMenu = extras.getString("TranslateMenu");
            userId              = Integer.parseInt(extras.getString("UserId"));
            saveHearingPath     = extras.getString("FilePath");
            translationMenu     = translateMenu;

            try
            {
                transalationMap = new ObjectMapper().readValue(translateMenu, Map.class);

                TestTone[] parseTone;
                System.out.println(testToneJSON);
                parseTone    = gson.fromJson(testToneJSON, TestTone[].class);

                playToneHeader.setText((String) transalationMap.get("StartHeaderLabel"));
                playToneDescription.setVisibility(View.INVISIBLE);
                playToneDescription.setText((String) transalationMap.get("TonePlayDescription"));
                startButton.setText((String) transalationMap.get("StartPlayToneButton"));
                cancelButton.setText((String) transalationMap.get("CancelButton"));

                suggestionLine1.setText((String) transalationMap.get("SuggestionLine1"));
                suggestionLine2.setText((String) transalationMap.get("SuggestionLine2"));
                warningLabel.setText((String) transalationMap.get("WarningLabel"));
                warningText.setText((String) transalationMap.get("WarningDescription"));


                if(parseTone != null && parseTone.length > 0){
                    List<TestTone> parseList = Arrays.asList(parseTone);
                    List<TestTone> parseToneArray = new ArrayList<TestTone>();
                    parseToneArray.addAll(parseList);
                    TestTone tempTone;
                    int i = 0;
                    int tonesize = parseList.size();
                    while(i < tonesize){
                        TestTone eachTone = parseToneArray.get(i);
                        System.out.println(i + " : " + eachTone.runIndex + " :  = " + eachTone.frequency + ", " + eachTone.amplitude + ", " + eachTone.remainingRound + ", " + eachTone.testSide + " , " + eachTone.duration + ", " + eachTone.interval);
                        if(i < parseList.size()){
                            tempTone = new TestTone(eachTone, true);
                            protocolId = eachTone.protocolId;
                        }else{
                            tempTone = new TestTone(eachTone, false);
                        }
                        tempTone.runIndex = i;
                        tempTone.counter  = i+1;
                        int remainingRound = tempTone.remainingRound;
                        tempTone.remainingRound = tempTone.remainingRound -1;
                        remainingRound = remainingRound - 1;
                        i++;
                        if(remainingRound > 0){
                            TestTone newTestTone = new TestTone(tempTone, false);
                            newTestTone.runIndex       = tonesize + 1;
                            parseToneArray.add(newTestTone);
                            tonesize++;
                        }

                        testToneList.add(tempTone);

                    };
                }

                System.out.println("Hearing - testToneList = " + testToneList.size());
                currentRunTone      = testToneList.get(runningIndex);
                System.out.println("Hearing - Current Run Tone  = " + currentRunTone.testToneId + ", " + currentRunTone.testSide + ", " + currentRunTone.frequency + ", " + currentRunTone.amplitude);
                currentTestRound    = currentRunTone.testRound;
                noOfClick = 0;
                pass_result_criteria = testToneList.size();


                mAudioManager = (AudioManager)getSystemService(Context.AUDIO_SERVICE);
                devices      = mAudioManager.getDevices(AudioManager.GET_DEVICES_OUTPUTS);

                result_pass_validation_time = 0;
            }
            catch (JsonGenerationException e) {
                e.printStackTrace();
            } catch (JsonMappingException e) {
                e.printStackTrace();
            } catch (IOException e) {
                e.printStackTrace();
            }


        }
    }


    /*
       When Click start --> system will play the set of frequency
    */
    @RequiresApi(api = Build.VERSION_CODES.M)
    public void onClickStart(View view) {

        suggestionLayout.setVisibility(View.GONE);
        warningLayout.setVisibility(View.GONE);
        startButton.setText((String) transalationMap.get("HearToneButton"));
        playToneHeader.setText((String) transalationMap.get("TonePlayHeaderLabel"));
        playToneDescription.setVisibility(View.VISIBLE);
        noOfClick += 1;
        System.out.println(" no of click = " + noOfClick);

        if(noOfClick == 1){
            System.out.println("++++++++++++ Start ++++++++++++ ");
            try {

                play();
                m_PlayThread.interrupt();
                m_PlayThread.join();
                m_PlayThread = null;
                m_PlayThread = new Thread();
                startPlayToneFromStart = System.currentTimeMillis();
                startPlayToneByTonePlayed = System.currentTimeMillis();
                userHearingTest = new TestResultHeader( protocolId, userId);
                cancelButton.setVisibility(View.GONE);
                play();

            }catch (InterruptedException e) {
                e.printStackTrace();
            }
        }else{
            System.out.println("++++++++++++ is Hear ++++++++++++ ");
            m_bStop = true;
            if (m_PlayThread != null) {
                try {
                    long clickedTime = System.currentTimeMillis();
                    long clickSecFromStart = (clickedTime - startPlayToneFromStart) / 1000;
                    long clickSecFromByTonePlayed = (clickedTime - startPlayToneByTonePlayed) / 1000;
                    int clickSecFromByTonePlayedInt = (int) clickSecFromByTonePlayed;
                    String timeClickedType = (clickSecFromByTonePlayedInt >= currentRunTone.duration) ? "I" : "D";

                    System.out.println("RESULTJA :  "+ (playExecuteCount - 1) + " : " + currentRunTone.frequency  + ", " + currentRunTone.amplitude  + ", "+ currentRunTone.testSide  + ", " + clickSecFromStart + ", " + clickSecFromByTonePlayedInt + ", " + timeClickedType);
                    currentTestResult.setCanHear(timeClickedType, clickSecFromStart, clickSecFromByTonePlayed);
                    /*if(currentRunTone.dbHl <= RESULT_VALIDATION_DECEIBEL){
                        result_pass_validation_time++;
                    }*/
                    result_pass_validation_time++;

                } catch (Exception e) {
                    System.out.println(e.getMessage());
                }
            }
        }

    }


    public void onClickCancel(View view) {
        Intent intent = new Intent(this, ReactResultActivity.class);
        startActivity(intent);
        finish();
    }

    synchronized void stop() {
        m_bStop = true;

        if (mAudioTrack != null) {
            mAudioTrack.stop();
            mAudioTrack.release();
            mAudioTrack = null;
        }

        if (m_PlayThread != null) {
            try {
                m_PlayThread.interrupt();
                m_PlayThread.join();
                m_PlayThread = null;
            } catch (Exception e) {

            }
        }

    }

     @RequiresApi(api = Build.VERSION_CODES.M)
     synchronized void play() {
        System.out.println("TONE PLAY");
        playExecuteCount += 1;



        m_PlayThread = new Thread() {


            @RequiresApi(api = Build.VERSION_CODES.M)
            public void run() {
                try {


                    if(playExecuteCount > 1){


                        if(currentTestResult != null){
                            currentTestResult.setEndResult();
                            testResultList.add(currentTestResult);
                        }

                        currentTestResult = new TestResultItem(currentRunTone.protocolId, currentRunTone.testToneId,
                                currentRunTone.counter,currentRunTone.roundNo, currentRunTone.frequency, currentRunTone.amplitude,
                                currentRunTone.testSide, currentRunTone.duration, currentRunTone.interval,
                                currentRunTone.dbHl, currentRunTone.dbSpl);

                        startPlayToneByTonePlayed = System.currentTimeMillis();


                        generateTone(currentRunTone.frequency, currentRunTone.duration, currentRunTone.amplitude, currentRunTone.testSide);
                        synchronized (this) {
                            try {
                                Thread.sleep(currentRunTone.intervalSleep);

                            } catch (InterruptedException e) {
                                e.printStackTrace();
                            }
                        }

                        synchronized (this) {

                            if (runningIndex < testToneList.size()) {
                                runOnUiThread(new Runnable() {
                                    @Override
                                    public void run() {

                                        System.out.println("currentRunTone.testSide  = " + currentRunTone.testSide );
                                        if(currentRunTone.testSide.equals("L")){
                                            testToneImage.setImageResource(R.drawable.tone_left);
                                        }else if(  currentRunTone.equals("R")){
                                            testToneImage.setImageResource(R.drawable.tone_right);
                                        }else{
                                            testToneImage.setImageResource(R.drawable.tone_both);
                                        }

                                        System.out.println(" m_bStop = " + m_bStop);
                                        if(m_bStop) {
                                            m_bStop = false;
                                        }
                                        System.out.println(" RUN = " + currentRunTone.frequency + ", " + currentRunTone.amplitude + " , " + currentRunTone.testSide + " , " + currentRunTone.duration + ", " + currentRunTone.interval);

                                        runningIndex = runningIndex + 1;
                                        if(runningIndex < testToneList.size()){
                                            currentRunTone = testToneList.get(runningIndex);
                                        }

                                        m_PlayThread = null;
                                        if(runningIndex < testToneList.size()){
                                            play();
                                        }else{
                                            try {
                                                if(currentTestResult != null){
                                                    currentTestResult.setEndResult();
                                                    testResultList.add(currentTestResult);
                                                }
                                                finishActivity();
                                            } catch (InterruptedException e) {
                                                e.printStackTrace();
                                            }
                                        }

                                    }
                                });

                            }

                        }

                    }
                    else{
                        System.out.println("currentRunTone.testSide  = " + currentRunTone.testSide );
                        if(currentRunTone.testSide.equals("L")){
                            testToneImage.setImageResource(R.drawable.tone_left);
                        }else if(  currentRunTone.equals("R")){
                            testToneImage.setImageResource(R.drawable.tone_right);
                        }else{
                            testToneImage.setImageResource(R.drawable.tone_both);
                        }
                    }


                } catch (Exception e) {
                    Log.e("Tone", e.toString());
                } catch (OutOfMemoryError e) {
                    Log.e("Tone", e.toString());
                }

            }
        };
        m_PlayThread.start();

    }



    public void finishActivity() throws InterruptedException {

        System.out.println("FINISH ACTIVITY");
        userHearingTest.endTestResult(testResultList);
        if(result_pass_validation_time == pass_result_criteria) userHearingTest.setGoodSummary();

        Gson gson = new Gson();
        String resultJson = gson.toJson(userHearingTest);
        System.out.print("result" + resultJson);

        if(userHearingTest.isGoodResult()){
            Intent intent = new Intent(this, HearingActivityResult.class);
            intent.putExtra("TestToneList", testToneJSON);
            intent.putExtra("TestResultList", resultJson);
            intent.putExtra("FilePath", saveHearingPath);
            intent.putExtra("UserId", userId);
            intent.putExtra("TranslateMenu", translationMenu);

            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            startActivity(intent);
        }else{
            Intent intent = new Intent(this, SurveyQuestion.class);
            intent.putExtra("TestToneList", testToneJSON);
            intent.putExtra("TestResultList", resultJson);
            intent.putExtra("FilePath", saveHearingPath);
            intent.putExtra("UserId", userId);
            intent.putExtra("TranslateMenu", translationMenu);

            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            startActivity(intent);
            finish();
        }

        ///finish();

    }

    @RequiresApi(api = Build.VERSION_CODES.M)
    public void generateTone(int frequency, double durationSec, double amplitude, String earSide){

//        System.out.println("GET TONE");
        System.out.println(" --> F = " + frequency + " amplitude : " + amplitude + " durationSec : " + durationSec +  " earSide : " + earSide);

        // int mBufferSize = AudioTrack.getMinBufferSize(sampleRate, AudioFormat.CHANNEL_OUT_MONO, AudioFormat.ENCODING_PCM_16BIT);

        int runDuration = (int) durationSec * SAMPLE_RATE * 2;
        System.out.println("runDuration = " + runDuration);
        double[] samples = new double[runDuration];
        short[] mBuffer = new short[runDuration];

        for (int i = 0; i < runDuration; i++) {
            samples[i] = Math.sin(2.0 * Math.PI * i / (SAMPLE_RATE / frequency)); // Sine wave
            mBuffer[i] = (short) (samples[i] * Short.MAX_VALUE);  // Higher amplitude increases volume
        }

        //if audioTrack has been initialised, first, release any resources
        //then null it
        if (mAudioTrack != null) {
            mAudioTrack.stop();
            mAudioTrack.release();
            mAudioTrack = null;
        }

        //now create it again, note: use global audioTrack,
        //that means remove "final AudioTrack" here
        mAudioTrack = new AudioTrack.Builder()
                .setAudioAttributes(new AudioAttributes.Builder()
                        .setUsage(AudioAttributes.USAGE_MEDIA)
                        .setContentType(AudioAttributes.CONTENT_TYPE_MUSIC)
                        .build())
                .setAudioFormat(new AudioFormat.Builder()
                        .setEncoding(AudioFormat.ENCODING_PCM_16BIT)
                        .setSampleRate(SAMPLE_RATE)
                        .setChannelMask(AudioFormat.CHANNEL_OUT_MONO)
                        .build())
                .setBufferSizeInBytes(mBuffer.length)
                .setTransferMode(AudioTrack.MODE_STREAM)
                .build();


        devices = mAudioManager.getDevices(AudioManager.GET_DEVICES_OUTPUTS);
        if (devices  != null) {
            for (AudioDeviceInfo device : devices){
                System.out.println("Device Type = " + device.getType());
                mAudioTrack.setPreferredDevice(device);
                if ( device.getType() == AudioDeviceInfo.TYPE_USB_HEADSET || device.getType() == AudioDeviceInfo.TYPE_WIRED_HEADSET || device.getType() == AudioDeviceInfo.TYPE_WIRED_HEADPHONES ||
                        device.getType() == AudioDeviceInfo.TYPE_BLUETOOTH_A2DP || device.getType() == AudioDeviceInfo.TYPE_BLUETOOTH_SCO) {
                    if(mAudioManager.isSpeakerphoneOn()){
                        mAudioManager.setSpeakerphoneOn(false);
                    }

                }else{
                    if(mAudioManager.isSpeakerphoneOn() == false){
                        mAudioManager.setSpeakerphoneOn(true);
                    }
                }
            }
        }

        double amp = 0;
        if(amplitude >= 0){
            amp = amplitude;
        }
        float volumePercentage = (float) (amp);

        if(earSide == "L"){
            mAudioTrack.setStereoVolume(volumePercentage, 0.0f);
        }else if(earSide == "R"){
            mAudioTrack.setStereoVolume(0.0f, volumePercentage);
        }else{
            mAudioTrack.setStereoVolume(volumePercentage, volumePercentage);
        }

        mAudioTrack.write(mBuffer, 0, mBuffer.length);
        mAudioTrack.play();
    }

    @Override
    public void onBackPressed() {

        System.out.println("Android - HearingActivity Back Pressed");
        stop();

        Intent intent = new Intent(this, ReactResultActivity.class);
        startActivity(intent);
        finish();
    }

    @Override
    protected void onStop() {
        super.onStop();
        System.out.println("Android - HearingActivity - Stop");
    }




}