export interface Product {
    id: number;
    name: string;
    price: number;
    images: string[];
    categoryId: number;
}

export const products: { [key: number]: Product[] } = {
    1: [
        { id: 1, name: 'Французская роза', price: 3490, images: ['/magnolia.png', '/magnolia2.png', '/magnolia3.png'], categoryId: 1 },
        { id: 2, name: 'Красная роза', price: 3490, images: ['/magnolia.png', '/magnolia2.png'], categoryId: 1 },
        { id: 3, name: 'Белая роза', price: 3490, images: ['/magnolia.png'], categoryId: 1 },
        { id: 4, name: 'Розовая роза', price: 3490, images: ['/magnolia.png'], categoryId: 1 },
        { id: 5, name: 'Желтая роза', price: 3490, images: ['/magnolia.png'], categoryId: 1 },
        { id: 6, name: 'Синяя роза', price: 3490, images: ['/magnolia.png'], categoryId: 1 },
        { id: 7, name: 'Фиолетовая роза', price: 3490, images: ['/magnolia.png'], categoryId: 1 },
    ],
    2: [
        { id: 8, name: 'Популярная роза', price: 3990, images: ['/magnolia.png'], categoryId: 2 },
        { id: 9, name: 'Трендовый букет', price: 4500, images: ['/magnolia.png'], categoryId: 2 },
    ],
    3: [
        { id: 10, name: 'Онлайн роза', price: 3290, images: ['/magnolia.png'], categoryId: 3 },
        { id: 11, name: 'Виртуальный букет', price: 3700, images: ['/magnolia.png'], categoryId: 3 },
    ],
    4: [
        { id: 12, name: 'Авторский букет 1', price: 5000, images: ['/magnolia.png'], categoryId: 4 },
        { id: 13, name: 'Авторский букет 2', price: 5200, images: ['/magnolia.png'], categoryId: 4 },
    ],
    5: [
        { id: 14, name: 'Розовый монобукет', price: 3000, images: ['/magnolia.png'], categoryId: 5 },
        { id: 15, name: 'Белый монобукет', price: 3100, images: ['/magnolia.png'], categoryId: 5 },
    ],
    6: [
        { id: 16, name: 'Композиция 1', price: 6000, images: ['/magnolia.png'], categoryId: 6 },
        { id: 17, name: 'Композиция 2', price: 6200, images: ['/magnolia.png'], categoryId: 6 },
    ],
    7: [
        { id: 18, name: 'Весенний букет', price: 3500, images: ['/magnolia.png'], categoryId: 7 },
        { id: 19, name: 'Осенний букет', price: 3600, images: ['/magnolia.png'], categoryId: 7 },
    ],
    8: [
        { id: 20, name: 'Сухоцветы 1', price: 2800, images: ['/magnolia.png'], categoryId: 8 },
        { id: 21, name: 'Сухоцветы 2', price: 2900, images: ['/magnolia.png'], categoryId: 8 },
    ],
    9: [
        { id: 22, name: 'Свадебный букет 1', price: 7000, images: ['/magnolia.png'], categoryId: 9 },
        { id: 23, name: 'Свадебный букет 2', price: 7200, images: ['/magnolia.png'], categoryId: 9 },
    ],
};