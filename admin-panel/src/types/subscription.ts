export enum SubscriptionState {
  INITIAL = 1,
  CONSENT = 2,
  EMAIL_INPUT = 3,
  ACTIVE = 4,
  CANCEL_CONFIRMATION = 5,
  CANCELLED = 6
}

export interface ConsentItem {
  id: number;
  text: string;
  checked: boolean;
  href?: string;
}

export interface SubscriptionProps {
  currentState?: SubscriptionState;
  email?: string;
  subscriptionEndDate?: string;
  cancellationDate?: string;
  onStateChange?: (newState: SubscriptionState) => void;
  onEmailSubmit?: (email: string) => Promise<void>; // Асинхронный тип
  onCancel?: () => Promise<void>; // Асинхронный тип
}

export interface SubscriptionBlockProps {
  currentState: SubscriptionState; // Обязательное состояние
  email?: string; // Опциональный email для состояния
  onStateChange: (newState: SubscriptionState) => void;
  onEmailSubmit?: (email: string) => Promise<void>; // Асинхронный тип
  onCancel?: () => Promise<void>; // Асинхронный тип
  userId?: number;
  backUrl?: string;
  until?: string;
}