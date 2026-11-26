package com.fuwuwaibao.entity;

public class MemberInfo {
    int id;
    String username;
    String user;
    String telephone;
    String password;
    int type;
    int state;

    @Override
    public String toString() {
        return "MemberInfo{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", user='" + user + '\'' +
                ", telephone='" + telephone + '\'' +
                ", password='" + password + '\'' +
                ", type=" + type +
                ", state=" + state +
                '}';
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getUser() {
        return user;
    }

    public void setUser(String user) {
        this.user = user;
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

    public int getState() {
        return state;
    }

    public void setState(int state) {
        this.state = state;
    }
}
