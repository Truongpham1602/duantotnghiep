package bangiay.com.rest.controller;

import java.util.List;

import bangiay.com.DTO.RoleDTO;
import bangiay.com.doMain.constant;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import bangiay.com.DTO.OrdersDTO;
import bangiay.com.service.OrderService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/order")
public class OrderRestController {

	@Autowired
	OrderService orderService;

	@GetMapping("/findAll")
	public List<OrdersDTO> findAll() {
		return this.orderService.findAll();
	}
	@GetMapping("/select")
	public ResponseEntity<Page<OrdersDTO>> getPage(
			@RequestParam(name = constant.PAGE, defaultValue = constant.DEFAULT_PAGE) int page,
			@RequestParam(name = constant.SIZE, defaultValue = constant.DEFAULT_SIZE) int size
	) {
		Pageable pageable = PageRequest.of(page - 1 , size);
		return ResponseEntity.ok(orderService.findAll(pageable));
	}

	@DeleteMapping("/delete/{id}")
	public void delete(@PathVariable("id") Integer id) {
	}

	@PostMapping("/createHasUser/{user_Id}")
	public List<OrdersDTO> createHasUser(@PathVariable("user_Id") Integer user_Id,
			@RequestParam(value = "voucher_Id", required = false, defaultValue = "0") Integer voucher_Id) {
		return this.orderService.createHasUser(user_Id, voucher_Id);
	}

	@PutMapping("/confirm/{user_IdOrTelephone}")
	public List<OrdersDTO> updateConfirm(@PathVariable("user_IdOrTelephone") Integer user_IdOrTelephone) {
		return this.orderService.updateConfirm(user_IdOrTelephone);
	}

	@PutMapping("/delivered/{user_IdOrTelephone}")
	public List<OrdersDTO> updateDelivered(@PathVariable("user_IdOrTelephone") Integer user_IdOrTelephone) {
		return this.orderService.updateConfirm(user_IdOrTelephone);
	}

	@GetMapping("/find/{id}")
	public OrdersDTO finByID(@PathVariable("id") Integer id) {
		return this.orderService.finById(id);
	}

	@GetMapping("/findOrderBySize_ID/{user_IdOrTelephone}")
	public List<OrdersDTO> findOrderBySize_ID(@PathVariable("user_IdOrTelephone") Integer user_IdOrTelephone) {
		return this.orderService.findOrderBySize_ID(user_IdOrTelephone);
	}

	@PostMapping("/createNoUser")
	public List<OrdersDTO> createNoUser(
			@RequestParam(value = "voucher_Id", required = false, defaultValue = "0") Integer voucher_Id,
			@RequestBody OrdersDTO ordersDTO) {
		return this.orderService.createNoUser(ordersDTO, voucher_Id);
	}
	@PostMapping ("updateStatus")
	public ResponseEntity<?> updateOrderWithStatus(@RequestParam("id")Integer id,
												   @RequestParam("status") Integer status){
		return new ResponseEntity<>(orderService.updateOrderWithStatus(id, status), HttpStatus.OK);
	}

}
