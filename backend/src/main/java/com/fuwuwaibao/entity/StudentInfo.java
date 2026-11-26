package com.fuwuwaibao.entity;

import java.sql.Blob;

public class StudentInfo {
    int id;
    String username;
    String telephone;
    String password;
    int type;
    Blob img_url;
    String payment;
    String user;
    int state;
    String gender;
    String birth;
    String email;
    String address;
    String work;

    @Override
    public String toString() {
        return "StudentInfo{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", telephone='" + telephone + '\'' +
                ", password='" + password + '\'' +
                ", type=" + type +
                ", img_url=" + img_url +
                ", payment='" + payment + '\'' +
                ", user='" + user + '\'' +
                ", state=" + state +
                ", gender='" + gender + '\'' +
                ", birth='" + birth + '\'' +
                ", email='" + email + '\'' +
                ", address='" + address + '\'' +
                ", work='" + work + '\'' +
                '}';
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getBirth() {
        return birth;
    }

    public void setBirth(String birth) {
        this.birth = birth;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getWork() {
        return work;
    }

    public void setWork(String work) {
        this.work = work;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public int getState() {
        return state;
    }

    public void setState(int state) {
        this.state = state;
    }

    public String getUser() {
        return user;
    }

    public void setUser(String user) {
        this.user = user;
    }

    public String getPayment() {
        return payment;
    }

    public void setPayment(String payment) {
        this.payment = payment;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }



    public String getTelephone() {
        return telephone;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public int getType() {
        return type;
    }

    public void setType(int type) {
        this.type = type;
    }

    public Blob getImg_url() {
        return img_url;
    }

    public void setImg_url(Blob img_url) {
        this.img_url = img_url;
    }
}
