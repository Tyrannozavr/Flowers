import React, {useState, useRef, useEffect} from 'react';
import styles from './StoresPage.module.css';
import {useMutation, useQuery, useQueryClient} from "react-query";
import {createShop, deleteShop, fetchShops, updateShop} from "../api/shops";
import {Box, TextField} from "@mui/material";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";

interface StoreAddress {
  address: string;
  phone: string;
}
interface Store {
  id: number;
  inn: string;
  logo_url: string;
  phone: string;
  primary_color: string;
  subdomain: string;
  tg: string;
  whatsapp: string;
  addresses?: StoreAddress[];
}

type StoreState = 'empty' | 'creating' | 'viewing' | 'editing';

const StoresPage: React.FC = () => {
  const [editingStoreId, setEditingStoreId] = useState<number | -1>(-1);
  const [currentState, setCurrentState] = useState<StoreState>('empty');
  const queryClient = useQueryClient();
  const {
    data: shops,
  } = useQuery("shops", fetchShops, {
    retry: false,
    onSuccess: (data) => {
      console.log(data);
      if (!data) {
        setCurrentState('empty');
      } else {
        if (!data.length) {
          setCurrentState('empty');
        } else {
          setCurrentState('viewing');
        }
      }
    }
  });
  const deleteMutation = useMutation(deleteShop, {
    onSuccess: () => queryClient.invalidateQueries("shops"),
  });

  // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  //   const { name, value } = e.target;
  //   setFormData(prev => ({ ...prev, [name]: value }));
  // };

  const handleEdit = (id: number) => {
    setEditingStoreId(id);
    const shop = shops.find((shop: Store) => shop.id === id);
    if (shop) {
      setSubdomain(shop.subdomain);
      setPrimaryColor(shop.primary_color);
      logoRef.current = shop.logo_url;
      setPhone(shop.phone);
      setInn(shop.inn);
      setTg(shop.tg);
      setWhatsApp(shop.whatsapp);
      setAddresses(shop.addresses);
    }
    setCurrentState('editing');
  };

  // const handleSave = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setStore(formData);
  //   setCurrentState('viewing');
  // };

  const logoRef = useRef<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    logoRef.current = file;

    // Вы можете добавить здесь логику для работы с файлом
    console.log("Загруженный файл:", file);
  };
  const navigate = useNavigate();
  const [subdomain, setSubdomain] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#FFFFFF");
  const [phone, setPhone] = useState("");
  const [inn, setInn] = useState("");
  const [tg, setTg] = useState("");
  const [whatsapp, setWhatsApp] = useState("");
  const [addresses, setAddresses] = useState<
      { phone: string; address: string }[]
  >([]);
  const handleAddressChange = (
      index: number,
      field: "phone" | "address",
      value: string
  ) => {
    const updatedAddresses = [...addresses];
    updatedAddresses[index][field] = value;
    setAddresses(updatedAddresses);
  };
  const handleRemoveAddress = (index: number) => {
    setAddresses(addresses.filter((_, i) => i !== index));
  };
  const handleAddAddress = () => {
    setAddresses((prev) => [...prev, { phone: "", address: "" }]);
  };
  const createMutation = useMutation(
      (formData: FormData) => createShop(formData),
      {
        onSuccess: () => {
          queryClient.invalidateQueries("shops");
          navigate("/shops");
        },
        onError: (error: any) => {
          toast.error(
              `Не удалось создать магазин: ${error.response.data.detail}`
          );
        },
      }
  );
  const updateMutation = useMutation(
      ({ formData, shopId }: { formData: FormData; shopId: number }) =>
          updateShop(shopId, formData),
      {
        onSuccess: () => {
          queryClient.invalidateQueries("shops");
          navigate("/shops");
        },
        onError: (error: any) => {
          toast.error(
              `Не удалось обновить магазин: ${error.response.data.detail}`
          );
        },
      }
  );
  const handleSave = async (type: 'update' | 'create') => {
    const formData = new FormData();
    formData.append("subdomain", subdomain);
    formData.append("color", primaryColor || "#FFFFFF");
    formData.append("inn", inn);
    formData.append("phone", phone);
    formData.append("tg", tg);
    formData.append("whatsapp", whatsapp);

    if (logoRef.current) {
      formData.append("logo", logoRef.current);
    }

    formData.append("addresses", JSON.stringify(addresses));

    if (type == 'update' && editingStoreId) {
      updateMutation.mutate({ formData, shopId: editingStoreId });
    } else {
      createMutation.mutate(formData);
    }
  };
  useEffect(() => {
    console.log(currentState);
    console.log(logoRef.current);
  }, [currentState]);

  const renderForm = (isEditing: boolean) => (
    <div className={styles.formContainer}>
      <div className={styles.form}>
        <h2>{isEditing ? 'Редактирование магазина' : 'Создание магазина'}</h2>

        <div className={styles.formGroup}>
          <input
            type="text"
            placeholder="Название на английском"
            value={subdomain}
            onChange={(e) => setSubdomain(e.target.value)}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <TextField
              type="color"
              label="Выберите цвет"
              fullWidth
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <input
              placeholder="ИНН"
              value={inn}
              onChange={(e) => setInn(e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <input
            placeholder="Рабочий номер телефона"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <input
            type="text"
            placeholder="Номер Telegram"
            value={tg}
            onChange={(e) => setTg(e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <input
            type="text"
            placeholder="Номер WhatsApp"
            value={whatsapp}
            onChange={(e) => setWhatsApp(e.target.value)}
            required
          />
        </div>

        <div className={styles.formGroup}>
          {addresses.map((address, index) => (
              <Box key={index} display="flex" gap={2} className={styles.formGroup}>
                <input
                    type="text"
                    placeholder="Номер телефона"
                    value={address.phone}
                    onChange={(e) =>
                        handleAddressChange(
                            index,
                            "phone",
                            e.target.value
                        )
                    }
                    required
                />
                <input
                    placeholder="Адрес"
                    value={address.address}
                    onChange={(e) =>
                        handleAddressChange(
                            index,
                            "address",
                            e.target.value
                        )
                    }
                />
                <button
                    type="button"
                    className={styles.secondaryButton}
                    onClick={() => handleRemoveAddress(index)}

                >
                  Удалить
                </button>
              </Box>
          ))}
          <button type="button" className={styles.secondaryButton} onClick={handleAddAddress}>
            Добавить адрес
          </button>
        </div>

        <div className={styles.uploadButton}>
          <label className={styles.secondaryButton}>
            Загрузить логотип
            <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleFileChange}
            />
          </label>
        </div>

        <div className={styles.buttonGroup}>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={() => setCurrentState(isEditing ? 'viewing' : 'empty')}
          >
            Отмена
          </button>
          <button
              className={styles.button}
              onClick={ () => handleSave(isEditing ? 'update' : 'create') }
              disabled={!subdomain || !primaryColor || !inn || !phone}
          >
            {isEditing ? 'Сохранить' : 'Создать'}
          </button>
        </div>
      </div>
    </div>
  );

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

    return (
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Название</th>
              <th>Ссылка</th>
              <th>Цвет</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
          {shops.map((store: Store) => (
            <tr key={store.id}>
              <td>{store.subdomain}</td>
              <td>{`${store.subdomain.toLowerCase()}.flourum.ru`}</td>
              <td>
                <span className={styles.colorCell}>
                  {store.primary_color}
                </span>
              </td>
              <td className={styles.actionsCell}>
                <button className={styles.actionButton} onClick={() => {
                  window.location.href = `https://${store.subdomain.toLowerCase()}.flourum.ru`;
                }}>
                  Открыть
                </button>
                <button className={styles.actionButton} onClick={() => handleEdit(store.id)}>
                  Изменить
                </button>
                <button className={styles.actionButtonIcon} onClick={() =>
                    deleteMutation.mutate(store.id)
                }>
                  <span className={styles.trashIcon}>🗑</span>
                </button>
              </td>
            </tr>
          ))}
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
