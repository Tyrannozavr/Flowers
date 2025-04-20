import React, { useCallback, useEffect, useState } from 'react';
import AdminHeader from '../components/admin/AdminHeader';
import ProductGrid from '../components/product/ProductGrid';
import ContactForm from '../components/contact/ContactForm';
import Footer from '../components/footer/Footer';
import SwiperCategories from '../components/SwiperCategories';
import './HomePage.css';
import magnoliaImage from '../assets/magnolia.png';


// const MOBILE_BREAKPOINT = 480;
// const TABLET_BREAKPOINT = 780;

const HomePage: React.FC = () => {



  // const [isMobile, setIsMobile] = useState(false);
  // const [isTablet, setIsTablet] = useState(false);
  const [activeCategory, setActiveCategory] = useState<number >(
        -1
    );

  const categories = [
    { id: 1, name: 'Все', image: magnoliaImage },
    { id: 2, name: 'Популярное', image: magnoliaImage },
    { id: 3, name: 'Витрина онлайн', image: magnoliaImage },
    { id: 4, name: 'Авторские букеты', image: magnoliaImage },
    { id: 5, name: 'Монобукеты', image: magnoliaImage },
    { id: 6, name: 'Композиции', image: magnoliaImage },
    { id: 7, name: 'Сезонные', image: magnoliaImage },
    { id: 8, name: 'Сухоцветы', image: magnoliaImage },
    { id: 9, name: 'Свадебный букет', image: magnoliaImage },
  ];

  const handleCategoryClick = useCallback((categoryId: number) => {
    setActiveCategory(categoryId);
  }, []);

  const handleResize = useCallback(() => {
    // const width = window.innerWidth;
    // setIsMobile(width <= MOBILE_BREAKPOINT);
    // setIsTablet(width > MOBILE_BREAKPOINT && width <= TABLET_BREAKPOINT);
    // console.log('Window width:', width, 'isMobile:', width <= MOBILE_BREAKPOINT, 'isTablet:', width > MOBILE_BREAKPOINT && width <= TABLET_BREAKPOINT);
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  useEffect(() => {
    console.log('Categories in HomePage before passing:', categories);
    console.log('Number of categories in HomePage:', categories.length);
  }, [categories]);

  return (
      <div className="home-page">
        <AdminHeader />
        <main className="main-content">
          <SwiperCategories
              categories={categories}
              activeCategory={activeCategory}
              onCategoryClick={handleCategoryClick}
          />
          <ProductGrid categoryId={activeCategory} />
          <ContactForm />
        </main>
        <Footer />
      </div>
  );
};

export default HomePage;