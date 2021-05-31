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
import android.os.Environment;
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

import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.ObjectOutputStream;
import java.io.OutputStreamWriter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import com.facebook.react.bridge.Callback;
import com.google.gson.Gson;

import org.w3c.dom.Text;

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
    public TextView         freqView, decibelView, suiteView,volumeTextView, durationView, intervalView, testRoundView;
    Thread m_PlayThread = null;
    boolean m_bStop = false;
    Integer noOfClick;
    AudioManager mAudioManager;
    AudioDeviceInfo[] devices;
    public Integer          playExecuteCount;

    public int          userId;
    public String       saveHearingPath;
    public long     startPlayToneFromStart;
    public long     startPlayToneByTonePlayed;

    @RequiresApi(api = Build.VERSION_CODES.M)
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
//        super.onCreate(null);
        setContentView(R.layout.activity_hearing);
        this.isCanHearClick = false;


        testResultList = new ArrayList<TestResult>();
        testToneList   = new ArrayList<TestTone>();
        runningIndex        = 0;
        playExecuteCount    = 0;
        noOfLatestResult    = 0;
        freqView            = (TextView) findViewById(R.id.frequency);
        decibelView         = (TextView) findViewById(R.id.decibel);
        suiteView           = (TextView) findViewById(R.id.testSuite);
        volumeTextView      = (TextView) findViewById(R.id.volumeText);
        durationView        = (TextView) findViewById(R.id.durationText);
        intervalView        = (TextView) findViewById(R.id.intervalText);
        testRoundView       = (TextView) findViewById(R.id.testRoundText);


        Bundle extras = getIntent().getExtras();
        if(extras != null) {
            Gson gson = new Gson();
            String testToneJSON = extras.getString("TestToneList");
            userId              = (int) extras.get("UserId");
            saveHearingPath     = extras.getString("FilePath");

            TestTone[] parseTone;
            System.out.print(testToneJSON);
            parseTone    = gson.fromJson(testToneJSON, TestTone[].class);
            if(parseTone != null && parseTone.length > 0){
                for(int i = 0; i < parseTone.length; i++){
                    TestTone eachTone = parseTone[i];
                    testToneList.add(new TestTone(eachTone.protocolId, eachTone.index, eachTone.frequency,
                            eachTone.startDB, eachTone.durationMin, eachTone.durationMax,
                            eachTone.upDB, eachTone.downDB,
                            eachTone.intervalMin, eachTone.intervalMax,
                            eachTone.testRoundMin, eachTone.testRoundMax,
                            eachTone.testSite, eachTone.maxResult));
                }
            }

            System.out.println("Hearing - testToneList = " + testToneList.size());
            currentRunTone      = testToneList.get(runningIndex);
            System.out.println("Hearing - Current Run Tone  = " + currentRunTone.index + ", " + currentRunTone.testSite + ", " + currentRunTone.frequency + ", " + currentRunTone.runDB);
            currentTestRound    = currentRunTone.testRound;


            freqView.setText(""+currentRunTone.frequency);
            decibelView.setText(""+currentRunTone.runDB);
            suiteView.setText(currentRunTone.testSite);
            durationView.setText(""+currentRunTone.duration);
            intervalView.setText(""+currentRunTone.interval);
            testRoundView.setText(""+currentRunTone.testRound);

            volumeTextView.setText("");

            noOfClick = 0;


            mAudioManager = (AudioManager)getSystemService(Context.AUDIO_SERVICE);
            devices      = mAudioManager.getDevices(AudioManager.GET_DEVICES_OUTPUTS);
        }
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
                startPlayToneFromStart = System.currentTimeMillis();
                startPlayToneByTonePlayed = System.currentTimeMillis();
                play();
            }catch (InterruptedException e) {
                e.printStackTrace();
            }
        }else{
            m_bStop = true;
            if (m_PlayThread != null) {
                try {
                    long clickedTime = System.currentTimeMillis();
                    long clickSecFromStart = (clickedTime - startPlayToneFromStart) / 1000;
                    long clickSecFromByTonePlayed = (clickedTime - startPlayToneByTonePlayed) / 1000;
                    int clickSecFromByTonePlayedInt = (int) clickSecFromByTonePlayed;
                    String timeClickedType = (clickSecFromByTonePlayedInt > currentRunTone.duration) ? "I" : "D";
                    currentTestResult.setCanHear(timeClickedType, clickSecFromStart, clickSecFromByTonePlayed);

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
                    suiteView.setText(currentRunTone.testSite);
                    durationView.setText(""+currentRunTone.duration);
                    intervalView.setText(""+currentRunTone.interval);
                    testRoundView.setText(""+currentRunTone.testRound);


                    if(playExecuteCount > 1){
                        if(currentTestResult != null){
                            currentTestResult.setEndResult();
                            testResultList.add(currentTestResult);
                        }
                        currentTestResult = new TestResult(currentRunTone.protocolId, userId, currentRunTone.index, currentRunTone.frequency, currentRunTone.runDB, currentRunTone.testSite);
                    }
                    generateTone(currentRunTone.frequency, currentRunTone.duration, currentRunTone.runDB, currentRunTone.testSite);
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
                                    if(m_bStop){

                                        if (currentRunTone.remainingRound > 0) {
                                            testToneList.add(new TestTone(currentRunTone));
                                        }
                                        m_bStop = false;
                                    }

                                    runningIndex = runningIndex + 1;
                                    if(runningIndex < testToneList.size()){
                                        currentRunTone = testToneList.get(runningIndex);
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
        intent.putExtra("FilePath", saveHearingPath);
        intent.putExtra("UserId", userId);
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
        stop();
    }

    @Override
    protected void onStop() {
        super.onStop();
        System.out.println("LEK Stop");
        stop();
    }



}