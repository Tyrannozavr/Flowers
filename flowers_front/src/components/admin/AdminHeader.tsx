import React, { useState, useRef, useEffect } from 'react';
import './AdminHeader.css';
import logoIcon from '../../assets/Flattened.svg';
import cartIcon from '../../assets/icon left (1).svg';
import chatIcon from '../../assets/chat-1-line.svg';
import tgIcon from '../../assets/Tg.svg';
import vkIcon from '../../assets/Vk.svg';
import wsIcon from '../../assets/Ws.svg';
import tlIcon from '../../assets/Tl.svg';
import homeIcon from '../../assets/home-line 1.svg';
import { useTheme } from "../../theme/ThemeProvider.tsx";


const CART_TEXT = 'Корзина';
const CONTACT_TEXT = 'Связаться';

interface IconProps {
    icon: React.ReactNode;
    label: string;
    onClick?: () => void;
}

const HeaderIcon: React.FC<IconProps> = ({ icon, label, onClick }) => {
    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onClick?.();
        }
    };

    const handleClick = (event: React.MouseEvent) => {
        event.preventDefault();
        onClick?.();
    };

    return (
        <div
            className="header-icon-wrapper"
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
            aria-label={label}
        >
            <div className="header-icon">{icon}</div>
            <span className="icon-label" aria-hidden="true">{label}</span>
        </div>
    );
};

interface ContactOption {
    icon: string;
    label: string;
    link: string;
}

const ContactModal: React.FC<{ isOpen: boolean; onClose: () => void; phone: string }> = ({ isOpen, onClose, phone }) => {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;


    const contactOptions: ContactOption[] = [
        { icon: tgIcon, label: 'Telegram', link: 'https://t.me/'+phone },
        { icon: vkIcon, label: 'Вконтакте', link: 'https://vk.com/'+phone },
        { icon: wsIcon, label: 'Whatsapp', link: 'https://wa.me/'+phone },
        { icon: tlIcon, label: '+7 922 323-29-35', link: 'tel:'+phone },
    ];

    return (
        <div className="contact-modal-overlay">
            <div className="contact-modal" ref={modalRef}>
                {contactOptions.map((option, index) => (
                    <a
                        key={index}
                        href={option.link}
                        className="contact-option"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <img src={option.icon} alt="" className="contact-icon" />
                        <span>{option.label}</span>
                    </a>
                ))}
            </div>
        </div>
    );
};

const MobileNavigation: React.FC = () => {
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);

    const handleHomeClick = () => {
        window.location.href = '/';
    };

    const handleCartClick = () => {
        window.location.href = '/cart';
    };

    const handleContactClick = () => {
        setIsContactModalOpen(true);
    };

    return (
        <>
            <div className="mobile-navigation" id="footer-mobile-nav">
                <div className="mobile-nav-item" onClick={handleHomeClick}>
                    <div className="mobile-nav-icon">
                        <img src={homeIcon} alt="" className="home-icon" />
                    </div>
                    <span>Главная</span>
                </div>
                <div className="mobile-nav-item" onClick={handleCartClick}>
                    <div className="mobile-nav-icon">
                        <img src={cartIcon} alt="" className="cart-icon" />
                        <span className="cart-badge">1</span>
                    </div>
                    <span>Корзина</span>
                </div>
                <div className="mobile-nav-item" onClick={handleContactClick}>
                    <div className="mobile-nav-icon">
                        <img src={chatIcon} alt="" className="chat-icon" />
                    </div>
                    <span>Связаться</span>
                </div>
            </div>
            <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} phone={''} />
        </>
    );
};

const AdminHeader: React.FC = () => {
    const { logoUrl, name, phone } = useTheme();
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);

    const handleCartClick = () => {
        window.location.href = '/cart';
    };

    const handleContactClick = () => {
        setIsContactModalOpen(true);
    };

    return (
        <>
            <header className="admin-header bg-accent-color">
                <div className="admin-header-content">
                    <a href="/" className="admin-logo" aria-label="На главную страницу">
                        {!logoUrl ? (
                            <h2>{name}</h2>
                        ) : (
                            <img src={logoIcon} alt="Логотип Магнолия" className="logo-image" />
                        )}
                    </a>
                    <nav className="header-icons" aria-label="User actions">
                        <HeaderIcon
                            icon={<img src={cartIcon} alt="" className="header-icon-image" aria-hidden="true" />}
                            label={CART_TEXT}
                            onClick={handleCartClick}
                        />
                        <HeaderIcon
                            icon={<img src={chatIcon} alt="" className="header-icon-image" aria-hidden="true" />}
                            label={CONTACT_TEXT}
                            onClick={handleContactClick}
                        />
                    </nav>
                </div>
                <ContactModal isOpen={isContactModalOpen} phone={phone} onClose={() => setIsContactModalOpen(false)} />
            </header>
            <MobileNavigation />
        </>
    );
};

export default AdminHeader;
