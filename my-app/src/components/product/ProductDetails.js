import { React, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    FormGroup,
    Label,
    Row,
    Col,
    Form,
    Input,
} from "reactstrap";
import { ToastContainer, toast } from 'react-toastify';
import NumericInput from 'react-numeric-input';
import '../css/detailsProduct.scss';
import useCallGetAPI from '../../customHook/CallGetApi';
import moment from 'moment'
import {
    ref,
    uploadBytes,
    getDownloadURL,
    listAll,
    list,
    getMetadata,
} from "firebase/storage";
import { storage } from "../../Firebase";
import { async } from "@firebase/util";
const ProductDetails = (props) => {
    // const [modal, setModal] = useState(false);
    const token = localStorage.getItem('token');
    axios.defaults.headers.common = { 'Authorization': `Bearer ${token}` }
    // const toggle = () => setModal(!modal);
    const navigate = useNavigate()
    const [check, setCheck] = useState({});
    const [newColor, setNewColor] = useState({
        name: "",
        color: "",
        price: "",
        quantity: "",
        categoryId: "",
        sizes: "",
        medias: "",
        status: 1
    });
    const [lstsizeSelect, setLstSizeSelect] = useState([]);
    const size = [37, 38, 39, 40, 41, 42, 43, 44, 45];
    const { isDetailsModal, toggleModal, updateData, handleUpdateImages, handleImages, imageUrls, setImageUrls, setImageFiles, imageFiles } = props;
    const [isSizeModal, setIsSizeModal] = useState(false);
    const [isImageModal, setisImageModal] = useState(false);
    const [product, setProduct] = useState(props.product);

    const imagesListRef = ref(storage, "images/");
    // const [imageUrls, setImageUrls] = useState([]);
    const [sizePro, setSizePro] = useState({});
    const [image, setImage] = useState({});
    const [media, setMedia] = useState({});
    const [imageURL, setImageURL] = useState();
    const [sizeSelect, setSizeSelect] = useState();
    const [sizeNewColorSelect, setSizeNewColorSelect] = useState(0);
    const [imageUpload, setImageUpload] = useState();
    const [sizeProQuantity, setSizeProQuantity] = useState({});
    const [sizes, setSizes] = useState([
    ])

    const [isCreateModal, setIsCreateModal] = useState(false)

    const { register, handleSubmit } = useForm();

    const sizeList = [
        {
            title: 36,
            status: false
        },
        {
            title: 37,
            status: false
        },
        {
            title: 38,
            status: false
        },
        {
            title: 39,
            status: false
        },
        {
            title: 40,
            status: false
        },
        {
            title: 41,
            status: false
        },
        {
            title: 42,
            status: false
        },
        {
            title: 43,
            status: false
        },
        {
            title: 44,
            status: false
        },
        {
            title: 45,
            status: false
        },
        {
            title: 46,
            status: false
        }]

    const [colorSt, setColorST] = useState([
    ])
    const sizeCheck = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    const ColorList = [
        {
            id: 'Trắng',
            status: false
        },
        {
            id: 'Đỏ',
            status: false
        },
        {
            id: 'Xanh dương',
            status: false
        },
        {
            id: 'Cam',
            status: false
        },
        {
            id: 'Đen',
            status: false
        },
        {
            id: 'Hồng',
            status: false
        },
        {
            id: 'Nâu',
            status: false
        },
        {
            id: 'Tím',
            status: false
        },
        {
            id: 'Xanh lá',
            status: false
        }]

    useEffect(() => {
        setProduct(props.product)
        //size
        props.product.sizes?.map(item => {
            let copydata = sizeList;
            let getIndex = copydata.findIndex((p) => { return p.title == item.size });
            let size = { id: item.id, title: item.size, quantity: item.quantity, status: true }
            copydata.fill(size, getIndex, getIndex + 1);
            setSizes(copydata)
        })

    }, [props.product])



    const checkSize = (e) => {
        let Select = e.target.value;
        setSizeNewColorSelect(Select);
        setLstSizeSelect([]);
        for (let i = 1; i <= Select; i++) {
            setLstSizeSelect((prev) => [...prev, i]);
        }
    };

    const setShowSize = (product) => {
        product.sizes?.map(item => {
            let copydata = sizeList;
            let getIndex = copydata.findIndex((p) => { return p.title == item.size });
            let size = { id: item.id, title: item.size, quantity: item.quantity, status: true }
            copydata.fill(size, getIndex, getIndex + 1);
            setSizes(copydata)
        })
    }

    // const setShowColor = (product) => {
    //     let copyc;
    //     product.colors?.map(item => {
    //         let copydata = ColorList;
    //         let getIndex = copydata.findIndex((p) => { return p.id == item.color });
    //         let color = { id: item.color, status: true, select: false }
    //         copydata.fill(color, getIndex, getIndex + 1);
    //         setColorST(copydata)
    //         copyc = copydata
    //     })
    //     let getIndexSelect = copyc.findIndex((p) => { return p.id == product.color });
    //     let color = { id: product.color, status: true, select: true }
    //     copyc.fill(color, getIndexSelect, getIndexSelect + 1);
    //     setColorST(copyc)
    // }

    const styleToast = {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
    }


    const handelInputNewColor = (event, id) => {
        let soluong = /^\d+$/;
        let gia = /^\d*(\.\d+)?$/
        let copyProduct = { ...newColor };
        copyProduct[id] = event.target.value;
        try {
            let ch0 = { ...check };
            if (id == "color") {
                if (copyProduct[id].trim().length == 0) {
                    ch0["color"] = "Màu không được để trống";
                } else {
                    ch0["color"] = "";
                }
            } else if (id == "price") {
                if (copyProduct[id].trim().length > 0 && gia.test(event.target.value) == false || Number(copyProduct[id]) <= 10000) {
                    ch0["price"] = "Giá tối thiểu 10K VNĐ và phải là số";
                } else if (copyProduct[id].trim().length == 0) {
                    ch0["price"] = "Giá không được để trống";
                } else {
                    ch0["price"] = "";
                }
            } else if (id == "quantity") {
                if (copyProduct[id].trim().length > 0 && soluong.test(event.target.value) == false || Number(copyProduct[id]) <= 0) {
                    ch0["quantity"] = "Số lượng phải là số và lớn hơn 0";
                } else if (copyProduct[id].trim().length == 0) {
                    ch0["quantity"] = "Số lượng không được để trống";
                } else {
                    ch0["quantity"] = "";
                }
            } else {
                ch0[id] = "";
            }
            setCheck({
                ...ch0,
            });
            setNewColor({
                ...copyProduct,
            });
        } catch (error) {
            console.log(error);
        }
    };


    const setNew = () => {
        let copyNew = { ...newColor }
        copyNew['name'] = product.name
        copyNew['categoryId'] = product.categoryId
        copyNew['cateName'] = product.name_cate
        setNewColor(copyNew)
    }

    const toggleNewColor = () => {
        setIsCreateModal(!isCreateModal)
        setNewColor({
            name: "",
            color: "",
            price: "",
            quantity: "",
            categoryId: "",
            sizes: "",
            medias: "",
            status: 1
        })
        setLstSizeSelect([]);
        setCheck({
            name: "",
            color: "",
            price: "",
            quantity: "",
            categoryId: "",
            sizes: "",
            medias: ""
        })
        setImageFiles([]);
    }

    const createProduct = async (data) => {
        try {
            handleUpdateImages()
            let ch0 = { ...check };
            if (newColor.color.trim().length == 0) {
                ch0["color"] = "Màu không được để trống";
                setCheck({ ...ch0 });
            }
            if (newColor.price.trim().length == 0) {
                ch0["price"] = "Giá không được để trống";
                setCheck({ ...ch0 });
            } if (newColor.quantity.trim().length == 0) {
                ch0["quantity"] = "Số lượng không được để trống";
                setCheck({ ...ch0 });
            } if (imageFiles.length == 0) {
                ch0["medias"] = "Cần chọn ảnh";
                setCheck({ ...ch0 });
            } if (sizeNewColorSelect == 0) {
                ch0["sizes"] = "Cần chọn số lượng cỡ giày";
                setCheck({ ...ch0 });
            }
            if (
                check.price.length > 0 ||
                check.quantity.length > 0 ||
                check.sizes.length > 0 ||
                check.medias.length > 0
            ) {
                return;
            }
            const res = await axios.post(
                `http://localhost:8080/admin/product/findByName`, { name: product.name },
                { headers: { "Authorization": `Bearer ${token}` } }
            );
            if (res.data.color == newColor.color) {
                notifyWarning("Sản phẩm đã có màu này");
                return
            }
            const nums = [
                data.size1,
                data.size2,
                data.size3,
                data.size4,
                data.size5,
                data.size6,
                data.size7,
                data.size8,
                data.size9,
                data.size10,
                data.size11,
            ];
            const quantt = [
                data.quantity1,
                data.quantity2,
                data.quantity3,
                data.quantity4,
                data.quantity5,
                data.quantity6,
                data.quantity7,
                data.quantity8,
                data.quantity9,
                data.quantity10,
                data.quantity11,
            ];
            const newQuantt = quantt.slice(0, sizeNewColorSelect);
            const newNums = nums.slice(0, sizeNewColorSelect);
            const hasDuplicate = newNums.some(
                (x) => newNums.indexOf(x) !== newNums.lastIndexOf(x)
            );
            let totalQuantitySize = 0;
            for (let i = 0; i < newQuantt.length; i++) {
                totalQuantitySize += Number(newQuantt[i])
                if (isNaN(newQuantt[i])) {
                    notifyWarning("Số lượng size phải là số");
                    return;
                }
            }
            if (hasDuplicate) {
                notifyWarning("Size bị trùng, vui lòng chọn lại!");
                return;
            } else if (totalQuantitySize > product.quantity) {
                notifyWarning("Số lượng Size lớn hơn số lượng sản phẩm");
                return;
            } else {
                const createPro = async () => {
                    let res = await axios.post("http://localhost:8080/admin/product/post", newColor);
                    let datares = res && res.data ? res.data : [];
                    datares.created = moment(datares.created).format(
                        "DD/MM/YYYY HH:mm:ss"
                    );
                    if (datares.modified > 0) {
                        datares.modified = moment(datares.modified).format(
                            "DD/MM/YYYY HH:mm:ss"
                        );
                    }
                    let image = [
                        {
                            productId: res.data.id,
                            url: imageFiles[0]?.name,
                            type: "image",
                        },
                        {
                            productId: res.data.id,
                            url: imageFiles[1]?.name,
                            type: "image",
                        },
                        {
                            productId: res.data.id,
                            url: imageFiles[2]?.name,
                            type: "image",
                        },
                        {
                            productId: res.data.id,
                            url: imageFiles[3]?.name,
                            type: "image",
                        },
                        {
                            productId: res.data.id,
                            url: imageFiles[4]?.name,
                            type: "image",
                        },
                    ].slice(0, imageFiles.length);
                    let datasize = [
                        {
                            productId: res.data.id,
                            size: data.size1,
                            quantity: data.quantity1,
                        },
                        {
                            productId: res.data.id,
                            size: data.size2,
                            quantity: data.quantity2,
                        },
                        {
                            productId: res.data.id,
                            size: data.size3,
                            quantity: data.quantity3,
                        },
                        {
                            productId: res.data.id,
                            size: data.size4,
                            quantity: data.quantity4,
                        },
                        {
                            productId: res.data.id,
                            size: data.size5,
                            quantity: data.quantity5,
                        },
                        {
                            productId: res.data.id,
                            size: data.size6,
                            quantity: data.quantity6,
                        },
                        {
                            productId: res.data.id,
                            size: data.size7,
                            quantity: data.quantity7,
                        },
                        {
                            productId: res.data.id,
                            size: data.size8,
                            quantity: data.quantity8,
                        },
                        {
                            productId: res.data.id,
                            size: data.size9,
                            quantity: data.quantity9,
                        },
                        {
                            productId: res.data.id,
                            size: data.size10,
                            quantity: data.quantity10,
                        },
                        {
                            productId: res.data.id,
                            size: data.size11,
                            quantity: data.quantity11,
                        },
                    ].slice(0, sizeNewColorSelect);
                    let resImg = await axios.post(
                        `http://localhost:8080/api/media/create`,
                        image
                    );
                    await axios.post(`http://localhost:8080/api/size/postList`, datasize);
                    findByNameAndColorBTN(datares.color)
                    setSizeSelect();
                    toggleNewColor();
                    notifySuccess("Thêm thành công");
                };
                createPro();
            }
        } catch (error) {
            console.log(error);
        }
    };

    const notifySuccess = (text) => {
        toast.success(text, styleToast)
    };
    const notifyWarning = (text) => {
        toast.warning(text, styleToast);
    };
    const notifyError = (text) => {
        toast.error(text, styleToast);
    };

    const toggle = () => {
        toggleModal()
        setProduct({})
        setSizes([
            {
                title: 36,
                status: false
            },
            {
                title: 37,
                status: false
            },
            {
                title: 38,
                status: false
            },
            {
                title: 39,
                status: false
            },
            {
                title: 40,
                status: false
            },
            {
                title: 41,
                status: false
            },
            {
                title: 42,
                status: false
            },
            {
                title: 43,
                status: false
            },
            {
                title: 44,
                status: false
            },
            {
                title: 45,
                status: false
            },
            {
                title: 46,
                status: false
            },
        ])
    }


    const toggleSize = async (id) => {
        setIsSizeModal(!isSizeModal)
        setSizePro({})
        setSizeProQuantity({})
        setSizeSelect(id)
    }

    const toggleImage = async (id) => {
        setisImageModal(!isImageModal)
        setImageURL()
        setImageUpload()
        setImage({})
    }

    const handleOnchangeFile = (event) => {
        let copy = { ...media };
        copy['id'] = image.dataImage?.id;
        copy['url'] = event.target.files[0].name;
        copy['type'] = 'image';
        copy['productId'] = product.id;
        setMedia({
            ...copy
        })
    }

    const handleOnchangeinputNewColor = (event, id) => {
        let soluong = /^\d+$/;
        let gia = /^\d*(\.\d+)?$/
        let chu = /[a-zA-Z]/g;
        let copyColor = { ...newColor };
        copyColor[id] = event.target.value;
        try {
            let ch0 = { ...check };

            if (id == "color") {
                if (copyColor[id].trim().length == 0) {
                    ch0["color"] = "Màu không được để trống";
                } else {
                    ch0["color"] = "";
                }
            } else if (id == "price") {
                if (copyColor[id].trim().length > 0 && gia.test(event.target.value) == false || Number(copyColor[id]) < 5000) {
                    ch0["price"] = "Giá phải trên 1k VNĐ và phải là số";
                } else if (copyColor[id].trim().length == 0) {
                    ch0["price"] = "Giá không được để trống";
                } else {
                    ch0["price"] = "";
                }
            } else if (id == "quantity") {
                if (copyColor[id].trim().length > 0 && soluong.test(event.target.value) == false || Number(copyColor[id]) <= 0) {
                    ch0["quantity"] = "Số lượng phải là số và lớn hơn 0";
                } else if (copyColor[id].trim().length == 0) {
                    ch0["quantity"] = "Số lượng không được để trống";
                } else {
                    ch0["quantity"] = "";
                }
            } else if (id == "medias") {
                if (event.target.files.length == 0) {
                    ch0["medias"] = "Cần chọn ảnh";
                } else if (event.target.files.length > 5) {
                    ch0["medias"] = "Không chọn quá 5 ảnh";
                } else {
                    ch0["medias"] = "";
                }
            } else {
                ch0[id] = "";
            }
            setCheck({
                ...ch0,
            });

            setNewColor({
                ...copyColor,
            });
        } catch (error) {
            console.log(error);
        }
    };

    const handleOnchangeinput = (event) => {
        let copy = { ...sizeProQuantity };
        copy['productId'] = product.id;
        copy['size'] = sizeSelect;
        copy['quantity'] = event.target.value;
        setSizeProQuantity({
            ...copy
        })
    }

    const checkQuantitySize = () => {
        let totalQuantitySize = 0
        product.sizes.map(item => { totalQuantitySize += item.quantity })
        if (Number(sizeProQuantity.quantity) <= 0) {
            notifyWarning('Số lượng cần lớn hơn 0!')
            return false
        } else if (totalQuantitySize + Number(sizeProQuantity.quantity) > product.quantity) {
            notifyWarning('Số lượng không đủ!')
            return false
        }
        return true
    }

    const createSizePro = async () => {
        try {
            if (checkQuantitySize()) {
                const res = await axios.post(`http://localhost:8080/api/size/post`, sizeProQuantity)
                let copydata = sizes;
                let getIndex = copydata.findIndex((p) => { return p.title == res.data.size });
                let size = { id: res.data.id, title: res.data.size, quantity: res.data.quantity, status: true }
                copydata.fill(size, getIndex, getIndex + 1);
                setSizes(copydata)
                // set product.sizes
                let copydataProduct = product;
                copydataProduct.sizes.push(res.data);
                setProduct(copydataProduct)
                notifySuccess('Thêm thành công')
                toggleSize()
            }
        } catch (error) {
            console.log(error.message)
            notifyError('Lỗi!!!')
        }
    }

    const updateSizePro = async () => {
        try {
            if (checkQuantitySize()) {
                const res = await axios.put(`http://localhost:8080/api/size/put/${sizePro.id}`, sizeProQuantity)
                let copydataSize = sizes;
                let getIndexSize = copydataSize.findIndex((p) => { return p.title == res.data.size });
                let size = { id: res.data.id, title: res.data.size, quantity: res.data.quantity, status: true }
                copydataSize.fill(size, getIndexSize, getIndexSize + 1);
                setSizes(copydataSize)
                // set product.sizes
                let copydataProduct = product;
                let getIndex = copydataProduct.sizes.findIndex((p) => { return p.id == res.data.id });
                copydataProduct.sizes.fill(res.data, getIndex, getIndex + 1);
                setProduct(copydataProduct)
                notifySuccess('Cập nhật thành công')
                toggleSize()
            }
        } catch (error) {
            console.log(error.message)
            notifyError('Lỗi!!!')
        }
    }

    const deleteSizePro = async () => {
        try {
            sizeProQuantity.quantity = 0;
            const res = await axios.put(`http://localhost:8080/api/size/put/${sizePro.id}`, sizeProQuantity)
            let copydataSize = sizes;
            let getIndexSize = copydataSize.findIndex((p) => { return p.title == res.data.size });
            let size = { id: res.data.id, title: res.data.size, quantity: res.data.quantity, status: true }
            copydataSize.fill(size, getIndexSize, getIndexSize + 1);
            setSizes(copydataSize)
            // set product.sizes
            let copydataProduct = product;
            let getIndex = copydataProduct.sizes.findIndex((p) => { return p.id == res.data.id });
            copydataProduct.sizes.fill(res.data, getIndex, getIndex + 1);
            setProduct(copydataProduct)
            notifySuccess('Cập nhật thành công')
            toggleSize()
        } catch (error) {
            console.log(error.message)
            notifyError('Lỗi!!!')
        }
    }

    const createImage = async () => {
        try {
            handleUpdateImages()
            const res = await axios.post(`http://localhost:8080/api/media/create`, [media])
            let copydata = product;
            copydata.medias.push(res.data[0]);
            setProduct(copydata)
            notifySuccess('Thêm thành công')
            toggleImage()
            navigate('/admin/product')
        } catch (error) {
            console.log(error.message)
            notifyError('Lỗi!!!')
        }
    }

    const updateImage = async () => {
        try {
            handleUpdateImages()
            let res = await axios.put(`http://localhost:8080/api/media/update`, media)
            let copydata = product;
            let getIndex = copydata.medias.findIndex((p) => { return p.id == res.data.id });
            copydata.medias.fill(res.data, getIndex, getIndex + 1);
            let productz = { ...copydata, image: copydata.medias[0].url }
            // setMedia(copydata)
            updateData(productz, '', 'update')
            notifySuccess('Cập nhật thành công')
            toggleImage()
        } catch (error) {
            console.log(error.message)
            notifyError('Lỗi!!!')
        }
    }

    const deleteImage = async (id) => {
        try {
            // handleUpdateImages()
            await axios.delete(`http://localhost:8080/api/media/delete/${id}`)
            let copydata = product;
            copydata.medias = copydata.medias.filter(item => item.id != id);
            console.log(copydata.medias);
            setProduct(copydata)
            notifySuccess('Xóa thành công')
            toggleImage()
        } catch (error) {
            console.log(error.message)
            notifyError('Lỗi!')
        }
    }

    const findSizeById = async (id) => {
        try {
            const res = await axios.get(`http://localhost:8080/api/size/find/${id}`)
            console.log(res.data);
            setSizePro(res.data)
            let copy = { ...sizeProQuantity };
            copy['productId'] = product.id;
            copy['quantity'] = res.data.quantity;
            copy['size'] = res.data.size;
            setSizeProQuantity({
                ...copy
            })
        } catch (error) {
            console.log(error.message)
            notifyError('Lỗi!!!')
        }
    }

    const findImageById = async (id, select) => {
        try {
            const res = await axios.get(`http://localhost:8080/api/media/findById/${id}`)
            const dataImage = res.data
            setImage({ dataImage, select: select })
            imageUrls.map((img) => {
                if (img.nameImg === res.data.url) {
                    return setImageURL(img.url)
                }
            })
        } catch (error) {
            console.log(error.message)
            notifyError('Lỗi!!!')
        }
    }

    const findByNameAndColor = async (event) => {
        const res = await axios.post(`http://localhost:8080/admin/product/findByNameAndColor`, { name: props.product.name, color: event.target.value })
        setProduct(res.data ? res.data : [])
        setShowSize(res.data ? res.data : [])
        // setShowColor(res.data ? res.data : [])
    }

    const findByNameAndColorBTN = async (color) => {
        const res = await axios.post(`http://localhost:8080/admin/product/findByNameAndColor`, { name: props.product.name, color: color })
        setProduct(res.data ? res.data : [])
        setShowSize(res.data ? res.data : [])
        // setShowColor(res.data ? res.data : [])
    }

    return (
        <div>
            <Modal isOpen={isDetailsModal} toggle={() => toggle()} size='xl' centered>
                <ModalHeader toggle={() => toggle()}>Chi tiết sản phẩm</ModalHeader>
                <ModalBody>
                    <div className="product-details row">
                        <div className="product-details-left row col-lg-7 pt-3">
                            <div className="product-details-left-small-img">
                                {product.name?.length > 0 && imageUrls.map((img, index1) => {
                                    return (
                                        product.medias.map((item, index2) => {
                                            return (
                                                <>
                                                    {index2 > 0 &&
                                                        img.nameImg === item.url &&
                                                        <img onClick={() => { findImageById(item.id); toggleImage() }} src={img.url} style={{ height: '88.25px', width: '88.25px', padding: '3px 0px 3px 0px' }} />
                                                    }
                                                </>
                                            )
                                        })
                                    )
                                })}
                                {product.medias?.length < 5 &&
                                    <img onClick={() => { toggleImage() }} style={{ height: '88.25px', width: '88.25px', padding: '3px 0px 3px 0px' }} />
                                }
                            </div>
                            <div className="product-details-left-big-img">
                                {product.name?.length > 0 && imageUrls.map((img, index1) => {
                                    return (
                                        product.medias.map((item, index2) => {
                                            let im = true;
                                            if (index2 === 0 && img.nameImg === item.url) {
                                                return (
                                                    <>
                                                        <img onClick={() => { findImageById(item.id, 'select'); toggleImage() }} src={img.url} style={{ height: '353px', width: '100%' }} />
                                                    </>
                                                )
                                            }
                                            // else if (index1 === 0 && index2 === 0 && im === true) {
                                            //     return (
                                            //         <>
                                            //             <img onClick={() => { findImageById(item.id, 'select'); toggleImage() }} style={{ height: '353px', width: '100%' }} />
                                            //         </>
                                            //     )
                                            // }
                                        })
                                    )
                                })}
                            </div>
                        </div>
                        <div className="product-details-right col-lg-5">
                            <div className="product-details-right-product-name">
                                <h1>{product.name}</h1>
                            </div>
                            <div className="product-details-right-product-color">
                                <p className="color"><span className="colorDetails">Màu: <select
                                    style={{
                                        border: "1px solid",
                                        width: "70%",
                                        borderRadius: "5px",
                                    }}
                                    id="namecate"
                                    name="namecate"
                                    placeholder=""
                                    type="select"
                                    onChange={(event) =>
                                        findByNameAndColor(event)
                                    }
                                >
                                    {product?.colors?.map((item) => {
                                        if (item.color === product.color) {
                                            return (
                                                <option key={item.color} selected value={item.color}>
                                                    {item.color}
                                                </option>
                                            );
                                        } else {
                                            return (
                                                <option key={item.color} value={item.color} >
                                                    {item.color}
                                                </option>
                                            );
                                        }
                                    })}
                                </select><button onClick={() => { toggleNewColor(); setNew() }} style={{ backgroundColor: 'cyan', marginLeft: '2%', borderRadius: '20px' }} className="btn">+</button></span></p>
                            </div>
                            <div className="product-details-right-product-color">
                                <p className="color"><span className="colorDetails">Loại: </span>{product.name_cate}</p>
                            </div>
                            <div className="product-details-right-product-price">
                                <p><span className="priceDetails">Giá: </span>{product.price}<sup>đ</sup></p>
                            </div>

                            <div className="product-details-right-product-size row">
                                <div className="col-lg-1">
                                    <span className="SizeDetails">Kích Cỡ: </span>
                                </div>
                                <div className="col-lg-11 sizeDetai">
                                    {sizes.map((item, index1) => {
                                        if (item.quantity > 0 && item.status == true) {
                                            return <button onClick={(e) => { toggleSize(item.title); findSizeById(item.id) }} className="btn">{item.title}</button>
                                        } else if (item.quantity <= 0 && item.status == true) {
                                            return <button onClick={(e) => { toggleSize(item.title); findSizeById(item.id) }} className="btn" style={{ borderColor: 'white', color: '#b6b6b6fe' }} >{item.title}</button>
                                        } else if (item.status === false) {
                                            return <button onClick={(e) => { toggleSize(item.title) }} className="btn" style={{ borderColor: 'white', color: '#b6b6b6fe' }} >{item.title}</button>
                                        }
                                    })}
                                </div>
                            </div>
                            <div className="product-details-right-product-quantity">
                                <span className="quantityLeft">Số Lượng: </span><span>{product.quantity}</span>
                            </div>
                            <div className="product-details-right-product-created">
                                <span className="createdLeft">Ngày Tạo: </span>
                                <span className="creatorLeft">{moment(product.created).format('DD/MM/YYYY HH:mm:ss')} - {product.creator}</span>
                            </div>
                            <div className="product-details-right-product-modified">
                                <span className="modifiedLeft">Ngày Sửa: </span>
                                <span className="modifierLeft">{product.modified ? moment(product.modified).format('DD/MM/YYYY HH:mm:ss') : ''} - {product.modifier}</span>
                            </div>
                            {/* <div className="product-details-right-product-button">
                            <button class="fas fa-cart-arrow-down btnGioHang"> Update</button>
                        </div> */}
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    {/* <Button color="primary" onClick={toggleModal}>
                Do Something
                </Button>{' '} */}
                    <Button color="secondary" onClick={() => toggle()}>
                        Hủy
                    </Button>
                </ModalFooter>
            </Modal>
            <Modal isOpen={isSizeModal} toggle={() => toggleSize()} centered>
                <ModalHeader toggle={() => toggleSize()}>Size {sizeSelect}</ModalHeader>
                <ModalBody>
                    <Label for="description">
                        Số Lượng
                    </Label>
                    <div>
                        <input value={sizeProQuantity.quantity} onChange={(e) => handleOnchangeinput(e)}
                            style={{ border: '1px solid', width: '100%', borderRadius: '5px' }}
                        />
                    </div>
                </ModalBody>
                <ModalFooter>
                    {sizePro.id > 0 &&
                        <>
                            <Button color="primary" onClick={() => updateSizePro()}>
                                Lưu
                            </Button>
                            <Button color="danger" onClick={() => deleteSizePro()}>
                                Xóa
                            </Button>
                        </>
                    }
                    {!sizePro.id > 0 &&
                        <Button color="primary" onClick={() => createSizePro()}>
                            Thêm
                        </Button>
                    }
                    <Button color="secondary" onClick={() => toggleSize()}>
                        Hủy
                    </Button>
                </ModalFooter>
            </Modal>
            <Modal isOpen={isImageModal} toggle={() => toggleImage()} centered>
                <ModalHeader toggle={() => toggleImage()}>Image</ModalHeader>
                <ModalBody>
                    <Input
                        id="image"
                        name="image"
                        type="file"
                        // value={user.image}
                        onChange={(event) => { handleOnchangeFile(event, 'image'); setImageUpload(event.target.files[0]); handleImages(event) }}
                        style={{ marginBottom: '10px' }}
                    />
                    <div>
                        {!imageUpload &&
                            <img width='100%' height='350rem' src={imageURL} />
                        }
                        {imageUpload &&
                            <img width='100%' height='350rem' src={URL.createObjectURL(imageUpload)} />
                        }
                    </div>
                </ModalBody>
                <ModalFooter>
                    {image.dataImage &&
                        <>
                            <Button color="primary" onClick={() => updateImage()}>
                                Lưu
                            </Button>
                            {image.select != 'select' &&
                                <Button color="danger" onClick={() => deleteImage(image.dataImage.id)}>
                                    Xóa
                                </Button>
                            }
                        </>
                    }
                    {!image.dataImage &&
                        <Button color="primary" onClick={() => createImage()}>
                            Thêm
                        </Button>
                    }
                    <Button color="secondary" onClick={() => toggleImage()}>
                        Hủy
                    </Button>
                </ModalFooter>
            </Modal>



            <Modal isOpen={isCreateModal} toggle={() => toggleNewColor()} size="xl" centered>
                <Form onSubmit={handleSubmit(createProduct)} innerRef={ref}>
                    <ModalHeader toggle={() => toggleNewColor()}>Thêm</ModalHeader>
                    <ModalBody>
                        <Row>
                            <Col md={7}>
                                <Row>
                                    <Col md={6}>
                                        <FormGroup>
                                            <Label for="name">Tên</Label>
                                            <div>
                                                <input
                                                    style={{
                                                        border: "1px solid",
                                                        width: "100%",
                                                        borderRadius: "5px",

                                                    }}
                                                    disabled
                                                    id="name"
                                                    name="name"
                                                    placeholder=""
                                                    type="text"
                                                    value={newColor.name}
                                                />
                                                {check.name && check.name.length > 0 && (
                                                    <p className="checkError">{check.name}</p>
                                                )}
                                            </div>
                                        </FormGroup>
                                    </Col>
                                    <Col md={6}>
                                        <FormGroup>
                                            <Label for="color">Màu</Label>
                                            <div>
                                                <input
                                                    style={{
                                                        border: "1px solid",
                                                        width: "100%",
                                                        borderRadius: "5px",
                                                    }}
                                                    id="name"
                                                    name="name"
                                                    placeholder=""
                                                    type="text"
                                                    value={newColor.color}
                                                    onChange={(event) =>
                                                        handelInputNewColor(event, "color")
                                                    }
                                                />
                                                {check.color && check.color.length > 0 && (
                                                    <p className="checkError">{check.color}</p>
                                                )}
                                            </div>
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6}>
                                        <FormGroup>
                                            <Label for="price">Giá</Label>
                                            <div>
                                                <input
                                                    style={{
                                                        border: "1px solid",
                                                        width: "100%",
                                                        borderRadius: "5px",
                                                    }}
                                                    id="price"
                                                    name="price"
                                                    placeholder=""
                                                    type="text"
                                                    value={newColor.price}
                                                    onChange={(event) =>
                                                        handelInputNewColor(event, "price")
                                                    }
                                                />
                                                {check.price && check.price.length > 0 && (
                                                    <p className="checkError">{check.price}</p>
                                                )}
                                            </div>
                                        </FormGroup>
                                    </Col>
                                    <Col md={6}>
                                        <FormGroup>
                                            <Label for="quantity">Số lượng</Label>
                                            <div>
                                                <input
                                                    style={{
                                                        border: "1px solid",
                                                        width: "100%",
                                                        borderRadius: "5px",
                                                    }}
                                                    id="quantity"
                                                    name="quantity"
                                                    placeholder=""
                                                    type="text"
                                                    value={newColor.quantity}
                                                    onChange={(event) =>
                                                        handelInputNewColor(event, "quantity")
                                                    }
                                                />
                                                {check.quantity && check.quantity.length > 0 && (
                                                    <p className="checkError">{check.quantity}</p>
                                                )}
                                            </div>
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6}>
                                        <Row>
                                            <Col md={12}>
                                                <FormGroup>
                                                    <Label for="namecate">Danh mục</Label>
                                                    <div>
                                                        <input
                                                            style={{
                                                                border: "1px solid",
                                                                width: "100%",
                                                                borderRadius: "5px",
                                                            }}
                                                            disabled
                                                            id="quantity"
                                                            name="quantity"
                                                            placeholder=""
                                                            type="text"
                                                            value={newColor.cateName}
                                                        />
                                                    </div>
                                                </FormGroup>
                                            </Col>
                                            <Col
                                                md={2}
                                                style={{
                                                    padding: "0px 12px 0px 0px",
                                                    marginLeft: "0%",
                                                }}
                                            >
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col md={6}>
                                        <Row>
                                            <Col md={12}>
                                                <FormGroup>
                                                    <Label for="sizes">Số lượng size</Label>
                                                    <div>
                                                        <select
                                                            style={{
                                                                border: "1px solid",
                                                                width: "100%",
                                                                borderRadius: "5px",
                                                            }}
                                                            id="sizes"
                                                            name="sizes"
                                                            placeholder=""
                                                            type="select"
                                                            onChange={(event) => {
                                                                handleOnchangeinputNewColor(event, "sizes");
                                                                checkSize(event);
                                                            }}
                                                        >
                                                            <option value="" disabled selected>Chọn size</option>
                                                            {sizeCheck.map((item, index) => {
                                                                return <option value={item}>{item}</option>;
                                                            })}
                                                        </select>
                                                        {check.sizes && check.sizes.length > 0 && (
                                                            <p className="checkError">{check.sizes}</p>
                                                        )}
                                                    </div>
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                    </Col>

                                </Row>
                                {lstsizeSelect.length >= 1 && (
                                    <Row>
                                        {lstsizeSelect.map((item) => {
                                            return (
                                                <Col md={6}>
                                                    <Row>
                                                        <Col md={4}>
                                                            <FormGroup>
                                                                <Label for="description">Kích Cỡ</Label>
                                                                <div>
                                                                    <select
                                                                        style={{
                                                                            border: "1px solid",
                                                                            width: "100%",
                                                                            borderRadius: "5px",
                                                                        }}
                                                                        id="size"
                                                                        name="size"
                                                                        placeholder=""
                                                                        type="select"
                                                                        {...register(`size${item}`)}
                                                                    >
                                                                        {size.map((size) => {
                                                                            return (
                                                                                <option value={size}>{size}</option>
                                                                            );
                                                                        })}
                                                                    </select>
                                                                </div>
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md={8}>
                                                            <FormGroup>
                                                                <Label for="description">Số Lượng</Label>
                                                                <div>
                                                                    <input
                                                                        style={{
                                                                            border: "1px solid",
                                                                            width: "100%",
                                                                            borderRadius: "5px",
                                                                        }}
                                                                        {...register(`quantity${item}`)}
                                                                    />
                                                                </div>
                                                            </FormGroup>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            );
                                        })}
                                    </Row>
                                )}
                            </Col>
                            <Col md={5}>
                                <Row>
                                    <Col md={12}>
                                        <Label>Ảnh</Label>
                                        <div>
                                            <input
                                                type="file"
                                                multiple
                                                onChange={(e) => { handleImages(e, 'medias'); handleOnchangeinputNewColor(e, 'medias') }}
                                                style={{
                                                    border: "1px solid",
                                                    width: "100%",
                                                    borderRadius: "5px",
                                                }}
                                            />
                                        </div>
                                        {check.medias &&
                                            check.medias.length > 0 && (
                                                <p className="checkError">{check.medias}</p>
                                            )}
                                    </Col>
                                    <Col md={12} style={{ marginTop: "1%" }}>
                                        {imageFiles.length > 0 &&
                                            imageFiles &&
                                            imageFiles.map((item, index) => {
                                                return (
                                                    <>
                                                        {imageFiles.length === 1 && (
                                                            <img
                                                                src={URL.createObjectURL(item)}
                                                                width="100%"
                                                                height="285rem"
                                                                style={{
                                                                    borderRadius: "15px",
                                                                    border: "1px solid",
                                                                }}
                                                            />
                                                        )}
                                                        {imageFiles.length === 2 && (
                                                            <div style={{ padding: "0 20% 0 20%" }}>
                                                                <img
                                                                    src={URL.createObjectURL(item)}
                                                                    width="100%"
                                                                    height="142rem"
                                                                    style={{
                                                                        borderRadius: "15px",
                                                                        border: "1px solid",
                                                                        marginBottom: "5px",
                                                                    }}
                                                                />
                                                            </div>
                                                        )}
                                                        {imageFiles.length === 3 && (
                                                            <>
                                                                {index === 0 && (
                                                                    <div style={{ padding: "0 20% 0 20%" }}>
                                                                        <img
                                                                            src={URL.createObjectURL(item)}
                                                                            width="100%"
                                                                            height="142rem"
                                                                            style={{
                                                                                borderRadius: "15px",
                                                                                border: "1px solid",
                                                                                marginBottom: "5px",
                                                                            }}
                                                                        />
                                                                    </div>
                                                                )}
                                                                {index > 0 && (
                                                                    <img
                                                                        src={URL.createObjectURL(item)}
                                                                        width="48.883%"
                                                                        height="142rem"
                                                                        style={{
                                                                            borderRadius: "15px",
                                                                            border: "1px solid",
                                                                            marginRight: "5px",
                                                                        }}
                                                                    />
                                                                )}
                                                            </>
                                                        )}
                                                        {imageFiles.length === 4 && (
                                                            <>
                                                                {index === 0 && (
                                                                    <img
                                                                        src={URL.createObjectURL(item)}
                                                                        width="49%"
                                                                        height="142rem"
                                                                        style={{
                                                                            borderRadius: "15px",
                                                                            border: "1px solid",
                                                                            marginBottom: "5px",
                                                                            marginRight: "5px",
                                                                        }}
                                                                    />
                                                                )}
                                                                {index === 1 && (
                                                                    <img
                                                                        src={URL.createObjectURL(item)}
                                                                        width="49%"
                                                                        height="142rem"
                                                                        style={{
                                                                            borderRadius: "15px",
                                                                            border: "1px solid",
                                                                            marginBottom: "5px",
                                                                        }}
                                                                    />
                                                                )}

                                                                {index === 2 && (
                                                                    <img
                                                                        src={URL.createObjectURL(item)}
                                                                        width="49%"
                                                                        height="142rem"
                                                                        style={{
                                                                            borderRadius: "15px",
                                                                            border: "1px solid",
                                                                            marginRight: "5px",
                                                                        }}
                                                                    />
                                                                )}
                                                                {index === 3 && (
                                                                    <img
                                                                        src={URL.createObjectURL(item)}
                                                                        width="49%"
                                                                        height="142rem"
                                                                        style={{
                                                                            borderRadius: "15px",
                                                                            border: "1px solid",
                                                                        }}
                                                                    />
                                                                )}
                                                            </>
                                                        )}
                                                        {imageFiles.length === 5 && (
                                                            <>
                                                                {index === 0 && (
                                                                    <div style={{ padding: "0 20% 0 20%" }}>
                                                                        <img
                                                                            src={URL.createObjectURL(item)}
                                                                            width="100%"
                                                                            height="142rem"
                                                                            style={{
                                                                                borderRadius: "15px",
                                                                                border: "1px solid",
                                                                                marginBottom: "5px",
                                                                            }}
                                                                        />
                                                                    </div>
                                                                )}
                                                                {index === 1 && (
                                                                    <img
                                                                        src={URL.createObjectURL(item)}
                                                                        width="49%"
                                                                        height="142rem"
                                                                        style={{
                                                                            borderRadius: "15px",
                                                                            border: "1px solid",
                                                                            marginBottom: "5px",
                                                                            marginRight: "5px",
                                                                        }}
                                                                    />
                                                                )}
                                                                {index === 2 && (
                                                                    <img
                                                                        src={URL.createObjectURL(item)}
                                                                        width="49%"
                                                                        height="142rem"
                                                                        style={{
                                                                            borderRadius: "15px",
                                                                            border: "1px solid",
                                                                            marginBottom: "5px",
                                                                        }}
                                                                    />
                                                                )}

                                                                {index === 3 && (
                                                                    <img
                                                                        src={URL.createObjectURL(item)}
                                                                        width="49%"
                                                                        height="142rem"
                                                                        style={{
                                                                            borderRadius: "15px",
                                                                            border: "1px solid",
                                                                            marginRight: "5px",
                                                                        }}
                                                                    />
                                                                )}
                                                                {index === 4 && (
                                                                    <img
                                                                        src={URL.createObjectURL(item)}
                                                                        width="49%"
                                                                        height="142rem"
                                                                        style={{
                                                                            borderRadius: "15px",
                                                                            border: "1px solid",
                                                                        }}
                                                                    />
                                                                )}
                                                            </>
                                                        )}
                                                    </>
                                                );
                                            })}
                                        {imageFiles.length <= 0 && (
                                            <img
                                                width="100%"
                                                height="285rem"
                                                style={{ borderRadius: "15px", border: "1px solid" }}
                                            />
                                        )}
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            color="primary"
                            type="submit"
                            onClick={() => {
                                // createProduct();
                            }}
                        >
                            Thêm Mới
                        </Button>
                        <Button color="secondary" onClick={() => toggleNewColor()}>
                            Hủy
                        </Button>
                    </ModalFooter>
                </Form>

            </Modal>
        </div>
    );
}
export default ProductDetails;