package com.fuwuwaibao.entity;

public class Seatings {
    int id;
    int state;

    @Override
    public String toString() {
        return "Seatings{" +
                "id=" + id +
                ", state=" + state +
                '}';
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getState() {
        return state;
    }

    public void setState(int state) {
        this.state = state;
    }
}
