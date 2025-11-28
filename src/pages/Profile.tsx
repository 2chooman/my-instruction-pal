import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { apiClient } from '@/lib/apiClient';
import { User, Deal, Photo } from '@/types';
import { useToast } from '@/hooks/use-toast';
const statusMap = {
  processing: 'В обработке',
  ready: 'Готово',
  cancelled: 'Отменена',
  pending_payment: 'Ждет оплаты'
};
export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [photos, setPhotos] = useState<Record<string, Photo[]>>({});
  const [expandedDeal, setExpandedDeal] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [whatsappEnabled, setWhatsappEnabled] = useState(true);
  const [editingField, setEditingField] = useState<'name' | 'phone' | 'email' | null>(null);
  const [editValue, setEditValue] = useState('');
  const {
    toast
  } = useToast();
  useEffect(() => {
    const loadData = async () => {
      try {
        const [userData, dealsData] = await Promise.all([apiClient.getCurrentUser(), apiClient.getDeals()]);
        setUser(userData);
        setDeals(dealsData);
        setSmsEnabled(userData.notificationSettings?.smsEnabled ?? true);
        setWhatsappEnabled(userData.notificationSettings?.whatsappEnabled ?? true);
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);
  const toggleDeal = async (dealId: string) => {
    if (expandedDeal === dealId) {
      setExpandedDeal(null);
    } else {
      setExpandedDeal(dealId);
      if (!photos[dealId]) {
        try {
          const dealPhotos = await apiClient.getDealPhotos(dealId);
          setPhotos(prev => ({
            ...prev,
            [dealId]: dealPhotos
          }));
        } catch (error) {
          console.error('Ошибка загрузки фотографий:', error);
        }
      }
    }
  };
  const startEditing = (field: 'name' | 'phone' | 'email', currentValue: string) => {
    setEditingField(field);
    setEditValue(currentValue);
  };
  const saveEdit = () => {
    if (user && editingField) {
      setUser({
        ...user,
        [editingField]: editValue
      });
      setEditingField(null);
      toast({
        title: 'Данные обновлены',
        description: 'Изменения сохранены успешно'
      });
    }
  };
  const cancelEdit = () => {
    setEditingField(null);
    setEditValue('');
  };
  const sendNotification = (channel: 'sms' | 'whatsapp', dealTitle: string) => {
    toast({
      title: `Уведомление отправлено`,
      description: `Статус "${dealTitle}" отправлен через ${channel === 'sms' ? 'СМС' : 'WhatsApp'}`
    });
  };
  if (isLoading) {
    return <>
        <Header />
        <div style={{
        padding: '20px',
        fontFamily: 'Times New Roman, serif'
      }}>
          <p>Загрузка...</p>
        </div>
      </>;
  }
  if (!user) {
    return <>
        <Header />
        <div style={{
        padding: '20px',
        fontFamily: 'Times New Roman, serif'
      }}>
          <p>Не удалось загрузить профиль</p>
        </div>
      </>;
  }
  return <>
      
      <div style={{
      padding: '20px',
      fontFamily: 'Times New Roman, serif'
    }}>
        <h1 className="text-3xl">Личный кабинет</h1>
        <p className="text-xl">Управление профилем и настройками</p>
        <hr />

        <h2>Информация о пользователе</h2>
        <p><small>Данные получены из T-ID</small></p>
        <table border={1} cellPadding={10} style={{
        borderCollapse: 'collapse',
        marginBottom: '20px'
      }}>
          <tbody>
            <tr>
              <td><strong>ФИО</strong></td>
              <td>
                {editingField === 'name' ? <div>
                    <input value={editValue} onChange={e => setEditValue(e.target.value)} style={{
                  marginRight: '5px'
                }} />
                    <button onClick={saveEdit}>Сохранить</button>
                    <button onClick={cancelEdit}>Отмена</button>
                  </div> : <div>
                    {user.name}{' '}
                    <button onClick={() => startEditing('name', user.name)}>✎</button>
                  </div>}
              </td>
            </tr>
            <tr>
              <td><strong>Телефон</strong></td>
              <td>
                {editingField === 'phone' ? <div>
                    <input value={editValue} onChange={e => setEditValue(e.target.value)} style={{
                  marginRight: '5px'
                }} />
                    <button onClick={saveEdit}>Сохранить</button>
                    <button onClick={cancelEdit}>Отмена</button>
                  </div> : <div>
                    {user.phone}{' '}
                    <button onClick={() => startEditing('phone', user.phone)}>✎</button>
                  </div>}
              </td>
            </tr>
            <tr>
              <td><strong>E-mail</strong></td>
              <td>
                {editingField === 'email' ? <div>
                    <input value={editValue} onChange={e => setEditValue(e.target.value)} style={{
                  marginRight: '5px'
                }} />
                    <button onClick={saveEdit}>Сохранить</button>
                    <button onClick={cancelEdit}>Отмена</button>
                  </div> : <div>
                    {user.email}{' '}
                    <button onClick={() => startEditing('email', user.email)}>✎</button>
                  </div>}
              </td>
            </tr>
          </tbody>
        </table>

        <h2 className="text-xl">Настройки уведомлений</h2>
        <p>Выберите каналы для получения уведомлений</p>
        <div style={{
        marginBottom: '20px'
      }}>
          <div style={{
          marginBottom: '10px'
        }}>
            <input type="checkbox" id="sms" checked={smsEnabled} onChange={e => setSmsEnabled(e.target.checked)} />
            <label htmlFor="sms"> SMS уведомления (SMS.RU) {smsEnabled && '✓'}</label>
          </div>
          <div>
            <input type="checkbox" id="whatsapp" checked={whatsappEnabled} onChange={e => setWhatsappEnabled(e.target.checked)} />
            <label htmlFor="whatsapp"> WhatsApp (Meta Cloud API) {whatsappEnabled && '✓'}</label>
          </div>
        </div>

        <h2 className="text-xl">Мои фотосессии</h2>
        <p><small>Сделки синхронизируются с Битрикс</small></p>
        
        {deals.length === 0 ? <p>У вас пока нет фотосессий</p> : <div>
            {deals.map(deal => <fieldset key={deal.id} style={{
          marginBottom: '15px',
          border: '1px solid #ccc',
          padding: '10px'
        }}>
                <legend onClick={() => toggleDeal(deal.id)} style={{
            cursor: 'pointer',
            fontWeight: 'bold'
          }}>
                  {deal.title} - {statusMap[deal.status]} {expandedDeal === deal.id ? '▼' : '▶'}
                </legend>
                <div>
                  <p>
                    <small>
                      Дата: {new Date(deal.date).toLocaleDateString('ru-RU', {
                  day: 'numeric',
                  month: 'long'
                })} | Фото: {deal.photosCount}
                    </small>
                  </p>
                  <button onClick={e => {
              e.stopPropagation();
              sendNotification('sms', deal.title);
            }}>
                    Отправить статус в СМС
                  </button>
                  {' '}
                  <button onClick={e => {
              e.stopPropagation();
              sendNotification('whatsapp', deal.title);
            }}>
                    Отправить статус в WhatsApp
                  </button>
                </div>
                
                {expandedDeal === deal.id && <div style={{
            marginTop: '10px',
            paddingTop: '10px',
            borderTop: '1px solid #ccc'
          }}>
                    {photos[deal.id] ? <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '10px'
            }}>
                        {photos[deal.id].map(photo => <img key={photo.id} src={photo.thumbnailUrl} alt="Фото" style={{
                width: '100%',
                height: '100px',
                objectFit: 'cover'
              }} />)}
                      </div> : <p>Загрузка...</p>}
                  </div>}
              </fieldset>)}
          </div>}
      </div>
    </>;
}