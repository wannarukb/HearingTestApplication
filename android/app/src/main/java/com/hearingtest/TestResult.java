package com.hearingtest;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

public class TestResult {

    public int testIndex;
    public int frequency;
    public int hearDB;
    public String testSite;
    public Boolean isClickHear;
    public Date startDate;
    public Date endDate;
    public Integer noOfClick;
    public String saveDate;

    public TestResult(int testIndex, int frequency, int dB, String testSite){
        this.testIndex = testIndex;
        this.frequency = frequency;
        this.hearDB    = dB;
        this.testSite = testSite;
        this.isClickHear = false;
        this.startDate = Calendar.getInstance().getTime();
        this.noOfClick = 1;
    }

    public void resetStartDate(int newHearDB){
        if(newHearDB < this.hearDB){
            this.startDate = Calendar.getInstance().getTime();
            this.hearDB = newHearDB;
        }

    }

    public void increaseNoOfClick(){
        this.noOfClick = this.noOfClick + 1;
    }

    public void canHear(){
        this.endDate   = Calendar.getInstance().getTime();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        this.saveDate  =  sdf.format(this.endDate);
        this.isClickHear = true;
    }

    public void setClickHear(int newHearDB){
        this.endDate   = Calendar.getInstance().getTime();
        this.isClickHear = true;
        if(newHearDB < this.hearDB){
            this.hearDB = newHearDB;
        }
    }

}
