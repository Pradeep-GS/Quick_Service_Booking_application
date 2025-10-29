package com.quickserviceapp.quickserviceapp.DTO;

public class UserLogInDto {
    private String mailID;
    private String password;

    public String getMailID() {
        return mailID;
    }

    public void setMailID(String mailID) {
        this.mailID = mailID;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
