import React, {useState,} from 'react';
import styles from './StoresPage.module.css';
import {useMutation, useQuery, useQueryClient} from "react-query";
import {createShop, deleteShop, fetchShops, updateShop, validateAddress} from "../api/shops";
import {TextField} from "@mui/material";
import {toast} from "react-toastify";
import {Link, useNavigate} from "react-router-dom";

interface StoreAddressOld {
  address: string;
  phone: string;
}

interface Store {
  id?: number;
  inn: string;
  logo_url?: string;
  new_logo?: File;
  phone: string;
  primary_color: string;
  subdomain: string;
  tg: string;
  whatsapp: string;
  addresses?: string[];
}

type StoreState = 'empty' | 'creating' | 'viewing' | 'editing';
type FormStep = 'step1' | 'step2';

const StoresPage: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [currentState, setCurrentState] = useState<StoreState>('empty');
  const [currentStep, setCurrentStep] = useState<FormStep>('step1');
  const [store, setStore] = useState<Store | null>(null);
  // const queryClient = useQueryClient();
  const [formData, setFormData] = useState<Store>({
    inn: '',
    logo_url: '',
    new_logo: undefined,
    phone: '',
    primary_color: '',
    subdomain: '',
    tg: '',
    whatsapp: '',
    addresses: [],
  });
  useQuery("shops", fetchShops, {
    retry: false,
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      if (!data) {
        setCurrentState('empty');
      } else {
        if (!data.length) {
          setCurrentState('empty');
        } else {
          const fetchedShop = data[0];
          const addresses = fetchedShop.addresses;
          fetchedShop.addresses = [];
          addresses.map((item: StoreAddressOld) => {
            fetchedShop.addresses.push(item.address);
          })
          setStore(fetchedShop);
          setCurrentState('viewing');
        }
      }
    }
  });
  // const navigate = useNavigate();
  const [addressInputs, setAddressInputs] = useState<string[]>(['']);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isTextLogoActive, setIsTextLogoActive] = useState(false);
  const [isFileLogoActive, setIsFileLogoActive] = useState(false);
  const [logoError, setLogoError] = useState<string>('');

  const validateAddresses = async (addresses: string[], validateWithAPI: boolean = false): Promise<boolean> => {
    let isValid = true;
    const newErrors: { [key: string]: string } = {};

    for (let index = 0; index < addresses.length; index++) {
      const address = addresses[index];
      const errorKey = `address${index}`;
      
      // Первичная проверка на пустое значение
      if (!address) {
        newErrors[errorKey] = 'Поле обязательно для заполнения';
        isValid = false;
        continue;
      }

      // Проверка через API, если требуется
      if (validateWithAPI && address) {
        try {
          const response = await validateAddress(address);
          
          if (!response.isValid) {
            newErrors[errorKey] = response.message;
            isValid = false;
          } else {
            newErrors[errorKey] = '';
          }
        } catch (error) {
          console.error(`Error validating address at index ${index}:`, error);
          newErrors[errorKey] = 'Ошибка при проверке адреса';
          isValid = false;
        }
      } else {
        newErrors[errorKey] = '';
      }
    }

    setErrors(prev => ({ ...prev, ...newErrors }));
    return isValid;
  };

  const handleAddressInputChange = (index: number, value: string) => {
    const newAddressInputs = [...addressInputs];
    newAddressInputs[index] = value;
    setAddressInputs(newAddressInputs);
    validateAddresses([value], false).then(() => {});
  };


  const handleAddAddress = () => {
    setAddressInputs(prev => [...prev, '']);
  };

  const validateInput = (name: string, value: string | undefined) => {
    if (value === undefined || value === '') {
      setErrors(prev => ({ ...prev, [name]: 'Поле обязательно для заполнения' }));
      return false;
    }

    let error = '';
    switch (name) {
      case 'name':
        if (/[А-Яа-яЁё]/.test(value)) {
          error = 'Русские буквы не допускаются, используйте английские';
        }
        break;
      // case 'color':
      //   if (!/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/.test(value)) {
      //     error = 'Введите HEX-код (#FFF или #FFFFFF)';
      //   }
      //   break;
      case 'inn':
        if (!/^\d{10}$|^\d{12}$/.test(value)) {
          error = 'ИНН должен содержать 10 или 12 цифр';
        }
        break;
      case 'phone':
        if (!/^\+?\d+$/.test(value)) {
          error = 'Только цифры, может начинаться с +';
        } else {
          const digitCount = value.startsWith('+') ? value.length - 1 : value.length;
          if (digitCount < 10 || digitCount > 12) {
            error = 'Номер телефона должен содержать 10–12 цифр';
          }
        }
        break;
      case 'tg':
      case 'whatsapp':
        if (!/^\d+$/.test(value)) {
          error = 'Только цифры';
        } else if (value.length < 10 || value.length > 12) {
          error = 'Номер должен содержать 10–12 цифр';
        }
        break;
      case 'logo':
      case 'textLogo':
        break;
      default:
        break;
    }
    setErrors(prev => ({ ...prev, [name]: error }));
    return error === '';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    let cleanedValue = value;
    switch (name) {
      case 'name':
        cleanedValue = value;
        break;
      // case 'color':
      //   cleanedValue = value;
      //   if (!cleanedValue.startsWith('#')) {
      //     cleanedValue = '#' + cleanedValue;
      //   }
      //   cleanedValue = cleanedValue.replace(/[^#0-9A-Fa-f]/g, '');
      //   if (cleanedValue.length > 9) {
      //     cleanedValue = cleanedValue.slice(0, 9);
      //   }
      //   break;
      case 'inn':
        cleanedValue = value.replace(/[^0-9]/g, '');
        break;
      case 'phone':
        cleanedValue = value.replace(/[^0-9+]/g, '');
        if (cleanedValue.startsWith('+') && cleanedValue.indexOf('+', 1) !== -1) {
          cleanedValue = '+' + cleanedValue.slice(1).replace(/\+/g, '');
        }
        break;
      case 'telegram':
      case 'whatsapp':
        cleanedValue = value.replace(/[^0-9]/g, '');
        break;
      default:
        break;
    }

    setFormData(prev => ({ ...prev, [name]: cleanedValue }));
    validateInput(name, cleanedValue);
  };

  const checkImageTransparency = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            resolve(true);
            return;
          }
          
          ctx.drawImage(img, 0, 0);
          
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          
          let hasTransparentPixel = false;
          for (let i = 3; i < data.length; i += 4) {
            if (data[i] < 255) {
              hasTransparentPixel = true;
              break;
            }
          }
          
          resolve(hasTransparentPixel);
        };
        
        img.src = event.target?.result as string;
      };
      
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setLogoError('');
    
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (file.type !== 'image/png') {
        setLogoError('Пожалуйста, загрузите файл в формате PNG.');
        e.target.value = '';
        return;
      }
      
      const hasTransparency = await checkImageTransparency(file);
      
      if (!hasTransparency) {
        setLogoError('Логотип должен быть в PNG формате с прозрачным фоном. Выберите другое изображение или используйте название как логотип.');
        e.target.value = '';
        return;
      }

      const logoFile = new File([file], file.name, { type: file.type });

      setFormData(prev => ({ ...prev, new_logo: logoFile, textLogo: '' }));
      setIsFileLogoActive(true);
      setIsTextLogoActive(false);
    }
  };

  const handleNextStep = async (e: React.FormEvent) => {
    e.preventDefault();
    const fieldsToValidate = ['subdomain', 'primary_color', 'inn'] as const;
    let isValid = true;
    fieldsToValidate.forEach(field => {
      const value = formData[field];
      if (typeof value === 'string' || value === undefined) {
        if (!validateInput(field, value)) {
          isValid = false;
        }
      }
    });
    
    // Валидация адресов с API проверкой
    const addressesValid = await validateAddresses(addressInputs, true);
    if (!addressesValid) {
      isValid = false;
    }
    
    if (isValid) {
      setFormData(prev => ({ ...prev, addresses: addressInputs }));
      setCurrentStep('step2');
    } else {
      toast.error("Пожалуйста, исправьте ошибки в форме");
    }
  };

  const handleTextLogoToggle = () => {
    setIsTextLogoActive(true);
    setIsFileLogoActive(false);
    setLogoError('');
    setFormData(prev => ({ ...prev, new_logo: undefined, textLogo: prev.subdomain }));
    validateInput('textLogo', formData.subdomain);
  };

  const deleteMutation = useMutation(deleteShop, {
    onSuccess: () => queryClient.invalidateQueries("shops"),
  });

  const createMutation = useMutation(
      (formData: FormData) => createShop(formData),
      {
        onSuccess: () => {
          queryClient.invalidateQueries("shops");
          navigate("/shops");
        },
        onError: (error: Error & { response?: { data: { detail: string } } }) => {
          toast.error(
              `Не удалось создать магазин: ${error.response?.data.detail || 'Неизвестная ошибка'}`
          );
        },
      }
  );

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const fieldsToValidate = ['phone', 'tg', 'whatsapp'] as const;
    let isValid = true;
    fieldsToValidate.forEach(field => {
      const value = formData[field];
      if (typeof value === 'string' || value === undefined) {
        if (!validateInput(field, value)) {
          isValid = false;
        }
      }
    });
    if (isValid) {
      const fd = new FormData();
      fd.append("subdomain", formData.subdomain);
      fd.append("color", formData.primary_color || "#FFFFFF");
      fd.append("inn", formData.inn);
      fd.append("phone", formData.phone);
      fd.append("tg", formData.tg);
      fd.append("whatsapp", formData.whatsapp);

      if (isTextLogoActive) {
        fd.append("use_text_logo", "true");
      } else if (formData.new_logo) {
        fd.append("logo", formData.new_logo);
      }

      if (formData.addresses && formData.addresses.length > 0) {
        const tAddresses : StoreAddressOld[] = [];
        formData.addresses.forEach(addresse => {
          tAddresses.push({'phone': '1', 'address': addresse});
        })
        fd.append("addresses", JSON.stringify(tAddresses));
      }
      createMutation.mutate(fd);
      setStore(formData);
      setCurrentState('viewing');
    }
  };

  const handleEdit = () => {
    if (store) {
      setFormData(store);
      if (store.addresses) {
        setAddressInputs(store.addresses.length > 0 ? store.addresses : ['']);
      }
      
      // Установка начальных значений для логотипа
      if (store.logo_url) {
        setIsFileLogoActive(true);
        setIsTextLogoActive(false);
      } else {
        setIsFileLogoActive(false);
        setIsTextLogoActive(true);
      }
      
      setCurrentState('editing');
      setCurrentStep('step1');
    }
  };

  type MutationInput = {
    f: FormData;
    shopId: number;
  };

  const updateMutation = useMutation(
      ({ f, shopId }: MutationInput) => updateShop(shopId, f),
      {
        onSuccess: () => {
          queryClient.invalidateQueries("shops");
          navigate("/shops");
        },
        onError: (error: Error & { response?: { data: { detail: string } } }) => {
          toast.error(
              `Не удалось обновить магазин: ${error.response?.data.detail || 'Неизвестная ошибка'}`
          );
        },
      }
  );

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const fieldsToValidate = ['subdomain', 'primary_color', 'inn', 'phone', 'tg', 'whatsapp'] as const;
    let isValid = true;

    fieldsToValidate.forEach(field => {
      const value = formData[field];
      if (typeof value === 'string' || value === undefined) {
        if (!validateInput(field, value)) {
          isValid = false;
        }
      }
    });

    if (formData.addresses && formData.addresses.length > 0) {
      const addressesValid = await validateAddresses(formData.addresses, true);
      if (!addressesValid) {
        isValid = false;
      }
    }

    if (isValid) {
      setStore(formData);

      if (formData.id) {
        const fd = new FormData();
        fd.append("subdomain", formData.subdomain);
        fd.append("color", formData.primary_color || "#FFFFFF");
        fd.append("inn", formData.inn);
        fd.append("phone", formData.phone);
        fd.append("tg", formData.tg);
        fd.append("whatsapp", formData.whatsapp);

        if (isTextLogoActive) {
          fd.append("use_text_logo", "true");
        } else if (formData.new_logo) {
          fd.append("logo", formData.new_logo);
        }

        if (formData.addresses && formData.addresses.length > 0) {
          const tAddresses : StoreAddressOld[] = [];
          formData.addresses.forEach(addresse => {
            tAddresses.push({'phone': '1', 'address': addresse});
          })
            fd.append("addresses", JSON.stringify(tAddresses));
        }

        updateMutation.mutate({ f: fd, shopId: formData.id });
      }

      setCurrentState('viewing');
    } else {
      toast.error("Пожалуйста, исправьте ошибки в форме");
    }
  };

  const renderStep1 = (isEditing: boolean) => (
      <div className={styles.formContainer}>
        <form className={styles.form} onSubmit={handleNextStep}>
          <h2>{isEditing ? 'Редактирование магазина' : 'Создание магазина'}</h2>

          <div className={styles.formGroup}>
            <input
                type="text"
                name="subdomain"
                placeholder="Название на английском"
                value={formData.subdomain}
                onChange={handleInputChange}
                className={errors.name ? styles.inputError : ''}
                required
            />
            {errors.subdomain && <p className={styles.error}>{errors.subdomain}</p>}
          </div>

          <div className={styles.formGroup}>
            <TextField
                type="color"
                label="Выберите цвет"
                fullWidth
                value={formData.primary_color}
                onChange={
                  (e) => setFormData(
                      prev => (
                          { ...prev, ['primary_color']: e.target.value })
                  )
                }
            />
            {errors.color && <p className={styles.error}>{errors.color}</p>}
          </div>

          <div className={styles.formGroup}>
            <input
                type="text"
                name="inn"
                placeholder="ИНН"
                value={formData.inn}
                onChange={handleInputChange}
                className={errors.inn ? styles.inputError : ''}
                pattern="\d{10}|\d{12}"
                required
            />
            {errors.inn && <p className={styles.error}>{errors.inn}</p>}
          </div>

          {addressInputs.map((address, index) => (<>
              <div key={index} className={styles.addressGroup}>
                <input
                    type="text"
                    name={`address${index}`}
                    placeholder="Адрес точки продаж"
                    value={address}
                    onChange={(e) => handleAddressInputChange(index, e.target.value)}
                    className={errors[`address${index}`] ? styles.inputError : ''}
                    required
                />
                {index === addressInputs.length - 1 && (
                    <button
                        type="button"
                        onClick={handleAddAddress}
                        className={styles.addAddressButton}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 5V19M5 12H19" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                )}

              </div>
              {errors[`address${index}`] && <p className={styles.error}>{errors[`address${index}`]}</p>}
              </>
          ))}

          <div className={styles.buttonGroup}>
            <button
                type="button"
                className={styles.secondaryButton}
                onClick={() => setCurrentState(isEditing ? 'viewing' : 'empty')}
            >
              Отмена
            </button>
            <button type="submit" className={styles.button}>
              Далее
            </button>
          </div>
        </form>
      </div>
  );

  const renderStep2 = (isEditing: boolean) => (
      <div className={styles.formContainer}>
        <form className={styles.form} onSubmit={isEditing ? handleSave : handleCreate}>
          <h2>{isEditing ? 'Редактирование магазина' : 'Создание магазина'}</h2>

          <div className={styles.formGroup}>
            <input
                type="tel"
                name="phone"
                placeholder="Рабочий номер телефона"
                value={formData.phone}
                onChange={handleInputChange}
                className={errors.phone ? styles.inputError : ''}
                pattern="\+?\d{10,12}"
                required
            />
            {errors.phone && <p className={styles.error}>{errors.phone}</p>}
          </div>

          <div className={styles.formGroup}>
            <input
                type="text"
                name="tg"
                placeholder="Номер Telegram"
                value={formData.tg}
                onChange={handleInputChange}
                className={errors.tg ? styles.inputError : ''}
                pattern="\d{10,12}"
                required
            />
            {errors.tg && <p className={styles.error}>{errors.tg}</p>}
          </div>

          <div className={styles.formGroup}>
            <input
                type="text"
                name="whatsapp"
                placeholder="Номер WhatsApp"
                value={formData.whatsapp}
                onChange={handleInputChange}
                className={errors.whatsapp ? styles.inputError : ''}
                pattern="\d{10,12}"
                required
            />
            {errors.whatsapp && <p className={styles.error}>{errors.whatsapp}</p>}
          </div>

          <div className={styles.logoButtonGroup}>
            <button
                type="button"
                className={`${styles.logoButton} ${isTextLogoActive ? styles.activeButton : ''}`}
                onClick={handleTextLogoToggle}
            >
              Использовать название, как логотип
            </button>
            <label
                htmlFor="logoUpload"
                className={`${styles.logoButton} ${isFileLogoActive ? styles.activeButton : ''}`}
            >
              Загрузить логотип
            </label>
            <input
                id="logoUpload"
                type="file"
                accept="image/png"
                onChange={handleFileChange}
                style={{ display: 'none' }}
            />
            <p className={styles.uploadHint}>Изображение в формате PNG без фона.</p>
            {logoError && <p className={styles.error}>{logoError}</p>}
          </div>

          <div className={styles.buttonGroup}>
            <button
                type="button"
                className={styles.secondaryButton}
                onClick={() => setCurrentStep('step1')}
            >
              Назад
            </button>
            <button type="submit" className={styles.button}>
              {isEditing ? 'Сохранить' : 'Создать'}
            </button>
          </div>
        </form>
      </div>
  );

  const renderForm = (isEditing: boolean) => {
    if (currentStep === 'step1') {
      return renderStep1(isEditing);
    }
    return renderStep2(isEditing);
  };

  const renderEmptyState = () => (
      <div className={styles.emptyState}>
        <h1 className={styles.emptyStateTitle}>Магазина нет</h1>
        <p className={styles.createNowText}>Создайте его прямо сейчас</p>
        <button
            className={styles.button}
            onClick={() => setCurrentState('creating')}
        >
          Создать магазин
        </button>
      </div>
  );

  const renderViewingState = () => {
    if (!store) return null;
    const storeLink = `${store.subdomain.toLowerCase()}.flourum.ru`;

    return (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
            <tr>
              <th>Название</th>
              <th>Ссылка</th>
              <th>Цвет</th>
              <th>Логотип</th>
              <th>Действия</th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>{store.subdomain}</td>
              <td><Link to={`https://${storeLink}`} target="_blank">{storeLink}</Link></td>
              <td>{store.primary_color}</td>
              <td className={styles.logoCell}>
                {!store.logo_url ? (
                    <span className={styles.textLogo}>{store.subdomain}</span>
                ) : store.logo_url ? (
                    <div className={styles.logoContainer}>
                      <img src={store.logo_url} alt="Store Logo" className={styles.logoImage} />
                    </div>
                ) : (
                    'Нет логотипа'
                )}
              </td>
              <td className={styles.actionsCell}>
                <button className={styles.actionButton} onClick={() => window.open(`https://${storeLink}`, '_blank')}>Открыть</button>
                <button className={styles.actionButton} onClick={handleEdit}>
                  Изменить
                </button>
                <button className={styles.actionButtonIcon} onClick={() =>
                    deleteMutation.mutate(store.id!)
                }>
                  <span className={styles.trashIcon}>🗑</span>
                </button>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
    );
  };

  return (
    <div className={styles.container}>
      {currentState === 'empty' && renderEmptyState()}
      {currentState === 'creating' && renderForm(false)}
      {currentState === 'viewing' && renderViewingState()}
      {currentState === 'editing' && renderForm(true)}
    </div>
  );
};

export default StoresPage;
