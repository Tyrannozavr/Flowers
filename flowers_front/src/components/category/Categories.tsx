import React, { useEffect, useState, useRef } from "react";
import { CategoryResponse, fetchCategories } from "../../api/category.ts";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperCore } from 'swiper';
import { Link } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/scrollbar';
import './Categories.css';

interface CategoriesProps {
    selectedCategory: number | null;
    onSelectCategory: (categoryId: number) => void;
}

const Categories: React.FC<CategoriesProps> = ({
    selectedCategory,
    onSelectCategory,
}) => {

    const swiperRef = useRef<SwiperCore | null>(null);

    useEffect(() => {
        const swiper = swiperRef.current;
        if (swiper) {
            // Настройки для свободной прокрутки
            swiper.params.scrollbar = {
                draggable: true,
                snapOnRelease: false, // Отключаем привязку при отпускании
                dragSize: 100,
                hide: false
            };
            swiper.scrollbar?.init();
            swiper.scrollbar?.updateSize();

            // Разрешаем свободную прокрутку
            swiper.params.freeMode = {
                enabled: true,
                momentum: true,
                momentumRatio: 1,
                momentumBounce: true,
                momentumBounceRatio: 1
            };
            swiper.update();
        }
    }, []);

    const [categories, setCategories] = useState<CategoryResponse[]>([]);

    useEffect(() => {
        (async () => {
            const data = await fetchCategories();
            setCategories(data);
        })();
    }, []);

    return (
        <div className="categories-container">
            <Swiper
                slidesPerView="auto"
                spaceBetween={20}
                initialSlide={0}
                freeMode={{
                    enabled: true,
                    momentum: true,
                    sticky: false
                }}
                scrollbar={{
                    draggable: true,
                    snapOnRelease: false,
                    dragSize: 100,
                    hide: false
                }}
                onSwiper={(swiper: SwiperCore) => {
                    swiperRef.current = swiper;
                    // Добавляем пространство для свободной прокрутки
                    swiper.wrapperEl.style.padding = '0 40px';
                    swiper.wrapperEl.style.margin = '0 -40px';
                }}
                className="categories-swiper"
            >
                {categories.map((category) => (
                    <SwiperSlide key={category.id} className="category-slide">
                        <Link
                            to={`/category/${category.id}`}
                            className={`category-tab ${selectedCategory === category.id ? 'active' : ''}`}
                            onClick={() => onSelectCategory(category.id)}
                        >
                            <div className="category-image-container">
                                <img
                                    src={category.imageUrl}
                                    alt={category.name}
                                    className="category-image"
                                    loading="lazy"
                                />
                            </div>
                            <span className={`category-text ${category.name.split(' ').length === 2 ? 'two-words' : ''}`}>
                                {category.name}
                            </span>
                        </Link>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default Categories;
