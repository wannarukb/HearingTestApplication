package com.hearingtest;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.media.AudioManager;
import android.os.Bundle;
import android.os.Parcelable;
import android.util.Base64;
import android.util.Log;
import android.view.Gravity;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.facebook.react.ReactActivity;
import com.facebook.react.bridge.ReactApplicationContext;
import com.fasterxml.jackson.core.JsonGenerationException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.ObjectOutputStream;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

public class HearingActivityResult extends ReactActivity {

    public TestResultHeader resultHeader;

    public String filePath;

    public Map<String, Object> transalationMap;
    public ImageView resultImage;
    public TextView  header, subHeader, resultText, suggestionText;
    public Button backToMainButton;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_hearing_result);

        header      = (TextView) findViewById(R.id.toneResultHeader);
        subHeader   = (TextView) findViewById(R.id.toneResultSubHeader);
        resultText  = (TextView) findViewById(R.id.toneResultText);
        suggestionText = (TextView) findViewById(R.id.resultSuggestion);

        resultImage = (ImageView) findViewById(R.id.resultImage);
        backToMainButton = (Button) findViewById(R.id.doneTesting);

        Bundle extras = getIntent().getExtras();
        if(extras != null) {
            Gson gson = new Gson();

            String resultJSON = extras.getString("TestResultList");
            resultHeader    = gson.fromJson(resultJSON, TestResultHeader.class);
            filePath          = extras.getString("FilePath");

            String translateMenu = extras.getString("TranslateMenu");

            try
            {
                transalationMap = new ObjectMapper().readValue(translateMenu, Map.class);
                header.setText((String) transalationMap.get("ToneResultIntro"));
                subHeader.setText((String) transalationMap.get("ToneResultLabel"));
                backToMainButton.setText((String) transalationMap.get("GoBackToHomePageButton"));

                if(resultHeader.isGoodResult()){
                    resultImage.setImageResource(R.drawable.result_normalcase);
                    resultText.setText((String) transalationMap.get("ToneResultInfo_Good"));
                    suggestionText.setText((String) transalationMap.get("ToneResultInfo_GoodSuggestion"));
                }else{
                    resultImage.setImageResource(R.drawable.result_badcase);
                    resultText.setText((String) transalationMap.get("ToneResultInfo_Bad"));
                    suggestionText.setText((String) transalationMap.get("ToneResultInfo_BadSuggestion"));
                }

            }
            catch (JsonGenerationException e) {
                e.printStackTrace();
            } catch (JsonMappingException e) {
                e.printStackTrace();
            } catch (IOException e) {
                e.printStackTrace();
            }

        }

        for(int i=0; i < resultHeader.resultTestTones.size(); i++){
            TestResultItem eachResult = resultHeader.resultTestTones.get(i);
            System.out.println(eachResult.frequency + ", " + eachResult.amplitude + ", " + eachResult.testSide + ", " + eachResult.isHeard + ", " + eachResult.timeClicked + ", " + eachResult.clickTimeByTone + ", " + eachResult.clickTimeByTest);
        }





//        LinearLayout tableLayout = (LinearLayout)findViewById(R.id.resultTable);


//        LinearLayout headerRow = new LinearLayout(getApplicationContext());
//        headerRow.setOrientation(LinearLayout.HORIZONTAL);
//        headerRow.setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT,LinearLayout.LayoutParams.WRAP_CONTENT));
//
//
//        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(225, LinearLayout.LayoutParams.WRAP_CONTENT);
//
//        TextView head_frequency_col = new TextView(getApplicationContext());
//        TextView head_decibel_col = new TextView(getApplicationContext());
//        TextView head_duration_col = new TextView(getApplicationContext());
//        TextView head_canHear_col = new TextView(getApplicationContext());
//
//        head_frequency_col.setText("Frequency");
//        head_frequency_col.setGravity(Gravity.CENTER);
//        head_frequency_col.setLayoutParams(params);
//
//        head_decibel_col.setText("Amplitude");
//        head_decibel_col.setGravity(Gravity.CENTER);
//        head_decibel_col.setLayoutParams(params);
//        head_decibel_col.setPadding(4, 4, 4, 4);
//
//        head_duration_col.setText("Site");
//        head_duration_col.setGravity(Gravity.CENTER);
//        head_duration_col.setLayoutParams(params);
//        head_duration_col.setPadding(4, 4, 4, 4);
//
//        head_canHear_col.setText("Is Heard");
//        head_canHear_col.setGravity(Gravity.CENTER);
//        head_canHear_col.setLayoutParams(params);
//        head_canHear_col.setPadding(4, 4, 4, 4);
//
//
//
//
//
//        headerRow.addView(head_frequency_col);
//        headerRow.addView(head_decibel_col);
//        headerRow.addView(head_duration_col);
//        headerRow.addView(head_canHear_col);
//
//        tableLayout.addView(headerRow,new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT,LinearLayout.LayoutParams.WRAP_CONTENT));
//
//        for(int i=0; i < resultHeader.resultTestTones.size(); i++){
//            TestResultItem eachItem = resultHeader.resultTestTones.get(i);
//            LinearLayout tableRow = new LinearLayout(getApplicationContext());
//            tableRow.setOrientation(LinearLayout.HORIZONTAL);
//            tableRow.setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT,LinearLayout.LayoutParams.WRAP_CONTENT));
//
//            TextView frequency_col = new TextView(getApplicationContext());
//            TextView decibel_col = new TextView(getApplicationContext());
//            TextView duration_col = new TextView(getApplicationContext());
//            TextView canHear_col = new TextView(getApplicationContext());
//
//
//            frequency_col.setText("" + eachItem.frequency);
//            frequency_col.setGravity(Gravity.CENTER);
//            frequency_col.setLayoutParams(params);
//            frequency_col.setPadding(4, 4, 4, 4);
//
//
//            decibel_col.setText("" + eachItem.amplitude);
//            decibel_col.setGravity(Gravity.CENTER);
//            decibel_col.setLayoutParams(params);
//            decibel_col.setPadding(4, 4, 4, 4);
//
//
//            duration_col.setText("" + eachItem.testSide);
//            duration_col.setGravity(Gravity.CENTER);
//            duration_col.setLayoutParams(params);
//            duration_col.setPadding(4, 4, 4, 4);
//
//            String isHeard = "" + eachItem.isHeard;
//            if(eachItem.timeClicked == "I" || eachItem.timeClicked == "D"){
//                isHeard +=  " - " + eachItem.timeClicked;
//            }
//            canHear_col.setText( isHeard );
//            canHear_col.setGravity(Gravity.LEFT);
//            canHear_col.setLayoutParams(params);
//            canHear_col.setPadding(4, 4, 4, 4);
//
//
//            tableRow.addView(frequency_col );
//            tableRow.addView(decibel_col);
//            tableRow.addView(duration_col);
//            tableRow.addView(canHear_col);
//
//            tableLayout.addView(tableRow);


  //      }

        saveFile();
    }

    private void saveFile(){
        try {
            System.out.println(resultHeader);
            if(resultHeader != null ){
                Gson gson = new Gson();
                String data = gson.toJson(resultHeader);

//                String encoded = URLEncoder.encode(data, "UTF-8");

                filePath = filePath + "/" + "HearingTestResult.txt";
//                FileOutputStream fileOut = new FileOutputStream(filePath);
//                ObjectOutputStream objectOut = new ObjectOutputStream(fileOut);
//                objectOut.writeObject(encoded);
//                fileOut.getFD().sync();

                File f = new File(filePath);
                BufferedWriter writer = new BufferedWriter( new OutputStreamWriter(
                        new FileOutputStream(filePath),"UTF-8"));
                writer.write(data);

                if (writer != null) writer.close( );

                System.out.println(data);

            }

        } catch (IOException e) {
            e.printStackTrace();
            System.out.println(e);
        }
    }

    public void onClickDone(View view) {
        System.out.println(resultHeader);
        if( resultHeader != null ){

            Intent intent = new Intent(this, ReactResultActivity.class);
            startActivity(intent);
            finish();
        }



    }

//
//    private void writeToFile() {
//            try {
//
//                if(userId != null && userId != "" && testResultList != null && testResultList.length > 0){
//                    Gson gson = new Gson();
//                    HearingTestResult resultInfo = new HearingTestResult(userId, testResultList);
//                    String data = gson.toJson(resultInfo);
//
//                    filePath = filePath + "/" + "HearingTestResult.json";
//                    FileOutputStream fileOut = new FileOutputStream(filePath);
//                    ObjectOutputStream objectOut = new ObjectOutputStream(fileOut);
//                    objectOut.writeObject(data);
//                    fileOut.getFD().sync();
//                }
//
//            } catch (IOException e) {
//                e.printStackTrace();
//                System.out.println(e);
//            }
////        try {
////            OutputStreamWriter outputStreamWriter = new OutputStreamWriter(context.openFileOutput("config.txt", Context.MODE_PRIVATE));
////            outputStreamWriter.write(data);
////            outputStreamWriter.close();
////        } catch (IOException e) {
////            Log.e("Exception", "File write failed: " + e.toString());
////        }
//    }
}