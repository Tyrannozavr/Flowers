import React, { useEffect, useState } from "react";
import { IProduct, fetchProducts } from "../api/product";
import Categories from "../components/category/Categories.tsx";
import ContactForm from "../components/ContactForm";
import FloatingCartButton from "../components/FloatingCart";
import Pagination from "../components/Pagination";
import Product from "../components/Product";

const ProductSection: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState<number | null>(
        null
    );
    const [products, setProducts] = useState<IProduct[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [columns, setColumns] = useState(2);
    const perPage = 30;

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

        if ((i + 1) % (columns * 3) === 0) {
            enhancedProducts.push(
                <div key={`form-${i}`} className={`w-full`}>
                    <ContactForm />
                </div>
            );
        }
    }

    const getProducts = async (category: number | null) => {
        try {
            const data = await fetchProducts(currentPage, perPage, category);

            setProducts(data.products);
        } catch (error) {
            setProducts([]);
        }
    };

    const onSelectCategory = (category: number | null) => {
        setSelectedCategory((prev) => {
            const newCategory = prev === category ? null : category;

            getProducts(newCategory);
            return newCategory;
        });
    };

    useEffect(() => {
        getProducts(selectedCategory);
    }, []);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [currentPage]);

    return (
        <section className="w-full p-4">
            <Categories
                selectedCategory={selectedCategory}
                onSelectCategory={onSelectCategory}
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
                {((products.length < 18 && columns === 6) ||
                    (products.length < 12 && columns === 4) ||
                    (products.length < 9 && columns === 3) ||
                    (products.length < 6 && columns === 2)) && (
                    <div className="col-span-full -mx-4">
                        <ContactForm />
                    </div>
                )}
            </div>

            <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(products.length / perPage)}
                onPageChange={setCurrentPage}
            />
            <FloatingCartButton />
        </section>
    );
};

export default ProductSection;
