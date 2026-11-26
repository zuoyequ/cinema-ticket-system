package com.fuwuwaibao.mapper;

import com.fuwuwaibao.entity.ModelInfo;
import com.fuwuwaibao.entity.MovieInfo;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.springframework.stereotype.Repository;

@Mapper
@Repository
public interface MovieMapper {
    // 修正：原 SQL 查询不存在的 movies 表，实际对应的表是 movie_models
    @Select("SELECT movieurl FROM movie_models WHERE movieid=#{movieid}")
    MovieInfo movieLogin(@Param("movieid") String movieid);
}
