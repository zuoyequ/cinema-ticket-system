package com.fuwuwaibao.service;

import com.fuwuwaibao.entity.ModelInfo;
import com.fuwuwaibao.entity.MovieInfo;
import com.fuwuwaibao.mapper.ModelMapper;
import com.fuwuwaibao.mapper.MovieMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MovieService {
    @Autowired
    private MovieMapper movieMapper;

    public MovieInfo movieLogin(String movieid){
        return movieMapper.movieLogin(movieid);
    }
}
