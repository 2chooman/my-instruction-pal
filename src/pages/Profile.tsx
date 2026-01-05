import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { apiClient } from '@/lib/apiClient';
import { User, DealWithCover } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Share2 } from 'lucide-react';

const statusMap: Record<string, { label: string; color: string }> = {
  processing: { label: 'В ретуши', color: '#8B5CF6' },
  ready: { label: 'Готово', color: '#22C55E' },
  cancelled: { label: 'Отменена', color: '#EF4444' },
  pending_payment: { label: 'Заказано', color: '#F97316' },
};

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [deals, setDeals] = useState<DealWithCover[]>([]);
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
        const [userData, dealsData] = await Promise.all([
          apiClient.getCurrentUser(),
          apiClient.getDealsWithCovers(),
        ]);
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

  const handleShare = (e: React.MouseEvent, dealId: string) => {
    e.stopPropagation();
    console.log('Share deal:', dealId);
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
      <Header userName={user?.name} />
      <div style={{
      padding: '24px 32px',
      fontFamily: 'Times New Roman, serif',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
        <Breadcrumbs items={[{ label: 'Профиль' }]} />
        
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>Личный кабинет</h1>
        <p style={{ color: '#666', marginBottom: '24px' }}>Управление профилем и настройками</p>

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
        <p style={{ marginBottom: '16px' }}><small>Сделки синхронизируются с Битрикс</small></p>
        
        {deals.length === 0 ? (
          <p>У вас пока нет фотосессий</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
            {deals.map(deal => {
              const status = statusMap[deal.status];
              return (
                <div
                  key={deal.id}
                  onClick={() => navigate(`/photosessions/${deal.id}`)}
                  style={{
                    cursor: 'pointer',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    background: '#fff',
                  }}
                >
                  <div style={{ position: 'relative' }}>
                    <img
                      src={deal.coverUrl}
                      alt={deal.title}
                      style={{
                        width: '100%',
                        height: '220px',
                        objectFit: 'cover',
                        display: 'block',
                        borderRadius: '16px',
                      }}
                    />
                    <button
                      onClick={(e) => handleShare(e, deal.id)}
                      style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.9)',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Share2 size={16} color="#333" />
                    </button>
                    {status && (
                      <span
                        style={{
                          position: 'absolute',
                          bottom: '12px',
                          left: '12px',
                          padding: '4px 12px',
                          borderRadius: '6px',
                          background: status.color,
                          color: '#fff',
                          fontSize: '12px',
                          fontWeight: '500',
                        }}
                      >
                        {status.label}
                      </span>
                    )}
                  </div>
                  <div style={{ padding: '12px 4px' }}>
                    <strong style={{ fontSize: '16px', display: 'block' }}>{deal.title}</strong>
                    <span style={{ fontSize: '14px', color: '#666', marginTop: '4px', display: 'block' }}>
                      {new Date(deal.date).toLocaleDateString('ru-RU', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>;
}