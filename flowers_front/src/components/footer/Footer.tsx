import React, { useState, useRef, useEffect } from 'react';
import './Footer.css';
import homeIcon from '../../assets/home-line 1.svg';
import cartIcon from '../../assets/icon left (1).svg';
import chatIcon from '../../assets/chat-1-line.svg';
import tgIcon from '../../assets/Tg.svg';
import vkIcon from '../../assets/Vk.svg';
import wsIcon from '../../assets/Ws.svg';
import tlIcon from '../../assets/Tl.svg';
import { useTheme } from "../../theme/ThemeProvider.tsx";
import { useNavigate } from 'react-router-dom';

interface ContactOption {
  icon: string;
  label: string;
  link: string;
}

const ContactModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const { tg, whatsapp, phone } = useTheme();
  
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

  const tgName = tg !== null ? tg : '';

  const contactOptions: ContactOption[] = [
    { icon: tgIcon, label: 'Telegram', link: 'https://t.me/'+tgName },
    { icon: vkIcon, label: 'Вконтакте', link: 'https://vk.com/magnolia_flowers' },
    { icon: wsIcon, label: 'Whatsapp', link: 'https://wa.me/'+whatsapp },
    { icon: tlIcon, label: phone, link: 'tel:'+phone },
  ];
  
  return (
    <div className="contact-modal-overlay">
      <div className="contact-modal" ref={modalRef} style={{bottom: '70px', top: 'auto', left: '50%', transform: 'translateX(-50%)', right: 'auto'}}>
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

const Footer: React.FC = () => {
  const [activeTab, setActiveTab] = useState('');
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const { inn } = useTheme();
  const navigate = useNavigate();

  const handleTabClick = (tab: string) => {
    if (tab === 'chat') {
      setIsContactModalOpen(true);
    } else if (tab === 'home') {
      navigate('/');
      setActiveTab(tab);
    } else if (tab === 'cart') {
      navigate('/cart');
      setActiveTab(tab);
    }
  };

  return (
    <>
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-copyright">
            ©2024. All Rights Reserved
            <span className="footer-inn">ИНН: {inn}</span>
          </div>
        </div>
      </footer>
      
      <div className="mobile-navigation-container">
        <div className="footer-mobile-nav">
          <div 
            className={`footer-nav-item ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => handleTabClick('home')}
          >
            <img src={homeIcon} alt="Home" className="footer-icon" />
            <span>Главная</span>
          </div>
          
          <div 
            className={`footer-nav-item ${activeTab === 'cart' ? 'active' : ''}`}
            onClick={() => handleTabClick('cart')}
          >
            <div className="cart-badge">1</div>
            <img src={cartIcon} alt="Cart" className="footer-icon" />
            <span>Корзина</span>
          </div>
          
          <div 
            className={`footer-nav-item ${activeTab === 'chat' ? 'active' : ''}`}
            onClick={() => handleTabClick('chat')}
          >
            <img src={chatIcon} alt="Chat" className="footer-icon" />
            <span>Связаться</span>
          </div>
        </div>
      </div>
      
      <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
    </>
  );
};

export default Footer;
