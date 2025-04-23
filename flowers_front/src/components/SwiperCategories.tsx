import React, { useCallback, useRef } from 'react';
import styled from 'styled-components';
import { Swiper, SwiperSlide } from 'swiper/react'; // Импортируем Swiper
// import 'swiper/swiper.min.css';

interface CategoryTabsProps {
    categoryCount: number;
    children?: React.ReactNode;
}

const SwiperContainer = styled.div`
    padding: 8px 0 45px 0;
    width: 100%;
    position: relative;

    .swiper {
        width: 100%;
        height: 100%;
    }

    @media (max-width: 480px) {
        padding: 4px 0 16px 0;
    }
`;

const CategoryTabsBase = styled.div`
    display: flex;
    white-space: nowrap;
    gap: 0px; /* Отступ между категориями по умолчанию 0px */
    align-items: flex-start; /* Выравнивание по верхнему краю */
    padding: 0; /* Убираем padding */

    @media (min-width: 781px) {
        width: 100%;
        justify-content: center; /* Центрируем категории */
        overflow: visible; /* Убираем обрезку на десктопе */
        gap: 40px; /* Отступ между категориями 40px на десктопе */
    }

    @media (max-width: 780px) {
        gap: 45px; /* Отступ между категориями */
        padding: 0 87px; /* Добавляем padding для планшетов и мобильных */
    }
`;

const CategoryTabs: React.FC<CategoryTabsProps> = ({ categoryCount, children }) => {
    return (
        <CategoryTabsBase
            style={{
                ...(window.innerWidth >= 781
                    ? { minWidth: `${categoryCount * 64 + (categoryCount - 1) * 40 + 20}px` } // Для десктопа
                    : {}), // Для планшетов и мобильных ширина определяется Swiper
            }}
        >
            {children}
        </CategoryTabsBase>
    );
};

const CategoryTabWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const CategoryTab = styled.button`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start; /* Выравниваем содержимое по верхнему краю внутри контейнера */
    gap: 8px;
    padding: 0; /* Убираем padding, чтобы изображение занимало весь контейнер */
    background: transparent;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
    outline: none;
    position: relative;
    z-index: 1;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
    flex: 0 0 auto;

    @media (min-width: 781px) {
        width: 64px; /* Десктоп */
        min-width: 64px;
        height: 104px; /* Увеличиваем высоту, чтобы вместить текст */
    }

    @media (max-width: 780px) {
        width: 44px; /* Планшет и мобильный */
        min-width: 44px;
        height: 84px; /* Увеличиваем высоту, чтобы вместить текст */
    }

    @media (min-width: 781px) {
        &::after {
            content: '';
            position: absolute;
            width: 92.51952237298119px;
            height: 20.559894284517732px;
            background-color: #30aa6e;
            top: 35%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-15deg);
            opacity: 0;
            transition: opacity 0.3s ease;
            z-index: -1;
        }

        &:hover::after {
            opacity: 1;
        }
    }

    @media (max-width: 780px) {
        &::after {
            content: '';
            position: absolute;
            width: 71.99999902908115px; /* Указанный размер */
            height: 15.999999784240257px; /* Указанный размер */
            background-color: #30aa6e;
            top: 20px; /* Центр изображения с учетом рамки (48px / 2) */
            left: 50%;
            transform: translate(-50%, 0) rotate(-15deg); /* Убираем смещение по Y, так как top уже задан */
            opacity: 0;
            transition: opacity 0.3s ease;
            z-index: -1;
        }

        &:hover::after {
            opacity: 1;
        }
    }
`;

const CategoryImage = styled.img`
    width: 64px;
    height: 64px;
    border-radius: 16px; /* 2XL radius */
    object-fit: cover;
    margin: 0;
    flex-shrink: 0;
    border: 2px solid #e0e0e0;
    transition: border-color 0.3s ease;

    @media (max-width: 780px) {
        width: 44px;
        height: 44px;
        border-radius: 16px; /* 2XL radius */
    }
`;

const CategoryText = styled.div`
    font-family: 'Montserrat', sans-serif;
    font-weight: 400;
    letter-spacing: 0px;
    text-align: center; /* Горизонтальное выравнивание */
    color: #333333;
    transition: color 0.3s ease;
    margin: 0;
    position: relative;
    z-index: 2;
    width: 100%;
    white-space: normal;

    @media (min-width: 781px) {
        font-size: 13px;
        line-height: 16px;
        height: 32px; /* Фиксированная высота для текста */
        display: flex;
        align-items: flex-start; /* Выравниваем текст по верхнему краю */
        justify-content: center;
    }

    @media (max-width: 780px) {
        font-size: 11px !important;
        line-height: 16px !important;
        height: 32px; /* Фиксированная высота для текста */
        display: flex;
        align-items: flex-start; /* Выравниваем текст по верхнему краю */
        justify-content: center;
    }
`;

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
    const containerRef = useRef<HTMLDivElement>(null);

    const handleTouchStart = useCallback((e: React.TouchEvent<HTMLButtonElement>) => {
        const text = e.currentTarget.querySelector('.category-text');
        if (text) text.setAttribute('style', 'color: #30AA6E');
    }, []);

    const handleTouchEnd = useCallback((e: React.TouchEvent<HTMLButtonElement>) => {
        const text = e.currentTarget.querySelector('.category-text');
        if (text) text.setAttribute('style', 'color: #333333');
    }, []);

    const renderCategoryName = (name: string) => {
        const words = name.split(' ');
        return words.map((word, index) => (
            <React.Fragment key={index}>
                {word}
                {index < words.length - 1 && <br />}
            </React.Fragment>
        ));
    };

    // Для десктопа показываем категории без слайдера
    if (window.innerWidth >= 781) {
        return (
            <SwiperContainer ref={containerRef}>
                <CategoryTabs categoryCount={categories.length}>
                    {categories.map((category) => (
                        <CategoryTabWrapper key={category.id}>
                            <CategoryTab
                                className={`category-tab ${activeCategory === category.id ? 'active' : ''}`}
                                onClick={() => onCategoryClick(category.id)}
                                onTouchStart={handleTouchStart}
                                onTouchEnd={handleTouchEnd}
                                type="button"
                                role="tab"
                                aria-selected={activeCategory === category.id}
                                aria-label={`Выбрать категорию: ${category.name}`}
                            >
                                <CategoryImage
                                    src={category.imageUrl}
                                    alt={category.name}
                                    className="category-image"
                                    loading="lazy"
                                    width={64}
                                    height={64}
                                />
                                <CategoryText className="category-text">{renderCategoryName(category.name)}</CategoryText>
                            </CategoryTab>
                        </CategoryTabWrapper>
                    ))}
                </CategoryTabs>
            </SwiperContainer>
        );
    }

    // Для планшетов и мобильных используем Swiper
    return (
        <SwiperContainer ref={containerRef}>
            <Swiper
                slidesPerView="auto"
                spaceBetween={45} // Соответствует gap: 45px
                freeMode={true} // Позволяет свободно прокручивать
                grabCursor={true} // Курсор в виде "хватания" при перетаскивании
                style={{ padding: '0 87px' }}
            >
                {categories.map((category) => (
                    <SwiperSlide key={category.id} style={{ width: '44px' }}>
                        <CategoryTabWrapper>
                            <CategoryTab
                                className={`category-tab ${activeCategory === category.id ? 'active' : ''}`}
                                onClick={() => onCategoryClick(category.id)}
                                onTouchStart={handleTouchStart}
                                onTouchEnd={handleTouchEnd}
                                type="button"
                                role="tab"
                                aria-selected={activeCategory === category.id}
                                aria-label={`Выбрать категорию: ${category.name}`}
                            >
                                <CategoryImage
                                    src={category.imageUrl}
                                    alt={category.name}
                                    className="category-image"
                                    loading="lazy"
                                    width={44}
                                    height={44}
                                />
                                <CategoryText className="category-text">{renderCategoryName(category.name)}</CategoryText>
                            </CategoryTab>
                        </CategoryTabWrapper>
                    </SwiperSlide>
                ))}
            </Swiper>
        </SwiperContainer>
    );
};

export default SwiperCategories;