package com.fuwuwaibao.webcontroller;

import com.fuwuwaibao.entity.BuyTicketInfo;
import com.fuwuwaibao.entity.MovieContentInfo;
import com.fuwuwaibao.entity.Seatings;
import com.fuwuwaibao.service.BuyTicketService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class BuyTicketController {
    @Autowired
    private BuyTicketService buyTicketService;

    @RequestMapping("get_buyticket")
    public List<BuyTicketInfo> get_buyticket(HttpServletRequest request){
        String index = request.getParameter("index");

        List<BuyTicketInfo> BuyTicketInfoList=null;
        BuyTicketInfoList=buyTicketService.get_buyticket(index);
        return BuyTicketInfoList;
    }
    @RequestMapping("get_moviecontent")
    public List<MovieContentInfo> get_moviecontent(HttpServletRequest request){
        int id = Integer.parseInt(request.getParameter("id"));
        List<MovieContentInfo> BuyTicketInfoList=null;
        BuyTicketInfoList=buyTicketService.get_moviecontent(id);
        //System.out.println(BuyTicketInfoList);
        return BuyTicketInfoList;
    }
    @RequestMapping("get_moviecontent3")
    public List<MovieContentInfo> get_moviecontent3(HttpServletRequest request){

        List<MovieContentInfo> BuyTicketInfoList=null;
        BuyTicketInfoList=buyTicketService.get_moviecontent3();
        //System.out.println(BuyTicketInfoList);
        return BuyTicketInfoList;
    }
    @RequestMapping("get_moviecontent1")
    public List<MovieContentInfo> get_moviecontent1(HttpServletRequest request){
        int id = Integer.parseInt(request.getParameter("id"));
        List<MovieContentInfo> BuyTicketInfoList1=null;
        BuyTicketInfoList1=buyTicketService.get_moviecontent1(id);
        //System.out.println(BuyTicketInfoList1);
        return BuyTicketInfoList1;
    }

    @RequestMapping("add_Movie")
    public int add_Movie(HttpServletRequest request){
        String name=request.getParameter("name");
        String type=request.getParameter("type");
        String during=request.getParameter("during");
        String choice=request.getParameter("choice");
        String image=request.getParameter("image");
        String jianjie=request.getParameter("jianjie");
        int addressList=0;
        addressList=buyTicketService.add_Movie(name,type,during,choice,image,jianjie);
        return addressList;
    }



    @RequestMapping("get_moviecontent2")
    public List<BuyTicketInfo> get_moviecontent2(HttpServletRequest request){
        String time=request.getParameter("time");
        String time_start=request.getParameter("time_start");
        String movie_name=request.getParameter("movie_name");
        List<BuyTicketInfo> BuyTicketInfoList2=null;

        BuyTicketInfoList2=buyTicketService.get_moviecontent2(time,time_start,movie_name);
        //System.out.println(BuyTicketInfoList2);
        return BuyTicketInfoList2;
    }


    @RequestMapping("insert_Aevaluate")
    public int insertAevaluate(HttpServletRequest request){
        String movie_name=request.getParameter("movie_name");
        String yonghu_name=request.getParameter("yonghu_name");
        String pinjia=request.getParameter("pinjia");
        int star= Integer.parseInt(request.getParameter("star"));
        int Aevaluate=buyTicketService.insertAevaluate(movie_name,yonghu_name,pinjia,star);
        return Aevaluate;
    }
    @RequestMapping("get_seating")
    public List<Seatings> get_seating(HttpServletRequest request){
        String time=request.getParameter("time");
        System.out.println(time);
        String time_start=request.getParameter("time_start");
        System.out.println(time_start);
        String movie_name=request.getParameter("movie_name");
        System.out.println(movie_name);
        // 修正：原代码把「孤注一掷 + 3月7日 + 13:40」写死在 if 判断里，
        // 导致其它影片/场次查询座位时永远返回 null。座位数据按影厅整体存放，
        // 此处直接返回全部座位，不再做无意义的硬编码过滤。
        return buyTicketService.get_seating();
    }


    @RequestMapping("update_seating")
    public int update_seating(HttpServletRequest request){
        int id= Integer.parseInt(request.getParameter("id"));
        int updateseatings=buyTicketService.update_seating(id);
        return updateseatings;
    }
}
