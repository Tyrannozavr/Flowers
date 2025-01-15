import { Alert, Box, Button, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { instance as axios } from "../api/axios";

const Login: React.FC = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await axios.post("/auth/login", {
                username,
                password,
            });
            localStorage.setItem("token", response.data.access_token);
            navigate("/");
        } catch (err) {
            setError("Неверные данные для входа");
        }
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="100vh"
            bgcolor="#f5f5f5"
        >
            <Box
                p={4}
                bgcolor="white"
                boxShadow={3}
                borderRadius={2}
                width="300px"
                display="flex"
                flexDirection="column"
                alignItems="center"
            >
                <Typography variant="h4" mb={2}>
                    Вход
                </Typography>
                <TextField
                    label="Логин"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                    label="Пароль"
                    type="password"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {error && (
                    <Alert severity="error" sx={{ mt: 2, width: "100%" }}>
                        {error}
                    </Alert>
                )}
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleLogin}
                    sx={{ mt: 2 }}
                >
                    Войти
                </Button>
            </Box>
        </Box>
    );
};

export default Login;
