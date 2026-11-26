package com.fuwuwaibao.entity;

public class ModelInfo {
    int id;
    String path;
    String notes;
    String number;

    @Override
    public String toString() {
        return "ModelInfo{" +
                "id=" + id +
                ", path='" + path + '\'' +
                ", notes='" + notes + '\'' +
                ", number='" + number + '\'' +
                '}';
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public String getNumber() {
        return number;
    }

    public void setNumber(String number) {
        this.number = number;
    }
}
