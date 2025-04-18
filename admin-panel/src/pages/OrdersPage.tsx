import React, { useState, useEffect } from 'react';
import styles from './OrdersPage.module.css';
import { getOrders, searchOrders } from '../api/orders';
import { OrderResponse } from '../types/order';

const OrdersPage: React.FC = () => {
    const [orders, setOrders] = useState<OrderResponse[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const data = await getOrders();
            console.log(data)
            setOrders(data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch orders');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!searchTerm.trim()) {
            fetchOrders();
            return;
        }

        try {
            setLoading(true);
            const data = await searchOrders(searchTerm);
            setOrders(data);
            setError(null);
        } catch (err) {
            setError('Failed to search orders');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU');
    };

    const formatAddress = (order: OrderResponse) => {
        if (order.isSelfPickup) return 'Самовывоз';
        
        const parts = [];
        if (order.city) parts.push(order.city);
        if (order.street) parts.push(order.street);
        if (order.house) parts.push(order.house);
        if (order.building) parts.push(`корп. ${order.building}`);
        if (order.apartment) parts.push(`кв. ${order.apartment}`);
        
        return parts.join(', ');
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.pageTitle}>Заказы</h2>
            <div className={styles.searchBar}>
                <input
                    type="text"
                    placeholder="Поиск по заказам"
                    className={styles.searchInput}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className={styles.startButton} onClick={handleSearch}>Начать</button>
            </div>
            <div className={styles.tableHeader}>
                <div className={styles.tableHeaderItem}>ID</div>
                <div className={styles.tableHeaderItem}>ФИО</div>
                <div className={styles.tableHeaderItem}>Телефон</div>
                <div className={styles.tableHeaderItem}>Дата доставки</div>
                <div className={styles.tableHeaderItem}>Адрес</div>
                <div className={styles.tableHeaderItem}>Статус</div>
            </div>
            {loading ? (
                <div className={styles.loading}>Загрузка...</div>
            ) : error ? (
                <div className={styles.error}>{error}</div>
            ) : orders.length === 0 ? (
                <div className={styles.emptyState}>
                    <p className={styles.emptyTitle}>Заказов пока нет</p>
                    <p className={styles.emptySubtitle}>Начинайте действовать ссылок на вашу витрину</p>
                </div>
            ) : (
                <div className={styles.ordersTable}>
                    {orders.map((order) => (
                        <div key={order.id} className={styles.orderRow}>
                            <div className={styles.orderCell}>{order.id}</div>
                            <div className={styles.orderCell}>{order.fullName}</div>
                            <div className={styles.orderCell}>{order.phoneNumber}</div>
                            <div className={styles.orderCell}>{formatDate(order.deliveryDate)}</div>
                            <div className={styles.orderCell}>{formatAddress(order)}</div>
                            <div className={styles.orderCell}>{order.status}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrdersPage;