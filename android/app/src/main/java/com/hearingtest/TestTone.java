package com.hearingtest;

public class TestTone {

    public int protocolId;
    public int testToneId;
    public int orderNo;
    public int frequency;
    public String decibel;
    public int upDb; // To increase decibel when user cannot hear the tone
    public int downDb; // To decrease decibel when user can hear the tone
    public double duration; // run duration --> if DurationMax > 0 --> this value will be random, otherwise uses the DurationMin
    public double interval; // the interval that will use for waiting for the next line. --> if IntervalMax > 0 --> this value will be random, otherwise uses the IntervalMin
    public long intervalSleep; // the sleep time in milisecond
    public int testRound;// the test round for each frequency  --> if TestRoundMax > 0 --> this value will be random, otherwise uses the TestRoundMin
    public String testSide;
    public int maxResult;

    public int remainingRound;
    public double durationMin;
    public double durationMax;
    public double intervalMin;
    public double intervalMax;
    public int testRoundMin;
    public int testRoundMax;
    public int runDB;

    public int runIndex;
    public int counter;
    public int roundNo;

    public TestTone(){

    }

    public TestTone(int protocolId, int index, int frequency, int runDB, double durationMin, double durationMax, int upDB, int downDB, double intervalMin, double intervalMax, int testRoundMin, int testRoundMax, String testSide, int maxResult){
        this.protocolId     = protocolId;
        this.testToneId     = index;
        this.frequency      = frequency;
        this.runDB          = runDB;
        this.upDb           = upDB;
        this.downDb         = downDB;
        this.testSide       = testSide;
        this.durationMin    = (durationMin != 0) ? durationMin : 1;
        this.durationMax    = durationMax;
        this.duration       = (durationMax != 0) ? ((Math.random() * (durationMax - this.durationMin)) + this.durationMin) : this.durationMin;
        this.intervalMin    = (intervalMin != 0) ? intervalMin : 1;
        this.intervalMax    = intervalMax;
        this.interval       = (intervalMax != 0) ? ((Math.random() * (intervalMax - this.intervalMin )) + this.intervalMin ) : this.intervalMin ;
        this.testRoundMin   = (testRoundMin != 0) ? testRoundMin : 1;
        this.testRoundMax   = testRoundMax;
        this.testRound      = (testRoundMax != 0) ? ((int)(Math.random() * (testRoundMax - this.testRoundMin)) + this.testRoundMin) : this.testRoundMin;
        this.intervalSleep  = (long) (this.interval + this.duration) * 1000;
        this.remainingRound = this.testRound;
        this.maxResult      = maxResult;
        this.roundNo        = 1;
    }

    public TestTone(TestTone eachTone){
        this.protocolId     = eachTone.protocolId;
        this.testToneId     = eachTone.testToneId;
        this.frequency      = eachTone.frequency;
        this.runDB          = eachTone.runDB;
        this.upDb           = eachTone.upDb;
        this.downDb         = eachTone.downDb;
        this.testSide       = eachTone.testSide;
        this.duration       = eachTone.duration;
        this.durationMin    = eachTone.durationMin;
        this.durationMax    = eachTone.durationMax;
        this.interval       = eachTone.interval;
        this.intervalMin    = eachTone.intervalMin;
        this.intervalMax    = eachTone.intervalMax;
        this.testRound      = eachTone.testRound;
        this.testRoundMin   = eachTone.testRoundMin;
        this.testRoundMax   = eachTone.testRoundMax;
        this.intervalSleep  = eachTone.intervalSleep;
        this.remainingRound = eachTone.remainingRound;
        this.maxResult      = eachTone.maxResult;
        this.roundNo        = eachTone.roundNo + 1;
    }


    public void setDecreaseRemainingRound(){
        this.remainingRound  = this.remainingRound - 1;
    }
}
