package com.hearingtest;

import java.util.ArrayList;

public class HearingTestResult {
    public String userId;
    public TestResult[] testResults;

    public HearingTestResult(String userId, TestResult[] testResults){
        this.userId = userId;
        this.testResults = testResults;
    }
}
