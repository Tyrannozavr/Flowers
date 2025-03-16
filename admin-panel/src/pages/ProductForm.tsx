import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    TextField,
    Typography,
} from "@mui/material";
import React, {useEffect, useState} from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { fetchCategories } from "../api/categories";
import {createProduct, fetchAvailabilityOptions, fetchProduct, updateProduct} from "../api/products";

const ProductForm: React.FC = () => {
    const { id, productId } = useParams();
    const isEdit = !!productId;
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    if (!id) return null;

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: 0,
        ingredients: "",
        categoryId: "",
        availability: "",
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

    useQuery(
        ["product", id, productId],
        () => fetchProduct(Number(id), Number(productId)),
        {
            enabled: isEdit,
            onSuccess: (data) => {
                setFormData({
                    name: data.name,
                    description: data.description || "",
                    price: parseFloat(data.price),
                    ingredients: data.ingredients || "",
                    categoryId: data.categoryId
                        ? data.categoryId.toString()
                        : "",
                    availability: data.availability,
                    image: null,
                });
            },
        }
    );

    const { data: categories, isLoading: isLoadingCategories } = useQuery(
        "categories",
        fetchCategories
    );
    type availabilityOption = {
        key: string;
        value: string;
    }
    const { data: availabilityOptions, isLoading: isLoadingOptions } = useQuery(
        "availabilityOptions",
        fetchAvailabilityOptions
    );

    useEffect(() => {
        if (availabilityOptions && availabilityOptions.length > 0 && !formData.availability) {
            setFormData((prevFormData) => ({
                ...prevFormData,
                availability: availabilityOptions[0].key,
            }));
        }
    }, [availabilityOptions, formData.availability]);
    const createMutation = useMutation(
        ({ shopId, formData }: { shopId: number; formData: FormData }) =>
            createProduct({ shopId, formData }),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(["products", id]);
                navigate(`/shops/${id}`);
            },
        }
    );

    const updateMutation = useMutation(
        ({
            shopId,
            productId,
            formData,
        }: {
            shopId: number;
            productId: number;
            formData: FormData;
        }) => updateProduct({ shopId, productId, formData }),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(["products", id]);
                navigate(`/shops/${id}`);
            },
        }
    );

    const handleChange = (
        e:
            | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
            | SelectChangeEvent<string>
    ) => {
        const { name, value, files } = e.target as HTMLInputElement;
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

        const data = new FormData();
        data.append("name", formData.name);
        data.append("description", formData.description || "");
        data.append("price", formData.price.toString());
        data.append("category_id", formData.categoryId);
        data.append("ingredients", formData.ingredients || "");
        data.append("availability", formData.availability || "");
        if (formData.image) {
            data.append("image", formData.image);
        }

        if (isEdit) {
            updateMutation.mutate({
                shopId: Number(id),
                productId: Number(productId),
                formData: data,
            });
        } else {
            createMutation.mutate({
                shopId: Number(id),
                formData: data,
            });
        }
    };

    if (isEdit && !categories) return <Typography>Загрузка...</Typography>;
    if (isLoadingCategories)
        return <Typography>Загрузка категорий...</Typography>;
    if (isLoadingOptions)
        return <Typography>Загрузка опций...</Typography>;
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
                        value={formData.categoryId}
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
                <FormControl fullWidth>
                    <InputLabel id="availability-label">Товар в наличии</InputLabel>
                    <Select
                        labelId="availability-label"
                        name="availability"
                        value={formData.availability}
                        onChange={handleChange}
                        required
                        sx={{
                            // Убираем стрелочку
                            "& .MuiSelect-icon": {
                                display: "none", // Скрываем иконку
                            },
                            // Заполняем фон цветом primary
                            backgroundColor: "primary.main", // Используем primary цвет из темы
                            color: "primary.contrastText", // Цвет текста, чтобы был контрастным
                            "&:hover": {
                                backgroundColor: "primary.dark", // Темнее при наведении
                            },
                        }}
                    >
                        {availabilityOptions.map((variant: availabilityOption) => (
                            <MenuItem
                                key={variant.key}
                                value={variant.key}
                            >
                                {variant.value}
                            </MenuItem>
                        ))}
                    </Select>
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
