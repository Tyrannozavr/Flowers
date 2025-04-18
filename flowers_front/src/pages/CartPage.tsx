import React, {useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AdminHeader from '../components/admin/AdminHeader';
import Footer from '../components/footer/Footer';
// import ProductGrid from '../components/product/ProductGrid';
// import { useCart } from '../context/CartContext';
import trashIcon from '../assets/trash.svg';
import plusIcon from '../assets/plus.svg';
import minusIcon from '../assets/minus.svg';
import './CartPage.css';

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import {
    removeFromCart,
    decreaseQuantity,
    increaseQuantity,
} from "../redux/cart/slice";
import {setCartItems} from "../redux/order/slice.ts";

const CartPage: React.FC = () => {

    const dispatch = useDispatch();
    const cart = useSelector((state: RootState) => state.cart.cart);
    const navigate = useNavigate();
    const calculateTotal = () => {
        return cart.reduce(
            (total, item) => total + item.product.price * item.quantity,
            0
        );
    };
    const formatPrice = (value: number) => {
        return value.toLocaleString("ru-RU");
    };
    const handleOrder = () => {
        const mappedCartItems = cart.map((item) => ({
            id: item.product.id,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
        }));

        dispatch(setCartItems(mappedCartItems));
        navigate("/order");
    };
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);


    // const suggestedProducts = [
    //     {
    //         id: 1,
    //         categoryId: 1,
    //         name: 'Французская роза',
    //         price: 3490,
    //         images: [
    //             '/assets/french-rose-1.jpg',
    //             '/assets/french-rose-2.jpg',
    //             '/assets/french-rose-3.jpg',
    //             '/assets/french-rose-4.jpg',
    //         ],
    //     },
    //     {
    //         id: 2,
    //         categoryId: 1,
    //         name: 'Красная роза',
    //         price: 3490,
    //         images: [
    //             '/assets/red-rose-1.jpg',
    //             '/assets/red-rose-2.jpg',
    //             '/assets/red-rose-3.jpg',
    //             '/assets/red-rose-4.jpg',
    //         ],
    //     },
    //     {
    //         id: 3,
    //         categoryId: 1,
    //         name: 'Белая роза',
    //         price: 3490,
    //         images: [
    //             '/assets/white-rose-1.jpg',
    //             '/assets/white-rose-2.jpg',
    //             '/assets/white-rose-3.jpg',
    //             '/assets/white-rose-4.jpg',
    //         ],
    //     },
    //     {
    //         id: 4,
    //         categoryId: 1,
    //         name: 'Розовая роза',
    //         price: 3490,
    //         images: [
    //             '/assets/pink-rose-1.jpg',
    //             '/assets/pink-rose-2.jpg',
    //             '/assets/pink-rose-3.jpg',
    //             '/assets/pink-rose-4.jpg',
    //         ],
    //     },
    // ];

    return (
        <div className="cart-page">
            <AdminHeader />
            <main className="cart-content">
                {cart.length === 0 ? (
                    <div className="empty-cart">
                        <h2 className="empty-cart-title">Корзина пуста</h2>
                        <p className="empty-cart-text">Начните покупки на главной странице</p>
                        <Link to="/" className="back-to-home-button bg-accent-color">
                            Начать покупки
                        </Link>
                    </div>
                ) : (
                    <div className="filled-cart">
                        <div className="cart-header">
                            <h2 className="cart-header-title">Корзина</h2>
                        </div>
                        <div className="cart-items">
                            {cart.map(({ product, quantity }) => (
                                <div key={product.id} className="cart-item">
                                    <div className="cart-item-left">
                                        <img src={product.photoUrl} alt={product.name} className="cart-item-image" />
                                    </div>
                                    <div className="cart-item-details">
                                        <div className="cart-item-text">
                                            <p className="cart-item-total-price">{product.price * quantity} ₽</p>
                                            <h3 className="cart-item-title">{product.name}</h3>
                                            <p className="cart-item-price">{product.price} ₽ / шт</p>
                                        </div>
                                        <div className="cart-item-controls">
                                            <button
                                                className="remove-from-cart-button"
                                                onClick={() =>
                                                    dispatch(removeFromCart(product.id))
                                                }
                                                aria-label={`Удалить ${product.name} из корзины`}
                                            >
                                                <img src={trashIcon} alt="Удалить" className="remove-icon" />
                                            </button>
                                            <div className="quantity-controls">
                                                <button
                                                    onClick={() =>
                                                        dispatch(
                                                            decreaseQuantity(product.id)
                                                        )
                                                    }
                                                    disabled={quantity <= 1}
                                                    className="quantity-button quantity-button-minus"
                                                >
                                                    <img src={minusIcon} alt="Уменьшить" className="quantity-icon" />
                                                </button>
                                                <span className="quantity-value">{quantity}</span>
                                                <button
                                                    onClick={() =>
                                                        dispatch(
                                                            increaseQuantity(product.id)
                                                        )
                                                    }
                                                    className="quantity-button quantity-button-plus"
                                                >
                                                    <img src={plusIcon} alt="Увеличить" className="quantity-icon" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/*<div className="suggested-products">*/}
                        {/*    <h2 className="suggested-products-title">Ничего не забыли?</h2>*/}
                        {/*    <ProductGrid products={suggestedProducts} isSmallCard={true} />*/}
                        {/*</div>*/}
                        <div className="cart-summary">
                            <h3 className="cart-summary-total">{formatPrice(calculateTotal())} ₽</h3>
                            <button className="checkout-button bg-accent-color" onClick={handleOrder}>
                                Перейти к оформлению
                            </button>
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default CartPage;