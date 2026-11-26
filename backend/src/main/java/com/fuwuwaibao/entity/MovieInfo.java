package com.fuwuwaibao.entity;

public class MovieInfo {
    String movieid;
    String movieurl;

    @Override
    public String toString() {
        return "MovieInfo{" +
                "movieid='" + movieid + '\'' +
                ", movieurl='" + movieurl + '\'' +
                '}';
    }

    public String getMovieid() {
        return movieid;
    }

    public void setMovieid(String movieid) {
        this.movieid = movieid;
    }

    public String getMovieurl() {
        return movieurl;
    }

    public void setMovieurl(String movieurl) {
        this.movieurl = movieurl;
    }
}
