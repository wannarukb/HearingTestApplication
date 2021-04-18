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
import android.os.Parcelable;
import android.util.ArrayMap;
import android.util.Log;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TableLayout;
import android.widget.TableRow;
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
import com.google.gson.Gson;

import org.json.JSONArray;

public class HearingActivity extends ReactActivity {

    private final int       sampleRate = 44100;
    public final int        MAX_DB     = 100;
    public final int        MIN_DB     = 0;
    public final int        MAX_BEST_RESULT = 2;
    public AudioTrack       mAudioTrack;
    public List<TestTone>   testToneList;
    public List<TestResult> testResultList;
    public Boolean          isCanHearClick;
    public TestTone         currentRunTone;
    public TestResult       currentTestResult;
    public TestResult       currentBestResult, latestResult;
    public int              noOfLatestResult;

    public int              runningIndex;
    public int              currentTestRound;
    public Button           startButton, hearButton;
    public TextView         freqView, decibelView, suiteView,volumeTextView;
    Thread m_PlayThread = null;
    boolean m_bStop = false;
    Integer noOfClick;
    AudioManager mAudioManager;
    AudioDeviceInfo[] devices;
    public Integer          playExecuteCount;

    @RequiresApi(api = Build.VERSION_CODES.M)
    @Override
    protected void onCreate(Bundle savedInstanceState) {
//        super.onCreate(savedInstanceState);
        super.onCreate(null);
        setContentView(R.layout.activity_hearing);
        this.isCanHearClick = false;

        testResultList = new ArrayList<TestResult>();
        testToneList   = new ArrayList<TestTone>();

//        testToneList.add(new TestTone(0, 1000, 60, 3, 0,  5,  10,  5,  0, 1,  0, "R", 5));
//        testToneList.add(new TestTone(1, 1000, 65, 3, 0,  5,  10,  5,  0,  1,  0, "L",5));
//        testToneList.add(new TestTone(2, 1000, 70, 3, 0,  5,  10,  5,  0,  1,  0, "Both",5));

        testToneList.add(new TestTone(0, 1000, 40, 2, 0,  5,  10,  1,  0, 1,  0, "R", 5));
        testToneList.add(new TestTone(1, 2000, 40, 2, 0,  5,  10,  1,  0,  1,  0, "R", 5));
        testToneList.add(new TestTone(2, 4000, 40, 2, 0,  5,  10,   1,0 ,  1,  0, "R", 5));
        testToneList.add(new TestTone(3, 500, 40, 2, 0,  5,  10,  1,  0,  1,  0, "R", 5));
        testToneList.add(new TestTone(4, 1000, 40, 2, 0,  5,  10,  1,  0,  1,  0, "L",5));
        testToneList.add(new TestTone(5, 2000, 40, 2, 0,  5,  10,  1,  0,  1,  0, "L",5));
        testToneList.add(new TestTone(6, 4000, 40, 2, 0,  5,  10,  1,  0,  1,  0, "L",5));
        testToneList.add(new TestTone(7, 500, 40, 2, 0,  5,  10,  1,  0,  1,  0, "L", 5));
        testToneList.add(new TestTone(8, 1000, 40, 2, 0,  5,  10,  1,  0,  1,  0, "Both",5));
        testToneList.add(new TestTone(9, 2000, 40, 2, 0,  5,  10,  1,  0,  1,  0, "Both",5));
        testToneList.add(new TestTone(10, 4000, 40, 2, 0,  5,  10,  1,  0,  1,  0, "Both", 5));
        testToneList.add(new TestTone(11, 500, 40, 2, 0,  5,  10,  1,  0,  1,  0, "Both", 5));

//        testToneList.add(new TestTone(0, 1000, 25, 5, 0,  5,  10,  5,  0, 1,  0, "R", 5));
//        testToneList.add(new TestTone(1, 2000, 30, 5, 0,  5,  10,  5,  0,  1,  0, "R", 5));
//        testToneList.add(new TestTone(2, 4000, 35, 5, 0,  5,  10,   5,0 ,  1,  0, "R", 5));
//        testToneList.add(new TestTone(3, 500, 35, 5, 0,  5,  10,  5,  0,  1,  0, "R", 5));
//        testToneList.add(new TestTone(4, 1000, 35, 5, 0,  5,  10,  5,  0,  1,  0, "L",5));
//        testToneList.add(new TestTone(5, 2000, 35, 5, 0,  5,  10,  5,  0,  1,  0, "L",5));
//        testToneList.add(new TestTone(6, 4000, 35, 5, 0,  5,  10,  5,  0,  1,  0, "L",5));
//        testToneList.add(new TestTone(7, 500, 35, 5, 0,  5,  10,  5,  0,  1,  0, "L", 5));
//        testToneList.add(new TestTone(8, 1000, 35, 5, 0,  5,  10,  5,  0,  1,  0, "Both",5));
//        testToneList.add(new TestTone(9, 2000, 35, 5, 0,  5,  10,  5,  0,  1,  0, "Both",5));
//        testToneList.add(new TestTone(10, 4000, 35, 5, 0,  5,  10,  5,  0,  1,  0, "Both", 5));
//        testToneList.add(new TestTone(11, 500, 35, 5, 0,  5,  10,  5,  0,  1,  0, "Both", 5));


        runningIndex        = 0;
        playExecuteCount    = 0;
        noOfLatestResult    = 0;

        currentRunTone      = testToneList.get(runningIndex);
        currentTestRound    = currentRunTone.testRound;

        freqView            = (TextView) findViewById(R.id.frequency);
        decibelView         = (TextView) findViewById(R.id.decibel);
        suiteView           = (TextView) findViewById(R.id.testSuite);
        volumeTextView      = (TextView) findViewById(R.id.volumeText);

        freqView.setText(""+currentRunTone.frequency);
        decibelView.setText(""+currentRunTone.runDB);
        suiteView.setText(currentRunTone.testSuite);

        volumeTextView.setText("");

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
            if (m_PlayThread != null) {
                try {

                    System.out.println("Lek = mAudioTrack = " + mAudioTrack);
                    System.out.println("Lek = m_PlayThread = " + m_PlayThread);

                } catch (Exception e) {
                    System.out.println(e.getMessage());
                }
            }
        }

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
        playExecuteCount += 1;



        m_PlayThread = new Thread() {


            @RequiresApi(api = Build.VERSION_CODES.M)
            public void run() {
                try {
                    freqView.setText(""+currentRunTone.frequency);
                    decibelView.setText(""+currentRunTone.runDB);
                    suiteView.setText(currentRunTone.testSuite);

                    if(playExecuteCount > 1){
                        currentTestResult = new TestResult(currentRunTone.index,currentRunTone.frequency, currentRunTone.runDB, currentRunTone.testSuite);
                    }
                    generateTone(currentRunTone.frequency, currentRunTone.duration, currentRunTone.runDB, currentRunTone.testSuite);
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
                                    System.out.println("LEK m_bStop = " + m_bStop);
                                    Boolean isEndThisFrequency = false;
                                    if(!m_bStop){

                                        System.out.println("Thread F = " + currentRunTone.frequency + "DB = " + currentRunTone.runDB);
                                        currentRunTone.setIncreaseDB();

                                        freqView.setText(""+currentRunTone.frequency);
                                        decibelView.setText(""+currentRunTone.runDB);
                                        suiteView.setText(currentRunTone.testSuite);
                                        if(currentRunTone.runDB > MAX_DB) {
                                            isEndThisFrequency = true;
                                        }
                                    }
                                    else{

                                        currentTestResult.canHear();
                                        testResultList.add(currentTestResult);
                                        System.out.println("CLICKED latestResult = " + latestResult);
                                        if(latestResult != null){
                                            System.out.println("CLICKED latestResult.hearDB  = " + latestResult.hearDB  + " currentTestResult = " + currentTestResult.hearDB );
                                            if(latestResult.hearDB == currentTestResult.hearDB){
                                                noOfLatestResult += 1;
                                            }else{
                                                latestResult = currentTestResult;
                                            }

                                        }else{
                                            latestResult = currentTestResult;
                                            noOfLatestResult = 1;
                                        }

                                        System.out.println("CLICKED noOfLatestResult = " + noOfLatestResult);
                                        System.out.println("CLICKED STOP AT F = " + currentRunTone.frequency + " DB = " + currentRunTone.runDB + " TS = " + currentRunTone.testSuite);
                                        if(noOfLatestResult < MAX_BEST_RESULT){
                                            currentRunTone.setDecreaseDB();
                                            if (currentRunTone.runDB < MIN_DB) {
                                                currentRunTone.setDecreaseRemainingRound();

                                                if (currentRunTone.remainingRound > 0) {
                                                    testToneList.add(new TestTone(currentRunTone));
                                                }
                                                isEndThisFrequency = true;
                                            }

                                        }else{
                                            isEndThisFrequency = true;
                                        }
                                        m_bStop = false;
                                    }

                                    if(isEndThisFrequency){
                                        runningIndex = runningIndex + 1;
                                        if(runningIndex < testToneList.size()){
                                            currentRunTone = testToneList.get(runningIndex);
                                            latestResult = null;
                                        }
                                    }

                                    m_PlayThread = null;
                                    if(runningIndex < testToneList.size()){
                                        play();
                                    }else{
                                        try {
                                            finishActivity();
                                        } catch (InterruptedException e) {
                                            e.printStackTrace();
                                        }
                                    }

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

    public void finishActivity() throws InterruptedException {

        System.out.println("FINISH ACTIVITY");
        Gson gson = new Gson();
        String resultJson = gson.toJson(testResultList);

        Intent intent = new Intent(this, HearingActivityResult.class);
        intent.putExtra("TestResultList", resultJson);
        startActivity(intent);
        finish();
    }

    @RequiresApi(api = Build.VERSION_CODES.M)
    public void generateTone(int frequency, double durationSec, int volDB, String testSuite){

//        System.out.println("GET TONE");
        System.out.println("LEK --> F = " + frequency + " DB : " + volDB);

        // int mBufferSize = AudioTrack.getMinBufferSize(sampleRate, AudioFormat.CHANNEL_OUT_MONO, AudioFormat.ENCODING_PCM_16BIT);

        int runDuration = (int) durationSec * sampleRate * 2;
        System.out.println("runDuration = " + runDuration);
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

        double amp =( Math.pow(10, volDB/20.0));
        double max_amp = Math.pow(10, 100/20.0);
//        double rms = 0;
//        for (int i = 0; i < runDuration; i++) {
//            rms += mBuffer[i] * mBuffer[i];
//        }
//        rms = Math.sqrt(rms / runDuration);
//        double mAlpha = 0.9;
//        /*Compute a smoothed version for less flickering of the display.*/
//        double mRmsSmoothed = 0.0;
//        mRmsSmoothed = mRmsSmoothed * mAlpha + (1 - mAlpha) * rms;
//        double rmsdB = 20.0 * Math.log10(amp);
//
//
//        System.out.println("LEK mRmsSmoothed = " + mRmsSmoothed);
//
//        double maxVolDB =  20.0 * Math.log10(mRmsSmoothed/ 2700.0);
//        float volumePercentage = (float) (rmsdB/maxVolDB);
        double rmsdB = 20.0 * Math.log10(amp);
        double maxVolDB =  20.0 * Math.log10(max_amp);
        float volumePercentage = (float) (rmsdB/maxVolDB);
        System.out.println("LEK amp = " + amp);
        System.out.println("LEK max_amp = " + max_amp);
//        System.out.println("LEK rmsdB = " + rmsdB);
//        System.out.println("LEK maxVolDB = " + maxVolDB);
        System.out.println("LEK volumePercentage = " + volumePercentage);

        volumeTextView.setText(""+volumePercentage);

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
        if(m_PlayThread != null){
            m_PlayThread.interrupt();
            m_PlayThread = null;
        }
    }



}