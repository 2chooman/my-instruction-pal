import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { apiClient } from '@/lib/apiClient';
import { User, DealWithCover } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { MessageSquare } from 'lucide-react';

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

  const [sendingNotification, setSendingNotification] = useState<string | null>(null);

  const handleSendNotification = async (e: React.MouseEvent, deal: DealWithCover, channel: 'sms' | 'whatsapp') => {
    e.stopPropagation();
    setSendingNotification(`${deal.id}-${channel}`);
    
    try {
      const result = await apiClient.sendNotificationTest({
        dealId: deal.id,
        channel,
        phone: user?.phone || '',
        templateId: channel === 'sms' ? '1' : '3',
      });
      
      if (result.status === 'success') {
        toast({
          title: 'Уведомление отправлено',
          description: `Статус "${deal.title}" успешно отправлен через ${channel === 'sms' ? 'СМС' : 'WhatsApp'}`,
        });
      } else {
        toast({
          title: 'Ошибка отправки',
          description: `Не удалось отправить уведомление через ${channel === 'sms' ? 'СМС' : 'WhatsApp'}`,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Произошла ошибка при отправке уведомления',
        variant: 'destructive',
      });
    } finally {
      setSendingNotification(null);
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
                    {/* WhatsApp button */}
                    <button
                      onClick={(e) => handleSendNotification(e, deal, 'whatsapp')}
                      disabled={sendingNotification === `${deal.id}-whatsapp`}
                      style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: sendingNotification === `${deal.id}-whatsapp` ? 'rgba(200,200,200,0.9)' : 'rgba(37, 211, 102, 0.9)',
                        border: 'none',
                        cursor: sendingNotification === `${deal.id}-whatsapp` ? 'wait' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      title="Отправить статус в WhatsApp"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                    </button>
                    {/* SMS button */}
                    <button
                      onClick={(e) => handleSendNotification(e, deal, 'sms')}
                      disabled={sendingNotification === `${deal.id}-sms`}
                      style={{
                        position: 'absolute',
                        top: '12px',
                        right: '56px',
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: sendingNotification === `${deal.id}-sms` ? 'rgba(200,200,200,0.9)' : 'rgba(59, 130, 246, 0.9)',
                        border: 'none',
                        cursor: sendingNotification === `${deal.id}-sms` ? 'wait' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      title="Отправить статус в СМС"
                    >
                      <MessageSquare size={18} color="white" />
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