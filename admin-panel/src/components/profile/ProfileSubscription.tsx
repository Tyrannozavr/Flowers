import React, { useState, useEffect } from 'react';
import { SubscriptionBlock } from './SubscriptionBlock';
import { SubscriptionState } from '../../types/subscription';
import { useAuth } from '../../context/AuthContext';
import { checkPay, cancelSubscription } from '../../api/profile';


export const ProfileSubscription: React.FC = () => {
  const [subscriptionState, setSubscriptionState] = useState<SubscriptionState>(SubscriptionState.INITIAL);
  const [email, setEmail] = useState<string>(''); // Локальное состояние для email
  const [until, setUntil] = useState<string>('');

  const handleEmailSubmit = async (email: string) => {
    // Здесь вы бы обычно делали API-запрос для валидации/сохранения email
    console.log('Email submitted:', email);
    setEmail(email); // Обновляем локальное состояние email
  };

  const handleCancel = async () => {
    // Здесь вы бы обычно делали API-запрос для отмены подписки
    try {
      await cancelSubscription(userId);
      console.log('Subscription cancelled');
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
    }
  };

  const { userId } = useAuth();
  const backUrl = window.location.origin+'/profile';

  useEffect(() => {
    const checkSubscriptionStatus = async () => {
      if (userId) {
        try {
          const rs = await checkPay(userId);
          if (rs.currentStatus === 'CONFIRMED') {
            const dateString: string = rs.until;
            const date: Date = new Date(dateString);
            const day: string = String(date.getDate()).padStart(2, '0');
            const month: string = String(date.getMonth() + 1).padStart(2, '0');
            const year: number = date.getFullYear();
            setUntil(`${day}.${month}.${year}`);

            setSubscriptionState(SubscriptionState.ACTIVE);
          }
        } catch (error) {
          console.error('Error checking subscription status:', error);
        }
      }
    };

    checkSubscriptionStatus();
  }, [userId]);

  return (
      <SubscriptionBlock
          currentState={subscriptionState}
          userId={userId}
          email={email}
          backUrl={backUrl}
          onStateChange={setSubscriptionState}
          onEmailSubmit={handleEmailSubmit}
          onCancel={handleCancel}
          until={until}
      />
  );
};