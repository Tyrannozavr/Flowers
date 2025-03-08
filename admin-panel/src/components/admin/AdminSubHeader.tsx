import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './AdminSubHeader.css';
import { useAuth } from '../../context/AuthContext';

export type AdminSection = 'shops' | 'admins' | 'profile';

interface AdminSubHeaderProps {
    activeSection: AdminSection;
    onSectionChange: (section: AdminSection) => void;
}

const AdminSubHeader: React.FC<AdminSubHeaderProps> = ({
    activeSection,
    onSectionChange,
}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
    const sectionRefs = useRef<{ [key in AdminSection]?: HTMLDivElement }>({});

    const { isSuperadmin } = useAuth();

    const sections: { id: AdminSection; label: string; path: string }[] = [
        { id: 'shops', label: 'Магазины', path: '/shops' },
        { id: 'admins', label: isSuperadmin?'Администраторы':'Мой профиль', path: '/admins' },
//         { id: 'assortment', label: 'Ассортимент', path: '/assortment' },
        { id: 'profile', label: 'Профиль', path: '/profile' },
    ];

    useEffect(() => {
        // Update active section based on current route
        const currentPath = location.pathname.substring(1).split('/')[0] || sections[0].id;
        const section = sections.find(s => s.path.substring(1) === currentPath)?.id || sections[0].id;
        onSectionChange(section);
    }, [location.pathname]);

    useEffect(() => {
        const activeElement = sectionRefs.current[activeSection];
        if (activeElement) {
            const { offsetLeft, offsetWidth } = activeElement;
            setIndicatorStyle({
                left: offsetLeft,
                width: offsetWidth,
            });
        }
    }, [activeSection]);

    const handleSectionClick = (section: AdminSection, path: string) => {
        onSectionChange(section);
        navigate(path);
    };

    return (
        <nav className="admin-subheader">
            <div className="admin-subheader-content">
                {sections.map(({ id, label, path }) => (
                    <div
                        key={id}
                        ref={(el) => {
                            if (el) sectionRefs.current[id] = el;
                        }}
                        className={`section-item ${activeSection === id ? 'active' : ''}`}
                        onClick={() => handleSectionClick(id, path)}
                    >
                        {label}
                    </div>
                ))}
                <div
                    className="active-indicator"
                    style={{
                        left: `${indicatorStyle.left}px`,
                        width: `${indicatorStyle.width}px`,
                    }}
                />
            </div>
        </nav>
    );
};

export default AdminSubHeader;
