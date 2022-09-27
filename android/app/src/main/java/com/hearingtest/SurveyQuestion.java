package com.hearingtest;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.facebook.react.ReactActivity;
import com.fasterxml.jackson.core.JsonGenerationException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;

import java.io.IOException;
import java.util.Map;

public class SurveyQuestion extends ReactActivity {

    public TestResultHeader resultHeader;
    public String filePath;
    public Map<String, Object> transalationMap;

    public TextView  header, mainQuestion, question1, question2, question3;
    public Button checkResultButton;
    public CheckBox checkbox1, checkbox2, checkbox3;

    public String translationMenu;
    public String userId;
    public String testToneJSON;
    public String userInfoJSON;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_survey_question);


        checkResultButton = (Button) findViewById(R.id.checkResultButton);
        header          = (TextView) findViewById(R.id.userSurveyHeaderLabel);
        mainQuestion    = (TextView) findViewById(R.id.mainPageQuestion);
        question1      = (TextView) findViewById(R.id.question1);
        question2      = (TextView) findViewById(R.id.question2);
        question3      = (TextView) findViewById(R.id.question3);

        checkbox1      = (CheckBox) findViewById(R.id.checkbox_q1);
        checkbox2      = (CheckBox) findViewById(R.id.checkbox_q2);
        checkbox3      = (CheckBox) findViewById(R.id.checkbox_q3);


        Bundle extras = getIntent().getExtras();
        if (extras != null) {

            System.out.println("---- SurveyQuestion ----");
            Gson gson = new Gson();

            String resultJSON   = extras.getString("TestResultList");
            testToneJSON        = extras.getString("TestToneList");
            resultHeader        = gson.fromJson(resultJSON, TestResultHeader.class);
            filePath            = extras.getString("FilePath");
            translationMenu     = extras.getString("TranslateMenu");
            userId              = extras.getString("UserId");
            userInfoJSON        = extras.getString("UserInfo");


            try {
                transalationMap = new ObjectMapper().readValue(translationMenu, Map.class);

                checkResultButton.setText((String) transalationMap.get("CheckResultButton"));
                header.setText((String) transalationMap.get("UserSurveyHeaderLabel"));
                mainQuestion.setText((String) transalationMap.get("MainPageQuestion"));
                question1.setText((String) transalationMap.get("FirstQuestion"));
                question2.setText((String) transalationMap.get("SecondQuestion"));
                question3.setText((String) transalationMap.get("ThirdQuestion"));

                String yesLabel = (String)transalationMap.get("YesLabel");

                checkbox1.setText(yesLabel);
                checkbox2.setText(yesLabel);
                checkbox3.setText(yesLabel);

            } catch (JsonGenerationException e) {
                e.printStackTrace();
            } catch (JsonMappingException e) {
                e.printStackTrace();
            } catch (IOException e) {
                e.printStackTrace();
            }

        }


    }

    public void onCheckboxClicked(View view) {
        // Is the view now checked?
        boolean checked = ((CheckBox) view).isChecked();

        // Check which checkbox was clicked
        switch(view.getId()) {
            case R.id.checkbox_q1:
                if (checked) resultHeader.q1 = "true";
                else resultHeader.q1 = "false";
                break;
            case R.id.checkbox_q2:
                if (checked) resultHeader.q2 = "true";
                else resultHeader.q2 = "false";
            case R.id.checkbox_q3:
                if (checked) resultHeader.q3 = "true";
                else resultHeader.q3 = "false";
        }
    }


    public void onClickDone(View view) {

        System.out.println("On Click Done");
        System.out.println(resultHeader);
        if( resultHeader != null ){

            Gson gson = new Gson();
            String resultHeaderJson = gson.toJson(resultHeader);

            Intent intent = new Intent(this, HearingActivityResult.class);
            intent.putExtra("TestToneList", testToneJSON);
            intent.putExtra("TestResultList", resultHeaderJson);
            intent.putExtra("FilePath", filePath);
            intent.putExtra("UserId", userId);
            intent.putExtra("UserInfo", userInfoJSON);
            intent.putExtra("TranslateMenu", translationMenu);
            startActivity(intent);
        }
    }
}