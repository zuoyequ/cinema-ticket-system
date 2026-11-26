package com.fuwuwaibao.webcontroller;

import com.fuwuwaibao.entity.Address;
import com.fuwuwaibao.entity.BuyTicketInfo;
import com.fuwuwaibao.entity.MovieContentInfo;
import com.fuwuwaibao.entity.Shopping;
import com.fuwuwaibao.service.ShoppingService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class ShoppingController {
    @Autowired
    private ShoppingService shoppingService;

    @RequestMapping("get_shopping")
    public List<Shopping> get_shopping(HttpServletRequest request){
        List<Shopping> ShoppingList=null;
        ShoppingList=shoppingService.get_shopping();
        return ShoppingList;
    }
    @RequestMapping("get_shopping1")
    public List<Shopping> get_shopping1(HttpServletRequest request){
        String name=request.getParameter("name");
        //System.out.println(name);
        List<Shopping> ShoppingList1=null;
        ShoppingList1=shoppingService.get_shopping1(name);
        return ShoppingList1;
    }
    @RequestMapping("get_shopping2")
    public List<Shopping> get_shopping2(HttpServletRequest request){
        String type_name=request.getParameter("type_name");
        List<Shopping> ShoppingList1=null;
        ShoppingList1=shoppingService.get_shopping2(type_name);
        return ShoppingList1;
    }

    @RequestMapping("shopping_cart")
    public List<Shopping> shopping_cart(HttpServletRequest request){
        int id= Integer.parseInt(request.getParameter("id"));
        List<Shopping> ShoppingList1=null;
        ShoppingList1=shoppingService.shopping_cart(id);
        return ShoppingList1;
    }
    @RequestMapping("shopping_order")
    public List<Shopping> shopping_order(HttpServletRequest request){
        int id= Integer.parseInt(request.getParameter("id"));
        List<Shopping> ShoppingList1=null;
        ShoppingList1=shoppingService.shopping_order(id);
        return ShoppingList1;
    }

    @RequestMapping("add_address")
    public int add_address(HttpServletRequest request){
        String name=request.getParameter("name");
        String telephone=request.getParameter("telephone");
        String street=request.getParameter("street");
        String address=request.getParameter("address");
        int addressList=0;
        addressList=shoppingService.add_address(name,telephone,address,street);
        return addressList;
    }
    @RequestMapping("add_shopping")
    public int add_shopping(HttpServletRequest request){
        String shopname=request.getParameter("shopname");
        String price=request.getParameter("price");
        String shopStyle=request.getParameter("shopStyle");
        String image=request.getParameter("image");
        String shopJ=request.getParameter("shopJ");
        String shopType=request.getParameter("shopType");
        int addressList=0;
        addressList=shoppingService.add_shopping(shopname,price,shopStyle,shopJ,image,shopType);
        return addressList;
    }

    @RequestMapping("delete_address")
    public int delete_address(HttpServletRequest request){
        int id= Integer.parseInt(request.getParameter("id"));

        int addressList=0;
        addressList=shoppingService.delete_address(id);
        return addressList;
    }
    @RequestMapping("insert_shoppingcart")
    public int insert_shoppingcart(HttpServletRequest request){
        int userid= Integer.parseInt(request.getParameter("id"));
        int shoppingid= Integer.parseInt(request.getParameter("index"));
        int address_id= Integer.parseInt(request.getParameter("address_id"));
        String isDefault=request.getParameter("isDefault");
        String typee=request.getParameter("typee");
        String select=request.getParameter("select");
        int addressList=0;
        addressList=shoppingService.insert_shoppingcart(userid,shoppingid,address_id,isDefault,typee,select);
        return addressList;
    }
    @RequestMapping("insert_shoppingorder")
    public int insert_shoppingorder(HttpServletRequest request){
        int userid= Integer.parseInt(request.getParameter("id"));
        int shoppingid= Integer.parseInt(request.getParameter("index"));
        int address_id= Integer.parseInt(request.getParameter("address_id"));
        String isDefault=request.getParameter("isDefault");
        String isBuy=request.getParameter("isBuy");
        int addressList=0;
        addressList=shoppingService.insert_shoppingorder(userid,shoppingid,address_id,isDefault,isBuy);
        return addressList;
    }
    @RequestMapping("update_address")
    public int update_address(HttpServletRequest request){
        int id= Integer.parseInt(request.getParameter("id"));
        String name=request.getParameter("name");
        String telephone=request.getParameter("telephone");
        String street=request.getParameter("street");
        String address=request.getParameter("address");
        int updateaddress=shoppingService.update_address(id,name,telephone,address,street);
        return updateaddress;
    }

    @RequestMapping("update_order")
    public int update_order(HttpServletRequest request){
        int id= Integer.parseInt(request.getParameter("id"));

        int updateaddress=shoppingService.update_order(id);
        return updateaddress;
    }


    @RequestMapping("get_address1")
    public List<Address> get_address1(HttpServletRequest request){
        int id = Integer.parseInt(request.getParameter("id"));
        List<Address> getaddress1=null;
        getaddress1=shoppingService.get_address1(id);
        System.out.println(getaddress1);
        return getaddress1;
    }
    @RequestMapping("get_address")
    public List<Address> get_address(HttpServletRequest request){
        List<Address> addressList=null;
        addressList=shoppingService.get_address();
        //System.out.println(addressList);
        return addressList;
    }
}
