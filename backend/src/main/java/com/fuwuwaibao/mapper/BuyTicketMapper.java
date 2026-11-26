package com.fuwuwaibao.mapper;

import com.fuwuwaibao.entity.BuyTicketInfo;
import com.fuwuwaibao.entity.MovieContentInfo;
import com.fuwuwaibao.entity.Seatings;
import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Repository;

import java.util.List;

@Mapper
@Repository
public interface BuyTicketMapper {
    @Select("SELECT * FROM buyTicket WHERE id=#{index}")
    List<BuyTicketInfo> get_buyticket(@Param("index") String index);

    @Select("SELECT * FROM movie_content bi \n" +
            "INNER JOIN evaluate ei ON bi.movie_name=ei.movie_name\n" +
            "WHERE bi.id=#{id}")
    List<MovieContentInfo> get_moviecontent1(@Param("id") int id);
    @Select("SELECT * FROM movie_content")
    List<MovieContentInfo> get_moviecontent3();
    @Select("SELECT * FROM movie_content WHERE id=#{id}")
    List<MovieContentInfo> get_moviecontent(@Param("id") int id);

    @Insert("INSERT INTO evaluate(movie_name,yonghu_name,pinjia,star)\n" +
            "VALUES (#{movie_name},#{yonghu_name},#{pinjia},#{star})")
    int insertAevaluate(String movie_name,String yonghu_name,String pinjia,int star);

    @Select("SELECT * FROM buyTicket WHERE time =#{time} and time_start=#{time_start} and movie_name=#{movie_name}")
    List<BuyTicketInfo> get_moviecontent2(@Param("time") String time,@Param("time_start") String time_start,@Param("movie_name") String movie_name);

    @Select("SELECT * FROM seatings")
    List<Seatings> get_seating();

    /**
     * 查询座位当前状态（1=可选，3=已售）。
     * 购票时在分布式锁内先查状态，避免把已售出的座位再次卖出。
     */
    @Select("SELECT state FROM seatings WHERE id=#{id}")
    Integer get_seat_state(@Param("id") int id);

    /**
     * 更新座位为已售。
     * 增加 state<>3 条件，即使锁降级，也不会把已售座位重复更新成功。
     */
    @Update("UPDATE seatings SET state=3 WHERE id=#{id} AND state<>3")
    int update_seating(@Param("id") int id);
    @Insert("INSERT INTO movie_content(movie_name,style,duration,choice,url,content)\n" +
            "VALUES (#{name},#{type},#{during},#{choice},#{image},#{jianjie})")
    int add_Movie(String name,String type,String during,String choice,String image,String jianjie);
}
