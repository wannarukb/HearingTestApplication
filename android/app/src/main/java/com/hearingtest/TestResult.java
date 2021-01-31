package com.hearingtest;

import java.util.Date;

public class TestResult {

    public int testIndex;
    public int frequency;
    public int dB;
    public String testSuite;


    public TestResult(int testIndex, int frequency, int dB, String testSuite){
        this.testIndex = testIndex;
        this.frequency = frequency;
        this.dB        = dB;
        this.testSuite = testSuite;
    }

}
