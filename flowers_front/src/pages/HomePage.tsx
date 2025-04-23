import React, { useCallback, useEffect, useState } from 'react';
import AdminHeader from '../components/admin/AdminHeader';
import ProductGrid from '../components/product/ProductGrid';
import ContactForm from '../components/contact/ContactForm';
import Footer from '../components/footer/Footer';
import SwiperCategories from '../components/SwiperCategories';
import './HomePage.css';
import {getShopCategories} from "../api/category.ts";
import { useTheme } from "../theme/ThemeProvider";
// import magnoliaImage from '../assets/magnolia.png';

// const MOBILE_BREAKPOINT = 480;
// const TABLET_BREAKPOINT = 780;

const HomePage: React.FC = () => {
  // const [isMobile, setIsMobile] = useState(false);
  // const [isTablet, setIsTablet] = useState(false);
  interface Category {
    id: number;
    name: string;
    value: string;
    imageUrl?: string;
  }
  const [activeCategory, setActiveCategory] = useState<number>(-1); // Set to the ID of the "All" category
  const [categories, setCategories] = useState<Category[]>([]);

  const { shopId } = useTheme();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getShopCategories(shopId);
        if (data.length > 0) {
          setCategories(data);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchCategories();
  }, [shopId]);

  const handleCategoryClick = useCallback((categoryId: number) => {
    setActiveCategory(categoryId);
  }, []);

  const handleResize = useCallback(() => {
    // const width = window.innerWidth;
    // setIsMobile(width <= MOBILE_BREAKPOINT);
    // setIsTablet(width > MOBILE_BREAKPOINT && width <= TABLET_BREAKPOINT);
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);


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