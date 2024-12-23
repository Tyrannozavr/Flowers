import React from "react";

interface Category {
    id: number;
    name: string;
    imageUrl: string;
}

interface CategoriesProps {
    selectedCategory: number | null;
    onSelectCategory: (categoryId: number) => void;
}

const Categories: React.FC<CategoriesProps> = ({
    selectedCategory,
    onSelectCategory,
}) => {
    const categories = [
        {
            id: 1,
            name: "Популярное",
            imageUrl:
                "https://static.tildacdn.com/tild6466-3038-4738-b033-326535343936/C7FB51BD-ED83-4206-9.jpeg",
        },
        {
            id: 2,
            name: "Витрина онлайн",
            imageUrl:
                "https://static.tildacdn.com/tild6566-3166-4262-b730-623031616465/IMG_0056.jpeg",
        },
        {
            id: 3,
            name: "Новый год",
            imageUrl:
                "https://static.tildacdn.com/tild3962-6633-4333-b533-656130633839/71424204_1.jpg",
        },
        {
            id: 4,
            name: "Авторские букеты",
            imageUrl:
                "https://static.tildacdn.com/tild6563-3365-4265-a635-663366396261/IMG_2254.jpg",
        },
        {
            id: 5,
            name: "Монобукеты",
            imageUrl:
                "https://static.tildacdn.com/tild6535-3538-4636-a364-323562343364/IMG_2198.jpeg",
        },
        {
            id: 6,
            name: "Композиции",
            imageUrl:
                "https://static.tildacdn.com/tild3032-3933-4431-b638-623462633139/IMG_6443.jpeg",
        },
        {
            id: 7,
            name: "Сезонные",
            imageUrl:
                "https://static.tildacdn.com/tild3261-3032-4030-b737-646132303163/IMG_6214.jpeg",
        },
        {
            id: 8,
            name: "Сухоцветы",
            imageUrl:
                "https://static.tildacdn.com/tild6231-3638-4432-a237-393231616133/telegram-cloud-docum.jpg",
        },
        {
            id: 9,
            name: "Свадебный букет",
            imageUrl:
                "https://static.tildacdn.com/tild6661-3239-4361-b866-633339346362/photo-output_7.jpeg",
        },
        {
            id: 10,
            name: "Декор",
            imageUrl:
                "https://static.tildacdn.com/tild3862-3036-4630-a430-666631343961/IMG_2207.JPG",
        },
        {
            id: 11,
            name: "Аксессуары",
            imageUrl:
                "https://static.tildacdn.com/tild3534-3934-4266-b539-636563316235/2023-10-05_123028.jpg",
        },
    ];

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
