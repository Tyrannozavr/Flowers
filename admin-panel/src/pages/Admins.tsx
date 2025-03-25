import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    TextField,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from "@mui/material";
import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import {
    activateAdmin,
    addTelegramId,
    createAdmin,
    deactivateAdmin,
    fetchAdmins,
    fetchCurrentAdmin,
    removeTelegramId,
    fetchPays,
    cancelPay,
} from "../api/admins";

const Admins: React.FC = () => {
    const queryClient = useQueryClient();

    const { data: currentUser, isLoading: isUserLoading } = useQuery(
        "currentUser",
        fetchCurrentAdmin,
        { retry: false }
    );

    type PayRecord = {
        [key: string]: any;
    };

    const {
        data: all_pays,
        isLoading: isAllPaysLoading,
        isError: isErrorPays,
    } = useQuery<PayRecord[]>("all_pays", fetchPays, {
        enabled: currentUser?.is_superadmin,
        retry: false
    });

    const {
        data: admins,
        isLoading: isAdminsLoading,
        isError,
    } = useQuery("admins", fetchAdmins, {
        enabled: currentUser?.is_superadmin,
        retry: false,
    });

    const cancelPayMutation = useMutation(cancelPay, {
        onSuccess: () => {
            queryClient.invalidateQueries("all_pays");
            toast.success("Платеж успешно отменен.");
        },
        onError: () => {
            toast.error("Ошибка при отмене платежа.");
        },
    });

    const handleCancelPay = (id: number) => {
        cancelPayMutation.mutate(id);
    };

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

    const status_to_refund = ['NEW', 'AUTHORIZED', 'AUTHORIZED', 'CONFIRMED', 'CONFIRMED', 'canceled_by_user'];
    const excludedKeys = ['last_pay_date', 'rebill_id', 'paid_until'];
    const filteredKeys = all_pays?.length ? Object.keys(all_pays[0]).filter((key) => !excludedKeys.includes(key)) : [];

    if (isUserLoading || (currentUser?.is_superadmin && (isAdminsLoading || isAllPaysLoading)))
        return <Typography>Загрузка...</Typography>;

    return (
        <Box p={3}>
            {/*<Button
                variant="outlined"
                color="secondary"
                sx={{ mb: 3 }}
                onClick={() => navigate("/")}
            >
                Назад
            </Button>*/}

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

                    <Typography variant="h6">Платежи</Typography>
                    {isErrorPays ? (
                        <Typography variant="body1" color="text.secondary">
                            Ошибка при загрузке платежей.
                        </Typography>
                    ) : (
                        <TableContainer component={Paper}>
                          <Table>
                            <TableHead>
                              <TableRow>
                                {filteredKeys.map((key) => (
                                    <TableCell key={key}>{key}</TableCell>
                                ))}
                                <TableCell>Действия</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {all_pays?.map((row, index: number) => (
                                <TableRow key={index}>
                                  {filteredKeys.map((key) => (
                                    <TableCell key={key}>
                                      {row[key] !== null ? row[key].toString() : "—"}
                                    </TableCell>
                                  ))}
                                      <TableCell>
                                        {status_to_refund.includes(row.status) && (
                                            <Button
                                                variant="contained"
                                                color="error"
                                                size="small"
                                                onClick={() => handleCancelPay(row.payment_id)}
                                                disabled={cancelPayMutation.isLoading}
                                            >
                                                Отменить
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
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
