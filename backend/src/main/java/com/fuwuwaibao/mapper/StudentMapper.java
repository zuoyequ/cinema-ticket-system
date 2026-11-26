package com.fuwuwaibao.mapper;

import com.fuwuwaibao.entity.AdminInfo;
import com.fuwuwaibao.entity.MemberInfo;
import com.fuwuwaibao.entity.StudentInfo;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.springframework.stereotype.Repository;

import java.util.List;

@Mapper
@Repository
public interface StudentMapper {

    @Select("select * from ${user} where telephone=#{telephone} and password=#{password}")
    StudentInfo checkLogin(@Param("telephone") String telephone,
                           @Param("password") String password,
                           @Param("user") String user);


    @Select("select * from user")
    List<StudentInfo> check();
    @Select("select * from user where id=#{id}")
    List<StudentInfo> check1(@Param("id") int id);
    @Select("select * from member where id=#{id}")
    List<MemberInfo> check2(@Param("id") int id);
    @Select("select * from admin where id=#{id}")
    List<AdminInfo> check3(@Param("id") int id);
    @Select("select * from ${user} where id=#{id}")
    List<StudentInfo> check4(@Param("id") int id,String user);
    // 说明：${user} 为表名占位符，其取值在 StudentService 中由 type 白名单映射得到
    // （只会是 user/member/admin 三者之一），不存在注入风险；
    // 但用户名、电话、密码原先用 ${} 拼接，存在 SQL 注入风险，已改为 #{} 预编译占位符
    @Insert("INSERT INTO ${user} (username,telephone, password) " +
            "VALUES (#{trName},#{telephone}, #{password})")
    int check_Register(String trName, String telephone, String password, String user);
}
