package com.fuwuwaibao.webcontroller;

import com.fuwuwaibao.entity.*;
import com.fuwuwaibao.service.ModelService;
import com.fuwuwaibao.service.MovieService;
import com.fuwuwaibao.service.StudentService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class WebController {
    @Autowired
    private StudentService studentService;
    @Autowired
    private ModelService modelService;
    @Autowired
    private MovieService movieService;


    @RequestMapping("check_login")
    public Object checkLogin(HttpServletRequest request) {
        //request是获取上一个网页里面form表单里面的input类型的name的值。
        String telephone = request.getParameter("telephone");
        String password = request.getParameter("password");
        int type= Integer.parseInt(request.getParameter("type"));

        if (type == 1) {
            HttpSession session = request.getSession();
            StudentInfo studentInfo = null;
            studentInfo = studentService.checkLogin(telephone, password, type);
            return studentInfo;
        } else if (type == 2) {
            HttpSession session = request.getSession();
            StudentInfo studentInfo = null;
            studentInfo = studentService.checkLogin(telephone, password, type);
            return studentInfo;
        } else {
            HttpSession session = request.getSession();
            StudentInfo studentInfo = null;
            studentInfo = studentService.checkLogin(telephone, password, type);
            return studentInfo;
        }
    }
    @RequestMapping("chaxun")
    public List<StudentInfo> check(){
        return studentService.check();
    }
    @RequestMapping("chaxun1")
    public List<StudentInfo> check1(HttpServletRequest request){
        int id= Integer.parseInt(request.getParameter("id"));

        return studentService.check1(id);
    }
    @RequestMapping("chaxun2")
    public List<MemberInfo> check2(HttpServletRequest request){
        int id= Integer.parseInt(request.getParameter("id"));
        return studentService.check2(id);
    }
    @RequestMapping("chaxun3")
    public List<AdminInfo> check3(HttpServletRequest request){
        int id= Integer.parseInt(request.getParameter("id"));

        return studentService.check3(id);
    }
    @RequestMapping("chaxun4")
    public List<StudentInfo> check4(HttpServletRequest request){
        int id= Integer.parseInt(request.getParameter("id"));
        int type= Integer.parseInt(request.getParameter("type"));
        return studentService.check4(id,type);
    }
    @RequestMapping("check_Register")
    public int check_Register(HttpServletRequest request) {
        //request是获取上一个网页里面form表单里面的input类型的name的值。
        String trName=request.getParameter("trName");
        String telephone = request.getParameter("telephone");
        String password = request.getParameter("password");
        int type = Integer.parseInt(request.getParameter("type"));
        System.out.println(type);
        if (type==1) {

            int flag=0;
            flag = studentService.check_Register(trName,telephone, password, type);
            return flag;
        }else if (type==2){

            int flag=0;
            flag = studentService.check_Register(trName,telephone, password, type);
            return flag;
        }else{

            int flag=0;
            flag = studentService.check_Register(trName,telephone, password, type);
            return flag;
        }

    }

    @RequestMapping("model_login")
    public Object modelLogin(HttpServletRequest request){
        int id= Integer.parseInt(request.getParameter("id"));
        HttpSession session = request.getSession();
        ModelInfo modelInfo = null;
        modelInfo = modelService.modelLogin(id);
        return modelInfo;

    }
    @RequestMapping("movie_login")
    public MovieInfo movieLogin(HttpServletRequest request){
        String id= request.getParameter("movieid");
        System.out.println(id);
        HttpSession session = request.getSession();
        MovieInfo movieInfo = null;
        movieInfo = movieService.movieLogin(id);
        System.out.println(movieInfo);
        return movieInfo;

    }
}
