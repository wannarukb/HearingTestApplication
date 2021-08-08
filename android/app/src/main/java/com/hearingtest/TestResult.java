package com.hearingtest;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

public class TestResult {

    public int TestID;
    public String UserId;
    public int Frequency;
    public int Decibel;
    public String TestSite;
    public int IsClickHeard;
    public String TimeClicked;
    public long ClickSecFromStart;
    public long ClickSecFromByTonePlayed;
    public String TestedDateTime;
    public String StartDateTime;
    public String EndDateTime;
    public int ProtocolId;


    private Calendar startDate;

    public TestResult(int protocolId, String userId, int testIndex, int frequency, int dB, String testSide){
        this.TestID         = testIndex;
        this.Frequency      = frequency;
        this.Decibel        = dB;
        this.TestSite       = testSide;
        this.IsClickHeard   = 0;
        this.ProtocolId     = protocolId;
        this.UserId         = userId;
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        Date currentStartDate= Calendar.getInstance().getTime();
        this.StartDateTime   = sdf.format(currentStartDate);
        this.TestedDateTime  = this.StartDateTime;
    }


    public void setCanHear(String timeClickedType, long clickSecFromStart, long clickSecFromByTonePlayed){
        this.IsClickHeard = 1;
        this.TimeClicked  = timeClickedType;
        this.ClickSecFromStart = clickSecFromStart;
        this.ClickSecFromByTonePlayed  = clickSecFromByTonePlayed;
    }

    public void setEndResult(){
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        Date currentEndDate  = Calendar.getInstance().getTime();
        this.EndDateTime     = sdf.format(currentEndDate);
    }

}
