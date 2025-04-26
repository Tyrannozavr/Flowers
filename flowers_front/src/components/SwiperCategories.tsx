import React from 'react';
import { Link } from 'react-router-dom';
import useViewport from '../useViewport';
import '../pages/HomePage.css';

interface Category {
    id: number;
    name: string;
    value: string;
    imageUrl?: string;
}

interface SwiperCategoriesProps {
    categories: Category[];
    activeCategory: number | null;
    onCategoryClick: (id: number) => void;
}

const SwiperCategories: React.FC<SwiperCategoriesProps> = ({ categories, activeCategory, onCategoryClick }) => {
    const { isDesktop } = useViewport();

    return (
        <div className={`category-tabs ${isDesktop ? 'desktop' : ''}`}>
            {categories.map((category) => (
                <Link
                    key={category.id}
                    to={`/category/${category.id}`}
                    className={`category-tab ${activeCategory === category.id ? 'active' : ''}`}
                    onClick={() => onCategoryClick(category.id)}
                >
                    <img
                        src={category.imageUrl || '/magnolia.png'}
                        alt={category.name}
                        className="category-image"
                    />
                    <span className="category-text">{category.name}</span>
                </Link>
            ))}
        </div>
    );
};

export default SwiperCategories;