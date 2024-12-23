import React, { useEffect, useState } from "react";
import Categories from "../components/Categories";
import ContactForm from "../components/ContactForm";
import Pagination from "../components/Pagination";
import Product from "../components/Product";
import ProductModal from "../components/ProductModal";
import { CartItem, useCart } from "../context/CartContext";

interface Product {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
}

const ProductSection: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState<number | null>(
        null
    );
    const [products, setProducts] = useState<Product[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [modalProduct, setModalProduct] = useState<Product | null>(null);
    const productsPerPage = 40;
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

    // Уточняем количество колонок с помощью ResizeObserver API
    const [columns, setColumns] = useState(2);

    useEffect(() => {
        const updateColumns = () => {
            if (window.innerWidth >= 1024) setColumns(6);
            else if (window.innerWidth >= 768) setColumns(4);
            else if (window.innerWidth >= 640) setColumns(3);
            else setColumns(2);
        };

        updateColumns();
        window.addEventListener("resize", updateColumns);
        return () => window.removeEventListener("resize", updateColumns);
    }, []);

    const enhancedProducts = [];
    for (let i = 0; i < products.length; i++) {
        enhancedProducts.push(
            <Product
                key={products[i].id}
                product={products[i]}
                onAddToCart={handleAddToCart}
                onOpenModal={handleOpenModal}
            />
        );

        // Добавляем форму после каждых трех строк
        if ((i + 1) % (columns * 3) === 0) {
            enhancedProducts.push(
                <div key={`form-${i}`} className={`w-full`}>
                    <ContactForm />
                </div>
            );
        }
    }

    return (
        <section className="w-full p-4">
            <Categories
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
            />

            <div
                className={`grid gap-4 mb-6`}
                style={{
                    gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                }}
            >
                {products.map((product, index) => (
                    <React.Fragment key={product.id}>
                        <Product
                            product={product}
                            onAddToCart={handleAddToCart}
                            onOpenModal={handleOpenModal}
                        />
                        {/* Рендерим форму после каждых 3 строк */}
                        {(index + 1) % (columns * 3) === 0 && (
                            <div
                                key={`form-${index}`}
                                className="col-span-full -mx-4"
                            >
                                <ContactForm />
                            </div>
                        )}
                    </React.Fragment>
                ))}
            </div>

            <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(mockProducts.length / productsPerPage)}
                onPageChange={setCurrentPage}
            />
            <ProductModal product={modalProduct} onClose={handleCloseModal} />
        </section>
    );
};

export default ProductSection;
