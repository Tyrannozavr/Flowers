import { IOrder, setErrors } from "../redux/order/slice";

// Валидация для первого шага
const firstStepValidate = (formData: IOrder) => {
    const errors: { [key: string]: string } = {};
    if (!formData.fullName.trim()) {
        errors.fullName = "Введите ваше имя.";
    }
    if (!formData.phoneNumber) {
        errors.phoneNumber = "Введите корректный номер телефона.";
    }
    if (!formData.isSelfPickup) {
        if (!formData.recipientName?.trim()) {
            errors.recipientName = "Введите имя получателя.";
        }
        if (!formData.recipientPhone) {
            errors.recipientPhone = "Введите корректный номер получателя.";
        }
    }
    return errors;
};

// Валидация для второго шага
const secondStepValidate = (formData: IOrder) => {
    const errors: { [key: string]: string } = {};
    if (!formData.deliveryMethod || formData.deliveryMethod === "DELIVERY") {
        if (!formData.city?.trim()) {
            errors.city = "Введите город.";
        }
        if (!formData.street?.trim()) {
            errors.street = "Введите улицу.";
        }
        if (!formData.house?.trim()) {
            errors.house = "Введите дом.";
        }
    }
    if (!formData.deliveryMethod) {
        errors.deliveryMethod = "Выберите способ доставки.";
    }
    if (!formData.deliveryDate) {
        errors.deliveryDate = "Выберите дату доставки.";
    }
    if (!formData.deliveryTime) {
        errors.deliveryTime = "Выберите время доставки.";
    }
    return errors;
};

// Объект с валидацией для каждого шага
const validationRules: {
    [key: number]: (formData: IOrder) => { [key: string]: string };
} = {
    1: (formData) => firstStepValidate(formData),
    2: (formData) => secondStepValidate(formData),
    3: (formData) => {
        const errors = {
            ...firstStepValidate(formData),
            ...secondStepValidate(formData),
        };
        return errors;
    },
    4: (formData) => {
        const errors = {
            ...firstStepValidate(formData),
            ...secondStepValidate(formData),
        };
        return errors;
    },
};

// Основная валидация
const validateStep = (
    currentStep: number,
    formData: IOrder,
    dispatch: Function
) => {
    const newErrors: { [key: string]: string } = {};

    // Проверка всех шагов от 1 до текущего шага
    for (let step = 1; step <= currentStep; step++) {
        const stepErrors = validationRules[step](formData);
        Object.assign(newErrors, stepErrors);
    }

    console.log(newErrors);

    dispatch(setErrors(newErrors)); // Отправляем ошибки в store
    return Object.keys(newErrors).length === 0; // Возвращаем true, если ошибок нет
};

export default validateStep;
