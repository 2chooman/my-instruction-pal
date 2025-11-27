import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/apiClient';
import { NotificationTemplate, NotificationChannel, NotificationTest } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface NotificationPanelProps {
  dealId: string;
  dealTitle: string;
  dealDate: string;
}

export const NotificationPanel = ({ dealId, dealTitle, dealDate }: NotificationPanelProps) => {
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [recentTests, setRecentTests] = useState<NotificationTest[]>([]);
  const [selectedChannels, setSelectedChannels] = useState<NotificationChannel[]>(['sms']);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [templatesData, testsData] = await Promise.all([
          apiClient.getNotificationTemplates(),
          apiClient.getNotificationTestsByDeal(dealId),
        ]);
        setTemplates(templatesData);
        setRecentTests(testsData);
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      }
    };
    loadData();
  }, [dealId]);

  const selectedTemplate = templates.find(t => t.id === selectedTemplateId);
  const availableTemplates = templates.filter(t => 
    selectedChannels.length === 0 || selectedChannels.includes(t.channel)
  );

  const formatTemplateText = (text: string) => {
    return text
      .replace('{Имя}', 'Иван')
      .replace('{Дата_фотосессии}', new Date(dealDate).toLocaleDateString('ru-RU'));
  };

  const handleSendTest = async () => {
    if (!selectedTemplateId || !phone || selectedChannels.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Заполните все поля',
      });
      return;
    }

    setIsLoading(true);
    try {
      const channel = selectedChannels[0];
      const result = await apiClient.sendNotificationTest({
        dealId,
        channel,
        phone,
        templateId: selectedTemplateId,
      });

      setRecentTests([result, ...recentTests.slice(0, 4)]);

      toast({
        title: result.status === 'success' ? 'Успешно отправлено' : 'Ошибка отправки',
        description: result.status === 'success' 
          ? 'Тестовое уведомление отправлено'
          : 'Не удалось отправить уведомление',
        variant: result.status === 'error' ? 'destructive' : 'default',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Не удалось отправить уведомление',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: 'Times New Roman, serif' }}>
      <fieldset style={{ marginBottom: '20px', padding: '15px' }}>
        <legend><strong>Управление уведомлениями</strong></legend>
        <p><small>Настройте и отправьте тестовое уведомление клиенту</small></p>
        
        <h3>Каналы отправки</h3>
        <div>
          <input
            type="checkbox"
            id="sms-channel"
            checked={selectedChannels.includes('sms')}
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedChannels([...selectedChannels, 'sms']);
              } else {
                setSelectedChannels(selectedChannels.filter(c => c !== 'sms'));
              }
              setSelectedTemplateId('');
            }}
          />
          <label htmlFor="sms-channel"> SMS (через SMS.RU)</label>
        </div>
        <div>
          <input
            type="checkbox"
            id="whatsapp-channel"
            checked={selectedChannels.includes('whatsapp')}
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedChannels([...selectedChannels, 'whatsapp']);
              } else {
                setSelectedChannels(selectedChannels.filter(c => c !== 'whatsapp'));
              }
              setSelectedTemplateId('');
            }}
          />
          <label htmlFor="whatsapp-channel"> WhatsApp (через Meta Cloud API)</label>
        </div>

        <div style={{ marginTop: '15px' }}>
          <label htmlFor="template"><strong>Шаблон уведомления:</strong></label><br />
          <select 
            id="template" 
            value={selectedTemplateId} 
            onChange={(e) => setSelectedTemplateId(e.target.value)}
            style={{ width: '100%', padding: '5px', marginTop: '5px' }}
          >
            <option value="">Выберите шаблон</option>
            {availableTemplates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.name} ({template.channel.toUpperCase()})
              </option>
            ))}
          </select>
        </div>

        {selectedTemplate && (
          <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#f5f5f5', border: '1px solid #ccc' }}>
            <strong>Превью текста:</strong>
            <p>{formatTemplateText(selectedTemplate.text)}</p>
          </div>
        )}

        <div style={{ marginTop: '15px' }}>
          <label htmlFor="phone"><strong>Номер телефона для тестовой отправки:</strong></label><br />
          <input
            id="phone"
            type="tel"
            placeholder="+7 (999) 123-45-67"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={{ width: '100%', padding: '5px', marginTop: '5px' }}
          />
        </div>

        <button 
          onClick={handleSendTest} 
          disabled={isLoading || !selectedTemplateId || !phone}
          style={{ marginTop: '15px', padding: '10px 20px', cursor: isLoading ? 'not-allowed' : 'pointer' }}
        >
          {isLoading ? 'Отправка...' : 'Отправить тестовое уведомление'}
        </button>
      </fieldset>

      {recentTests.length > 0 && (
        <fieldset style={{ padding: '15px' }}>
          <legend><strong>Тестовые уведомления</strong></legend>
          <p><small>Последние 5 отправок по данной фотосессии</small></p>
          <table border={1} cellPadding={10} style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>Статус</th>
                <th>Телефон</th>
                <th>Дата</th>
                <th>Канал</th>
              </tr>
            </thead>
            <tbody>
              {recentTests.map((test) => (
                <tr key={test.id}>
                  <td>{test.status === 'success' ? '✓ Успешно' : '✗ Ошибка'}</td>
                  <td>{test.phone}</td>
                  <td>{new Date(test.createdAt).toLocaleString('ru-RU')}</td>
                  <td>{test.channel.toUpperCase()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </fieldset>
      )}
    </div>
  );
};