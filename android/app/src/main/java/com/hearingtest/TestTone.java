package com.hearingtest;

public class TestTone {

    public int protocolId;
    public int testToneId;
    public int orderNo;
    public String flagStatus;
    public int frequency;
    public double dbHl;
    public double dbSpl;
    public double amplitude;
    public double durationMin;
    public double durationMax;
    public int upDb; // To increase decibel when user cannot hear the tone
    public int downDb; // To decrease decibel when user can hear the tone
    public double intervalMin;
    public double intervalMax;
    public int testRoundMin;
    public int testRoundMax;
    public String testSide;
    public String roundRandom;

    public String decibel;

    public double duration; // run duration --> if DurationMax > 0 --> this value will be random, otherwise uses the DurationMin
    public double interval; // the interval that will use for waiting for the next line. --> if IntervalMax > 0 --> this value will be random, otherwise uses the IntervalMin
    public long intervalSleep; // the sleep time in milisecond
    public int testRound;// the test round for each frequency  --> if TestRoundMax > 0 --> this value will be random, otherwise uses the TestRoundMin
    public int maxResult;
    public int remainingRound;
    public int runDB;
    public int runIndex;
    public int counter;
    public int roundNo;

    public TestTone(TestTone eachTone, Boolean isNew){
        this.protocolId     = eachTone.protocolId;
        this.testToneId     = eachTone.testToneId;
        this.orderNo        = eachTone.orderNo;
        this.flagStatus     = eachTone.flagStatus;
        this.frequency      = eachTone.frequency;
        this.dbHl           = eachTone.dbHl;
        this.dbSpl          = eachTone.dbSpl;
        this.amplitude      = eachTone.amplitude;
      //  this.runDB          = eachTone.runDB;
        this.upDb           = eachTone.upDb;
        this.downDb         = eachTone.downDb;
        this.testSide       = eachTone.testSide;
        this.roundRandom    = eachTone.roundRandom;

        if(isNew){
            this.durationMin    = (eachTone.durationMin != 0) ? eachTone.durationMin : 1;
            this.durationMax    = eachTone.durationMax;
            this.duration       = (durationMax != 0) ? ((Math.random() * (eachTone.durationMax - this.durationMin)) + this.durationMin) : this.durationMin;
            this.intervalMin    = (intervalMin != 0) ? intervalMin : 1;
            this.intervalMax    = eachTone.intervalMax;
            this.interval       = (intervalMax != 0) ? ((Math.random() * (eachTone.intervalMax - this.intervalMin )) + this.intervalMin ) : this.intervalMin ;
            this.testRoundMin   = (testRoundMin != 0) ? testRoundMin : 1;
            this.testRoundMax   = eachTone.testRoundMax;
            this.testRound      = (eachTone.testRoundMax != 0) ? ((int)(Math.random() * (eachTone.testRoundMax - this.testRoundMin)) + this.testRoundMin) : this.testRoundMin;
            this.intervalSleep  = (long) (this.interval + this.duration) * 1000;
            this.remainingRound = this.testRound;
            this.maxResult      = eachTone.maxResult;
            this.roundNo        = 1;
        }else{
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
    }


    public void setDecreaseRemainingRound(){
        this.remainingRound  = this.remainingRound - 1;
    }
}
