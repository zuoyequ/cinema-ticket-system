package com.fuwuwaibao.entity;

public class MovieContentInfo {
    int id;
    String movie_name;
    String english_name;
    String style;
    String huang;
    String start;
    String score_name;
    String score;
    String score_number;
    String number;
    String content;

    String yonghu_name;
    String pinjia;
    int star;
    String zhuyan;
    String address;
    String duration;
    String url;

    @Override
    public String toString() {
        return "MovieContentInfo{" +
                "id=" + id +
                ", movie_name='" + movie_name + '\'' +
                ", english_name='" + english_name + '\'' +
                ", style='" + style + '\'' +
                ", huang='" + huang + '\'' +
                ", start='" + start + '\'' +
                ", score_name='" + score_name + '\'' +
                ", score='" + score + '\'' +
                ", score_number='" + score_number + '\'' +
                ", number='" + number + '\'' +
                ", content='" + content + '\'' +
                ", yonghu_name='" + yonghu_name + '\'' +
                ", pinjia='" + pinjia + '\'' +
                ", star=" + star +
                ", zhuyan='" + zhuyan + '\'' +
                ", address='" + address + '\'' +
                ", duration='" + duration + '\'' +
                ", url='" + url + '\'' +
                '}';
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getZhuyan() {
        return zhuyan;
    }

    public void setZhuyan(String zhuyan) {
        this.zhuyan = zhuyan;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public int getStar() {
        return star;
    }

    public void setStar(int star) {
        this.star = star;
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

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getMovie_name() {
        return movie_name;
    }

    public void setMovie_name(String movie_name) {
        this.movie_name = movie_name;
    }

    public String getEnglish_name() {
        return english_name;
    }

    public void setEnglish_name(String english_name) {
        this.english_name = english_name;
    }

    public String getStyle() {
        return style;
    }

    public void setStyle(String style) {
        this.style = style;
    }

    public String getHuang() {
        return huang;
    }

    public void setHuang(String huang) {
        this.huang = huang;
    }

    public String getStart() {
        return start;
    }

    public void setStart(String start) {
        this.start = start;
    }

    public String getScore_name() {
        return score_name;
    }

    public void setScore_name(String score_name) {
        this.score_name = score_name;
    }

    public String getScore() {
        return score;
    }

    public void setScore(String score) {
        this.score = score;
    }

    public String getScore_number() {
        return score_number;
    }

    public void setScore_number(String score_number) {
        this.score_number = score_number;
    }

    public String getNumber() {
        return number;
    }

    public void setNumber(String number) {
        this.number = number;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
