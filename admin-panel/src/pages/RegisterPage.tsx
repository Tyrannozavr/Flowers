import { Alert } from "@mui/material";
import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthHeader from '../components/auth/AuthHeader';
import styles from './RegisterPage.module.css';
import { instance as axios } from "../api/axios";
import { AxiosError, isAxiosError } from "axios";

interface ErrorResponse {
  detail: string;
}

const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const validateEmail = (email: string) => {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return re.test(String(email).toLowerCase());
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (!validateEmail(email)) {
            setError("Пожалуйста, введите корректный email адрес");
            return;
        }

        if (password !== confirmPassword) {
            setError("Пароли не совпадают");
            return;
        }

        try {
            const response = await axios.post("/auth/register", {
                email,
                password,
            });

            if (response.status === 201) {
                setMessage("Вы успешно зарегистрировались. Ваш логин и пароль были отправлены на указанный email. Если вы не видите письмо, проверьте папку 'Спам'.");
                // Clear the form
                setEmail('');
                setPassword('');
                setConfirmPassword('');
            }
        } catch (err) {
            if (isAxiosError(err)) {
                const axiosError = err as AxiosError<ErrorResponse>;
                if (axiosError.response?.status === 400 && axiosError.response.data?.detail === "Email already registered") {
                    setError("Этот email уже зарегистрирован");
                } else {
                    setError("Ошибка при регистрации");
                }
            } else {
                setError("Произошла неизвестная ошибка");
            }
        }
    };

    return (
        <div className={styles.pageContainer}>
            <AuthHeader />
            <div className={styles.authContainer}>
                <form className={styles.authForm} onSubmit={handleSubmit}>
                    <h1>Регистрация</h1>
                    <div className={styles.inputGroup}>
                        <input
                            type="email"
                            placeholder="Электронная почта"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <input
                            type="password"
                            placeholder="Пароль"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <input
                            type="password"
                            placeholder="Повторите пароль"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && (
                        <Alert severity="error" sx={{ mt: 2, mb: 2, width: "100%" }}>
                            {error}
                        </Alert>
                    )}
                    {message && (
                        <Alert severity="success" sx={{ mt: 2, mb: 2, width: "100%" }}>
                            {message}
                        </Alert>
                    )}
                    <button type="submit" className={styles.loginButton}>
                        Зарегистрироваться
                    </button>
                    <div className={styles.loginLink}>
                        <span>Уже зарегистрированы?</span>
                        <Link to="/login">Вход</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;