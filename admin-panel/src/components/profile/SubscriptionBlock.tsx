import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SubscriptionState, SubscriptionBlockProps, ConsentItem } from '../../types/subscription';
import styles from './SubscriptionBlock.module.css';
import { Link } from 'react-router-dom';
import { createPay } from '../../api/profile';

const SUBSCRIPTION_PRICE = 990;
const CONTACT_EMAIL = 'prometeusmm@gmail.com';
const CONTACT_PERSON = 'Семёнова Илья Сергеевич ИНН 026706792471';

const initialConsentItems: ConsentItem[] = [
    {
        id: 1,
        text: `Я согласен(а) на ежемесячные списания с банковской карты в размере ${SUBSCRIPTION_PRICE} рублей (девятьсот девяносто)`,
        checked: false,
    },
    {
        id: 2,
        text: 'Я согласен(а) с условиями',
        href: '/policy',
        checked: false,
    },
    {
        id: 3,
        text: 'Я согласен(а) с условиями',
        href: '/offer',
        checked: false,
    },
    {
        id: 4,
        text: 'Я согласен(а) с сохранением учетных данных для будущих транзакций',
        checked: false,
    },
];

export const SubscriptionBlock: React.FC<SubscriptionBlockProps> = ({
                                                                        currentState,
                                                                        userId,
                                                                        email: propEmail,
                                                                        onStateChange,
                                                                        onEmailSubmit,
                                                                        backUrl,
                                                                        onCancel,
                                                                        until,
                                                                    }) => {
    const [localEmail, setLocalEmail] = useState<string>(propEmail || '');
    const [consents, setConsents] = useState<ConsentItem[]>(initialConsentItems);
    const [handleEmailSubmitDisable, setHandleEmailSubmitDisable] = useState(false);
    const [showErrorAfterSubmit, setShowErrorAfterSubmit] = useState(false);

    const handleStateChange = (newState: SubscriptionState) => {
        onStateChange?.(newState);
    };

    const validateEmail = (email: string): boolean => {
        const trimmedEmail = email.trim();
        if (!trimmedEmail) return false;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(trimmedEmail);
    };

    const handleEmailSubmit = () => {
        if (!localEmail || !validateEmail(localEmail)) {
            setShowErrorAfterSubmit(true); // Показываем ошибку, если поле пустое или email некорректен
            return;
        }
        setShowErrorAfterSubmit(false); // Сбрасываем ошибку, если email корректен
        if (onEmailSubmit) {
            onEmailSubmit(localEmail)
                .then(async () => {
                    setHandleEmailSubmitDisable(true);
                    const res = await createPay(userId, localEmail, encodeURIComponent(backUrl));
                    if (res.url) {
                        window.location = res.url;
                    }
                    // handleStateChange(SubscriptionState.ACTIVE);
                })
                .catch((error) => {
                    console.error('Error submitting email:', error);
                });
        } else {
            console.log('qweqwe');
            // handleStateChange(SubscriptionState.ACTIVE);
        }
    };

    const handleConsentToggle = (id: number) => {
        setConsents((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, checked: !item.checked } : item
            )
        );
    };

    const handleSubscribe = () => {
        handleStateChange(SubscriptionState.CONSENT);
    };

    const handleProceedToEmail = () => {
        if (consents.every((item) => item.checked)) {
            handleStateChange(SubscriptionState.EMAIL_INPUT);
        }
    };

    const handleConfirmCancel = () => {
        console.log('Confirming cancellation, moving to INITIAL');
        if (onCancel) {
            onCancel().then(() => {
                handleStateChange(SubscriptionState.INITIAL); // Ведёт в INITIAL
            }).catch(error => {
                console.error('Error cancelling subscription:', error);
            });
        } else {
            handleStateChange(SubscriptionState.INITIAL); // Ведёт в INITIAL
        }
    };

    const handleKeepSubscription = () => {
        handleStateChange(SubscriptionState.ACTIVE);
    };

    const renderContactInfo = () => (
        <>
            <p className={styles.additionalTextLight}>
                Связаться с разработчиками по всем вопросам можно через личного менеджера или по почте{' '}
                <a href={`mailto:${CONTACT_EMAIL}`} className={styles.contactLink}>
                    {CONTACT_EMAIL}
                </a>
            </p>
            <p className={styles.additionalTextBold}>
                ИП {CONTACT_PERSON}{' '}
            </p>
        </>
    );

    const handleSubmitEmail = (e: React.FormEvent) => {
        e.preventDefault();
        handleEmailSubmit();
    };

    const renderContent = () => {
        switch (currentState) {
            case SubscriptionState.INITIAL:
                return (
                    <>
                        <h2 className={styles.subscriptionTitle}>Подписка на Флаурум</h2>
                        <div className={styles.inactiveBadge}>Неактивно</div>
                        <p className={styles.description}>
                            Флаурум - сервис для цветочных магазинов, включающий в себя: онлайн-витрину, чат-бота для обновления ассортимента и личный кабинет
                        </p>
                        <button className={styles.subscribeButtonActive} onClick={() => handleSubscribe()}>
                            Оформить за {SUBSCRIPTION_PRICE} руб/мес
                        </button>
                        <p className={styles.cancelSubscriptionText}>Отменить подписку можно в любой момент</p>
                        {renderContactInfo()}
                    </>
                );
            case SubscriptionState.CONSENT:
                return (
                    <>
                        <h2 className={styles.subscriptionTitle}>Подписка на Флаурум</h2>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            {consents.map(item => (
                                <div key={item.id} className={styles.agreementPoint}>
            <span
                className={`${styles.checkbox} ${item.checked ? styles.checked : ''}`}
                onClick={() => handleConsentToggle(item.id)}
            />
                                    <span
                                        className={`${styles.agreementText} ${!item.checked ? styles.uncheckedText : ''}`}
                                        onClick={() => handleConsentToggle(item.id)}
                                    >
              {item.text}
                                        {item.href && (
                                            <>
                                                {' '}
                                                <Link to={item.href} className={styles.link}>
                                                    {item.href === '/policy' ? 'политики по обработке персональных данных' : 'условиями оферты'}
                                                </Link>
                                            </>
                                        )}
            </span>
                                </div>
                            ))}
                            <button
                                className={`${styles.subscribeButtonActive} ${!consents.every(item => item.checked) ? styles.subscribeButtonDisabled : ''}`}
                                onClick={() => handleProceedToEmail()}
                                disabled={!consents.every(item => item.checked)}
                            >
                                Перейти к оплате
                            </button>
                        </motion.div>
                        <p className={styles.cancelSubscriptionText}>Отменить подписку можно в любой момент</p>
                        {renderContactInfo()}
                    </>
                );

            case SubscriptionState.EMAIL_INPUT:
                return (
                    <>
                        <h2 className={styles.subscriptionTitle}>Подписка на Флаурум</h2>
                        <p className={styles.description}>
                            Введите электронную почту для получения уведомления по подписке
                        </p>
                        <form className={styles.emailInputContainer} onSubmit={handleSubmitEmail}>
                            <input
                                type="email"
                                value={localEmail}
                                onChange={(e) => {
                                    const newEmail = e.target.value;
                                    setLocalEmail(newEmail);
                                    setShowErrorAfterSubmit(false); // Сбрасываем ошибку при изменении поля
                                }}
                                className={styles.emailInput}
                                placeholder="Введите email"
                            />
                            {showErrorAfterSubmit && (
                                <p className={styles.errorText}>
                                    Введите корректную электронную почту для получения уведомления по подписке
                                </p>
                            )}
                            <button
                                className={styles.paymentButton}
                                disabled={handleEmailSubmitDisable}
                                type="submit"
                            >
                                Перейти к оплате
                            </button>
                        </form>
                        <p className={styles.cancelSubscriptionText}>Отменить подписку можно в любой момент</p>
                        {renderContactInfo()}
                    </>
                );

            case SubscriptionState.ACTIVE:
                return (
                    <>
                        <h2 className={styles.subscriptionTitle}>Подписка на Флаурум</h2>
                        <div className={styles.activeBadge}>{'Активна до ' + until.trim()}</div>
                        <button className={styles.subscribeButtonCancel} onClick={() => handleStateChange(SubscriptionState.CANCEL_CONFIRMATION)}>
                            Отменить подписку
                        </button>
                        {renderContactInfo()}
                    </>
                );

            case SubscriptionState.CANCEL_CONFIRMATION:
                return (
                    <>
                        <h2 className={styles.subscriptionTitle}>Подписка на Флаурум</h2>
                        <p className={styles.description}>
                            Вы действительно хотите отменить подписку на сервис?
                            Доступ к витрине будет закрыт - покупатели не смогу воспользоватся сервисом
                        </p>
                        <div className={styles.buttonGroup}>
                            <button className={styles.subscribeButtonCancel} onClick={() => handleConfirmCancel()}>
                                Да, отменить
                            </button>
                            <button className={styles.subscribeButtonActive} onClick={() => handleKeepSubscription()}>
                                Нет, оставить
                            </button>
                        </div>
                        <p className={styles.cancelSubscriptionText}>Отменить подписку можно в любой момент</p>
                        {renderContactInfo()}
                    </>
                );

            default:
                return null;
        }
    };

    return (
        <div className={styles.subscriptionBlock}>
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentState}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                >
                    {renderContent()}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};