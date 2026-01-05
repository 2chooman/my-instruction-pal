import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { apiClient } from '@/lib/apiClient';
import { DealDetails, PhotoGroup, User } from '@/types';
import { Share2, Trash2, AlertCircle } from 'lucide-react';

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

  const totalPhotos = groups.reduce((sum, g) => sum + g.photosCount, 0);

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

  if (!deal) {
    return (
      <>
        <Header userName={user?.name} />
        <div style={{ padding: '24px 32px', fontFamily: 'Times New Roman, serif' }}>
          <button
            onClick={() => navigate('/photosessions')}
            style={{
              background: '#f5f5f5',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            ‹ Все фотосессии
          </button>
          <p style={{ marginTop: '20px' }}>Фотосессия не найдена</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header userName={user?.name} />
      <div style={{ padding: '24px 32px', fontFamily: 'Times New Roman, serif', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Back button */}
        <button
          onClick={() => navigate('/photosessions')}
          style={{
            background: '#f5f5f5',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '20px',
            cursor: 'pointer',
            fontSize: '14px',
            marginBottom: '16px',
          }}
        >
          ‹ Все фотосессии
        </button>
        
        {/* Header row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>
              {deal.title}
              <sup style={{ fontSize: '14px', color: '#666', marginLeft: '4px' }}>{totalPhotos}</sup>
            </h1>
            <p style={{ fontSize: '14px', color: '#666', margin: '8px 0 0 0' }}>
              Дата съемок: {new Date(deal.date).toLocaleDateString('ru-RU', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })}
            </p>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: '#fff',
                border: '1px solid #e5e5e5',
                padding: '10px 24px',
                borderRadius: '24px',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              <Share2 size={16} />
              Поделиться
            </button>
            <button
              style={{
                background: '#fff',
                border: '1px solid #e5e5e5',
                padding: '10px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Trash2 size={18} color="#999" />
            </button>
          </div>
        </div>
        
        {/* Order deadline warning */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          alignItems: 'center', 
          gap: '8px',
          marginBottom: '32px',
        }}>
          <span style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px',
            background: '#FFF7ED',
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '14px',
            color: '#EA580C',
          }}>
            <AlertCircle size={16} />
            Оформить заказ до 18:00 15.04.2025
          </span>
        </div>
        
        {/* Groups grid */}
        {groups.length === 0 ? (
          <p>В этой фотосессии пока нет групп</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            {groups.map(group => (
              <button
                key={group.id}
                onClick={() => navigate(`/photosessions/${dealId}/groups/${group.id}`)}
                style={{
                  background: '#f5f5f5',
                  border: 'none',
                  padding: '20px 24px',
                  borderRadius: '24px',
                  cursor: 'pointer',
                  fontSize: '15px',
                  fontWeight: '500',
                  textAlign: 'center',
                  transition: 'background 0.2s',
                }}
                onMouseOver={(e) => e.currentTarget.style.background = '#eee'}
                onMouseOut={(e) => e.currentTarget.style.background = '#f5f5f5'}
              >
                {group.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
