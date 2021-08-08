package com.hearingtest;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

public class TestResultHeader {

    public int protocolId;
    public int userId;
    public String startDateTime;
    public String endDateTime;
    public List<TestResultItem> resultTestTones;

    public TestResultHeader(int protocolId, int userId ){
        this.protocolId = protocolId;
        this.userId     = userId;

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
        Date currentStartDate= Calendar.getInstance().getTime();
        this.startDateTime   = sdf.format(currentStartDate);
    }

    public void endTestResult(List<TestResultItem> resultItems){
        this.resultTestTones = resultItems;

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
        Date currentEndDate  = Calendar.getInstance().getTime();
        this.endDateTime     = sdf.format(currentEndDate);
    }

}
