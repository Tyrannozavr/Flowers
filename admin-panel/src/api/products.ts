import { instance as axios } from "./axios";

export const fetchProducts = async () => {
    try {
        const response = await axios.get(`/shops/products`);
        return response.data;
    } catch (error: any) {
        if (error.response && error.response.status === 404) {
            console.log("Продукты не найдены, возвращаем пустой список.");
            return [];
        }
        throw error;
    }
};

export const fetchProduct = async (shopId: number, productId: number) => {
    const response = await axios.get(`/shops/${shopId}/products/${productId}`);
    return response.data;
};

export const createProduct = async ({
    name,
    price,
    category_id,
    availability,
    description,
    ingredients,
    images,
}: {
    name: string;
    price: string;
    category_id: number;
    availability?: string;
    description?: string;
    ingredients?: string;
    images?: File[];
}) => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('category_id', category_id.toString());
    
    if (availability) formData.append('availability', availability);
    if (description) formData.append('description', description);
    if (ingredients) formData.append('ingredients', ingredients);
    
    if (images && images.length > 0) {
        images.forEach((image) => {
            formData.append(`images`, image);
        });
    }

    const response = await axios.post(`/shops/products`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

export const updateProduct = async ({
    productId,
    name,
    price,
    category_id,
    availability,
    description,
    ingredients,
    images,
}: {
    productId: number;
    name: string;
    price: string;
    category_id: number;
    availability?: string;
    description?: string;
    ingredients?: string;
    images?: File[];
}) => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('category_id', category_id.toString());
    
    if (availability) formData.append('availability', availability);
    if (description) formData.append('description', description);
    if (ingredients) formData.append('ingredients', ingredients);
    
    if (images && images.length > 0) {
        images.forEach((image) => {
            formData.append(`images`, image);
        });
    }

    const response = await axios.put(
        `/shops/products/${productId}`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );
    return response.data;
};

export const deleteProduct = async (productId: number) => {
    const response = await axios.delete(
        `/shops/products/${productId}`
    );
    return response.data;
};

export const fetchAvailabilityOptions = async () => {
    const response = await axios.get(`/products/availability-options`);
    return response.data;
};

const handleDelete = async () => {
    if (editingProduct) {
        try {
            await deleteProduct(Number(editingProduct.id));
            const updatedProducts = await fetchProducts();
            setProducts(updatedProducts);
            setIsCreatingProduct(false);
            setNewProduct({inStock: true});
            setSelectedImages([]);
            setEditingProduct(null);
            setError(null);
        } catch (err) {
            console.error("Failed to delete product:", err);
            setError("Failed to delete product. Please try again.");
        }
    } else {
        // This is the existing behavior for canceling product creation
        setIsCreatingProduct(false);
        setNewProduct({inStock: true});
        setSelectedImages([]);
        setEditingProduct(null);
        setError(null);
    }
};