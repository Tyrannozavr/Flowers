import React, { useEffect, useState } from "react";
import Categories from "../components/Categories";
import ContactForm from "../components/ContactForm";
import FloatingCartButton from "../components/FloatingCart";
import Pagination from "../components/Pagination";
import Product from "../components/Product";
import { mockProducts } from "../data/mockProducts";

export interface IProduct {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
    description: string;
    composition: string[];
}

const ProductSection: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState<number | null>(
        null
    );
    const [products, setProducts] = useState<IProduct[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 40;

    useEffect(() => {
        const fetchProducts = () => {
            const start = (currentPage - 1) * productsPerPage;
            const end = start + productsPerPage;
            setProducts(mockProducts.slice(start, end));
        };
        fetchProducts();
    }, [selectedCategory, currentPage]);

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
            <Product key={products[i].id} product={products[i]} />
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
                        <Product product={product} />
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
            <FloatingCartButton />
        </section>
    );
};

export default ProductSection;
