import React, {useEffect, useState, useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import AdminHeader from '../components/admin/AdminHeader';
import Footer from '../components/footer/Footer';
import backIcon from '../assets/back.svg';
import trashIcon from '../assets/trash.svg';
import './CheckoutPage.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {
    removeFromCart,
    decreaseQuantity,
    increaseQuantity,
} from "../redux/cart/slice";
import {
    IOrder,
    clearOrderError,
    setFormData,
    setErrors,
} from "../redux/order/slice";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../redux/store.ts";
import {useTheme} from "../theme/ThemeProvider.tsx";
import TimeSlotSelector from "../components/TimeSlotSelector.tsx";
import {createOrder, getDeliveryCost} from "../api/order";
import AddressFields, { AddressFieldsRef } from '../components/AddressFields';

const CheckoutPage: React.FC = () => {

    const dispatch = useDispatch();
    interface Address {
        address: string;
        shop_id?: number;
    }

    const formData = useSelector(
        (state: { order: { formData: IOrder } }) => state.order.formData
    );
    const theme = useTheme() as { addresses: Address[], shopId: number };
    const changeAddress = (value: string) => {
        dispatch(setFormData({ street: value }));
    };
    const handleDeliveryMethodChange = (method: "DELIVERY" | "PICKUP") => {
        dispatch(setFormData({ deliveryMethod: method }));
        dispatch(clearOrderError("deliveryMethod"));

        if (method === "DELIVERY") {
            dispatch(
                setFormData({
                    city: "",
                    street: "",
                    house: "",
                    apartment: "",
                    building: "",
                })
            );
        }
    };
    const cart = useSelector((state: RootState) => state.cart.cart);
    const navigate = useNavigate();
    const calculateTotal = () => {
        return cart.reduce(
            (total, item) => total + item.product.price * item.quantity,
            0
        );
    };
    const formatPrice = (value: number) => {
        return value.toLocaleString("ru-RU");
    };
    // if (!formData.street && theme.addresses.length > 0) {
    //     changeAddress(theme.addresses[0].address);
    // }
    const errors = useSelector(
        (state: { order: { errors: { [key: string]: string } } }) =>
            state.order.errors
    );
    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        dispatch(setFormData({ [name]: value }));
        dispatch(clearOrderError(name));

        if (name === "fullName" && value.trim() === "") {
            dispatch(
                setErrors({
                    field: "fullName",
                    error: "ФИО не может быть пустым",
                })
            );
        }
        if (name === "phoneNumber" && value.trim() === "") {
            dispatch(
                setErrors({
                    field: "phoneNumber",
                    error: "Номер телефона обязателен",
                })
            );
        }
    };
    const { wishes } = useSelector(
        (state: RootState) => state.order.formData
    );
    const handleInputChangeWish = (
        e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
    ) => {
        const { name, value } = e.target;
        dispatch(setFormData({ [name]: value }));
    };
    
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    useEffect(() => {
        if (!formData.deliveryDate) {
            const today = new Date();
            setSelectedDate(today);
            dispatch(
                setFormData({ deliveryDate: today.toISOString().split("T")[0] })
            );
        } else {
            setSelectedDate(new Date(formData.deliveryDate));
        }
    }, [formData.deliveryDate, dispatch]);
    const handleDateChange = (date: Date | null) => {
        if (date) {
            dispatch(
                setFormData({ deliveryDate: date.toISOString().split("T")[0] })
            );
            dispatch(setErrors({ field: "deliveryDate", error: "" })); // сбрасываем ошибку
        } else {
            dispatch(setFormData({ deliveryDate: "" }));
            dispatch(
                setErrors({ field: "deliveryDate", error: "Дата обязательна!" })
            ); // ошибка если не выбрана дата
        }
        setSelectedDate(date);
    };

    const [step, setStep] = useState(1);

    const progress = step === 1 ? 33 : step === 2 ? 66 : 100;

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
        } else {
            navigate('/cart');
        }
    };

    const addressFieldsRef = useRef<AddressFieldsRef | null>(null);
    

    const handleContinue = async () => {
        if (step === 2 && formData.deliveryMethod === "DELIVERY") {
            // Если это шаг с адресом доставки, проверяем его
            const addressValid = await addressFieldsRef.current?.validateAddress();
            if (!addressValid) {
                return; // Останавливаем переход если адрес не валиден
            }
            
            // Вычисляем стоимость доставки после валидации адреса
            await fetchDeliveryCost();
        }
        
        if (step < 3) {
            setStep(step + 1);
        } else {
            await createOrder(formData);
        }
    };

    const handlePayWithSBP = async () => {
        const rs = await createOrder(formData);
        if (rs) {
            navigate('/confirmation');
        } else {
            alert("Произошла ошибка при создании заказа. Попробуйте снова.");
        }
    };

    const handleSubmitWithoutPayment = async () => {
        const rs = await createOrder(formData);
        if (rs) {
            navigate('/confirmation');
        } else {
            alert("Произошла ошибка при создании заказа. Попробуйте снова.");
        }
    };

    const [deliveryCost, setDeliveryCost] = useState<number | null>(null);
    const [deliveryCostLoading, setDeliveryCostLoading] = useState(false);
    const [deliveryCostError, setDeliveryCostError] = useState<string | null>(null);

    // Получаем shopId из темы
    const shopId = theme.shopId || (theme.addresses && theme.addresses[0] && theme.addresses[0].shop_id);

    const fetchDeliveryCost = async () => {
        if (
            formData.deliveryMethod !== "DELIVERY" ||
            !formData.city ||
            !formData.street ||
            !formData.house ||
            !shopId
        ) {
            setDeliveryCost(null);
            return;
        }
        setDeliveryCostLoading(true);
        setDeliveryCostError(null);
        try {
            const cost = await getDeliveryCost(shopId, {
                city: formData.city,
                street: formData.street,
                house: formData.house,
                building: formData.building,
                apartment: formData.apartment,
            });
            setDeliveryCost(cost);
        } catch {
            setDeliveryCostError("Ошибка при расчете стоимости доставки");
            setDeliveryCost(null);
        } finally {
            setDeliveryCostLoading(false);
        }
    };

    // Расчет итоговой суммы с учетом доставки
    const calculateFinalTotal = () => {
        const productsTotal = calculateTotal();
        const delivery = deliveryCost || 0;
        return productsTotal + delivery;
    };

    return (
        <div className="checkout-page">
            <AdminHeader />
            <main className="checkout-content">
                <div className="checkout-header">
                    <button className="back-button" onClick={handleBack}>
                        <img src={backIcon} alt="Назад" className="back-icon" />
                    </button>
                    <h2 className="checkout-header-title">Оформление заказа</h2>
                    <div className="progress-bar">
                        <div className="progress-bar-fill bg-accent" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>
                <div className="contact-section">
                    {step === 1 && (
                        <div className="contact-form-section">
                            <h3 className="contact-section-title">Как с вами связаться</h3>
                            <form className="checkout-contact-form">
                                <div className="form-group">
                                    <input
                                        type="text"
                                        placeholder="ФИО"
                                        name="fullName"
                                        className={`checkout-form-input ${
                                            errors.fullName
                                                ? "border-red-500 focus:ring-red-500"
                                                : "border-gray-300 focus:ring-accent"
                                        }`}
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    {errors.fullName && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.fullName}
                                        </p>
                                    )}
                                </div>
                                <div className="form-group">
                                    <input
                                        type="tel"
                                        placeholder="Телефон"
                                        className="checkout-form-input"
                                        value={formData.phoneNumber}
                                        onChange={handleInputChange}
                                        name="phoneNumber"
                                        required
                                    />
                                </div>
                                <div className="form-group form-group-toggle">
                                    <label className="toggle-label">
                                        <input type="checkbox" className="toggle-input" />
                                        <span className="toggle-switch"></span>
                                        Получит другой человек
                                    </label>
                                </div>
                                <div className="form-group">
                                    <input
                                        type="text"
                                        placeholder="Имя получателя"
                                        className="checkout-form-input"
                                        value={formData.recipientName}
                                        onChange={handleInputChangeWish}
                                        name="recipientName"
                                    />
                                </div>
                                <div className="form-group">
                                    <input
                                        type="tel"
                                        placeholder="Телефон получателя"
                                        className="checkout-form-input"
                                        value={formData.recipientPhone}
                                        onChange={handleInputChangeWish}
                                        name="recipientPhone"
                                    />
                                </div>
                            </form>
                        </div>
                    )}

                    {step === 2 && (
                        <>
                            <div className="delivery-method-toggle">
                                <button
                                    className={`toggle-button ${formData.deliveryMethod === "PICKUP" ? 'active' : ''}`}
                                    onClick={() => handleDeliveryMethodChange("PICKUP")}
                                >
                                    Самовывоз
                                </button>
                                <button
                                    className={`toggle-button ${formData.deliveryMethod === "DELIVERY" ? 'active' : ''}`}
                                    onClick={() => handleDeliveryMethodChange("DELIVERY")}
                                >
                                    Доставка
                                </button>
                            </div>

                            {formData.deliveryMethod === 'PICKUP' ? (
                                theme.addresses.length > 0 ? (
                                    <div className="pickup-section">
                                        <h3 className="contact-section-title">Адрес магазина</h3>
                                        <div className="address-options">
                                            {theme.addresses.map((slot, i) => (
                                                <label className="address-option" key={i}>
                                                    <input
                                                        type="radio"
                                                        name="pickup-address"
                                                        value={slot.address}
                                                        checked={formData.street === slot.address}
                                                        onChange={(e) => changeAddress(e.target.value)}
                                                    />
                                                    <span className="address-text">
                                                        {slot.address}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                        <div className="form-group">
                                            <textarea
                                                placeholder="Пожелания к заказу"
                                                className="checkout-form-textarea"
                                                onChange={handleInputChangeWish}
                                                value={wishes}
                                                name="wishes"
                                                maxLength={200}
                                                id="wishes"
                                            />
                                        </div>
                                    </div>
                                ) : null
                            ) : (
                                <div className="delivery-section">
                                    <h3 className="contact-section-title">Адрес доставки</h3>
                                    <AddressFields 
                                        ref={addressFieldsRef}
                                    />

                                    <h3 className="contact-section-title">Желаемое время доставки</h3>
                                    <div className="form-group date-input-wrapper">
                                        <DatePicker
                                            className="checkout-form-input date-input"
                                            selected={selectedDate}
                                            onChange={handleDateChange}
                                            minDate={new Date()}
                                            dateFormat="dd.MM.yyyy"
                                            required
                                        />
                                        {errors.deliveryDate && (
                                            <div className="text-red-500 text-sm mt-2">
                                                {errors.deliveryDate}
                                            </div>
                                        )}
                                    </div>
                                    <TimeSlotSelector />

                                    <div className="form-group">
                                        <textarea
                                            placeholder="Пожелания к заказу"
                                            className="checkout-form-textarea"
                                            onChange={handleInputChangeWish}
                                            value={wishes}
                                            name="wishes"
                                            maxLength={200}
                                            id="wishes"
                                        />
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {step === 3 && (
                        <div className="confirmation-section">
                            {cart.map(({ product, quantity }) => (
                                <div className="confirmation-cart-item" key={product.id}>
                                    <div className="confirmation-cart-item-left">
                                        <img src={product.images[0]} alt={product.name} className="confirmation-cart-item-image" />
                                    </div>
                                    <div className="confirmation-cart-item-details">
                                        <div className="confirmation-cart-item-text">
                                            <p className="confirmation-cart-item-total-price">{product.price * quantity} ₽</p>
                                            <h3 className="confirmation-cart-item-title">{product.name}</h3>
                                            <p className="confirmation-cart-item-price">{product.price} ₽ / шт</p>
                                        </div>
                                        <div className="confirmation-cart-item-controls">
                                            <div className="confirmation-quantity-controls">
                                                <button
                                                    className="confirmation-quantity-button confirmation-quantity-button-minus"
                                                    onClick={() =>
                                                        dispatch(
                                                            decreaseQuantity(product.id)
                                                        )
                                                    }
                                                    disabled={quantity <= 1}
                                                >
                                                    -
                                                </button>
                                                <span className="confirmation-quantity-value">{quantity}</span>
                                                <button
                                                    className="confirmation-quantity-button confirmation-quantity-button-plus"
                                                    onClick={() =>
                                                        dispatch(
                                                            increaseQuantity(product.id)
                                                        )
                                                    }
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <button
                                                className="confirmation-remove-from-cart-button"
                                                onClick={() =>
                                                    dispatch(removeFromCart(product.id))
                                                }
                                                aria-label={`Удалить ${product.name} из корзины`}
                                            >
                                                <img src={trashIcon} alt="Удалить" className="confirmation-remove-icon" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div className="confirmation-order-total">
                                <div className="confirmation-order-total-row">
                                    <h4>Товары:</h4>
                                    <p>{formatPrice(calculateTotal())} ₽</p>
                                </div>
                                {formData.deliveryMethod === "DELIVERY" && (
                                    <div className="confirmation-order-total-row">
                                        <h4>Доставка:</h4>
                                        {deliveryCostLoading ? (
                                            <p>Рассчитываем...</p>
                                        ) : deliveryCostError ? (
                                            <p className="text-red-500">{deliveryCostError}</p>
                                        ) : (
                                            <p>{deliveryCost !== null ? `${deliveryCost} ₽` : "—"}</p>
                                        )}
                                    </div>
                                )}
                                <div className="confirmation-order-total-row">
                                    <h4>Итоговая сумма заказа:</h4>
                                    <p>{formatPrice(calculateFinalTotal())} ₽</p>
                                </div>
                            </div>

                            <button
                                className="confirmation-pay-button confirmation-pay-with-sbp bg-accent"
                                onClick={handlePayWithSBP}
                            >
                                Оплатить по СБП
                            </button>
                            <button
                                className="confirmation-pay-button confirmation-submit-without-payment"
                                onClick={handleSubmitWithoutPayment}
                            >
                                Оставить заявку без оплаты
                            </button>

                            <p className="confirmation-privacy-text">
                                Нажимая кнопку «Перейти к оплате» или «Оставить заявку»,
                                вы даете согласие на{' '}
                                <a href="/privacy-policy" className="confirmation-privacy-link">
                                    обработку персональных данных
                                </a>
                            </p>
                        </div>
                    )}

                    {step !== 3 && (
                        <button
                            type="submit"
                            className="continue-button bg-accent"
                            onClick={handleContinue}
                        >
                            Продолжить
                        </button>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default CheckoutPage;