package com.hearingtest;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
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
import java.util.Collection;
import java.util.Iterator;
import java.util.List;
import java.util.ListIterator;

import com.facebook.react.bridge.Callback;
import com.google.gson.Gson;

import org.w3c.dom.Text;

public class HearingActivity extends ReactActivity {

    private final int       sampleRate = 44100;
    public AudioTrack       mAudioTrack;
    public List<TestTone>   testToneList;
    public List<TestResultItem> testResultList;
    public Boolean          isCanHearClick;
    public TestTone         currentRunTone;
    public TestResultItem   currentTestResult;
    public int              noOfLatestResult;

    public int              runningIndex;
    public int              currentTestRound;
    public Button           startButton;
    public TextView         freqView, decibelView, suiteView,volumeTextView, durationView, intervalView, testRoundView;
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


    @RequiresApi(api = Build.VERSION_CODES.M)
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
//        super.onCreate(null);
        setContentView(R.layout.activity_hearing);
        this.isCanHearClick = false;


        testResultList = new ArrayList<TestResultItem>();
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
            userId              = Integer.parseInt(extras.getString("UserId"));
            saveHearingPath     = extras.getString("FilePath");

            TestTone[] parseTone;
            System.out.println(testToneJSON);
            parseTone    = gson.fromJson(testToneJSON, TestTone[].class);


            if(parseTone != null && parseTone.length > 0){
                List<TestTone> parseList = Arrays.asList(parseTone);
                List<TestTone> parseToneArray = new ArrayList<TestTone>();
                parseToneArray.addAll(parseList);
                TestTone tempTone;
                int i = 0;
                int tonesize = parseList.size();
                while(i < tonesize){
                    TestTone eachTone = parseToneArray.get(i);
                    System.out.println(i + " : " + eachTone.runIndex + " : LEK3 = " + eachTone.frequency + ", " + eachTone.amplitude + ", " + eachTone.remainingRound + ", " + eachTone.testSide + " , " + eachTone.duration + ", " + eachTone.interval);
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


            freqView.setText(playExecuteCount + " - "+currentRunTone.frequency);
            decibelView.setText(""+currentRunTone.amplitude);
            suiteView.setText(currentRunTone.testSide);
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
        startButton         = (Button) findViewById(R.id.start);
        startButton.setText("ได้ยิน");
        noOfClick += 1;
        System.out.println(" no of click = " + noOfClick);

        if(noOfClick == 1){
            System.out.println("++++++++++++ Start ++++++++++++ ");
            try {
                play();
                m_PlayThread.interrupt();
                m_PlayThread.join();
                m_PlayThread = null;
                startPlayToneFromStart = System.currentTimeMillis();
                startPlayToneByTonePlayed = System.currentTimeMillis();
                userHearingTest = new TestResultHeader( protocolId, userId);
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
                    String timeClickedType = (clickSecFromByTonePlayedInt >= currentRunTone.duration) ? "I" : "D";

                    System.out.println("RESULTJA :  "+ (playExecuteCount - 1) + " : " + currentRunTone.frequency  + ", " + currentRunTone.amplitude  + ", "+ currentRunTone.testSide  + ", " + clickSecFromStart + ", " + clickSecFromByTonePlayedInt + ", " + timeClickedType);
                    currentTestResult.setCanHear(timeClickedType, clickSecFromStart, clickSecFromByTonePlayed);

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

    @RequiresApi(api = Build.VERSION_CODES.M)
    synchronized void play() {
        System.out.println("LEK PLAY");
        playExecuteCount += 1;

        m_PlayThread = new Thread() {


            @RequiresApi(api = Build.VERSION_CODES.M)
            public void run() {
                try {

                    freqView.setText((playExecuteCount -1 )+" - "+currentRunTone.frequency);
                    decibelView.setText(""+currentRunTone.amplitude);
                    suiteView.setText(currentRunTone.testSide);
                    durationView.setText(""+currentRunTone.duration);
                    intervalView.setText(""+currentRunTone.interval);
                    testRoundView.setText(""+currentRunTone.testRound);


                    if(playExecuteCount > 1){
                        if(currentTestResult != null){
                            currentTestResult.setEndResult();
                            testResultList.add(currentTestResult);
                        }

                        currentTestResult = new TestResultItem(currentRunTone.protocolId, currentRunTone.testToneId,
                                currentRunTone.counter,currentRunTone.roundNo, currentRunTone.frequency, currentRunTone.amplitude,
                                currentRunTone.testSide, currentRunTone.duration, currentRunTone.interval,
                                currentRunTone.dbHl, currentRunTone.dbSpl);
                        //currentTestResult = new TestResult(currentRunTone.protocolId, userId, currentRunTone.index, currentRunTone.frequency, currentRunTone.runDB, currentRunTone.testSide);
                    }
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
                                    System.out.println("LEK m_bStop = " + m_bStop);
                                    if(m_bStop) {
                                        m_bStop = false;
                                    }
                                    System.out.println("LEK RUN = " + currentRunTone.frequency + ", " + currentRunTone.amplitude + " , " + currentRunTone.testSide + " , " + currentRunTone.duration + ", " + currentRunTone.interval);

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
        Gson gson = new Gson();
        String resultJson = gson.toJson(userHearingTest);

        System.out.print("result" + resultJson);

        Intent intent = new Intent(this, HearingActivityResult.class);
        intent.putExtra("TestResultList", resultJson);
        intent.putExtra("FilePath", saveHearingPath);
        intent.putExtra("UserId", userId);
        startActivity(intent);
        finish();
    }

    @RequiresApi(api = Build.VERSION_CODES.M)
    public void generateTone(int frequency, double durationSec, double amplitude, String earSide){

//        System.out.println("GET TONE");
        System.out.println("LEK --> F = " + frequency + " amplitude : " + amplitude);

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

       // double amp =( Math.pow(10, volDB/20.0));
        double amp = amplitude;
//        double max_amp = Math.pow(10, 100/20.0);
//        double rmsdB = 20.0 * Math.log10(amp);
//        double maxVolDB =  20.0 * Math.log10(max_amp);
//        float volumePercentage = (float) (rmsdB/maxVolDB);
//        System.out.println("LEK amp = " + amp);
//        System.out.println("LEK max_amp = " + max_amp);
//        System.out.println("LEK volumePercentage = " + volumePercentage);
        float volumePercentage = (float) (amp);
        volumeTextView.setText(""+volumePercentage);

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