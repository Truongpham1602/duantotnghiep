package bangiay.com.service.impl;

import java.util.List;
import java.util.stream.Collectors;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import bangiay.com.dao.SizeDao;
import bangiay.com.service.SizeService;


import bangiay.com.DTO.SizeDTO;
import bangiay.com.entity.Size;

@Service
public class SizeServiceImpl implements SizeService{
	@Autowired
	private SizeDao sizeDAO;
	
	@Autowired
	private ModelMapper modelMapper;
	
	public List<SizeDTO> findAll(){
		List<Size> pro = sizeDAO.findAll();
		List<SizeDTO> result = pro.stream().map(d -> modelMapper.map(d,SizeDTO.class)).collect(Collectors.toList());
		return result;
	}
	
	@Override
	public SizeDTO findById(Integer id) {
		Size Size = sizeDAO.findById(id).get();
		SizeDTO Sizedto =  modelMapper.map(Size, SizeDTO.class);
		return Sizedto;
	}

	@Override
	public SizeDTO save(SizeDTO SizeDTO) {
		Size Size =  modelMapper.map(SizeDTO, Size.class);
		this.sizeDAO.save(Size);
		return SizeDTO;
	}

	@Override
	public void delete(Integer id) {
		sizeDAO.deleteById(id);
	}

	@Override
	public SizeDTO findSizeByProductId(Integer id) {
		Size Size = sizeDAO.findSizeByProduct_id(id).get(1);
		SizeDTO Sizedto =  modelMapper.map(Size, SizeDTO.class);
		return Sizedto;
	}

}