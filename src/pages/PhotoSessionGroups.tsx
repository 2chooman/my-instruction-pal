import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { apiClient } from '@/lib/apiClient';
import { DealDetails, PhotoGroup, User } from '@/types';

const statusMap = {
  processing: 'В обработке',
  ready: 'Готово',
  cancelled: 'Отменена',
  pending_payment: 'Ждет оплаты',
};

export default function PhotoSessionGroups() {
  const { dealId } = useParams<{ dealId: string }>();
  const navigate = useNavigate();
  const [deal, setDeal] = useState<DealDetails | null>(null);
  const [groups, setGroups] = useState<PhotoGroup[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!dealId) return;
      
      try {
        const [dealData, groupsData, userData] = await Promise.all([
          apiClient.getDealDetails(dealId),
          apiClient.getDealGroups(dealId),
          apiClient.getCurrentUser(),
        ]);
        setDeal(dealData);
        setGroups(groupsData);
        setUser(userData);
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [dealId]);

  if (isLoading) {
    return (
      <>
        <Header userName={user?.name} />
        <div style={{ padding: '20px', fontFamily: 'Times New Roman, serif' }}>
          <p>Загрузка...</p>
        </div>
      </>
    );
  }

  if (!deal) {
    return (
      <>
        <Header userName={user?.name} />
        <div style={{ padding: '20px', fontFamily: 'Times New Roman, serif' }}>
          <button onClick={() => navigate('/photosessions')}>← Назад к фотосессиям</button>
          <p>Фотосессия не найдена</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header userName={user?.name} />
      <div style={{ padding: '20px', fontFamily: 'Times New Roman, serif' }}>
        <button onClick={() => navigate('/photosessions')}>← Назад к фотосессиям</button>
        <hr />
        
        <h1>{deal.title}</h1>
        <p>
          <strong>Дата:</strong>{' '}
          {new Date(deal.date).toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </p>
        <p><strong>Статус:</strong> {statusMap[deal.status]}</p>
        {deal.description && <p>{deal.description}</p>}
        
        <hr />
        
        <h2>Группы / Папки ({groups.length})</h2>
        <p><small>Выберите группу для просмотра фотографий</small></p>
        
        {groups.length === 0 ? (
          <p>В этой фотосессии пока нет групп</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginTop: '15px' }}>
            {groups.map(group => (
              <div
                key={group.id}
                onClick={() => navigate(`/photosessions/${dealId}/groups/${group.id}`)}
                style={{
                  border: '1px solid #ccc',
                  cursor: 'pointer',
                  backgroundColor: '#f9f9f9',
                }}
              >
                <img
                  src={group.coverUrl}
                  alt={group.name}
                  style={{ width: '100%', height: '120px', objectFit: 'cover', display: 'block' }}
                />
                <div style={{ padding: '10px' }}>
                  <strong>{group.name}</strong>
                  <p style={{ margin: '5px 0' }}>
                    <small>Фото: {group.photosCount}</small>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
