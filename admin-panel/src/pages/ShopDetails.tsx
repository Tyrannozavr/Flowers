import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Typography,
} from "@mui/material";
import React from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { deleteProduct, fetchProducts } from "../api/products";

const ShopDetails: React.FC = () => {
    const { id } = useParams();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { data: products, isLoading: isLoadingProducts } = useQuery(
        ["products", id],
        () => fetchProducts(),
        {
            retry: false,
            onError: (error) => {
                console.error("Ошибка при загрузке продуктов:", error);
            },
        }
    );

    const deleteMutation = useMutation(
        ({ shopId, productId }: { shopId: number; productId: number }) =>
            deleteProduct(shopId, productId),
        {
            onSuccess: () => {
                console.log("Продукт удален, обновляем список...");
                queryClient.invalidateQueries(["products", id]);
                console.log("Кэш обновлен для магазина:", id);
            },
        }
    );

    const handleDeleteProduct = (productId: number) => {
        console.log("Удаляем продукт с ID:", productId);
        deleteMutation.mutate({ shopId: Number(id), productId });
    };

    const handleAddProduct = () => {
        navigate(`/shops/${id}/products/new`);
    };

    const handleEditProduct = (productId: number) => {
        navigate(`/shops/${id}/products/${productId}`);
    };

    if (isLoadingProducts) return <Typography>Загрузка...</Typography>;

    return (
        <Box p={3}>
            <Button
                variant="outlined"
                onClick={() => navigate("/shops")}
                sx={{ mb: 3 }}
            >
                Назад
            </Button>
            <Typography variant="h4" mb={3}>
                Продукты магазина
            </Typography>

            {products && products.length > 0 ? (
                <Box
                    display="grid"
                    gridTemplateColumns="repeat(auto-fill, minmax(300px, 1fr))"
                    gap={3}
                    mt={2}
                >
                    {products.map((product: any) => (
                        <Card key={product.id}>
                            {product.photo_url && (
                                <CardMedia
                                    component="img"
                                    image={product.photo_url}
                                    alt={product.name}
                                />
                            )}
                            <CardContent>
                                <Typography variant="h6">
                                    {product.name}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    {product.description || "Без описания"}
                                </Typography>
                                <Typography variant="body1">
                                    Цена: {product.price} руб.
                                </Typography>
                                <Typography variant="body2">
                                    Состав: {product.ingredients}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button
                                    size="small"
                                    onClick={() =>
                                        handleEditProduct(product.id)
                                    }
                                >
                                    Редактировать
                                </Button>
                                <Button
                                    size="small"
                                    color="error"
                                    onClick={() =>
                                        handleDeleteProduct(product.id)
                                    }
                                >
                                    Удалить
                                </Button>
                            </CardActions>
                        </Card>
                    ))}
                </Box>
            ) : (
                <Typography mt={2}>Пока нет товаров</Typography>
            )}

            <Button
                variant="contained"
                color="primary"
                sx={{ mt: 3 }}
                onClick={handleAddProduct}
            >
                Добавить букет
            </Button>
        </Box>
    );
};

export default ShopDetails;
