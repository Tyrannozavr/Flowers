import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

const Main: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");

        navigate("/auth");
    };

    return (
        <Box p={3}>
            {/* Logout Button */}
            <Button
                variant="contained"
                color="error"
                sx={{ mb: 3 }}
                onClick={handleLogout}
            >
                Выйти
            </Button>

            {/* Grid of Cards */}
            <Box
                display="grid"
                gridTemplateColumns="repeat(auto-fill, minmax(300px, 1fr))"
                gap={3}
            >
                <Card
                    sx={{ cursor: "pointer" }}
                    onClick={() => navigate("/shops")}
                >
                    <CardContent>
                        <Typography variant="h5">Магазины</Typography>
                        <Typography variant="body2" color="text.secondary">
                            Управление магазинами
                        </Typography>
                    </CardContent>
                </Card>
                <Card
                    sx={{ cursor: "pointer" }}
                    onClick={() => navigate("/admins")}
                >
                    <CardContent>
                        <Typography variant="h5">Администраторы</Typography>
                        <Typography variant="body2" color="text.secondary">
                            Управление администраторами
                        </Typography>
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
};

export default Main;
