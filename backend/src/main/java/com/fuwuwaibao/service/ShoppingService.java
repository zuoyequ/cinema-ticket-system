package com.fuwuwaibao.service;

import com.fuwuwaibao.entity.Address;
import com.fuwuwaibao.entity.Shopping;
import com.fuwuwaibao.mapper.ShoppingMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ShoppingService {

    private static final Logger log = LoggerFactory.getLogger(ShoppingService.class);

    @Autowired
    private ShoppingMapper shoppingMapper;
    @Autowired
    private ProductCacheService productCacheService;
    @Autowired
    private OrderEventService orderEventService;

    /**
     * 查询全部商品（商城首页）。
     * 优先读 Memcached，未命中再查数据库并回填缓存。
     */
    public List<Shopping> get_shopping(){
        List<Shopping> cached = productCacheService.get();
        if (cached != null) {
            return cached;
        }
        log.info("商品列表未命中缓存，改为查询数据库");
        List<Shopping> list = shoppingMapper.get_shopping();
        productCacheService.set(list);
        return list;
    }

    public List<Shopping> get_shopping1(String name){
        return shoppingMapper.get_shopping1(name);
    }

    public List<Shopping> get_shopping2(String type_name){
        return shoppingMapper.get_shopping2(type_name);
    }
    public int add_address(String name,String telephone,String address,String street){
        return shoppingMapper.add_address(name,telephone,address,street);
    }
    public List<Shopping> shopping_cart(int id){
        return shoppingMapper.shopping_cart(id);
    }
    public List<Shopping> shopping_order(int id){
        return shoppingMapper.shopping_order(id);
    }
    public int delete_address(int id){
        return shoppingMapper.delete_address(id);
    }
    public int insert_shoppingcart(int userid,int shoppingid,int address_id,String isDefault,String typee,String select){
        return shoppingMapper.insert_shoppingcart(userid,shoppingid,address_id,isDefault,typee,select);
    }
    public int insert_shoppingorder(int userid,int shoppingid,int address_id,String isDefault,String isBuy){
        return orderEventService.createOrder(userid,shoppingid,address_id,isDefault,isBuy);
    }

    public int add_shopping(String shopname,String price,String shopStyle,String shopJ,String image,String shopType){
        int rows = shoppingMapper.add_shopping(shopname,price,shopStyle,shopJ,image,shopType);
        // 新增商品后清空列表缓存，保证商城首页能立即看到新商品
        productCacheService.evict();
        return rows;
    }

    public List<Address> get_address(){
        return shoppingMapper.get_address();
    }

    public List<Address> get_address1(int id){return  shoppingMapper.get_address1(id);}
    public int update_address(int id,String name,String telephone,String address,String street){return shoppingMapper.update_address(id,name,telephone,address,street);}

    public int update_order(int id){return shoppingMapper.update_order(id);}

}
