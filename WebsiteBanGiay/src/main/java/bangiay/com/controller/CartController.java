package bangiay.com.controller;

import bangiay.com.DTO.request.CartDTO;
import bangiay.com.DTO.respon.ResponCartDTO;
import bangiay.com.entity.Cart;
import bangiay.com.service.CartService;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
public class CartController {
    @Autowired
    private CartService cartService;
    @Autowired
    private ModelMapper modelMapper;
    private static Logger logger = LoggerFactory.getLogger(CartController.class);


    @GetMapping("/getAll")
    public ResponseEntity<List<ResponCartDTO>>getAll() {
        return ResponseEntity.ok().body(cartService.findAll());
    }
    @GetMapping("/getOneById")
    @CrossOrigin
    public ResponseEntity<ResponCartDTO> getOneById(@RequestParam("id") Integer id) {
        Cart cart = cartService.findByID(id);
        ResponCartDTO responCartDTO = modelMapper.map(cart, ResponCartDTO.class);
        return ResponseEntity.ok().body(responCartDTO);
    }
    @PostMapping(value = "/update")
    public ResponseEntity<CartDTO> update(@RequestParam(name = "id") Integer id,@RequestBody  CartDTO cartDTO) {
        cartDTO.setId(id);

        return ResponseEntity.ok().body(cartService.updateCart(cartDTO));
    }
    @PostMapping(value = "/create")
    public ResponseEntity<CartDTO> create(@RequestBody CartDTO dto) {
        return ResponseEntity.ok().body(cartService.createCart(dto) );
    }
    @PostMapping(value = "/delete")
    public ResponseEntity<String> delete(@RequestParam(name = "id") Integer id) {
        logger.info("Deleted cart with id : " + id);
        cartService.deleteById(id);
        return ResponseEntity.ok().body("Delete cart id " + id + " successfully!");
    }
}