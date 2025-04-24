import React from 'react';
import { useNavigate } from 'react-router-dom'; // Импортируем useNavigate для перехода
import AdminHeader from '../components/admin/AdminHeader';
import Footer from '../components/footer/Footer';
import doneIcon from '../assets/done.svg'; // Импортируем иконку done.svg
import './ConfirmationPage.css';

const ConfirmationPage: React.FC = () => {
    const navigate = useNavigate(); // Инициализируем useNavigate

    const handleGoToHome = () => {
        navigate('/'); // Переход на главную страницу
    };

    return (
        <div className="confirmation-page">
            <AdminHeader />
            <main className="confirmation-content">
                <div className="confirmation-message">
                    <img src={doneIcon} alt="Галочка" className="confirmation-icon"/>
                    <h2 className="confirmation-title">Спасибо за заказ</h2>
                    <p className="confirmation-subtitle">
                        В ближайшее время с вами свяжутся для уточнения заказа
                    </p>
                    <button className="confirmation-home-button bg-accent" onClick={handleGoToHome}>
                        На главную
                    </button>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ConfirmationPage;