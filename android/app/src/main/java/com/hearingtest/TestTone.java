package com.hearingtest;

public class TestTone {

    public int index;
    public int frequency;
    public int runDB;
    public int startDB;
    public int upDB; // To increase decibel when user cannot hear the tone
    public int downDB; // To decrease decibel when user can hear the tone
    public double duration; // run duration --> if DurationMax > 0 --> this value will be random, otherwise uses the DurationMin
    public double interval; // the interval that will use for waiting for the next line. --> if IntervalMax > 0 --> this value will be random, otherwise uses the IntervalMin
    public long intervalSleep; // the sleep time in milisecond
    public int testRound;// the test round for each frequency  --> if TestRoundMax > 0 --> this value will be random, otherwise uses the TestRoundMin
    public String testSuite;
    public int maxResult;

    public int remainingRound;

    public TestTone(int index, int frequency, int startDB, double durationMin, double durationMax, int upDB, int downDB, double intervalMin, double intervalMax, int testRoundMin, int testRoundMax, String testSuite, int maxResult){
        this.index          = index;
        this.frequency      = frequency;
        this.startDB        = startDB;
        this.runDB          = this.startDB;
        this.upDB           = upDB;
        this.downDB         = downDB;
        this.testSuite      = testSuite;
        this.duration       = (durationMax != 0) ? ((Math.random() * (durationMax - durationMin)) + durationMin) : durationMin;
        this.interval       = (intervalMax != 0) ? ((Math.random() * (intervalMax - intervalMin)) + intervalMin) : intervalMin;
        this.testRound      = (testRoundMax != 0) ? ((int)(Math.random() * (testRoundMax - testRoundMin)) + testRoundMin) : testRoundMin;
        this.intervalSleep  = (long) this.interval * 1000;
        this.remainingRound = this.testRound;
        this.maxResult      = maxResult;
    }

    public TestTone(TestTone eachTone){
        this.index          = eachTone.index;
        this.frequency      = eachTone.frequency;
        this.startDB        = eachTone.startDB;
        this.runDB          = eachTone.startDB;
        this.upDB           = eachTone.upDB;
        this.downDB         = eachTone.downDB;
        this.testSuite      = eachTone.testSuite;
        this.duration       = eachTone.duration;
        this.interval       = eachTone.interval;
        this.testRound      = eachTone.testRound;
        this.intervalSleep  = (long) eachTone.interval * 1000;
        this.remainingRound = eachTone.remainingRound - 1;
        this.maxResult      = eachTone.maxResult;
    }

    public void setDecreaseDB(){
        this.runDB = this.runDB - this.downDB;
    }

    public void setIncreaseDB(){
        this.runDB = this.runDB +this.upDB;
    }

    public void setDecreaseRemainingRound(){
        this.remainingRound  = this.remainingRound - 1;
    }
}
