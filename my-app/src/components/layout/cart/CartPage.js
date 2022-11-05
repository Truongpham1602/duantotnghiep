import { React, useState, useEffect } from 'react';
import NumericInput from 'react-numeric-input';
import { Link } from "react-router-dom";
import "./CartPage.css";
import axios from 'axios';
import useCallGetAPI from "../../../customHook/CallGetApi";

const Cart = () => {

    const [lstproduct, setLstProduct] = useState([])
    const { data: dataCart } = useCallGetAPI(``)
    const [totalPrice, setTotalPrice] = useState()
    const [lstcart, setLstCart] = useState([])
    const [source, setSource] = useState()

    useEffect(() => {
        axios
            .get(
                'http://localhost:8080/cart/getByUser_Id/1',
                { responseType: 'arraybuffer' },
            )
            .then(response => {
                const base64 = btoa(
                    new Uint8Array(response.data).reduce(
                        (data, byte) => data + String.fromCharCode(byte),
                        '',
                    ),
                );
                setSource("data:;base64," + base64);
            });
        let total = 0;
        const setTotal = () => {
            setLstCart(dataCart)
            dataCart.map(item => {
                total += item.price
            })
            setTotalPrice(total)
        }
        dataCart && setTotal()
    }, [dataCart])

    return (
        <div className="container-fluid">
            <h4 className="py-4">Shopping Cart</h4>
            <div className="d-flex justify-content-between align-items-center">
                <ul className="breadcrumb">
                    <Link className="breadcrumb-item" to={"/"}>
                        Trang Chủ
                    </Link>
                    <Link className="breadcrumb-item" to={"cart"}>
                        Giỏ Hàng
                    </Link>
                </ul>
                <p className="count">Có {lstcart.length} Sản Phẩm Trong Giỏ Hàng</p>
            </div>
            <div className="row">
                {/* Cart-left */}
                <section className="cart-left col-8">
                    <ul className="cart-list">
                        {lstcart.map((lstcart, index) => {
                            return (
                                <li className="cart-item d-flex align-items-center" key={index}>
                                    <div className="cart-infor">
                                        <div className="thumbnail">
                                            <a href="#">
                                                <img src={source} alt={lstcart.name} />
                                            </a>
                                        </div>
                                        <div className="detail">
                                            <div className="name">
                                                <a href="#">{lstcart.name_Product}</a>
                                            </div>
                                            <div className="description">{lstcart.description}</div>
                                            <div className="price">{lstcart.price}</div>
                                        </div>
                                    </div>

                                    <div className="cart-quantity">
                                        <div className="quantity">
                                            <NumericInput min={0} max={lstcart.quantityTotal} value={lstcart.quantity} />
                                        </div>

                                        <div className="remove">
                                            <svg
                                                version="1.1"
                                                className="close"
                                                x="0px"
                                                y="0px"
                                                viewBox="0 0 60 60"
                                                enableBackground="new 0 0 60 60"
                                            >
                                                <polygon points="38.936,23.561 36.814,21.439 30.562,27.691 24.311,21.439 22.189,23.561 28.441,29.812 22.189,36.064 24.311,38.186 30.562,31.934 36.814,38.186 38.936,36.064 32.684,29.812" />
                                            </svg>
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </section>
                {/* Cart-right */}
                <div className="cart-right col-4 bg-light">
                    <div className="summary">
                        <ul>
                            <li>
                                Tổng Cộng: <span>{totalPrice}</span>
                            </li>
                            <li>
                                Giảm: <span>$5.00</span>
                            </li>
                            <li className="total">
                                Tổng: <span>{lstcart.length}</span> Sản Phẩm
                            </li>
                        </ul>
                    </div>

                    <div className="checkout">
                        <button type="button">Thanh Toán</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
