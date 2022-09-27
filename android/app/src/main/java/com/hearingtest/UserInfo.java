package com.hearingtest;

public class UserInfo {

    public int userId;
    public String firstName;
    public String lastName;

    public String gender;
    public String ageRange;

    public UserInfo(int userId, String firstName, String lastName, String gender, String ageRange){
        this.userId = userId;
        this.firstName = firstName;
        this.lastName  = lastName;
        this.gender    = gender;
        this.ageRange  = ageRange;
    }


}
