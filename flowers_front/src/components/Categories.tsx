import React from "react";

interface Category {
    id: number;
    name: string;
}

interface CategoriesProps {
    categories: Category[];
    selectedCategory: number | null;
    onSelectCategory: (categoryId: number) => void;
}

const Categories: React.FC<CategoriesProps> = ({
    categories,
    selectedCategory,
    onSelectCategory,
}) => {
    return (
        <div className="flex overflow-x-auto space-x-4 mb-6">
            {categories.map((category) => (
                <button
                    key={category.id}
                    onClick={() => onSelectCategory(category.id)}
                    className={`p-2 rounded-lg border ${
                        selectedCategory === category.id
                            ? "bg-accent text-white"
                            : "bg-white text-gray-700"
                    }`}
                >
                    {category.name}
                </button>
            ))}
        </div>
    );
};

export default Categories;
