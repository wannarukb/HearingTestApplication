package com.hearingtest;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonRequest;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.facebook.react.ReactActivity;
import com.fasterxml.jackson.core.JsonGenerationException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.util.Map;

public class HearingActivityResult extends ReactActivity {

    public TestResultHeader resultHeader;

    public String filePath;
    public String translationMenu;
    public String userId;
    public String testToneJSON;
    public String resultHeaderJSON;

    public Map<String, Object> transalationMap;
    public ImageView resultImage;
    public TextView  header, subHeader, resultText, suggestionText;
    public Button backToMainButton;

    public TestResultReturn testResultReturnInfo;
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

            System.out.println("---- HearingActivityResult ----");
            Gson gson = new Gson();

            resultHeaderJSON  = extras.getString("TestResultList");
            resultHeader        = gson.fromJson(resultHeaderJSON, TestResultHeader.class);
            testToneJSON        = extras.getString("TestToneList");
            filePath            = extras.getString("FilePath");
            translationMenu     =  extras.getString("TranslateMenu");
            userId              = extras.getString("UserId");

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

                String postTestResultURL = (String) transalationMap.get("PostTestToneResult");
                executeTestResultCallout(postTestResultURL);

                testResultReturnInfo = new TestResultReturn(resultHeader.userId, resultHeader.startDateTime, resultHeader.resultSum);

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

    private void saveFile(){
        try {
            System.out.println(testResultReturnInfo);
            if(testResultReturnInfo != null ){
                Gson gson = new Gson();
                String data = gson.toJson(testResultReturnInfo);

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

                if (writer != null) writer.close();

                System.out.println(data);

            }

        } catch (IOException e) {
            e.printStackTrace();
            System.out.println(e);
        }
    }

    public void onClickDone(View view) {

        System.out.println("On Click Done");
        System.out.println(resultHeader);
        if( resultHeader != null ){

            Intent intent = new Intent(this, ReactResultActivity.class);
            startActivity(intent);
            finish();
        }
    }

    public void onClickTryAgain(View view) {

        System.out.println("On Try Again");
        if (resultHeader != null) {
            Intent intent = new Intent(this, HearingActivity.class);
            intent.putExtra("TestToneList", testToneJSON);
            intent.putExtra("FilePath", filePath);
            intent.putExtra("UserId", userId);
            intent.putExtra("TranslateMenu", translationMenu);
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            startActivity(intent);
        }
    }


    public void executeTestResultCallout(String postTestToneResultURL){
        // Instantiate the RequestQueue.
        RequestQueue queue = Volley.newRequestQueue(this);
        String url = postTestToneResultURL;
        System.out.println(url);
        System.out.println(resultHeaderJSON);
        try{
            JsonObjectRequest jsonObjectRequest = new JsonObjectRequest(Request.Method.POST, url, new JSONObject(resultHeaderJSON), new Response.Listener<JSONObject>() {

                @Override
                public void onResponse(JSONObject response) {
                    System.out.println(response);
                    System.out.println("Response: " + response.toString());

                    String hearingTestId = null;
                    try {
                        hearingTestId = response.getString("hearingTestId");
                        testResultReturnInfo.setHearingTestId(hearingTestId);
                        saveFile();

                    } catch (JSONException e) {
                        e.printStackTrace();
                    }


                    Toast.makeText(getApplicationContext(), "Send Test Result Success !", Toast.LENGTH_SHORT);
                }
            }, new Response.ErrorListener() {

                @Override
                public void onErrorResponse(VolleyError error) {
                    // TODO: Handle error
                    System.out.println("VolleyError: " + error.getMessage() + error.toString());
                    Toast.makeText(getApplicationContext(), error.getMessage(), Toast.LENGTH_LONG);
                }
            });

            queue.add(jsonObjectRequest);
        }catch (JSONException jsonEx){
            System.out.println(jsonEx.getMessage() + '\n' + jsonEx.getStackTrace());
        }



    }

}