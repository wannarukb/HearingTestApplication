package com.hearingtest;

import androidx.annotation.RequiresApi;
import androidx.appcompat.app.AppCompatActivity;

import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.media.AudioAttributes;
import android.media.AudioDeviceInfo;
import android.media.AudioFormat;
import android.media.AudioManager;
import android.media.AudioTrack;
import android.os.AsyncTask;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.util.ArrayMap;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
//import android.widget.TextView;

import com.facebook.react.ReactActivity;

import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.facebook.react.bridge.Callback;

public class HearingActivity extends ReactActivity {

    private final int       sampleRate = 44100;
    public final int        MAX_DB     = 90;
    public final int        MIN_DB     = 5;
    public AudioTrack       mAudioTrack;
    public List<TestTone>   testToneList;
    public List<TestResult> testResultList;
    public Boolean          isCanHearClick;
    public TestTone         currentRunTone;
    public int              runningIndex;
    public int              currentTestRound;
    public Button           startButton, hearButton;
    public TextView         freqView, decibelView, suiteView;
    Thread m_PlayThread = null;
    boolean m_bStop = false;
    Integer noOfClick;
    AudioManager mAudioManager;
    AudioDeviceInfo[] devices;

    @RequiresApi(api = Build.VERSION_CODES.M)
    @Override
    protected void onCreate(Bundle savedInstanceState) {
//        super.onCreate(savedInstanceState);
        super.onCreate(null);
        setContentView(R.layout.activity_hearing);
        this.isCanHearClick = false;

        testResultList = new ArrayList<TestResult>();
        testToneList   = new ArrayList<TestTone>();


        testToneList.add(new TestTone(0, 1000, 25, 3, 0,  5,  10,  3,  0,  2,  0, "R"));
        testToneList.add(new TestTone(1, 2000, 30, 3, 0,  5,  10,  3,  0,  1,  0, "R"));
        testToneList.add(new TestTone(2, 4000, 35, 3, 0,  5,  10,   3,0 ,  2,  0, "R"));
        testToneList.add(new TestTone(3, 500, 35, 3, 0,  5,  10,  3,  0,  3,  0, "R"));
        testToneList.add(new TestTone(4, 1000, 35, 3, 0,  5,  10,  3,  0,  2,  0, "L"));
        testToneList.add(new TestTone(5, 2000, 35, 3, 0,  5,  10,  3,  0,  3,  0, "L"));
        testToneList.add(new TestTone(6, 4000, 35, 3, 0,  5,  10,  3,  0,  1,  0, "L"));
        testToneList.add(new TestTone(7, 500, 35, 3, 0,  5,  10,  3,  0,  4,  0, "L"));


        runningIndex        = 0;

        currentRunTone      = testToneList.get(runningIndex);
        currentTestRound    = currentRunTone.testRound;

        freqView            = (TextView) findViewById(R.id.frequency);
        decibelView         = (TextView) findViewById(R.id.decibel);
        suiteView           = (TextView) findViewById(R.id.testSuite);

        freqView.setText(""+currentRunTone.frequency);
        decibelView.setText(""+currentRunTone.runDB);
        suiteView.setText(currentRunTone.testSuite);

        noOfClick = 0;


        mAudioManager = (AudioManager)getSystemService(Context.AUDIO_SERVICE);
        devices      = mAudioManager.getDevices(AudioManager.GET_DEVICES_OUTPUTS);

    }



    /*
        When Click start --> system will play the set of frequency
     */
    @RequiresApi(api = Build.VERSION_CODES.M)
    public void onClickStart(View view) {
        System.out.println("++++++++++++ Start ++++++++++++ ");
        startButton         = (Button) findViewById(R.id.start);

        startButton.setText("ได้ยิน");

        noOfClick += 1;

        System.out.println(" no of click = " + noOfClick);
        if(noOfClick == 1){
            try {
                play();
                m_PlayThread.interrupt();
                m_PlayThread.join();
                m_PlayThread = null;
                play();
            }catch (InterruptedException e) {
                e.printStackTrace();
            }
        }else{
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

                    System.out.println("Lek = mAudioTrack = " + mAudioTrack);
                    System.out.println("Lek = m_PlayThread = " + m_PlayThread);
                    if (m_bStop) {
                        System.out.println(" STOP AT F = " + currentRunTone.frequency + " DB = " + currentRunTone.runDB);
                        currentRunTone.setDecreaseDB();


                        if (currentRunTone.runDB < MIN_DB) {
                            currentRunTone.setDecreaseRemainingRound();
                            if (currentRunTone.remainingRound >= 0) {
                                testToneList.add(new TestTone(currentRunTone));
                            }

                            runningIndex = runningIndex + 1;
                            currentRunTone = testToneList.get(runningIndex);

                        }

                        play();
                    }

                } catch (Exception e) {
                    System.out.println(e.getMessage());
                }
            }
        }

    }

    @RequiresApi(api = Build.VERSION_CODES.M)
    public void onClickCanHear(View view)  {


//        runOnUiThread(new Runnable() {
//            @Override
//            public void run() {
//
//                }
//            }
//        });
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

    synchronized void play() {
        System.out.println("LEK PLAY");
        m_bStop = false;


        m_PlayThread = new Thread() {


            @RequiresApi(api = Build.VERSION_CODES.M)
            public void run() {
                try {
                    freqView.setText(""+currentRunTone.frequency);
                    decibelView.setText(""+currentRunTone.runDB);
                    suiteView.setText(currentRunTone.testSuite);
                    generateTone(currentRunTone.frequency, currentRunTone.duration, currentRunTone.runDB, currentRunTone.testSuite);

                    synchronized (this) {

                        wait(currentRunTone.intervalSleep);
                        if (!m_bStop) {

                            runOnUiThread(new Runnable() {
                                @Override
                                public void run() {

                                        System.out.println("Thead F = " + currentRunTone.frequency + "DB = " + currentRunTone.runDB);
                                        currentRunTone.setIncreaseDB();

                                        freqView.setText(""+currentRunTone.frequency);
                                        decibelView.setText(""+currentRunTone.runDB);
                                        suiteView.setText(currentRunTone.testSuite);
                                        if(currentRunTone.runDB > MAX_DB){
                                            runningIndex   = runningIndex + 1;
                                            currentRunTone = testToneList.get(runningIndex);
                                        }


                                        m_PlayThread = null;
                                        play();

                                }
                            });
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


    @RequiresApi(api = Build.VERSION_CODES.M)
    synchronized TestTone runTestTone2(TestTone runTone, Boolean canHear){


        generateTone(currentRunTone.frequency, currentRunTone.duration, currentRunTone.runDB, currentRunTone.testSuite);

        this.isCanHearClick = false;
        try {
            Thread.sleep(currentRunTone.intervalSleep);
            if(canHear == false){
                currentRunTone.setIncreaseDB();

                freqView.setText(""+currentRunTone.frequency);
                decibelView.setText(""+currentRunTone.runDB);
                suiteView.setText(currentRunTone.testSuite);

                if(currentRunTone.runDB > MAX_DB) {

                    runningIndex   = runningIndex + 1;
                    currentRunTone = testToneList.get(runningIndex);
                }

                currentRunTone = runTestTone2(currentRunTone, false);
            }



        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        return runTone;
    }



    @RequiresApi(api = Build.VERSION_CODES.M)
    public TestTone runTestTone(TestTone runTone, Boolean canHear){

//        runner = new Runnable() {
//            @Override
//            public void run() {
//                runOnUiThread(new Runnable() {
//                    @RequiresApi(api = Build.VERSION_CODES.M)
//                    @Override
//                    public void run() {
//
//                        generateTone(currentRunTone.frequency, currentRunTone.duration, currentRunTone.runDB, currentRunTone.testSuite);
//                        isCanHearClick = false;
//                        try {
//                            Thread.sleep(currentRunTone.intervalSleep);
//
//                            try{
//                                Thread.sleep(currentRunTone.intervalSleep);
//                                if(isCanHearClick == false){
//                                    currentRunTone.setIncreaseDB();
//                                    freqView            = (TextView) findViewById(R.id.frequency);
//                                    decibelView         = (TextView) findViewById(R.id.decibel);
//                                    suiteView           = (TextView) findViewById(R.id.testSuite);
//
//                                    freqView.setText(""+currentRunTone.frequency);
//                                    decibelView.setText(""+currentRunTone.runDB);
//                                    suiteView.setText(currentRunTone.testSuite);
//
//                                    if(currentRunTone.runDB > MAX_DB) {
//
//                                        runningIndex   = runningIndex + 1;
//                                        currentRunTone = testToneList.get(runningIndex);
//                                    }
//
//                                    currentRunTone = runTestTone(currentRunTone, false);
//                                }
//                            }catch (InterruptedException e) {
//                                e.printStackTrace();
//                            }
//
//                        } catch (InterruptedException e) {
//                            e.printStackTrace();
//                        }
//                    }
//                });
//            }
//        };
//        handler.post(runner);
//

        return runTone;
    }

    @RequiresApi(api = Build.VERSION_CODES.M)
    public void generateTone2(int frequency, double durationSec, int volDB, String testSuite){
        Thread thread = new Thread(){
            @Override
            public  void run(){
//                try{
                    System.out.println("GET TONE");

                    System.out.println("LEK --> F = " + frequency + " DB : " + volDB);
                    // int mBufferSize = AudioTrack.getMinBufferSize(sampleRate, AudioFormat.CHANNEL_OUT_MONO, AudioFormat.ENCODING_PCM_16BIT);

                    int runDuration = (int) durationSec * sampleRate;
                    System.out.println("runDuration = " + runDuration);
                    double[] samples = new double[runDuration];
                    short[] mBuffer = new short[runDuration];

                    for (int i = 0; i < runDuration; i++) {
                        samples[i] = Math.sin(2.0 * Math.PI * i / (sampleRate / frequency)); // Sine wave
                        mBuffer[i] = (short) (samples[i] * Short.MAX_VALUE);  // Higher amplitude increases volume
                    }

                    // System.out.println("+++ PLAY +++");
                    //if audioTrack has been initialised, first, release any resources
                    //then null it
                    if (mAudioTrack != null) {
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
                                    .setSampleRate(sampleRate)
                                    .setChannelMask(AudioFormat.CHANNEL_OUT_MONO)
                                    .build())
                            .setBufferSizeInBytes(mBuffer.length)
                            .setTransferMode(AudioTrack.MODE_STREAM)
                            .build();
                    //mAudioTrack = new AudioTrack(AudioManager.STREAM_MUSIC, sampleRate, AudioFormat.CHANNEL_OUT_MONO, AudioFormat.ENCODING_PCM_16BIT, generatedSnd.length, AudioTrack.MODE_STATIC);

                    double amp =( Math.pow(10, volDB/20.0))/1000;
                    double rms = 0;
                    for (int i = 0; i < runDuration; i++) {
                        rms += mBuffer[i] * mBuffer[i];
                    }
                    rms = Math.sqrt(rms / runDuration);
                    double mAlpha = 0.9;
                    /*Compute a smoothed version for less flickering of the display.*/
                    double mRmsSmoothed = 0.0;
                    mRmsSmoothed = mRmsSmoothed * mAlpha + (1 - mAlpha) * rms;


                    Log.d("amp", "amp = " + amp);
                    Log.d("mRmsSmoothed", "mRmsSmoothed = " + mRmsSmoothed);

                    double rmsdB = 20.0 * Math.log10(amp * mRmsSmoothed);
                    double maxVolDB =  20.0 * Math.log10(mRmsSmoothed * mRmsSmoothed);
                    float volumePercentage = (float) (rmsdB/maxVolDB);

                    Log.d("rmsdB", "rmsdB = " + rmsdB);
                    Log.d("maxVolDB", "maxVolDB = " + maxVolDB);
                    Log.d("volumePercentage", "volumePercentage = " + volumePercentage);

                    if(testSuite == "L"){
                        mAudioTrack.setStereoVolume(volumePercentage, 0.0f);
                    }else if(testSuite == "R"){
                        mAudioTrack.setStereoVolume(0.0f, volumePercentage);
                    }else{
                        mAudioTrack.setStereoVolume(volumePercentage, volumePercentage);
                    }

                    mAudioTrack.write(mBuffer, 0, mBuffer.length);
                    mAudioTrack.play();

//                }(InterruptedException e) {
//                    e.printStackTrace();
//                }
            }
        };
        thread.start();
    }


    @RequiresApi(api = Build.VERSION_CODES.M)
    public void generateTone(int frequency, double durationSec, int volDB, String testSuite){

//        System.out.println("GET TONE");
        System.out.println("LEK --> F = " + frequency + " DB : " + volDB);

        // int mBufferSize = AudioTrack.getMinBufferSize(sampleRate, AudioFormat.CHANNEL_OUT_MONO, AudioFormat.ENCODING_PCM_16BIT);

        int runDuration = (int) durationSec * sampleRate;
//        System.out.println("runDuration = " + runDuration);
        double[] samples = new double[runDuration];
        short[] mBuffer = new short[runDuration];

        for (int i = 0; i < runDuration; i++) {
            samples[i] = Math.sin(2.0 * Math.PI * i / (sampleRate / frequency)); // Sine wave
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
                                .setUsage(AudioAttributes.USAGE_ALARM)
                                .setContentType(AudioAttributes.CONTENT_TYPE_MUSIC)
                                .build())
                        .setAudioFormat(new AudioFormat.Builder()
                                .setEncoding(AudioFormat.ENCODING_PCM_16BIT)
                                .setSampleRate(sampleRate)
                                .setChannelMask(AudioFormat.CHANNEL_OUT_MONO)
                                .build())
                        .setBufferSizeInBytes(mBuffer.length)
                        .setTransferMode(AudioTrack.MODE_STREAM)
                        .build();
        //mAudioTrack = new AudioTrack(AudioManager.STREAM_MUSIC, sampleRate, AudioFormat.CHANNEL_OUT_MONO, AudioFormat.ENCODING_PCM_16BIT, generatedSnd.length, AudioTrack.MODE_STATIC);

        if (devices  != null){
            for (AudioDeviceInfo device : devices)
                if (device.getType() == AudioDeviceInfo.TYPE_WIRED_HEADSET || device.getType() == AudioDeviceInfo.TYPE_WIRED_HEADPHONES ||
                    device.getType() == AudioDeviceInfo.TYPE_BLUETOOTH_A2DP || device.getType() == AudioDeviceInfo.TYPE_BLUETOOTH_SCO) {
                    mAudioTrack.setPreferredDevice(device);
//                    mAudioManager.setWiredHeadsetOn(true);
                    mAudioManager.setSpeakerphoneOn(false);
                }
        }

        double amp =( Math.pow(10, volDB/20.0))/1000;
        double rms = 0;
        for (int i = 0; i < runDuration; i++) {
            rms += mBuffer[i] * mBuffer[i];
        }
        rms = Math.sqrt(rms / runDuration);
        double mAlpha = 0.9;
        /*Compute a smoothed version for less flickering of the display.*/
        double mRmsSmoothed = 0.0;
        mRmsSmoothed = mRmsSmoothed * mAlpha + (1 - mAlpha) * rms;

//
//        Log.d("amp", "amp = " + amp);
//        Log.d("mRmsSmoothed", "mRmsSmoothed = " + mRmsSmoothed);

        double rmsdB = 20.0 * Math.log10(amp * mRmsSmoothed);
        double maxVolDB =  20.0 * Math.log10(mRmsSmoothed * mRmsSmoothed);
        float volumePercentage = (float) (rmsdB/maxVolDB);
//
//        Log.d("rmsdB", "rmsdB = " + rmsdB);
//        Log.d("maxVolDB", "maxVolDB = " + maxVolDB);
//        Log.d("volumePercentage", "volumePercentage = " + volumePercentage);

//        DecimalFormat df = new DecimalFormat("0.00");
//        actualTextView.setText(String.valueOf(df.format(rmsdB)));

        if(testSuite == "L"){
            mAudioTrack.setStereoVolume(volumePercentage, 0.0f);
        }else if(testSuite == "R"){
            mAudioTrack.setStereoVolume(0.0f, volumePercentage);
        }else{
            mAudioTrack.setStereoVolume(volumePercentage, volumePercentage);
        }

        mAudioTrack.write(mBuffer, 0, mBuffer.length);
        mAudioTrack.play();

    }

    @Override
    public void onBackPressed() {
        System.out.println("LEK Back Pressed");
        m_PlayThread.interrupt();
        m_PlayThread = null;
        return;
    }

    @Override
    protected void onStop() {
        super.onStop();
        System.out.println("LEK Stop");
        m_PlayThread.interrupt();
        m_PlayThread = null;
    }



}