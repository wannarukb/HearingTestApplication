package com.hearingtest;

import java.util.Calendar;
import java.util.Date;

public class TestResult {

    public int testIndex;
    public int frequency;
    public int hearDB;
    public String testSuite;
    public Boolean isClickHear;
    public Date startDate;
    public Date endDate;
    public Integer noOfClick;

    public TestResult(int testIndex, int frequency, int dB, String testSuite){
        this.testIndex = testIndex;
        this.frequency = frequency;
        this.hearDB    = dB;
        this.testSuite = testSuite;
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
