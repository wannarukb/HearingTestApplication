package com.hearingtest;

public class UserContactDetail {

    public int UserId;
    public int UserHearingTestId;
    public String Firstname;
    public String Lastname;
    public String PhoneNumber;

    public UserContactDetail(int userId, String hearingTestId, String firstname, String contactNo){
        this.UserId         = userId;
        this.UserHearingTestId  = (hearingTestId != null && hearingTestId.length() > 0) ? Integer.parseInt(hearingTestId) : null;
        this.Firstname      = firstname;
        this.PhoneNumber    = contactNo;
        this.Lastname       = "-";
    }

    public void setLastName(String lastName){
        this.Lastname = lastName;
    }

}
