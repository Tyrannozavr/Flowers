import { IOrder, setErrors } from "../redux/order/slice";

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

const validateStep = (
    currentStep: number,
    formData: IOrder,
    dispatch: Function
) => {
    const newErrors: { [key: string]: string } = {};

    const stepErrors = validationRules[currentStep](formData);
    Object.assign(newErrors, stepErrors);

    dispatch(setErrors(newErrors));
    return Object.keys(newErrors).length === 0; 
};

export default validateStep;
