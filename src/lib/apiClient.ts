import {
  User,
  Deal,
  DealDetails,
  Photo,
  PhotoGroup,
  DealWithCover,
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
    title: 'Солнышко, улыбнись!',
    date: '2025-04-05',
    status: 'ready',
    source: 'bitrix',
    photosCount: 16,
  },
  {
    id: '2',
    title: 'Радость к нам приходит',
    date: '2024-12-20',
    status: 'pending_payment',
    source: 'bitrix',
    photosCount: 12,
  },
  {
    id: '3',
    title: 'Мир',
    date: '2024-11-18',
    status: 'processing',
    source: 'bitrix',
    photosCount: 8,
  },
  {
    id: '4',
    title: 'Осенние забавы',
    date: '2024-10-10',
    status: 'ready',
    source: 'bitrix',
    photosCount: 10,
  },
  {
    id: '5',
    title: 'Верю в тебя',
    date: '2024-09-17',
    status: 'ready',
    source: 'bitrix',
    photosCount: 14,
  },
  {
    id: '6',
    title: 'Прованс',
    date: '2024-08-05',
    status: 'ready',
    source: 'bitrix',
    photosCount: 9,
  },
];

// Реальные фото детей с Unsplash
const childrenPhotoIds = [
  '1503454537195-1dcabb73ffb9', // ребенок улыбается
  '1503919545889-aef636e10ad4', // дети играют
  '1516627145497-ae6968895b74', // детский портрет
  '1519340241574-2cec6aef0c01', // ребенок с мячом
  '1484820540004-14229fe36ca4', // дети в парке
  '1471286174890-9c112ffca5b4', // счастливый ребенок
  '1502086223501-7ea6ecd79368', // дети смеются
  '1519457431-44ccd64a579b', // ребенок на природе
  '1476703993599-0035a21b17a9', // детский портрет
  '1489710437720-ebb67ec84dd2', // дети играют
];

const mockPhotos: Record<string, Photo[]> = {
  '1': Array.from({ length: 5 }, (_, i) => ({
    id: `photo-1-${i + 1}`,
    url: `https://images.unsplash.com/photo-${childrenPhotoIds[i % childrenPhotoIds.length]}?w=1200&h=800&fit=crop`,
    thumbnailUrl: `https://images.unsplash.com/photo-${childrenPhotoIds[i % childrenPhotoIds.length]}?w=400&h=300&fit=crop`,
    shootingDate: '2024-11-15',
  })),
  '2': Array.from({ length: 5 }, (_, i) => ({
    id: `photo-2-${i + 1}`,
    url: `https://images.unsplash.com/photo-${childrenPhotoIds[(i + 2) % childrenPhotoIds.length]}?w=1200&h=800&fit=crop`,
    thumbnailUrl: `https://images.unsplash.com/photo-${childrenPhotoIds[(i + 2) % childrenPhotoIds.length]}?w=400&h=300&fit=crop`,
    shootingDate: '2024-11-20',
  })),
  '3': Array.from({ length: 5 }, (_, i) => ({
    id: `photo-3-${i + 1}`,
    url: `https://images.unsplash.com/photo-${childrenPhotoIds[(i + 4) % childrenPhotoIds.length]}?w=1200&h=800&fit=crop`,
    thumbnailUrl: `https://images.unsplash.com/photo-${childrenPhotoIds[(i + 4) % childrenPhotoIds.length]}?w=400&h=300&fit=crop`,
    shootingDate: '2024-11-10',
  })),
};

const mockGroups: Record<string, PhotoGroup[]> = {
  '1': [
    { id: 'group-1-1', dealId: '1', name: 'Младшая группа А', coverUrl: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=300&fit=crop', photosCount: 16 },
    { id: 'group-1-2', dealId: '1', name: 'Младшая группа Б', coverUrl: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=400&h=300&fit=crop', photosCount: 12 },
    { id: 'group-1-3', dealId: '1', name: 'Младшая группа В', coverUrl: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=400&h=300&fit=crop', photosCount: 8 },
    { id: 'group-1-4', dealId: '1', name: 'Средняя группа А', coverUrl: 'https://images.unsplash.com/photo-1519340241574-2cec6aef0c01?w=400&h=300&fit=crop', photosCount: 10 },
    { id: 'group-1-5', dealId: '1', name: 'Средняя группа Б', coverUrl: 'https://images.unsplash.com/photo-1484820540004-14229fe36ca4?w=400&h=300&fit=crop', photosCount: 14 },
    { id: 'group-1-6', dealId: '1', name: 'Старшая группа А', coverUrl: 'https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=400&h=300&fit=crop', photosCount: 9 },
    { id: 'group-1-7', dealId: '1', name: 'Старшая группа Б', coverUrl: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=400&h=300&fit=crop', photosCount: 11 },
    { id: 'group-1-8', dealId: '1', name: 'Старшая группа В', coverUrl: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=400&h=300&fit=crop', photosCount: 7 },
  ],
  '2': [
    { id: 'group-2-1', dealId: '2', name: 'Группа 1', coverUrl: 'https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=400&h=300&fit=crop', photosCount: 6 },
    { id: 'group-2-2', dealId: '2', name: 'Группа 2', coverUrl: 'https://images.unsplash.com/photo-1489710437720-ebb67ec84dd2?w=400&h=300&fit=crop', photosCount: 6 },
  ],
  '3': [
    { id: 'group-3-1', dealId: '3', name: 'Основная группа', coverUrl: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=300&fit=crop', photosCount: 8 },
  ],
  '4': [
    { id: 'group-4-1', dealId: '4', name: 'Группа А', coverUrl: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=400&h=300&fit=crop', photosCount: 5 },
    { id: 'group-4-2', dealId: '4', name: 'Группа Б', coverUrl: 'https://images.unsplash.com/photo-1519340241574-2cec6aef0c01?w=400&h=300&fit=crop', photosCount: 5 },
  ],
  '5': [
    { id: 'group-5-1', dealId: '5', name: 'Младшая группа', coverUrl: 'https://images.unsplash.com/photo-1484820540004-14229fe36ca4?w=400&h=300&fit=crop', photosCount: 7 },
    { id: 'group-5-2', dealId: '5', name: 'Старшая группа', coverUrl: 'https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=400&h=300&fit=crop', photosCount: 7 },
  ],
  '6': [
    { id: 'group-6-1', dealId: '6', name: 'Группа 1', coverUrl: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=400&h=300&fit=crop', photosCount: 9 },
  ],
};

const mockGroupPhotos: Record<string, Photo[]> = {
  'group-1-1': Array.from({ length: 3 }, (_, i) => ({
    id: `gphoto-1-1-${i + 1}`,
    url: `https://images.unsplash.com/photo-${childrenPhotoIds[i % childrenPhotoIds.length]}?w=1200&h=800&fit=crop`,
    thumbnailUrl: `https://images.unsplash.com/photo-${childrenPhotoIds[i % childrenPhotoIds.length]}?w=400&h=300&fit=crop`,
    shootingDate: '2024-11-15',
  })),
  'group-1-2': Array.from({ length: 2 }, (_, i) => ({
    id: `gphoto-1-2-${i + 1}`,
    url: `https://images.unsplash.com/photo-${childrenPhotoIds[(i + 1) % childrenPhotoIds.length]}?w=1200&h=800&fit=crop`,
    thumbnailUrl: `https://images.unsplash.com/photo-${childrenPhotoIds[(i + 1) % childrenPhotoIds.length]}?w=400&h=300&fit=crop`,
    shootingDate: '2024-11-15',
  })),
  'group-2-1': Array.from({ length: 3 }, (_, i) => ({
    id: `gphoto-2-1-${i + 1}`,
    url: `https://images.unsplash.com/photo-${childrenPhotoIds[(i + 2) % childrenPhotoIds.length]}?w=1200&h=800&fit=crop`,
    thumbnailUrl: `https://images.unsplash.com/photo-${childrenPhotoIds[(i + 2) % childrenPhotoIds.length]}?w=400&h=300&fit=crop`,
    shootingDate: '2024-11-20',
  })),
  'group-2-2': Array.from({ length: 2 }, (_, i) => ({
    id: `gphoto-2-2-${i + 1}`,
    url: `https://images.unsplash.com/photo-${childrenPhotoIds[(i + 3) % childrenPhotoIds.length]}?w=1200&h=800&fit=crop`,
    thumbnailUrl: `https://images.unsplash.com/photo-${childrenPhotoIds[(i + 3) % childrenPhotoIds.length]}?w=400&h=300&fit=crop`,
    shootingDate: '2024-11-20',
  })),
  'group-2-3': Array.from({ length: 2 }, (_, i) => ({
    id: `gphoto-2-3-${i + 1}`,
    url: `https://images.unsplash.com/photo-${childrenPhotoIds[(i + 4) % childrenPhotoIds.length]}?w=1200&h=800&fit=crop`,
    thumbnailUrl: `https://images.unsplash.com/photo-${childrenPhotoIds[(i + 4) % childrenPhotoIds.length]}?w=400&h=300&fit=crop`,
    shootingDate: '2024-11-20',
  })),
  'group-3-1': Array.from({ length: 3 }, (_, i) => ({
    id: `gphoto-3-1-${i + 1}`,
    url: `https://images.unsplash.com/photo-${childrenPhotoIds[(i + 5) % childrenPhotoIds.length]}?w=1200&h=800&fit=crop`,
    thumbnailUrl: `https://images.unsplash.com/photo-${childrenPhotoIds[(i + 5) % childrenPhotoIds.length]}?w=400&h=300&fit=crop`,
    shootingDate: '2024-11-10',
  })),
  'group-3-2': Array.from({ length: 2 }, (_, i) => ({
    id: `gphoto-3-2-${i + 1}`,
    url: `https://images.unsplash.com/photo-${childrenPhotoIds[(i + 6) % childrenPhotoIds.length]}?w=1200&h=800&fit=crop`,
    thumbnailUrl: `https://images.unsplash.com/photo-${childrenPhotoIds[(i + 6) % childrenPhotoIds.length]}?w=400&h=300&fit=crop`,
    shootingDate: '2024-11-10',
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

  async getDealsWithCovers(): Promise<DealWithCover[]> {
    await delay(800);
    return mockDeals.map((deal, index) => ({
      ...deal,
      coverUrl: `https://images.unsplash.com/photo-${childrenPhotoIds[index % childrenPhotoIds.length]}?w=400&h=300&fit=crop`,
    }));
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

  async getDealGroups(dealId: string): Promise<PhotoGroup[]> {
    await delay(600);
    const groups = mockGroups[dealId] || [];
    // Return only top-level groups (no parentId)
    return groups.filter(g => !g.parentId);
  },

  async getGroupPhotos(groupId: string): Promise<Photo[]> {
    await delay(600);
    return mockGroupPhotos[groupId] || [];
  },

  async getChildGroups(parentGroupId: string, dealId: string): Promise<PhotoGroup[]> {
    await delay(400);
    const groups = mockGroups[dealId] || [];
    return groups.filter(g => g.parentId === parentGroupId);
  },

  async getGroupDetails(groupId: string, dealId: string): Promise<PhotoGroup | null> {
    await delay(300);
    const groups = mockGroups[dealId] || [];
    return groups.find(g => g.id === groupId) || null;
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
