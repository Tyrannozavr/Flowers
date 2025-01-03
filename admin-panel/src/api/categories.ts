import axios from "./axios";

export const fetchCategories = async () => {
    const response = await axios.get(`/categories`);
    return response.data;
};
