import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    TextField,
    Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
    activateAdmin,
    addTelegramId,
    createAdmin,
    deactivateAdmin,
    fetchAdmins,
    fetchCurrentAdmin,
    removeTelegramId,
} from "../api/admins";

const Admins: React.FC = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: currentUser, isLoading: isUserLoading } = useQuery(
        "currentUser",
        fetchCurrentAdmin,
        { retry: false }
    );

    const {
        data: admins,
        isLoading: isAdminsLoading,
        isError,
    } = useQuery("admins", fetchAdmins, {
        enabled: currentUser?.is_superadmin, // Only fetch if superadmin
    });

    const deactivateMutation = useMutation(deactivateAdmin, {
        onSuccess: () => {
            queryClient.invalidateQueries("admins");
            toast.success("Администратор деактивирован.");
        },
        onError: () => {
            toast.error("Ошибка при деактивации администратора.");
        },
    });

    const activateMutation = useMutation(activateAdmin, {
        onSuccess: () => {
            queryClient.invalidateQueries("admins");
            toast.success("Администратор активирован.");
        },
        onError: () => {
            toast.error("Ошибка при активации администратора.");
        },
    });

    const createAdminMutation = useMutation(createAdmin, {
        onSuccess: () => {
            queryClient.invalidateQueries("admins");
            toast.success("Администратор успешно создан.");
        },
        onError: () => {
            toast.error("Ошибка при создании администратора.");
        },
    });

    const addTelegramIdMutation = useMutation(addTelegramId, {
        onSuccess: () => {
            queryClient.invalidateQueries("currentUser");
            toast.success("Telegram ID успешно добавлен.");
        },
        onError: () => {
            toast.error("Ошибка при добавлении Telegram ID.");
        },
    });

    const removeTelegramIdMutation = useMutation(removeTelegramId, {
        onSuccess: () => {
            queryClient.invalidateQueries("currentUser");
            toast.success("Telegram ID успешно удалён.");
        },
        onError: () => {
            toast.error("Ошибка при удалении Telegram ID.");
        },
    });

    const [newAdmin, setNewAdmin] = useState({ username: "", password: "" });
    const [newTelegramId, setNewTelegramId] = useState("");

    const handleCreateAdmin = () => {
        if (!newAdmin.username || !newAdmin.password) {
            toast.error("Введите имя пользователя и пароль.");
            return;
        }
        createAdminMutation.mutate(newAdmin);
        setNewAdmin({ username: "", password: "" });
    };

    const handleAddTelegramId = () => {
        if (!newTelegramId.trim()) {
            toast.error("Введите Telegram ID.");
            return;
        }
        addTelegramIdMutation.mutate(newTelegramId);
        setNewTelegramId("");
    };

    const handleRemoveTelegramId = (telegramId: string) => {
        removeTelegramIdMutation.mutate(telegramId);
    };

    if (isUserLoading || (currentUser?.is_superadmin && isAdminsLoading))
        return <Typography>Загрузка...</Typography>;

    return (
        <Box p={3}>
            <Button
                variant="outlined"
                color="secondary"
                sx={{ mb: 3 }}
                onClick={() => navigate("/")}
            >
                Назад
            </Button>

            <Typography variant="h4" mb={3}>
                {currentUser?.is_superadmin ? "Администраторы" : "Мой профиль"}
            </Typography>

            {/* Superadmin Section */}
            {currentUser?.is_superadmin && (
                <>
                    <Box mb={3}>
                        <Typography variant="h6">
                            Создать администратора
                        </Typography>
                        <Box display="flex" gap={2} mt={2}>
                            <TextField
                                label="Имя пользователя"
                                variant="outlined"
                                value={newAdmin.username}
                                onChange={(e) =>
                                    setNewAdmin({
                                        ...newAdmin,
                                        username: e.target.value,
                                    })
                                }
                            />
                            <TextField
                                label="Пароль"
                                type="password"
                                variant="outlined"
                                value={newAdmin.password}
                                onChange={(e) =>
                                    setNewAdmin({
                                        ...newAdmin,
                                        password: e.target.value,
                                    })
                                }
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleCreateAdmin}
                            >
                                Создать
                            </Button>
                        </Box>
                    </Box>

                    <Typography variant="h6">Администраторы</Typography>
                    {isError ? (
                        <Typography variant="body1" color="text.secondary">
                            Ошибка при загрузке администраторов.
                        </Typography>
                    ) : (
                        <Box
                            display="grid"
                            gridTemplateColumns="repeat(auto-fill, minmax(300px, 1fr))"
                            gap={3}
                        >
                            {admins.map((admin: any) => (
                                <Card key={admin.id}>
                                    <CardContent>
                                        <Typography variant="h6">
                                            {admin.username}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            {admin.is_removed
                                                ? "Деактивирован"
                                                : "Активен"}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button
                                            size="small"
                                            color="error"
                                            onClick={() =>
                                                admin.is_removed
                                                    ? activateMutation.mutate(
                                                          admin.id
                                                      )
                                                    : deactivateMutation.mutate(
                                                          admin.id
                                                      )
                                            }
                                        >
                                            {admin.is_removed
                                                ? "Активировать"
                                                : "Деактивировать"}
                                        </Button>
                                    </CardActions>
                                </Card>
                            ))}
                        </Box>
                    )}
                </>
            )}

            {/* Telegram ID Section (Visible to Everyone) */}
            <Box mt={3}>
                <Typography variant="h6">
                    Telegram IDs (для отправки сообщений ботом)
                </Typography>
                {currentUser?.telegram_ids.map((id: string) => (
                    <Box
                        key={id}
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        mt={1}
                    >
                        <Typography>{id}</Typography>
                        <Button
                            size="small"
                            color="error"
                            onClick={() => handleRemoveTelegramId(id)}
                        >
                            Удалить
                        </Button>
                    </Box>
                ))}
                <Box display="flex" gap={2} mt={2}>
                    <TextField
                        label="Новый Telegram ID"
                        variant="outlined"
                        value={newTelegramId}
                        onChange={(e) => setNewTelegramId(e.target.value)}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAddTelegramId}
                    >
                        Добавить
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default Admins;
