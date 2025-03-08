import React from 'react';
import '../admin/AdminHeader.css';

const AuthHeader: React.FC = () => {
    return (
        <header className="admin-header">
            <div className="admin-header-content">
                <div className="admin-logo">
                    <span className="logo-text">Флаурум</span>
                </div>
            </div>
        </header>
    );
};

export default AuthHeader;
