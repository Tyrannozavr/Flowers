// src/pages/ProductDetailPage.tsx
import React, {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import AdminHeader from '../components/admin/AdminHeader';
import Footer from '../components/footer/Footer';
import cartIcon from '../assets/icon-white.svg';
import {fetchProductById, IProduct} from "../api/product.ts";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../redux/store.ts";
import {addToCart} from "../redux/cart/slice.ts";

const ProductDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const productId = id ? parseInt(id, 10) : NaN;
    const [product, setProduct] = useState<IProduct | null>(null);
    const dispatch = useDispatch();
    const cart = useSelector((state: RootState) => state.cart.cart);

    useEffect(() => {
        const loadProduct = async () => {
            if (!isNaN(productId)) {
                try {
                    const data = await fetchProductById(productId);
                    setProduct(data);
                } catch (error) {
                    console.error("Error fetching product:", error);
                    setProduct(null);
                }
            }
        };
        loadProduct();
    }, [productId]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    if (isNaN(productId)) {
        return <div>Некорректный ID продукта</div>;
    }

    if (!product) {
        return <div>Загрузка...</div>;
    }

    const isInCart = cart.some((item) => item.product.id === product.id);

    const handleAddToCart = (product: IProduct) => {
        if (!cart.some((item) => item?.product?.id === product.id)) {
            dispatch(addToCart({ 
                product: {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    photoUrl: product.photoUrl || '' // Provide a default value if photoUrl is missing
                }, 
                quantity: 1 
            }));
        }
    };

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
                            <p className="product-detail-description">{product.description}</p>
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
                            <button 
                                className="product-detail-add-to-cart-button bg-accent-color" 
                                onClick={() => handleAddToCart(product)}
                            >
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