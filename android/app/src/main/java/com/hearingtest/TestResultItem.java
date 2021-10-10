package com.hearingtest;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

public class TestResultItem {

  //  public int hearingTestId;
    public int testToneId;
    public int counter;
    public int roundNo;
    public String startDateTime;
    public String endDateTime;
    public int frequency;
    public double amplitude;
    public double playDuration;
    public double pauseDuration;
    public long clickTimeByTest;
    public long clickTimeByTone;
    public String testSide;
    public int isHeard;
    public String timeClicked;

    public double decibel; //dbHl
    public double dbSpl;

    public TestResultItem(int hearingTestId, int testToneId, int counter, int roundNo, int frequency, double amplitude, String testSide, double playDuration, double pauseDuration, double dbHl, double dbSpl){
       // this.hearingTestId   = hearingTestId;
        this.testToneId      = testToneId;
        this.counter         = counter;
        this.roundNo         = roundNo;
        this.frequency       = frequency;
        this.amplitude       = amplitude;
        this.testSide        = testSide;
        this.playDuration    = playDuration;
        this.pauseDuration   = pauseDuration;
        this.timeClicked     = "";
        this.decibel            = dbHl;
        this.dbSpl           = dbSpl;

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
        Date currentStartDate= Calendar.getInstance().getTime();
        this.startDateTime   = sdf.format(currentStartDate);
    }


    public void setCanHear(String timeClickedType, long clickSecFromStart, long clickSecFromByTonePlayed){
        this.isHeard = 1;
        this.timeClicked  = timeClickedType;
        this.clickTimeByTest = clickSecFromStart;
        this.clickTimeByTone  = clickSecFromByTonePlayed;
    }

    public void setEndResult(){
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
        Date currentEndDate  = Calendar.getInstance().getTime();
        this.endDateTime     = sdf.format(currentEndDate);
    }

}
