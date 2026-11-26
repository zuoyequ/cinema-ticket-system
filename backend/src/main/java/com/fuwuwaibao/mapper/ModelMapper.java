package com.fuwuwaibao.mapper;

import com.fuwuwaibao.entity.ModelInfo;
import com.fuwuwaibao.entity.StudentInfo;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.springframework.stereotype.Repository;

@Mapper
@Repository
public interface ModelMapper {
    @Select("SELECT path,number FROM models WHERE id=#{id}")
    ModelInfo modelLogin(@Param("id") int id);
}
