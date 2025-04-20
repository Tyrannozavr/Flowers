// src/pages/ProductDetailPage.tsx
import React, {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import AdminHeader from '../components/admin/AdminHeader';
import Footer from '../components/footer/Footer';
import cartIcon from '../assets/icon-white.svg';
import './ProductDetailPage.css';
import {fetchProductById, IProduct} from "../api/product.ts";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../redux/store.ts";
import {addToCart} from "../redux/cart/slice.ts";

const ProductDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    const productId = id ? parseInt(id, 10) : NaN;

    if (isNaN(productId)) {
        return <div>Некорректный ID продукта</div>;
    }

    const [product, setProduct] = useState<IProduct>();
    const dispatch = useDispatch();
    const cart = useSelector((state: RootState) => state.cart.cart);

    useEffect(() => {
        const loadProduct = async () => {
            if (productId) {
                const data = await fetchProductById(Number(productId));
                setProduct(data);
            }
        };
        loadProduct();
    }, [productId]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);


    if (!product) {
        return <div>Продукт не найден</div>;
    }

    const description = product?.description;

    // Миниатюры — всегда magnolia.png
    // const thumbnails = ['/magnolia.png', '/magnolia.png', '/magnolia.png', '/magnolia.png'];
    // Основное изображение — берём из product.images или используем заглушку
    // const mainImages = product.photoUrl || ['/magnolia.png', '/magnolia.png', '/magnolia.png', '/magnolia.png'];

    // const relatedProducts = Object.values(products)
    //     .flat()
    //     .filter((p: Product) => p.categoryId === product.categoryId && p.id !== productId)
    //     .slice(0, 4);

    // const handleThumbnailClick = (index: number) => {
    //     setCurrentImageIndex(index);
    // };

    const isInCart = cart.some((item) => item.product.id === product.id);

    return (
        <div className="product-detail-page">
            <AdminHeader />
            <main className="main-content">
                <div className="product-detail-container">
                    <div className="product-detail-gallery">
                        <div className="product-detail-gallery-thumbnails">
                            {/*{thumbnails.map((image, index) => (*/}
                            {/*    <img*/}
                            {/*        key={index}*/}
                            {/*        src={image}*/}
                            {/*        alt={`${product.name} thumbnail ${index + 1}`}*/}
                            {/*        className={`product-detail-thumbnail ${index === currentImageIndex ? 'active' : ''}`}*/}
                            {/*        onClick={() => handleThumbnailClick(index)}*/}
                            {/*    />*/}
                            {/*))}*/}
                        </div>
                        <div className="product-detail-main-image">
                            {/*<img src={mainImages[currentImageIndex]} alt={product.name} />*/}
                        </div>
                    </div>
                    <div className="product-detail-info">
                        <p className="product-detail-price">
                            {product.price} ₽ {/*<span className="product-detail-price-note">• по заказу</span>*/}
                        </p>
                        <h1>{product.name}</h1>
                        <div className="product-detail-description-section">
                            <h2>Описание</h2>
                            <p className="product-detail-description">{description}</p>
                        </div>
                        <div className="product-detail-composition">
                            <h2>Состав</h2>
                            <ul>
                                {/*{composition.map((item, index) => (*/}
                                {/*    <li key={index}>*/}
                                {/*        {item.name} — {item.quantity} шт*/}
                                {/*    </li>*/}
                                {/*))}*/}
                            </ul>
                        </div>
                        {!isInCart ? (
                        <button className="product-detail-add-to-cart-button bg-accent-color" onClick={() => {
                            dispatch(addToCart({ product, quantity: 1 }));
                        }}>
                            <img src={cartIcon} alt="" className="product-detail-cart-icon" aria-hidden="true" />
                            В корзину
                        </button>
                        ) : (
                            <button className="product-detail-add-to-cart-button bg-accent-color">
                                <img src={cartIcon} alt="" className="product-detail-cart-icon" aria-hidden="true" />
                                В корзине
                            </button>
                        )}
                    </div>
                </div>
                {/*<section className="product-detail-related-products">*/}
                {/*    <h2>Похожие товары</h2>*/}
                {/*    {relatedProducts.length > 0 ? (*/}
                {/*        <ProductGrid products={relatedProducts} isSmallCard={true} />*/}
                {/*    ) : (*/}
                {/*        <p>Похожие товары отсутствуют.</p>*/}
                {/*    )}*/}
                {/*</section>*/}
            </main>
            <Footer />
        </div>
    );
};

export default ProductDetailPage;