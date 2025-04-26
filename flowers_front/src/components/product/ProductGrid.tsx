import React, {useState, useEffect} from 'react';
import './ProductGrid.css';
import cartIcon from '../../assets/icon-white.svg';
import {IProduct, fetchProducts} from "../../api/product";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {addToCart} from "../../redux/cart/slice";
import {Link} from 'react-router-dom';
import useViewport from '../../useViewport';

interface ProductGridProps {
    categoryId: number | null;
    products?: IProduct[];
    isSmallCard?: boolean;
}

const ProductGrid: React.FC<ProductGridProps> = ({categoryId, products: propProducts, isSmallCard = false}) => {
    const [products, setProducts] = useState<IProduct[]>([]);
    const currentPage = 1;
    const perPage = 10;
    const dispatch = useDispatch();
    const { isTablet, isDesktop } = useViewport();

    const getProducts = async (category: number | null) => {
        try {
            const data = await fetchProducts(currentPage, perPage, category);
            setProducts(data.products);
        } catch (error) {
            console.error("Error fetching products:", error);
            setProducts([]);
        }
    };

    useEffect(() => {
        if (!categoryId || categoryId === -1) {
            getProducts(null);
        } else {
            getProducts(categoryId);
        }
    }, [categoryId]);

    const handleAddToCart = (product: IProduct) => {
        if (!cart.some((item) => item?.product?.id === product.id)) {
            dispatch(addToCart({product, quantity: 1}));
        }
    };
    const cart = useSelector((state: RootState) => state.cart.cart);
    const formatPrice = (value: number) => value.toLocaleString("ru-RU");


    const allProductsArray = Object.values(products) as IProduct[];
    const flattenedProducts = allProductsArray.flat();
    const displayProducts = propProducts || flattenedProducts.filter(
        (product: IProduct) => categoryId === -1 || product.categoryId === categoryId
    );

    const uniqueDisplayProducts = Array.from(
        new Map(displayProducts.map((product) => [product.id, product])).values()
    );

    const firstRowProducts = isDesktop
        ? uniqueDisplayProducts.slice(0, 4)
        : isTablet
            ? uniqueDisplayProducts.slice(0, 3)
            : uniqueDisplayProducts.slice(0, 6);

    const secondRowProducts = isDesktop
        ? uniqueDisplayProducts.slice(4, 7)
        : isTablet
            ? uniqueDisplayProducts.slice(3, 5)
            : [];

    useEffect(() => {
        console.log('ProductGrid rendered with categoryId:', categoryId);
        console.log('First row cards rendered:', firstRowProducts.length);
        console.log('Second row cards rendered:', secondRowProducts.length);
    }, [categoryId, firstRowProducts, secondRowProducts]);

    // Компоненты карточек продуктов
    const FirstRowProductCard = ({product}: { product: IProduct }) => (
        <Link to={`/product/${product.id}`} className="product-card-link">
            <div key={product.id} className="product-card first-row-card">
                <div className="product-image-container">
                    <img src={product.images[0]} alt={product.name} className="product-image"/>
                </div>
                <div className="product-info">
                    <div className="product-price accent-color">{formatPrice(product.price)} ₽</div>
                    <div className="product-name">{product.name}</div>
                    <button
                        className="add-to-cart-button bg-accent-color"
                        onClick={() => handleAddToCart(product)}
                        aria-label={
                            cart.some((item) => item?.product?.id === product.id)
                                ? `Товар ${product.name} в корзине`
                                : `Добавить ${product.name} в корзину`
                        }
                    >
                        <img src={cartIcon} alt="" className="cart-icon" aria-hidden="true"/>
                        {
                            cart.some((item) => item?.product?.id === product.id)
                                ? "В корзине"
                                : "В корзину"
                        }
                    </button>
                </div>
            </div>
        </Link>
    );

    const SecondRowProductCard = ({ product }: { product: IProduct }) => (
        <Link to={`/product/${product.id}`} className="product-card-link">
            <div className="product-card second-row-card">
                <div className="product-image-container">
                    <img src="/magnolia.png" alt={product.name} className="product-image" />
                </div>
                <div className="product-info">
                    <div className="product-price">{formatPrice(product.price)} ₽</div>
                    <div className="product-name">{product.name}</div>
                    <button
                        className="add-to-cart-button bg-accent-color"
                        onClick={() => handleAddToCart(product)}
                        aria-label={
                            cart.some((item) => item?.product?.id === product.id)
                                ? `Товар ${product.name} в корзине`
                                : `Добавить ${product.name} в корзину`
                        }
                    >
                        <img src={cartIcon} alt="" className="cart-icon" aria-hidden="true"/>
                        {
                            cart.some((item) => item?.product?.id === product.id)
                                ? "В корзине"
                                : "В корзину"
                        }
                    </button>
                </div>
            </div>
        </Link>
    );

    // Определяем, какую версию отображать в зависимости от ширины экрана
    return (
        <div className="product-grid-container">
            <div className="product-grid first-row">
                {firstRowProducts.map((product) => (
                    <FirstRowProductCard key={product.id} product={product} />
                ))}
            </div>
            {!isSmallCard && (
                <div className="product-grid second-row">
                    {secondRowProducts.map((product) => (
                        <SecondRowProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductGrid;