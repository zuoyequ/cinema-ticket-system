package com.fuwuwaibao.service;

import com.fuwuwaibao.entity.ModelInfo;
import com.fuwuwaibao.mapper.ModelMapper;
import com.fuwuwaibao.mapper.StudentMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ModelService {
    @Autowired
    private ModelMapper modelMapper;

    public ModelInfo modelLogin(int id){
        return modelMapper.modelLogin(id);
    }
}
