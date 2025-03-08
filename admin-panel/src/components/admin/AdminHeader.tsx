import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminHeader.css';

interface AdminHeaderProps {
    onAuthAction: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({
    onAuthAction,
}) => {
    const navigate = useNavigate();

    const handleLogoClick = () => {
        navigate('/');
    };

    return (
        <header className="admin-header">
            <div className="admin-header-content">
                <div className="admin-logo" onClick={handleLogoClick}>
                    <span className="logo-text">Флаурум</span>
                </div>
                <button className="auth-button" onClick={onAuthAction}>
                    Выйти
                </button>
            </div>
        </header>
    );
};

export default AdminHeader;
