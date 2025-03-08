import { Alert } from "@mui/material";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthHeader from '../components/auth/AuthHeader';
import styles from './AuthPage.module.css';
import { instance as axios } from "../api/axios";

const AuthPage = () => {
  const [username, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    <div className={styles.pageContainer}>
      <AuthHeader />
      <div className={styles.authContainer}>
        <form className={styles.authForm} onSubmit={handleSubmit}>
          <h1>Вход в систему</h1>
          <div className={styles.inputGroup}>
            <input
              type="text"
              placeholder="Логин"
              value={username}
              onChange={(e) => setLogin(e.target.value)}
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
          {error && (
            <Alert severity="error" sx={{ mt: 2, mb: 2, width: "100%" }}>
                {error}
            </Alert>
          )}
          <button type="submit" className={styles.loginButton}>
            Войти
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
