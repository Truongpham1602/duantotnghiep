package bangiay.com.service;

import java.util.List;

import bangiay.com.DTO.OrdersDTO;
import bangiay.com.entity.Orders;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface OrderService {

	public List<OrdersDTO> findAll();
	Page<OrdersDTO> findAll(Pageable pageable);
	public List<OrdersDTO> findOrderBySize_ID(Integer user_IdOrTelephone);

	public List<OrdersDTO> createHasUser(Integer user_Id, Integer voucher_Id);

	public OrdersDTO finById(int id);

	public void delete(int id);

	List<OrdersDTO> createNoUser(OrdersDTO ordersDTO, Integer voucher_Id);

	List<OrdersDTO> updateConfirm(Integer user_IdOrTelephone);

	List<OrdersDTO> updateDelivered(Integer user_IdOrTelephone);

	//List<OrdersDTO> getOrderStatus(Integer status);

	Orders updateOrderWithStatus(Integer id,Integer status);

}
