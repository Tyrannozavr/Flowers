import React, { useCallback, useEffect, useState } from 'react';
import AdminHeader from '../components/admin/AdminHeader';
import ProductGrid from '../components/product/ProductGrid';
import ContactForm from '../components/contact/ContactForm';
import Footer from '../components/footer/Footer';
import Categories from '../components/category/Categories.tsx';
import './HomePage.css';
// import magnoliaImage from '../assets/magnolia.png';

// const MOBILE_BREAKPOINT = 480;
// const TABLET_BREAKPOINT = 780;

const HomePage: React.FC = () => {
  // const [isMobile, setIsMobile] = useState(false);
  // const [isTablet, setIsTablet] = useState(false);
  const [activeCategory, setActiveCategory] = useState<number>(-1); // Set to the ID of the "All" category

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


  return (
    <div className="home-page">
      <AdminHeader />
      <Categories
          selectedCategory={activeCategory}
          onSelectCategory={handleCategoryClick}
      />
      <main className="main-content">
        <ProductGrid categoryId={activeCategory} />
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;