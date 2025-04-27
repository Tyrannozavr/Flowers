import React, { useState, useEffect } from 'react';
import styles from './DeliveryPage.module.css';
import { toast } from 'react-toastify';
import { 
  getDeliveryCost, 
  createDeliveryCost, 
  updateDeliveryCost, 
  DeliveryCostData,
  DeliveryCostResponse 
} from '../api/delivery';

const DeliveryPage: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [deliveryType, setDeliveryType] = useState<'radius' | 'fixed' | 'yandex_go' | null>(null);
    const [hasExistingData, setHasExistingData] = useState(false);
    
    // Form values
    const [fixedCost, setFixedCost] = useState<number>(0);
    const [radiusCosts, setRadiusCosts] = useState({
        "1": 0,
        "5": 0,
        "10": 0,
        "20": 0
    });
    
    // Loading data on component mount
    useEffect(() => {
        const fetchDeliveryCost = async () => {
            try {
                setLoading(true);
                const data = await getDeliveryCost();
                
                // Set form values from API data with null checks
                setFixedCost(data.fixed_cost || 0);
                
                // Ensure radius_cost is properly initialized
                if (data.radius_cost) {
                    setRadiusCosts({
                        "1": data.radius_cost["1"] || 0,
                        "5": data.radius_cost["5"] || 0,
                        "10": data.radius_cost["10"] || 0,
                        "20": data.radius_cost["20"] || 0
                    });
                }
                
                // Set active delivery type
                if (data.type === 'yandex_go') {
                    setDeliveryType('yandex_go');
                } else if (data.type === 'fixed') {
                    setDeliveryType('fixed');
                } else if (data.type === 'radius') {
                    setDeliveryType('radius');
                }
                
                // Check if we have existing data
                setHasExistingData(true);
                
            } catch (error) {
                console.error('Error fetching delivery cost:', error);
                // If we get a 404 or other error, assume no existing data
                setHasExistingData(false);
                // toast.error('Не удалось загрузить настройки доставки');
            } finally {
                setLoading(false);
            }
        };
        
        fetchDeliveryCost();
    }, []);
    
    // Handle radius cost change
    const handleRadiusCostChange = (key: '1' | '5' | '10' | '20', value: string) => {
        const numValue = value === '' ? 0 : Number(value);
        setRadiusCosts(prev => ({
            ...prev,
            [key]: numValue
        }));
    };
    
    // Handle delivery type change
    const handleDeliveryTypeChange = (type: 'radius' | 'fixed' | 'yandex_go') => {
        setDeliveryType(type === deliveryType ? null : type);
    };
    
    // Handle save
    const handleSave = async () => {
        if (!deliveryType) {
            toast.error('Выберите хотя бы один способ доставки');
            return;
        }
        
        try {
            let data: DeliveryCostData;
            
            // Prepare data based on the selected delivery type
            if (deliveryType === 'yandex_go') {
                data = {
                    type: 'yandex_go',
                    is_yandex_geo: true
                } as DeliveryCostData;
            } else if (deliveryType === 'fixed') {
                data = {
                    type: 'fixed',
                    fixed_cost: fixedCost
                } as DeliveryCostData;
            } else {
                data = {
                    type: 'radius',
                    radius_cost: radiusCosts
                } as DeliveryCostData;
            }
            
            // Use createDeliveryCost if there's no existing data, otherwise updateDeliveryCost
            let response: DeliveryCostResponse;
            if (hasExistingData) {
                response = await updateDeliveryCost(data);
            } else {
                response = await createDeliveryCost(data);
                // After creating, we now have existing data
                setHasExistingData(true);
            }
            
            toast.success('Настройки доставки успешно сохранены');
        } catch (error) {
            console.error('Error saving delivery cost:', error);
            toast.error('Не удалось сохранить настройки доставки');
        }
    };
    
    if (loading) {
        return <div className={styles.container}>Загрузка...</div>;
    }

    return (
        <div className={styles.container}>
            {/* Секция "Радиус" */}
            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <label className={styles.switch}>
                        <input
                            type="checkbox"
                            checked={deliveryType === 'radius'}
                            onChange={() => handleDeliveryTypeChange('radius')}
                        />
                        <span className={styles.slider}></span>
                    </label>
                    <h3 className={styles.sectionTitle}>Радиус</h3>
                </div>
                <p className={styles.sectionDescription}>
                    Расчёт стоимости доставки будет производить в зависимости от радиуса удаления клиента от точки продаж
                </p>
                <div className={styles.optionColumns}>
                    <div className={styles.optionColumn}>
                        <div className={styles.optionRow}>
                            <input
                                type="text"
                                placeholder="Радиус 1 км"
                                className={styles.optionInput}
                                value={radiusCosts["1"] || ''}
                                onChange={(e) => handleRadiusCostChange("1", e.target.value)}
                                disabled={deliveryType !== 'radius'}
                            />
                            <span className={styles.costLabel}></span>
                            <button
                                className={styles.changeButton}
                                disabled={deliveryType !== 'radius'}
                                onClick={handleSave}
                            >
                                Изменить
                            </button>
                        </div>
                        <div className={styles.optionRow}>
                            <input
                                type="text"
                                placeholder="Радиус 5 км"
                                className={styles.optionInput}
                                value={radiusCosts["5"] || ''}
                                onChange={(e) => handleRadiusCostChange("5", e.target.value)}
                                disabled={deliveryType !== 'radius'}
                            />
                            <span className={styles.costLabel}></span>
                            <button
                                className={styles.changeButton}
                                disabled={deliveryType !== 'radius'}
                                onClick={handleSave}
                            >
                                Изменить
                            </button>
                        </div>
                    </div>
                    <div className={styles.optionColumn}>
                        <div className={styles.optionRow}>
                            <input
                                type="text"
                                placeholder="Радиус 10 км"
                                className={styles.optionInput}
                                value={radiusCosts["10"] || ''}
                                onChange={(e) => handleRadiusCostChange("10", e.target.value)}
                                disabled={deliveryType !== 'radius'}
                            />
                            <span className={styles.costLabel}></span>
                            <button
                                className={styles.changeButton}
                                disabled={deliveryType !== 'radius'}
                                onClick={handleSave}
                            >
                                Изменить
                            </button>
                        </div>
                        <div className={styles.optionRow}>
                            <input
                                type="text"
                                placeholder="Радиус 20 км"
                                className={styles.optionInput}
                                value={radiusCosts["20"] || ''}
                                onChange={(e) => handleRadiusCostChange("20", e.target.value)}
                                disabled={deliveryType !== 'radius'}
                            />
                            <span className={styles.costLabel}></span>
                            <button
                                className={styles.changeButton}
                                disabled={deliveryType !== 'radius'}
                                onClick={handleSave}
                            >
                                Изменить
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Секция "Фиксированная" */}
            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <label className={styles.switch}>
                        <input
                            type="checkbox"
                            checked={deliveryType === 'fixed'}
                            onChange={() => handleDeliveryTypeChange('fixed')}
                        />
                        <span className={styles.slider}></span>
                    </label>
                    <h3 className={styles.sectionTitle}>Фиксированная</h3>
                </div>
                <p className={styles.sectionDescription}>
                    Стоимость доставки будет фиксирована
                </p>
                <div className={styles.optionRow}>
                    <input
                        type="text"
                        placeholder="Стоимость доставки"
                        className={styles.optionInput}
                        value={fixedCost || ''}
                        onChange={(e) => setFixedCost(Number(e.target.value))}
                        disabled={deliveryType !== 'fixed'}
                    />
                    <span className={styles.costLabel}></span>
                    <button
                        className={styles.changeButton}
                        disabled={deliveryType !== 'fixed'}
                        onClick={handleSave}
                    >
                        Изменить
                    </button>
                </div>
            </div>

            {/* Секция "Яндекс GO" */}
            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <label className={styles.switch}>
                        <input
                            type="checkbox"
                            checked={deliveryType === 'yandex_go'}
                            onChange={() => handleDeliveryTypeChange('yandex_go')}
                        />
                        <span className={styles.slider}></span>
                    </label>
                    <h3 className={styles.sectionTitle}>Яндекс GO</h3>
                </div>
                <p className={styles.sectionDescription}>
                    Стоимость доставки будет динамично рассчитываться, исходя из текущей стоимости через приложение Яндекс GO (от двери до двери)
                </p>
            </div>

            {/* Кнопка "Сохранить" */}
            <button 
                className={styles.saveButton} 
                onClick={handleSave}
                disabled={!deliveryType}
            >
                Сохранить
            </button>
        </div>
    );
};

export default DeliveryPage;