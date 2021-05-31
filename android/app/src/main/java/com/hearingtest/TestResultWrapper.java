package com.hearingtest;

public class TestResultWrapper {

    public String userId;
    public String lastSyncDate;
    public TestResult[] testResultList;

    public TestResultWrapper(String userId, TestResult[] testResultList ){
        this.userId = userId;
        this.testResultList = testResultList;
    }
}
