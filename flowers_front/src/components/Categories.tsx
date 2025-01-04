import React, { useEffect, useState } from "react";
import { CategoryResponse, fetchCategories } from "../api/category";

interface CategoriesProps {
    selectedCategory: number | null;
    onSelectCategory: (categoryId: number) => void;
}

const Categories: React.FC<CategoriesProps> = ({
    selectedCategory,
    onSelectCategory,
}) => {
    const [categories, setCategories] = useState<CategoryResponse[]>([]);

    useEffect(() => {
        (async () => {
            const data = await fetchCategories();
            setCategories(data);
        })();
    }, []);

    return (
        <div className="flex overflow-x-auto px-4 py-2 h-40 mb-2 space-x-4 w-full items-center">
            {categories.map((category) => (
                <button
                    key={category.id}
                    onClick={() => onSelectCategory(category.id)}
                    className={`flex flex-col items-center`}
                >
                    <div
                        className={`relative flex items-center justify-center w-20 h-20 rounded-full border-2 transition-transform transform ${
                            selectedCategory === category.id
                                ? "border-accent scale-110"
                                : "border-gray-300"
                        } hover:scale-110`}
                    >
                        <img
                            src={category.imageUrl}
                            alt={category.name}
                            className="w-full h-full object-cover rounded-full"
                        />
                    </div>
                    <span
                        className="mt-2 text-sm text-center text-gray-700"
                        style={{
                            height: "1.5rem",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        {category.name}
                    </span>
                </button>
            ))}
        </div>
    );
};

export default Categories;
