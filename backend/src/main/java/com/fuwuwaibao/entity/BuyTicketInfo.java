package com.fuwuwaibao.entity;

public class BuyTicketInfo {
    private int buy_id;
    public int getBuy_id() { return buy_id; }
    public void setBuy_id(int buy_id) { this.buy_id = buy_id; }
    String index;
    String movie_name;
    String time_start;
    String time_end;
    String type;
    String seat;
    String price;
    String vip_price;
    String time;

    @Override
    public String toString() {
        return "BuyTicketInfo{" +
                "index='" + index + '\'' +
                ", movie_name='" + movie_name + '\'' +
                ", time_start='" + time_start + '\'' +
                ", time_end='" + time_end + '\'' +
                ", type='" + type + '\'' +
                ", seat='" + seat + '\'' +
                ", price='" + price + '\'' +
                ", vip_price='" + vip_price + '\'' +
                ", time='" + time + '\'' +
                '}';
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public String getIndex() {
        return index;
    }

    public void setIndex(String index) {
        this.index = index;
    }

    public String getMovie_name() {
        return movie_name;
    }

    public void setMovie_name(String movie_name) {
        this.movie_name = movie_name;
    }

    public String getTime_start() {
        return time_start;
    }

    public void setTime_start(String time_start) {
        this.time_start = time_start;
    }

    public String getTime_end() {
        return time_end;
    }

    public void setTime_end(String time_end) {
        this.time_end = time_end;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getSeat() {
        return seat;
    }

    public void setSeat(String seat) {
        this.seat = seat;
    }

    public String getPrice() {
        return price;
    }

    public void setPrice(String price) {
        this.price = price;
    }

    public String getVip_price() {
        return vip_price;
    }

    public void setVip_price(String vip_price) {
        this.vip_price = vip_price;
    }
}
