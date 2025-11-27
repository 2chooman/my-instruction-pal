import {
  User,
  Deal,
  DealDetails,
  Photo,
  NotificationTemplate,
  NotificationTest,
  SendNotificationTestPayload,
} from '@/types';

// Имитация задержки сети
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock данные
const mockUser: User = {
  id: '1',
  name: 'Иванов Иван Иванович',
  phone: '+7 (999) 123-45-67',
  email: 'ivanov@example.com',
  notificationSettings: {
    smsEnabled: true,
    whatsappEnabled: true,
  },
};

const mockDeals: Deal[] = [
  {
    id: '1',
    title: 'Семейная фотосессия в студии',
    date: '2024-11-15',
    status: 'ready',
    source: 'bitrix',
    photosCount: 5,
  },
  {
    id: '2',
    title: 'Свадебная съемка',
    date: '2024-11-20',
    status: 'processing',
    source: 'bitrix',
    photosCount: 5,
  },
  {
    id: '3',
    title: 'Детская фотосессия',
    date: '2024-11-10',
    status: 'ready',
    source: 'bitrix',
    photosCount: 5,
  },
];

const mockPhotos: Record<string, Photo[]> = {
  '1': Array.from({ length: 5 }, (_, i) => ({
    id: `photo-1-${i + 1}`,
    url: `https://images.unsplash.com/photo-${1511285560000 + i}?w=1200&h=800&fit=crop`,
    thumbnailUrl: `https://images.unsplash.com/photo-${1511285560000 + i}?w=400&h=300&fit=crop`,
  })),
  '2': Array.from({ length: 5 }, (_, i) => ({
    id: `photo-2-${i + 1}`,
    url: `https://images.unsplash.com/photo-${1519741644000 + i}?w=1200&h=800&fit=crop`,
    thumbnailUrl: `https://images.unsplash.com/photo-${1519741644000 + i}?w=400&h=300&fit=crop`,
  })),
  '3': Array.from({ length: 5 }, (_, i) => ({
    id: `photo-3-${i + 1}`,
    url: `https://images.unsplash.com/photo-${1503454537000 + i}?w=1200&h=800&fit=crop`,
    thumbnailUrl: `https://images.unsplash.com/photo-${1503454537000 + i}?w=400&h=300&fit=crop`,
  })),
};

const mockTemplates: NotificationTemplate[] = [
  {
    id: '1',
    name: 'Готовы предварительные фото',
    channel: 'sms',
    text: 'Здравствуйте, {Имя}! Ваши предварительные фотографии с фотосессии {Дата_фотосессии} готовы к просмотру.',
  },
  {
    id: '2',
    name: 'Готов окончательный альбом',
    channel: 'sms',
    text: 'Добрый день, {Имя}! Окончательный альбом с вашей фотосессии готов. Приглашаем вас для получения.',
  },
  {
    id: '3',
    name: 'Готовы предварительные фото (WhatsApp)',
    channel: 'whatsapp',
    text: 'Здравствуйте, {Имя}! 📸 Ваши предварительные фотографии с фотосессии {Дата_фотосессии} готовы к просмотру!',
  },
  {
    id: '4',
    name: 'Готов окончательный альбом (WhatsApp)',
    channel: 'whatsapp',
    text: 'Добрый день, {Имя}! ✨ Окончательный альбом с вашей фотосессии готов. Приглашаем вас для получения.',
  },
];

let mockNotificationTests: NotificationTest[] = [];

export const apiClient = {
  async loginWithTIDMock(): Promise<User> {
    await delay(1000);
    return mockUser;
  },

  async getCurrentUser(): Promise<User> {
    await delay(500);
    return mockUser;
  },

  async getDeals(): Promise<Deal[]> {
    await delay(800);
    return mockDeals;
  },

  async getDealDetails(id: string): Promise<DealDetails> {
    await delay(600);
    const deal = mockDeals.find(d => d.id === id);
    if (!deal) {
      throw new Error('Фотосессия не найдена');
    }
    return {
      ...deal,
      description: 'Профессиональная фотосессия с полной обработкой фотографий.',
    };
  },

  async getDealPhotos(id: string): Promise<Photo[]> {
    await delay(1000);
    return mockPhotos[id] || [];
  },

  async getNotificationTemplates(): Promise<NotificationTemplate[]> {
    await delay(400);
    return mockTemplates;
  },

  async sendNotificationTest(
    payload: SendNotificationTestPayload
  ): Promise<NotificationTest> {
    await delay(1500);
    
    // Случайный успех/ошибка для демонстрации
    const success = Math.random() > 0.2;
    
    const test: NotificationTest = {
      id: `test-${Date.now()}`,
      dealId: payload.dealId,
      channel: payload.channel,
      phone: payload.phone,
      status: success ? 'success' : 'error',
      createdAt: new Date().toISOString(),
    };
    
    mockNotificationTests.unshift(test);
    return test;
  },

  async getNotificationTestsByDeal(dealId: string): Promise<NotificationTest[]> {
    await delay(500);
    return mockNotificationTests
      .filter(test => test.dealId === dealId)
      .slice(0, 5);
  },
};
