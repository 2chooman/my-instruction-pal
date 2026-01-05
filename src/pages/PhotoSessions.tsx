import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { apiClient } from '@/lib/apiClient';
import { DealWithCover, User } from '@/types';

const statusMap = {
  processing: 'В обработке',
  ready: 'Готово',
  cancelled: 'Отменена',
  pending_payment: 'Ждет оплаты',
};

export default function PhotoSessions() {
  const navigate = useNavigate();
  const [deals, setDeals] = useState<DealWithCover[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [dealsData, userData] = await Promise.all([
          apiClient.getDealsWithCovers(),
          apiClient.getCurrentUser(),
        ]);
        setDeals(dealsData);
        setUser(userData);
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

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

  return (
    <>
      <Header userName={user?.name} />
      <div style={{ padding: '20px', fontFamily: 'Times New Roman, serif' }}>
        <button onClick={() => navigate('/profile')}>← Назад к профилю</button>
        <hr />
        
        <h1>Мои фотосессии</h1>
        <p><small>Выберите фотосессию для просмотра групп и фотографий</small></p>
        
        {deals.length === 0 ? (
          <p>У вас пока нет фотосессий</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginTop: '20px' }}>
            {deals.map(deal => (
              <div
                key={deal.id}
                onClick={() => navigate(`/photosessions/${deal.id}`)}
                style={{
                  border: '1px solid #ccc',
                  cursor: 'pointer',
                  backgroundColor: '#f9f9f9',
                }}
              >
                <img
                  src={deal.coverUrl}
                  alt={deal.title}
                  style={{ width: '100%', height: '150px', objectFit: 'cover', display: 'block' }}
                />
                <div style={{ padding: '10px' }}>
                  <strong>{deal.title}</strong>
                  <p style={{ margin: '5px 0' }}>
                    <small>
                      {new Date(deal.date).toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </small>
                  </p>
                  <p style={{ margin: '5px 0' }}>
                    <strong>Статус:</strong> {statusMap[deal.status]}
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
