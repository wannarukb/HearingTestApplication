package com.hearingtest;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Context;
import android.graphics.Color;
import android.os.Bundle;
import android.os.Parcelable;
import android.util.Log;
import android.view.Gravity;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.facebook.react.ReactActivity;
import com.google.gson.Gson;

import java.io.IOException;
import java.io.OutputStreamWriter;
import java.util.List;

public class HearingActivityResult extends ReactActivity {

    public TestResult[] testResultList;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_hearing_result);

        Bundle extras = getIntent().getExtras();
        if(extras != null) {
            Gson gson = new Gson();
            String resultJSON = extras.getString("TestResultList");
             testResultList    = gson.fromJson(resultJSON, TestResult[].class);
        }

        for(int i=0; i < testResultList.length; i++){
            TestResult eachResult = testResultList[i];
            System.out.println("F = " + eachResult.frequency + ", DB = " + eachResult.hearDB + ", Suite = " + eachResult.testSuite + ", Start = " + eachResult.startDate + ", End = " + eachResult.endDate);
        }

        LinearLayout tableLayout = (LinearLayout)findViewById(R.id.resultTable);


        LinearLayout headerRow = new LinearLayout(getApplicationContext());
        headerRow.setOrientation(LinearLayout.HORIZONTAL);
        headerRow.setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT,LinearLayout.LayoutParams.WRAP_CONTENT));


        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(300, LinearLayout.LayoutParams.WRAP_CONTENT);

        TextView head_frequency_col = new TextView(getApplicationContext());
        TextView head_decibel_col = new TextView(getApplicationContext());
        TextView head_duration_col = new TextView(getApplicationContext());

        head_frequency_col.setText("Frequency");
        head_frequency_col.setGravity(Gravity.CENTER);
        head_frequency_col.setLayoutParams(params);
        head_frequency_col.setPadding(4, 4, 4, 4);


        head_decibel_col.setText("Decibel");
        head_decibel_col.setGravity(Gravity.CENTER);
        head_decibel_col.setLayoutParams(params);
        head_decibel_col.setPadding(4, 4, 4, 4);

        head_duration_col.setText("Suite");
        head_duration_col.setGravity(Gravity.CENTER);
        head_duration_col.setLayoutParams(params);
        head_duration_col.setPadding(4, 4, 4, 4);

        headerRow.addView(head_frequency_col);
        headerRow.addView(head_decibel_col);
        headerRow.addView(head_duration_col);

        tableLayout.addView(headerRow,new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT,LinearLayout.LayoutParams.WRAP_CONTENT));

        for (int index = 0; index < testResultList.length; index++) {
            TestResult eachItem =  testResultList[index];
            LinearLayout tableRow = new LinearLayout(getApplicationContext());
            tableRow.setOrientation(LinearLayout.HORIZONTAL);
            tableRow.setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT,LinearLayout.LayoutParams.WRAP_CONTENT));

            TextView frequency_col = new TextView(getApplicationContext());
            TextView decibel_col = new TextView(getApplicationContext());
            TextView duration_col = new TextView(getApplicationContext());


            frequency_col.setText("" + eachItem.frequency);
            frequency_col.setGravity(Gravity.CENTER);
            frequency_col.setLayoutParams(params);
            frequency_col.setPadding(4, 4, 4, 4);


            decibel_col.setText("" + eachItem.hearDB);
            decibel_col.setGravity(Gravity.CENTER);
            decibel_col.setLayoutParams(params);
            decibel_col.setPadding(4, 4, 4, 4);

//            long diff = eachItem.endDate.getTime() - eachItem.startDate.getTime();
//            long seconds = diff / 1000;
//            duration_col.setText("" + seconds);
//            duration_col.setGravity(Gravity.CENTER);
//            duration_col.setLayoutParams(params);
//            duration_col.setPadding(4, 4, 4, 4);

            duration_col.setText("" + eachItem.testSuite);
            duration_col.setGravity(Gravity.CENTER);
            duration_col.setLayoutParams(params);
            duration_col.setPadding(4, 4, 4, 4);

            tableRow.addView(frequency_col );
            tableRow.addView(decibel_col);
            tableRow.addView(duration_col);

            tableLayout.addView(tableRow);


        }
    }


    private void writeToFile(String data, Context context) {

        try {
            OutputStreamWriter outputStreamWriter = new OutputStreamWriter(context.openFileOutput("config.txt", Context.MODE_PRIVATE));
            outputStreamWriter.write(data);
            outputStreamWriter.close();
        } catch (IOException e) {
            Log.e("Exception", "File write failed: " + e.toString());
        }
    }
}