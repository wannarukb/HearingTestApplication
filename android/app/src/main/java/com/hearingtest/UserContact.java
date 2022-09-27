package com.hearingtest;

import android.content.Intent;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.room.util.StringUtil;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.Volley;
import com.facebook.react.ReactActivity;
import com.fasterxml.jackson.core.JsonGenerationException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;

import org.json.JSONException;
import org.json.JSONObject;
import org.w3c.dom.Text;

import java.io.IOException;
import java.util.Map;

public class UserContact extends ReactActivity {

    public TestResultHeader resultHeader;
    public TestResultReturn resultReturnToHome;
    public String filePath;
    public Map<String, Object> transalationMap;

    public TextView  header, subHeader, contactNameLabel, contactNoLabel, contactRefCodeLabel, contactRefCode, contactNameError, contactNoError;
    public Button tryAgainButton, homePageButton, confirmButton;
    public EditText contactNameInput, contactNoInput;

    public String translationMenu;
    public String userId;
    public String testToneJSON;
    public String userInfoJSON;
    public UserInfo userInfo;
    public TestResultReturn testResultForReturn;

    public Boolean isSendSuccess;
    public String  postUserContactURL;

    public String  httpResultMessage = "";


    public LinearLayout fieldSection1, fieldSection2, fieldSection3, resultError, resultSuccess;
    public TextView resultSuccessHeader, resultSuccessDetail, resultErrorDetail;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_user_contact);

        this.isSendSuccess = false;

        confirmButton   = (Button) findViewById(R.id.confirmButton);
        tryAgainButton  = (Button) findViewById(R.id.tryAgainButton);
        homePageButton  = (Button) findViewById(R.id.doneTesting);

        header          = (TextView) findViewById(R.id.contactHeaderLabel);
        subHeader       = (TextView) findViewById(R.id.subHeaderLabel);
        contactNameLabel    = (TextView) findViewById(R.id.contactNameLabel);
        contactNoLabel      = (TextView) findViewById(R.id.contactNoLabel);
        contactRefCodeLabel = (TextView) findViewById(R.id.contactRefCodeLabel);
        contactRefCode      = (TextView) findViewById(R.id.contactRefCode);
        contactNameError    = (TextView) findViewById(R.id.contactNameError);
        contactNoError      = (TextView) findViewById(R.id.contactNoError);

        contactNameInput    = (EditText) findViewById(R.id.contactName);
        contactNoInput      = (EditText) findViewById(R.id.contactNo);


        fieldSection1  = (LinearLayout) findViewById(R.id.userContactSection1);
        fieldSection2  = (LinearLayout) findViewById(R.id.userContactSection2);
        fieldSection3  = (LinearLayout) findViewById(R.id.userContactSection3);
        resultError    = (LinearLayout) findViewById(R.id.result_error);
        resultSuccess  = (LinearLayout) findViewById(R.id.result_success);

        resultSuccessHeader = (TextView) findViewById(R.id.result_success_header);
        resultSuccessDetail = (TextView) findViewById(R.id.result_success_detail);
        resultErrorDetail   = (TextView) findViewById(R.id.errorMessage);


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

            String testResultForReturnJSON = extras.getString("TestResultForReturn");
            testResultForReturn = gson.fromJson(testResultForReturnJSON, TestResultReturn.class);


            if(userInfoJSON != null && userInfoJSON.length() > 0 && userInfoJSON != " "){
                userInfo        = gson.fromJson(userInfoJSON, UserInfo.class);
            }


            try {
                transalationMap = new ObjectMapper().readValue(translationMenu, Map.class);

                confirmButton.setText((String) transalationMap.get("ConfirmButton"));
                tryAgainButton.setText((String) transalationMap.get("TryAgainButton"));
                homePageButton.setText((String) transalationMap.get("GoBackToHomePageButton"));

                header.setText((String) transalationMap.get("UserContactHeader"));
                subHeader.setText((String) transalationMap.get("UserContactSubHeader"));
                contactNameLabel.setText((String) transalationMap.get("UserContactNameLabel"));
                contactNoLabel.setText((String) transalationMap.get("UserContactNoLabel"));
                contactNameError.setText((String) transalationMap.get("RequireFieldMissing"));
                contactNoError.setText((String) transalationMap.get("RequireFieldMissing"));


                resultSuccessHeader.setText((String) transalationMap.get("SuccessReceiveContact"));
                resultSuccessDetail.setText((String) transalationMap.get("SuccessReceiveContactDetail"));
                resultErrorDetail.setText((String) transalationMap.get("FailedReceiveContact"));

                postUserContactURL = (String) transalationMap.get("PostUserContactInfo");

                if(userInfo != null){
                    String contactNameDefault = "";
                    if(userInfo.firstName != null && userInfo.lastName != null){
                        contactNameDefault = userInfo.firstName + " " + userInfo.lastName;
                    }else if(userInfo.firstName != null){
                        contactNameDefault = userInfo.firstName;
                    }else if(userInfo.lastName != null){
                        contactNameDefault = userInfo.lastName;
                    }

                    if(contactNameDefault != null && contactNameDefault.length() > 0){
                        contactNameInput.setText(contactNameDefault);
                    }
                }

                if(testResultForReturn != null){
                    String pattern        = "00000000";
                    String hearingRefCode = testResultForReturn.hearingTestId;

                    String hearingRefCodeShow =  pattern.substring(0, pattern.length() - hearingRefCode.length()) + hearingRefCode;
                    contactRefCode.setText(hearingRefCodeShow);
                }

            } catch (JsonGenerationException e) {
                e.printStackTrace();
            } catch (JsonMappingException e) {
                e.printStackTrace();
            } catch (IOException e) {
                e.printStackTrace();
            }

        }


    }

    public void processLayoutResult(Boolean isSuccess){

        if(isSuccess){
            fieldSection1.setVisibility(View.GONE);
            fieldSection2.setVisibility(View.GONE);
            fieldSection3.setVisibility(View.GONE);
            confirmButton.setVisibility(View.GONE);
            resultSuccess.setVisibility(View.VISIBLE);
        }else{
            resultError.setVisibility(View.VISIBLE);
        }
    }

    public void onClickConfirmContact(View view) {

        System.out.println("On Click Confirm Contact");
        System.out.println(testResultForReturn);
        if( testResultForReturn != null ){
            String inputName = contactNameInput.getText().toString();
            String inputContactNo = contactNoInput.getText().toString();
            Boolean isError = false;
            if(inputName == null || inputName.length() == 0){
                contactNameInput.setBackgroundResource(R.drawable.require_text_background);
                contactNameError.setVisibility(View.VISIBLE);
                isError = true;
            }else{
                contactNameInput.setBackgroundResource(R.drawable.edit_text_background);
                contactNameError.setVisibility(View.GONE);
            }

            if(inputContactNo == null || inputContactNo.length() == 0){
                contactNoInput.setBackgroundResource(R.drawable.require_text_background);
                contactNoError.setVisibility(View.VISIBLE);
                isError = true;
            }else{
                contactNoInput.setBackgroundResource(R.drawable.edit_text_background);
                contactNoError.setVisibility(View.GONE);
            }

            if(isError == false){
                UserContactDetail contactDetail = new UserContactDetail(Integer.parseInt(userId), testResultForReturn.hearingTestId, inputName, inputContactNo);
                executeSendContactInfo(postUserContactURL, contactDetail);
            }
            
        }
    }

    public void onClickTryAgain(View view) {

        System.out.println("On Try Again");
        if (resultHeader != null) {

            Intent intent = new Intent(getApplication(), HearingActivity.class);
            intent.putExtra("TestToneList", testToneJSON);
            intent.putExtra("FilePath", filePath);
            intent.putExtra("UserId", String.valueOf(resultHeader.userId));
            intent.putExtra("UserInfo", userInfoJSON);
            intent.putExtra("TranslateMenu", translationMenu);
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            startActivity(intent);

        }
    }


    public void onClickDone(View view) {

        System.out.println("On Click Done");
        Intent intent = new Intent(this, ReactResultActivity.class);
        startActivity(intent);
        finish();
    }


    public void executeSendContactInfo(String postContactInfoURL, UserContactDetail contactDetail){
        // Instantiate the RequestQueue.
        RequestQueue queue = Volley.newRequestQueue(this);
        String url = postContactInfoURL;
        System.out.println(url);
        System.out.println(contactDetail);

        if(contactDetail != null){
            Gson gson = new Gson();
            String requestBody = gson.toJson(contactDetail);

            System.out.println(requestBody);


            try{
                JsonObjectRequest jsonObjectRequest = new JsonObjectRequest(Request.Method.POST, url, new JSONObject(requestBody), new Response.Listener<JSONObject>() {

                    @Override
                    public void onResponse(JSONObject response) {
                        System.out.println(response);
                        System.out.println("Response: " + response.toString());
                        processLayoutResult(true);
                    }
                }, new Response.ErrorListener() {

                    @Override
                    public void onErrorResponse(VolleyError error) {
                        // TODO: Handle error
                        System.out.println("VolleyError: " + error.getMessage() + error.toString());
                        //Toast.makeText(getApplicationContext(), error.getMessage(), Toast.LENGTH_LONG);
                        processLayoutResult(false);
                    }
                });

                queue.add(jsonObjectRequest);
            }catch (JSONException jsonEx){
                processLayoutResult(false);
                System.out.println(jsonEx.getMessage() + '\n' + jsonEx.getStackTrace());
            }
        }





    }

}