package com.fuwuwaibao.service;

import com.fuwuwaibao.entity.*;
import com.fuwuwaibao.mapper.BuyTicketMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.List;

@Service
public class BuyTicketService {

    private static final Logger log = LoggerFactory.getLogger(BuyTicketService.class);

    /** 影片列表缓存键：首页/影片列表都会查这个接口，属于典型热点数据 */
    private static final String MOVIE_LIST_CACHE_KEY = "cinema:movie:list";
    /** 缓存过期时间：10 分钟，既能挡住大量重复查询，又不至于长时间读到旧数据 */
    private static final Duration MOVIE_LIST_CACHE_TTL = Duration.ofMinutes(10);

    @Autowired
    private BuyTicketMapper buyTicketMapper;
    @Autowired
    private CacheService cacheService;
    @Autowired
    private SeatLockService seatLockService;

    public List<BuyTicketInfo> get_buyticket(String index){
        return buyTicketMapper.get_buyticket(index);
    }
    public List<MovieContentInfo> get_moviecontent(int id){return  buyTicketMapper.get_moviecontent(id);}

    /**
     * 查询全部影片（首页列表）。
     * 优先读 Redis 缓存，未命中再查数据库并回填缓存。
     */
    @SuppressWarnings("unchecked")
    public List<MovieContentInfo> get_moviecontent3(){
        Object cached = cacheService.get(MOVIE_LIST_CACHE_KEY);
        if (cached instanceof List) {
            log.info("影片列表命中 Redis 缓存：{}", MOVIE_LIST_CACHE_KEY);
            return (List<MovieContentInfo>) cached;
        }
        log.info("影片列表未命中缓存，改为查询数据库");
        List<MovieContentInfo> list = buyTicketMapper.get_moviecontent3();
        cacheService.set(MOVIE_LIST_CACHE_KEY, list, MOVIE_LIST_CACHE_TTL);
        return list;
    }

    public List<MovieContentInfo> get_moviecontent1(int id){return  buyTicketMapper.get_moviecontent1(id);}
    public int insertAevaluate(String movie_name,String yonghu_name,String pinjia,int star){return buyTicketMapper.insertAevaluate(movie_name,yonghu_name,pinjia,star);}
    public List<BuyTicketInfo> get_moviecontent2(String time,String time_start,String movie_name){return  buyTicketMapper.get_moviecontent2(time,time_start,movie_name);}
    public List<Seatings> get_seating(){return  buyTicketMapper.get_seating();}

    /**
     * 购买座位。
     *
     * <p>使用 ZooKeeper 分布式锁串行化同一座位的购买请求，
     * 并在锁内先检查座位状态，已经售出的座位直接拒绝，避免重复售票。</p>
     */
    public int update_seating(int id){
        return seatLockService.updateSeatWithLock(id, () -> {
            Integer state = buyTicketMapper.get_seat_state(id);
            if (state == null) {
                log.warn("座位 {} 不存在，无法购票", id);
                return 0;
            }
            if (state == 3) {
                log.info("座位 {} 已售出，拒绝重复购买", id);
                return 0;
            }
            int rows = buyTicketMapper.update_seating(id);
            log.info("座位 {} 已更新为售出，影响行数：{}", id, rows);
            return rows;
        });
    }

    public int add_Movie(String name,String type,String during,String choice,String image,String jianjie){
        int rows = buyTicketMapper.add_Movie(name,type,during,choice,image,jianjie);
        // 新增影片后必须清空列表缓存，否则下次查询还会读到旧列表
        cacheService.evict(MOVIE_LIST_CACHE_KEY);
        return rows;
    }
}
