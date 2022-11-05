package bangiay.com.rest.controller;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import bangiay.com.DTO.BillDTO;
import bangiay.com.controller.BillController;
import bangiay.com.service.BillService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping(value = "bill")
public class BillRestController {
	@Autowired
	private BillService billService;
	@Autowired
	private ModelMapper modelMapper;

	private static Logger logger = LoggerFactory.getLogger(BillController.class);

	@GetMapping("/getAll")
	public ResponseEntity<List<BillDTO>> getAll() {
		return ResponseEntity.ok().body(billService.findAll());
	}

	@GetMapping("/getOneById")
	@CrossOrigin
	public ResponseEntity<BillDTO> getOneById(@RequestParam("id") Integer id) {
		BillDTO billDTO = billService.findByID(id);
		BillDTO responBillDTO = modelMapper.map(billDTO, BillDTO.class);
		return ResponseEntity.ok().body(responBillDTO);
	}

	@PostMapping(value = "/update")
	public ResponseEntity<BillDTO> update(@RequestParam(name = "id") Integer id, @RequestBody BillDTO billDTO) {
		billDTO.setId(id);
		return ResponseEntity.ok().body(billService.updateBill(billDTO));
	}

	@PostMapping(value = "/create/{user_IdOrTelephone}")
	public ResponseEntity<BillDTO> create(@RequestBody BillDTO billDTO,
			@PathVariable("user_IdOrTelephone") Integer user_IdOrTelephone) {
		return ResponseEntity.ok().body(billService.createBill(billDTO, user_IdOrTelephone));
	}

	@PostMapping(value = "/delete")
	public ResponseEntity<String> delete(@RequestParam(name = "id") Integer id) {
		logger.info("Deleted bill with id : " + id);
		billService.deleteById(id);
		return ResponseEntity.ok().body("Delete bill id " + id + " successfully!");
	}
}
