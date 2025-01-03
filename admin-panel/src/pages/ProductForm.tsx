import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { fetchCategories } from "../api/categories";
import { fetchProduct, updateProduct } from "../api/products";

const ProductForm: React.FC = () => {
    const { id, productId } = useParams();
    const isEdit = !!productId;
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    if (!id) return;

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: 0,
        ingredients: "",
        categoryId: "",
        image: null as File | null,
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};
        if (!formData.name) newErrors.name = "Название обязательно.";
        if (!formData.price) newErrors.price = "Цена обязательна.";
        if (!formData.categoryId)
            newErrors.categoryId = "Категория обязательна.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const { isLoading: isLoadingProduct } = useQuery(
        ["product", id, productId],
        () => fetchProduct(Number(id), Number(productId)),
        {
            enabled:
                isEdit && !queryClient.getQueryData(["product", id, productId]),
            onSuccess: (data) => {
                console.log("Полученные данные продукта:", data);
                setFormData({
                    name: data.name,
                    description: data.description || "",
                    price: parseFloat(data.price),
                    ingredients: data.ingredients || "",
                    categoryId: data.categoryId
                        ? data.categoryId.toString()
                        : "",
                    image: null,
                });
            },
        }
    );

    const { data: categories, isLoading: isLoadingCategories } = useQuery(
        "categories",
        fetchCategories,
        {
            onSuccess: () => {
                if (isEdit && formData.categoryId) {
                    // Убедимся, что категория существует
                    const categoryExists = categories.some(
                        (cat: any) => cat.id.toString() === formData.categoryId
                    );
                    if (!categoryExists) {
                        setFormData((prev) => ({
                            ...prev,
                            categoryId: "",
                        }));
                    }
                }
            },
        }
    );

    const mutation = useMutation(
        ({
            shopId,
            productId,
            formData,
        }: {
            shopId: number;
            productId: number;
            formData: FormData;
        }) => updateProduct(shopId, productId, formData),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(["products", id]);
                navigate(`/shops/${id}`);
            },
            onError: (error: any) => {
                const backendErrors = error.response?.data?.detail || [];
                const newErrors: { [key: string]: string } = {};
                backendErrors.forEach((err: any) => {
                    if (err.loc[1] === "name") newErrors.name = err.msg;
                    if (err.loc[1] === "price") newErrors.price = err.msg;
                    if (err.loc[1] === "category_id")
                        newErrors.categoryId = err.msg;
                });
                setErrors(newErrors);
            },
        }
    );

    const handleChange = (
        e:
            | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
            | SelectChangeEvent
    ) => {
        const { name, value, files } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: files
                ? files[0]
                : name === "price"
                ? parseFloat(value)
                : value,
        }));
    };

    const handleSubmit = () => {
        if (!validateForm()) return;

        let data: FormData | any;

        console.log(formData);

        if (formData.image) {
            // Используем FormData, если загружено изображение
            data = new FormData();
            data.append("name", formData.name);
            data.append("description", formData.description || "");
            data.append("price", formData.price.toString()); // Преобразуем в строку для FormData
            data.append("category_id", formData.categoryId);
            data.append("ingredients", formData.ingredients || "");
            data.append("image", formData.image); // Добавляем изображение
        } else {
            // Если изображение не загружено, отправляем JSON
            data = {
                name: formData.name || "",
                description: formData.description || "",
                price: formData.price.toString(),
                category_id: formData.categoryId,
                ingredients: formData.ingredients || "",
            };
        }

        mutation.mutate({
            shopId: Number(id),
            ...(isEdit && { productId: Number(productId) }),
            formData: data,
        });
    };

    if (isEdit && isLoadingProduct) return <Typography>Загрузка...</Typography>;
    if (isLoadingCategories)
        return <Typography>Загрузка категорий...</Typography>;

    return (
        <Box p={3} maxWidth="600px" mx="auto">
            <Button
                variant="outlined"
                onClick={() => navigate(-1)}
                sx={{ mb: 2 }}
            >
                Назад
            </Button>
            <Typography variant="h4" mb={3}>
                {isEdit ? "Редактировать букет" : "Создать букет"}
            </Typography>
            <Box display="flex" flexDirection="column" gap={2}>
                <TextField
                    label="Название"
                    name="name"
                    variant="outlined"
                    fullWidth
                    value={formData.name}
                    onChange={handleChange}
                    required
                    error={!!errors.name}
                    helperText={errors.name}
                />
                <TextField
                    label="Описание"
                    name="description"
                    variant="outlined"
                    multiline
                    rows={3}
                    fullWidth
                    value={formData.description}
                    onChange={handleChange}
                />
                <TextField
                    label="Цена"
                    name="price"
                    type="number"
                    variant="outlined"
                    fullWidth
                    value={formData.price}
                    onChange={handleChange}
                    required
                    error={!!errors.price}
                    helperText={errors.price}
                />

                <TextField
                    label="Состав"
                    name="ingredients"
                    variant="outlined"
                    fullWidth
                    value={formData.ingredients}
                    onChange={handleChange}
                />
                <FormControl fullWidth>
                    <InputLabel id="category-label">Категория</InputLabel>
                    <Select
                        labelId="category-label"
                        name="categoryId"
                        value={formData.categoryId || ""}
                        onChange={handleChange}
                        required
                        error={!!errors.categoryId}
                    >
                        {categories.map((category: any) => (
                            <MenuItem
                                key={category.id}
                                value={category.id.toString()}
                            >
                                {category.name}
                            </MenuItem>
                        ))}
                    </Select>

                    {errors.categoryId && (
                        <Typography color="error">
                            {errors.categoryId}
                        </Typography>
                    )}
                </FormControl>
                <Button
                    variant="contained"
                    component="label"
                    color="primary"
                    fullWidth
                >
                    Загрузить изображение
                    <input
                        type="file"
                        name="image"
                        hidden
                        accept="image/*"
                        onChange={handleChange}
                    />
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    disabled={
                        !formData.name ||
                        !formData.price ||
                        !formData.categoryId
                    }
                >
                    {isEdit ? "Сохранить изменения" : "Создать"}
                </Button>
            </Box>
        </Box>
    );
};

export default ProductForm;
