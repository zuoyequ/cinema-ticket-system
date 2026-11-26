package com.fuwuwaibao.entity;

public class Shopping {
    int id;
    String name;
    String url;
    int price;
    int vip;
    int stock;
    int type;
    String type_name;
    String payment;
String isDefault;
String typee;
String select;
String telephone;
String street;
String address;
int shoppingid;
String isBuy;

    @Override
    public String toString() {
        return "Shopping{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", url='" + url + '\'' +
                ", price=" + price +
                ", vip=" + vip +
                ", stock=" + stock +
                ", type=" + type +
                ", type_name='" + type_name + '\'' +
                ", payment='" + payment + '\'' +
                ", isDefault='" + isDefault + '\'' +
                ", typee='" + typee + '\'' +
                ", select='" + select + '\'' +
                ", telephone='" + telephone + '\'' +
                ", street='" + street + '\'' +
                ", address='" + address + '\'' +
                ", shoppingid=" + shoppingid +
                ", isBuy='" + isBuy + '\'' +
                '}';
    }

    public String getIsBuy() {
        return isBuy;
    }

    public void setIsBuy(String isBuy) {
        this.isBuy = isBuy;
    }

    public int getShoppingid() {
        return shoppingid;
    }

    public void setShoppingid(int shoppingid) {
        this.shoppingid = shoppingid;
    }

    public String getTelephone() {
        return telephone;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }

    public String getStreet() {
        return street;
    }

    public void setStreet(String street) {
        this.street = street;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getTypee() {
        return typee;
    }

    public void setTypee(String typee) {
        this.typee = typee;
    }

    public String getSelect() {
        return select;
    }

    public void setSelect(String select) {
        this.select = select;
    }

    public String getIsDefault() {
        return isDefault;
    }

    public void setIsDefault(String isDefault) {
        this.isDefault = isDefault;
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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public int getPrice() {
        return price;
    }

    public void setPrice(int price) {
        this.price = price;
    }

    public int getVip() {
        return vip;
    }

    public void setVip(int vip) {
        this.vip = vip;
    }

    public int getStock() {
        return stock;
    }

    public void setStock(int stock) {
        this.stock = stock;
    }

    public int getType() {
        return type;
    }

    public void setType(int type) {
        this.type = type;
    }

    public String getType_name() {
        return type_name;
    }

    public void setType_name(String type_name) {
        this.type_name = type_name;
    }
}
