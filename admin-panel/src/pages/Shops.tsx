import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { deleteShop, fetchShops } from "../api/shops";

const Shops: React.FC = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { data: shops, isLoading } = useQuery("shops", fetchShops);


    const deleteMutation = useMutation(deleteShop, {
        onSuccess: () => queryClient.invalidateQueries("shops"),
    });

    if (isLoading) return <Typography>Загрузка...</Typography>;

    return (
        <Box p={3}>
            <Typography variant="h4" mb={3}>
                Магазины
            </Typography>
            <Box
                display="grid"
                gridTemplateColumns="repeat(auto-fill, minmax(300px, 1fr))"
                gap={3}
            >
                {shops.map((shop: any) => (
                    <Card key={shop.id}>
                        {shop.logo_url && (
                            <CardMedia
                                component="img"
                                height="140"
                                image={shop.logo_url}
                                alt={`${shop.subdomain} logo`}
                            />
                        )}
                        <CardContent>
                            <Typography variant="h6">
                                {shop.subdomain}
                            </Typography>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                display="flex"
                                alignItems="center"
                            >
                                Цвет: {shop.primary_color}
                                <Box
                                    width={16}
                                    height={16}
                                    ml={1}
                                    bgcolor={shop.primary_color}
                                    border="1px solid #000"
                                    display="inline-block"
                                />
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button
                                size="small"
                                onClick={() => navigate(`/shops/${shop.id}`)}
                            >
                                Открыть
                            </Button>
                            <Button
                                size="small"
                                color="primary"
                                onClick={() =>
                                    navigate(`/shops/${shop.id}/edit`)
                                }
                            >
                                Изменить
                            </Button>
                            <Button
                                size="small"
                                color="error"
                                onClick={() => deleteMutation.mutate(shop.id)}
                            >
                                Удалить
                            </Button>
                        </CardActions>
                    </Card>
                ))}
            </Box>
            <Button
                variant="contained"
                color="primary"
                sx={{ mt: 3 }}
                onClick={() => navigate("/shops/new")}
            >
                Добавить магазин
            </Button>
        </Box>
    );
};

export default Shops;
