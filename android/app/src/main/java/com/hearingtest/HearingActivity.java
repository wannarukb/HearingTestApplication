package com.hearingtest;

import androidx.annotation.RequiresApi;
import androidx.appcompat.app.AppCompatActivity;

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
import android.util.Log;
import android.view.View;
import android.widget.Button;

import com.facebook.react.ReactActivity;

import java.text.DecimalFormat;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

public class HearingActivity extends ReactActivity {

    private final int duration = 200; // seconds
    private final int sampleRate = 8000;
    private final int numSamples = duration * sampleRate / 1000;
    private double sample[];// =new double[numSamples];
    private final double freqOfTone = 1440; // hz
    private int pulseLength;
    private byte generatedSnd[];// = new byte[2 * numSamples];
    private int period = 4; // hz
    public AudioTrack mAudioTrack;
    Handler handler = new Handler();

    Button startBtn;


    @RequiresApi(api = Build.VERSION_CODES.M)
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_hearing);

        int mBufferSize = AudioTrack.getMinBufferSize(sampleRate,
                AudioFormat.CHANNEL_OUT_MONO,
                AudioFormat.ENCODING_PCM_8BIT);

        mAudioTrack = new AudioTrack.Builder()
                .setAudioAttributes(new AudioAttributes.Builder()
                        .setUsage(AudioAttributes.USAGE_ALARM)
                        .setContentType(AudioAttributes.CONTENT_TYPE_MUSIC)
                        .build())
                .setAudioFormat(new AudioFormat.Builder()
                        .setEncoding(AudioFormat.ENCODING_PCM_16BIT)
                        .setSampleRate(sampleRate)
                        .setChannelMask(AudioFormat.CHANNEL_OUT_STEREO)
                        .build())
                .setBufferSizeInBytes(mBufferSize)
                .build();


        pulseLength = duration * sampleRate / 1000;
        System.out.print("+++ Pulse " + pulseLength);

//        genTone();

//        View view = this.getWindow().getDecorView();
//
//        final Button button = findViewById(R.id.canHearBtn);
//        button.setOnClickListener(new View.OnClickListener() {
//            public void onClick(View v) {
//                // Code here executes on main thread after user presses button
//            }
//        });
//        view.setBackgroundColor(Color.parseColor("#505050"));




    }

    public void onClickStart(View view) {
        genTone();
    }


//    @Override
//    protected void onResume() {
//        super.onResume();
//
//        new SoundGen().execute(period);
//
//    }
//
//    private class SoundGen extends AsyncTask<Integer, Void, Void> {
//        @Override
//        protected Void doInBackground(Integer... hz) {
//            long mils = (int) (1000.0 / hz[0]);
//            long start = System.currentTimeMillis();
//            long next = start + mils;
//
//            while (true) {
//                long now = System.currentTimeMillis();
//                if (now > next) {
//                    next = now + mils;
//                    playSound();
//                }
//
//            }
//        }
//
//    }

    void genTone() {
        sample = new double[numSamples];
        generatedSnd = new byte[2 * numSamples];
        int rate = numSamples / period;

        for (int i = 0; i < numSamples; ++i) {
            if (i % rate == 0) {
                System.out.println("+++ Create tone " + i);

                int j = 0;
                for (j = 0; j < pulseLength; j++) {

                    sample[i + j] = Math.sin(2 * Math.PI * (i + j)
                            / (sampleRate / freqOfTone));
                    System.out.println("+++ SAMPLE " + (i + j) + " "
                            + sample[i + j]);
                }
                i = i + j;
            }
        }

        // convert to 16 bit pcm sound array
        // assumes the sample buffer is normalised.
        int idx = 0;
        for (final double dVal : sample) {
            // scale to maximum amplitude
            final short val = (short) ((dVal * 32767));
            // in 16 bit wav PCM, first byte is the low order byte
            generatedSnd[idx++] = (byte) (val & 0x00ff);
            generatedSnd[idx++] = (byte) ((val & 0xff00) >>> 8);

        }

        playSound();
    }


    void playSound() {
        System.out.println("+++ PLAY ++++ playSound " );
        //audioTrack.stop();
        //audioTrack.setPlaybackHeadPosition(0);
//        final AudioTrack audioTrack = new AudioTrack(AudioManager.STREAM_MUSIC, sampleRate, AudioFormat.CHANNEL_CONFIGURATION_MONO, AudioFormat.ENCODING_PCM_16BIT, generatedSnd.length, AudioTrack.MODE_STATIC);
        mAudioTrack.write(generatedSnd, 0, generatedSnd.length);
        mAudioTrack.play();
    }
}