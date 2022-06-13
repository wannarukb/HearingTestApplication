package com.hearingtest;

public class TestResultReturn {
    public String hearingTestId;
    public int userId;
    public String startDateTime;
    public String resultSum;

    public TestResultReturn(int userId, String startDateTime, String resultSum){
        this.userId         = userId;
        this.startDateTime  = startDateTime;
        this.resultSum      = resultSum;
    }

    public void setHearingTestId(String hearingTestId){
        this.hearingTestId = hearingTestId;
    }
}
