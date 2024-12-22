import React from "react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
}) => {
    return (
        <div className="flex justify-center mt-6 space-x-4">
            <button
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                className="px-4 py-2 bg-gray-300 rounded-lg disabled:opacity-50"
            >
                Назад
            </button>
            <button
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                className="px-4 py-2 bg-gray-300 rounded-lg disabled:opacity-50"
            >
                Вперед
            </button>
        </div>
    );
};

export default Pagination;
