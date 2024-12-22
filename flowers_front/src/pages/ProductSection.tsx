import React, { useEffect, useState } from "react";
import Categories from "../components/Categories";
import Pagination from "../components/Pagination";
import Product from "../components/Product";
import ProductModal from "../components/ProductModal";
import { CartItem, useCart } from "../context/CartContext";

interface Category {
    id: number;
    name: string;
}

interface Product {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
}

const ProductSection: React.FC = () => {
    const [categories] = useState<Category[]>([
        { id: 1, name: "Популярное" },
        { id: 2, name: "Витрина онлайн" },
        { id: 3, name: "Монобукеты" },
        { id: 4, name: "Композиции" },
        { id: 5, name: "Сезонные" },
    ]);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(
        null
    );
    const [products, setProducts] = useState<Product[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [modalProduct, setModalProduct] = useState<Product | null>(null);
    const productsPerPage = 20;
    const { addToCart } = useCart();

    const mockProducts: Product[] = [
        {
            id: 1,
            name: "Роза",
            price: 5000,
            imageUrl:
                "https://cdn.posiflora.online/1891/images/z/975d214655752d3f17f0118321ca5eb17582366e_shop.jpg",
        },
        {
            id: 2,
            name: "Тюльпан",
            price: 300,
            imageUrl:
                "https://cdn.posiflora.online/1891/images/y/190816fecbeb22ce924a7d14f1304cdf4c513056_shop.jpg",
        },
        {
            id: 3,
            name: "Розы",
            price: 2300,
            imageUrl:
                "https://cdn.posiflora.online/1891/images/a/add443f12c81a28b63fdd933f48f3cb6d230ec23_shop.jpg",
        },
        {
            id: 4,
            name: "Роза",
            price: 5000,
            imageUrl:
                "https://cdn.posiflora.online/1891/images/z/975d214655752d3f17f0118321ca5eb17582366e_shop.jpg",
        },
        {
            id: 5,
            name: "Тюльпан",
            price: 300,
            imageUrl:
                "https://cdn.posiflora.online/1891/images/y/190816fecbeb22ce924a7d14f1304cdf4c513056_shop.jpg",
        },
        {
            id: 6,
            name: "Розы",
            price: 2300,
            imageUrl:
                "https://cdn.posiflora.online/1891/images/a/add443f12c81a28b63fdd933f48f3cb6d230ec23_shop.jpg",
        },
        {
            id: 7,
            name: "Роза",
            price: 5000,
            imageUrl:
                "https://cdn.posiflora.online/1891/images/z/975d214655752d3f17f0118321ca5eb17582366e_shop.jpg",
        },
        {
            id: 8,
            name: "Тюльпан",
            price: 300,
            imageUrl:
                "https://cdn.posiflora.online/1891/images/y/190816fecbeb22ce924a7d14f1304cdf4c513056_shop.jpg",
        },
        {
            id: 9,
            name: "Розы",
            price: 2300,
            imageUrl:
                "https://cdn.posiflora.online/1891/images/a/add443f12c81a28b63fdd933f48f3cb6d230ec23_shop.jpg",
        },
        {
            id: 1,
            name: "Роза",
            price: 5000,
            imageUrl:
                "https://cdn.posiflora.online/1891/images/z/975d214655752d3f17f0118321ca5eb17582366e_shop.jpg",
        },
        {
            id: 2,
            name: "Тюльпан",
            price: 300,
            imageUrl:
                "https://cdn.posiflora.online/1891/images/y/190816fecbeb22ce924a7d14f1304cdf4c513056_shop.jpg",
        },
        {
            id: 3,
            name: "Розы",
            price: 2300,
            imageUrl:
                "https://cdn.posiflora.online/1891/images/a/add443f12c81a28b63fdd933f48f3cb6d230ec23_shop.jpg",
        },
        {
            id: 4,
            name: "Роза",
            price: 5000,
            imageUrl:
                "https://cdn.posiflora.online/1891/images/z/975d214655752d3f17f0118321ca5eb17582366e_shop.jpg",
        },
        {
            id: 5,
            name: "Тюльпан",
            price: 300,
            imageUrl:
                "https://cdn.posiflora.online/1891/images/y/190816fecbeb22ce924a7d14f1304cdf4c513056_shop.jpg",
        },
        {
            id: 6,
            name: "Розы",
            price: 2300,
            imageUrl:
                "https://cdn.posiflora.online/1891/images/a/add443f12c81a28b63fdd933f48f3cb6d230ec23_shop.jpg",
        },
        {
            id: 7,
            name: "Роза",
            price: 5000,
            imageUrl:
                "https://cdn.posiflora.online/1891/images/z/975d214655752d3f17f0118321ca5eb17582366e_shop.jpg",
        },
        {
            id: 8,
            name: "Тюльпан",
            price: 300,
            imageUrl:
                "https://cdn.posiflora.online/1891/images/y/190816fecbeb22ce924a7d14f1304cdf4c513056_shop.jpg",
        },
        {
            id: 9,
            name: "Розы",
            price: 2300,
            imageUrl:
                "https://cdn.posiflora.online/1891/images/a/add443f12c81a28b63fdd933f48f3cb6d230ec23_shop.jpg",
        },
    ];

    useEffect(() => {
        const fetchProducts = () => {
            const start = (currentPage - 1) * productsPerPage;
            const end = start + productsPerPage;
            setProducts(mockProducts.slice(start, end));
        };
        fetchProducts();
    }, [selectedCategory, currentPage]);

    const handleAddToCart = (item: CartItem) => {
        if (item) {
            addToCart(item);
        }
    };

    const handleOpenModal = (productId: number) => {
        const product = mockProducts.find((p) => p.id === productId);
        setModalProduct(product || null);
    };

    const handleCloseModal = () => setModalProduct(null);

    return (
        <section className="w-full p-4">
            <Categories
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
            />

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {products.map((product) => (
                    <Product
                        key={product.id}
                        product={product}
                        onAddToCart={handleAddToCart}
                        onOpenModal={handleOpenModal}
                    />
                ))}
            </div>

            <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(mockProducts.length / productsPerPage)}
                onPageChange={setCurrentPage}
            />
            <ProductModal
                product={modalProduct}
                onClose={handleCloseModal}
            />
        </section>
    );
};

export default ProductSection;
