package com.fuwuwaibao.service;

import com.fuwuwaibao.entity.AdminInfo;
import com.fuwuwaibao.entity.MemberInfo;
import com.fuwuwaibao.entity.StudentInfo;
import com.fuwuwaibao.mapper.StudentMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentService {
    @Autowired
    private StudentMapper studentMapper;

    public List<StudentInfo> check(){
        return (List<StudentInfo>) studentMapper.check();
    }
    public List<StudentInfo> check1(int id){
        return (List<StudentInfo>) studentMapper.check1(id);
    }
    public List<MemberInfo> check2(int id){
        return (List<MemberInfo>) studentMapper.check2(id);
    }
    public List<AdminInfo> check3(int id){
        return (List<AdminInfo>) studentMapper.check3(id);
    }
    public List<StudentInfo> check4(int id,int type){
        String user;
        if (type==3){
            user="admin";
        }else if(type==1){
            user="user";
        }else{
            user="member";
        }
        return (List<StudentInfo>) studentMapper.check4(id,user);
    }
    public StudentInfo checkLogin(String telephone, String pwd, int type){
        String user;
        if (type==3){
            user="admin";
        }else if(type==1){
            user="user";
        }else{
            user="member";
        }

        return studentMapper.checkLogin(telephone,pwd,user);
    }
    public int check_Register(String trName,String telephone, String password, int type) {
        String user;
        if (type==3){
            user="admin";
        }else if(type==1){
            user="user";
        }else{
            user="member";
        }

        return studentMapper.check_Register(trName,telephone,password,user);
    }
}
