package com.fuwuwaibao.mapper;

import com.fuwuwaibao.entity.*;
import org.apache.ibatis.annotations.*;
import org.apache.logging.log4j.util.Strings;
import org.springframework.stereotype.Repository;

import java.util.List;

@Mapper
@Repository
public interface ShoppingMapper {

    @Select("SELECT * FROM shopping")
    List<Shopping> get_shopping();

    @Select("SELECT * FROM shopping WHERE name=#{name}")
    List<Shopping> get_shopping1(@Param("name") String name);
    @Select("SELECT * FROM shopping WHERE type_name=#{type_name}")
    List<Shopping> get_shopping2(@Param("type_name") String type_name);
    // 修正：原写法使用 ${} 直接拼接字符串，存在 SQL 注入风险，改为 #{} 预编译占位符
    @Insert("INSERT INTO add_address (name,telephone, street,address) " +
            "VALUES (#{name},#{telephone}, #{street},#{address})")
    int add_address(String name, String telephone, String street, String address);
    // 修正：select 是 MySQL 保留字，作为列名引用时必须加反引号，原写的 sc.select 会导致语法错误
    @Select("SELECT ad.telephone,ad.street,ad.address,sc.typee,sc.`select`,sc.isDefault,sc.id,si.`name`,si.price,si.url,ui.payment,sc.shoppingid FROM shopping_cart sc\n" +
            "INNER JOIN shopping si ON sc.shoppingid=si.id\n" +
            "INNER JOIN `user` ui ON ui.id=sc.userid\n" +
            "INNER JOIN add_address ad ON ad.user_id=sc.userid AND ad.id=sc.address_id\n" +
            "WHERE sc.userid=#{id}")
    List<Shopping> shopping_cart(@Param("id") int id);

    @Select("SELECT ad.telephone,sc.isDefault,sc.id,si.`name`,si.price,si.url,ui.payment,ad.address,ad.street,sc.isBuy FROM shopping_order sc\n" +
            "INNER JOIN shopping si ON sc.shoppingid=si.id\n" +
            "INNER JOIN `user` ui ON ui.id=sc.userid\n" +
            "INNER JOIN add_address ad ON ad.user_id=sc.userid AND ad.id=sc.address_id\n" +
            "WHERE sc.userid=#{id}")
    List<Shopping> shopping_order(@Param("id") int id);
    @Delete("DELETE FROM add_address WHERE id=#{id}")
    int delete_address(@Param("id") int id);
    // 修正：原写法使用 ${} 直接拼接字符串，存在 SQL 注入风险，改为 #{} 预编译占位符
    @Insert("INSERT INTO shopping_cart (userid,shoppingid, address_id,isDefault,typee,`select`) " +
            "VALUES (#{userid},#{shoppingid}, #{address_id}, #{isDefault}, #{typee}, #{select})")
    int insert_shoppingcart(int userid, int shoppingid, int address_id, String isDefault,String typee,String select);

    // 修正：原写法使用 ${} 直接拼接字符串，存在 SQL 注入风险，改为 #{} 预编译占位符
    @Insert("INSERT INTO shopping_order (userid,shoppingid, address_id,isDefault,isBuy) " +
            "VALUES (#{userid},#{shoppingid}, #{address_id}, #{isDefault}, #{isBuy})")
    int insert_shoppingorder(int userid, int shoppingid, int address_id, String isDefault,String isBuy);
    @Select("SELECT * FROM add_address WHERE id=#{id}")
    List<Address> get_address1(@Param("id") int id);
    @Select("SELECT * FROM add_address")
    List<Address> get_address();
    @Update("UPDATE add_address SET name=#{name},telephone=#{telephone},address=#{address},street=#{street} WHERE id=#{id}")
    int update_address(int id,String name,String telephone,String address,String street);
    @Update("UPDATE shopping_order SET isBuy='已收货' WHERE id=#{id}")
    int update_order(int id);

    // 修正：原语句写了 5 个列却给出 6 个值，导致插入必然失败；
    // 现按语义对应：shopname→name、price→price、shopStyle→style、image→url、
    // shopType→type_name、shopJ（商品简介）→content，列与值一一对应
    @Insert("INSERT INTO shopping(name,price,style,url,type_name,content)\n" +
            "VALUES (#{shopname},#{price},#{shopStyle},#{image},#{shopType},#{shopJ})")
    int add_shopping(String shopname,String price,String shopStyle,String shopJ,String image,String shopType);
}
