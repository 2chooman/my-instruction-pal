import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { apiClient } from '@/lib/apiClient';
import { DealWithCover, User } from '@/types';
import { Share2 } from 'lucide-react';

const statusMap: Record<string, { label: string; color: string }> = {
  processing: { label: 'В ретуши', color: '#8B5CF6' },
  ready: { label: 'Готово', color: '#22C55E' },
  cancelled: { label: 'Отменена', color: '#EF4444' },
  pending_payment: { label: 'Заказано', color: '#F97316' },
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

  const handleShare = (e: React.MouseEvent, dealId: string) => {
    e.stopPropagation();
    // Share functionality placeholder
    console.log('Share deal:', dealId);
  };

  if (isLoading) {
    return (
      <>
        <Header userName={user?.name} />
        <div style={{ padding: '24px 32px', fontFamily: 'Times New Roman, serif' }}>
          <p>Загрузка...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header userName={user?.name} />
      <div style={{ padding: '24px 32px', fontFamily: 'Times New Roman, serif', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>Фотосессии</h1>
        
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
                    {/* Share button */}
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
                    {/* Status badge */}
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
    </>
  );
}
