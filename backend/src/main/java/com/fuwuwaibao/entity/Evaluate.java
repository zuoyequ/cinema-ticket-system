package com.fuwuwaibao.entity;

public class Evaluate {
    String movie_name;
    String yonghu_name;
    String pinjia;

    int star;

    @Override
    public String toString() {
        return "Evaluate{" +
                "movie_name='" + movie_name + '\'' +
                ", yonghu_name='" + yonghu_name + '\'' +
                ", pinjia='" + pinjia + '\'' +
                ", star='" + star + '\'' +
                '}';
    }


    public int getStar() {
        return star;
    }

    public void setStar(int star) {
        this.star = star;
    }

    public String getMovie_name() {
        return movie_name;
    }

    public void setMovie_name(String movie_name) {
        this.movie_name = movie_name;
    }

    public String getYonghu_name() {
        return yonghu_name;
    }

    public void setYonghu_name(String yonghu_name) {
        this.yonghu_name = yonghu_name;
    }

    public String getPinjia() {
        return pinjia;
    }

    public void setPinjia(String pinjia) {
        this.pinjia = pinjia;
    }
}
