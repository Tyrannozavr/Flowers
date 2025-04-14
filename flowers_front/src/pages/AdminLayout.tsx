import React from 'react';
import AdminHeader from '../components/admin/AdminHeader';
import './AdminLayout.css';

const AdminLayout: React.FC = () => {
    return (
        <div className="admin-layout">
            <AdminHeader />
        </div>
    );
};

export default AdminLayout;
