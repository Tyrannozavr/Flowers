import React, { useState, useEffect } from 'react';
import './ProductGrid.css';
import cartIcon from '../../assets/icon-white.svg';
import { IProduct, fetchProducts } from "../../api/product";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { addToCart } from "../../redux/cart/slice";
import { Link } from 'react-router-dom';


interface Product {
  id: number;
  name: string;
  price: number;
  photoUrl: string;
}
interface ProductGridProps {
  categoryId: number;
  products?: Product[];
  isSmallCard?: boolean;
}

const ProductGrid: React.FC<ProductGridProps> = ({ categoryId}) => {
  // Mock data for products
    const [products, setProducts] = useState<IProduct[]>([]);
    const currentPage = 1;
    const perPage = 10;
    const dispatch = useDispatch();
    const getProducts = async (category: number | null) => {
        try {
            const data = await fetchProducts(currentPage, perPage, category);

            setProducts(data.products);

            console.log(data.products);
        } catch (error) {
            setProducts([]);
        }
    };
    useEffect(() => {
        getProducts(categoryId);
    }, []);

  const handleAddToCart = (product: Product) => {
      if (!cart.some((item) => item?.product?.id === product.id)) {
          dispatch(addToCart({ product, quantity: 1 }));
      }
  };

  // Создаем массивы продуктов для разных рядов
  const firstRowProducts = products;
  // const secondRowProducts = products.slice(4, 7);

  // Для планшетной версии
  const tabletFirstRowProducts = products;
  // const tabletSecondRowProducts = products.slice(3, 6);
  // const tabletThirdRowProducts = products.slice(6, 8);

    const cart = useSelector((state: RootState) => state.cart.cart);
    const formatPrice = (value: number) => value.toLocaleString("ru-RU");

  // Компоненты карточек продуктов
  const FirstRowProductCard = ({ product }: { product: Product }) => (
      <Link to={`/product/${product.id}`} className="product-card-link">
          <div key={product.id} className="product-card first-row-card">
            <div className="product-image-container">
              <img src={product.photoUrl} alt={product.name} className="product-image" />
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
                <img src={cartIcon} alt="" className="cart-icon" aria-hidden="true" />
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

  // const SecondRowProductCard = ({ product }: { product: Product }) => (
  //     <div key={product.id} className="product-card second-row-card">
  //       <div className="product-image-container">
  //         <img src={product.photoUrl} alt={product.name} className="product-image" />
  //       </div>
  //       <div className="product-info">
  //         <div className="product-price">{product.price} ₽</div>
  //         <div className="product-name">{product.name}</div>
  //         <button
  //             className="add-to-cart-button"
  //             onClick={() => handleAddToCart(product.id)}
  //             aria-label={`Добавить ${product.name} в корзину`}
  //         >
  //           <img src={cartIcon} alt="" className="cart-icon" aria-hidden="true" />
  //           В корзину
  //         </button>
  //       </div>
  //     </div>
  // );

  // Определяем, какую версию отображать в зависимости от ширины экрана
  const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);

  React.useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Десктопная версия (> 1024px)
  const renderDesktopLayout = () => (
      <>
        <div className="product-grid first-row">
          {firstRowProducts.map((product) => (
              <FirstRowProductCard key={product.id} product={product} />
          ))}
        </div>
        {/*<div className="product-grid second-row">*/}
        {/*  {secondRowProducts.map((product) => (*/}
        {/*      <SecondRowProductCard key={product.id} product={product} />*/}
        {/*  ))}*/}
        {/*</div>*/}
      </>
  );

  // Планшетная версия (481px - 1024px)
  const renderTabletLayout = () => (
      <>
        <div className="product-grid first-row">
          {tabletFirstRowProducts.map((product) => (
              <FirstRowProductCard key={product.id} product={product} />
          ))}
        </div>
        {/*<div className="product-grid first-row">*/}
        {/*  {tabletSecondRowProducts.map((product) => (*/}
        {/*      <FirstRowProductCard key={product.id} product={product} />*/}
        {/*  ))}*/}
        {/*</div>*/}
        {/*<div className="product-grid second-row">*/}
        {/*  {tabletThirdRowProducts.map((product) => (*/}
        {/*      <SecondRowProductCard key={product.id} product={product} />*/}
        {/*  ))}*/}
        {/*</div>*/}
      </>
  );

  // Мобильная версия (≤ 480px)
  const renderMobileLayout = () => (
      <>
        <div className="product-grid first-row">
          {products.map((product) => (
              <FirstRowProductCard key={product.id} product={product} />
          ))}
        </div>
        {/*<div className="product-grid first-row">*/}
        {/*  {products.slice(2, 4).map((product) => (*/}
        {/*      <FirstRowProductCard key={product.id} product={product} />*/}
        {/*  ))}*/}
        {/*</div>*/}
        {/*<div className="product-grid first-row">*/}
        {/*  {products.slice(4, 6).map((product) => (*/}
        {/*      <FirstRowProductCard key={product.id} product={product} />*/}
        {/*  ))}*/}
        {/*</div>*/}
      </>
  );

  return (
      <div className="product-grid-container">
        {windowWidth > 1024 && renderDesktopLayout()}
        {windowWidth <= 1024 && windowWidth > 480 && renderTabletLayout()}
        {windowWidth <= 480 && renderMobileLayout()}
      </div>
  );
};

export default ProductGrid;
