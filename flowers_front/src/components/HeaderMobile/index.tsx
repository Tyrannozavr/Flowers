import React from 'react';
import s from './HeaderMobile.module.scss';
import cn from 'classnames';

interface HeaderMobileProps {
    phoneNumber: string;
    name: string;
    logoUrl: string;
}

export const HeaderMobile: React.FC<HeaderMobileProps> = ({phoneNumber, name, logoUrl}) => {


    return (
        <header className={s.root}>
            <div className={s.container}>
                {
                    logoUrl && <div className={s.logo}>
                        <img src={logoUrl} alt="Логотип" />
                    </div>
                }

                <div className={cn(s.content, {[s.full_width]: !logoUrl})}>
                    <h1>{name}</h1>
                    <span>Онлайн витрина</span>

                    <div className={s.contact}>
                        <button 
                        className={cn(s.contact__button, s.phone_button)} 
                        onClick={() => window.open(`tel:${phoneNumber}`, '_blank')}>
                            Позвонить
                        </button>

                        <button 
                        className={cn(s.contact__button, s.whatsapp_button)} 
                        onClick={() => window.open(`https://wa.me/${phoneNumber}`, '_blank')}>
                            WhatsApp
                        </button>
                    </div>
                </div>
            </div>

        </header>
    );
};
