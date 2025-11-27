export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  notificationSettings?: {
    smsEnabled: boolean;
    whatsappEnabled: boolean;
  };
}

export type DealStatus = 'processing' | 'ready' | 'cancelled' | 'pending_payment';

export interface Deal {
  id: string;
  title: string;
  date: string;
  status: DealStatus;
  source: 'bitrix';
  photosCount: number;
}

export interface DealDetails extends Deal {
  description?: string;
}

export interface Photo {
  id: string;
  url: string;
  thumbnailUrl: string;
}

export type NotificationChannel = 'sms' | 'whatsapp';

export interface NotificationTemplate {
  id: string;
  name: string;
  channel: NotificationChannel;
  text: string;
}

export type NotificationTestStatus = 'success' | 'error';

export interface NotificationTest {
  id: string;
  dealId: string;
  channel: NotificationChannel;
  phone: string;
  status: NotificationTestStatus;
  createdAt: string;
}

export interface SendNotificationTestPayload {
  dealId: string;
  channel: NotificationChannel;
  phone: string;
  templateId: string;
}
