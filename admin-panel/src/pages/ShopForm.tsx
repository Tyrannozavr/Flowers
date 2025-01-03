import { Box, Button, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { fetchShop, updateShop } from "../api/shops";

const ShopForm: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [subdomain, setSubdomain] = useState("");
    const [primaryColor, setPrimaryColor] = useState("#FFFFFF");
    const [logo, setLogo] = useState<File | null>(null);

    const { data: shop, isLoading } = useQuery(["shop", id], () => fetchShop(Number(id)), {
        enabled: !!id,
        onSuccess: (data) => {
            setSubdomain(data.subdomain);
            setPrimaryColor(data.primary_color || "#FFFFFF");
        },
    });

    const mutation = useMutation(
        (formData: FormData) => updateShop(Number(id), formData),
        {
            onSuccess: () => {
                queryClient.invalidateQueries("shops");
                navigate("/shops");
            },
        }
    );

    const handleSave = async () => {
        const formData = new FormData();
        formData.append("subdomain", subdomain);
        formData.append("primary_color", primaryColor);
        if (logo) {
            formData.append("logo", logo);
        }
        mutation.mutate(formData);
    };

    if (isLoading) return <Typography>Загрузка...</Typography>;

    return (
        <Box p={3}>
            <Typography variant="h4" mb={3}>
                Редактировать магазин
            </Typography>
            <Box display="flex" flexDirection="column" gap={2} maxWidth="400px">
                <TextField
                    label="Поддомен"
                    variant="outlined"
                    fullWidth
                    value={subdomain}
                    onChange={(e) => setSubdomain(e.target.value)}
                />
                <TextField
                    type="color"
                    label="Выберите цвет"
                    fullWidth
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                />
                <Button variant="contained" component="label">
                    Загрузить логотип
                    <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={(e) => setLogo(e.target.files?.[0] || null)}
                    />
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSave}
                    disabled={!subdomain || !primaryColor}
                >
                    Сохранить изменения
                </Button>
            </Box>
        </Box>
    );
};

export default ShopForm;
