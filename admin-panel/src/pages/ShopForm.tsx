import { Box, Button, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { createShop, fetchShop, updateShop } from "../api/shops";

const ShopForm: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const isEdit = !!id;
    const [subdomain, setSubdomain] = useState("");
    const [primaryColor, setPrimaryColor] = useState("#FFFFFF");
    const [logo, setLogo] = useState<File | null>(null);
    const [phone, setPhone] = useState("");
    const [inn, setInn] = useState("");

    useQuery(["shop", id], () => fetchShop(Number(id)), {
        retry: false,
        enabled: isEdit,
        onSuccess: (data) => {
            setSubdomain(data.subdomain);
            setPrimaryColor(data.primary_color || "#FFFFFF");
            setPhone(data.phone || "");
            setInn(data.inn || "");
        },
    });

    const createMutation = useMutation(
        (formData: FormData) => createShop(formData),
        {
            onSuccess: () => {
                queryClient.invalidateQueries("shops");
                navigate("/shops");
            },
            onError: (error: any) => {
                toast.error(
                    `Не удалось создать магазин: ${error.response.data.detail}`
                );
            },
        }
    );

    const updateMutation = useMutation(
        ({ formData, shopId }: { formData: FormData; shopId: number }) =>
            updateShop(shopId, formData),
        {
            onSuccess: () => {
                queryClient.invalidateQueries("shops");
                navigate("/shops");
            },
            onError: (error: any) => {
                toast.error(
                    `Не удалось обновить магазин: ${error.response.data.detail}`
                );
            },
        }
    );

    const handleSave = async () => {
        const formData = new FormData();
        formData.append("subdomain", subdomain);
        formData.append("color", primaryColor);
        formData.append("inn", inn);
        formData.append("phone", phone);

        if (logo) {
            formData.append("logo", logo);
        }

        if (isEdit) {
            updateMutation.mutate({ formData, shopId: Number(id) });
        } else {
            createMutation.mutate(formData);
        }
    };

    return (
        <Box p={3}>
            <Typography variant="h4" mb={3}>
                {isEdit ? "Редактировать магазин" : "Создать магазин"}
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
                <TextField
                    label="ИНН"
                    variant="outlined"
                    fullWidth
                    value={inn}
                    onChange={(e) => setInn(e.target.value)}
                />
                <TextField
                    label="Номер телефона для звонка"
                    variant="outlined"
                    fullWidth
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
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
                    disabled={!subdomain || !primaryColor || !inn || !phone}
                >
                    {isEdit ? "Сохранить изменения" : "Создать"}
                </Button>
            </Box>
        </Box>
    );
};

export default ShopForm;
