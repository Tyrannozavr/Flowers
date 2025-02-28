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
import { useNavigate } from "react-router-dom";
import { createPay, checkPay } from "../api/profile";

const Profile: React.FC = () => {
    const navigate = useNavigate();
    const pay = createPay;
    const check = checkPay;

    return (
        <Box p={3}>
            {/* Back Button */}
            <Button
                variant="outlined"
                color="secondary"
                sx={{ mb: 3 }}
                onClick={() => navigate("/")}
            >
                Назад
            </Button>

            <Typography variant="h4" mb={3}>
                Профиль
            </Typography>

            <Button
                variant="outlined"
                color="secondary"
                sx={{ mb: 3 }}
                onClick={() => createPay()}
            >
                Оплатить 900 руб
            </Button>

            <Button
                variant="outlined"
                color="secondary"
                sx={{ mb: 3 }}
                onClick={() => checkPay()}
            >
                Проверить платеж
            </Button>

        </Box>
    );
};

export default Profile;
