import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { apiClient } from '@/lib/apiClient';
import { DealDetails as DealDetailsType, Photo, User } from '@/types';

const statusMap = {
  processing: 'В обработке',
  ready: 'Готово',
  cancelled: 'Отменена',
};

export default function DealDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [deal, setDeal] = useState<DealDetailsType | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      
      try {
        const [dealData, photosData, userData] = await Promise.all([
          apiClient.getDealDetails(id),
          apiClient.getDealPhotos(id),
          apiClient.getCurrentUser(),
        ]);
        setDeal(dealData);
        setPhotos(photosData);
        setUser(userData);
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [id]);

  if (isLoading) {
    return (
      <>
        <Header />
        <div style={{ padding: '20px', fontFamily: 'Times New Roman, serif' }}>
          <p>Загрузка...</p>
        </div>
      </>
    );
  }

  if (!deal) {
    return (
      <>
        <Header />
        <div style={{ padding: '20px', fontFamily: 'Times New Roman, serif' }}>
          <button onClick={() => navigate('/profile')}>← Назад к списку</button>
          <p>Фотосессия не найдена</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header userName={user?.name} />
      <div style={{ padding: '20px', fontFamily: 'Times New Roman, serif' }}>
        <button onClick={() => navigate('/profile')}>← Назад к списку фотосессий</button>
        <hr />
        
        <h1>{deal.title}</h1>
        <p>
          Дата: {new Date(deal.date).toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </p>
        <p>Источник: {deal.source}</p>
        <p><strong>Статус: {statusMap[deal.status]}</strong></p>
        {deal.description && <p>{deal.description}</p>}
        
        <hr />
        
        <h2>Галерея фотографий ({photos.length} фото)</h2>
        {photos.length === 0 ? (
          <p>Фотографии еще не загружены</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
            {photos.map((photo, index) => (
              <img
                key={photo.id}
                src={photo.thumbnailUrl}
                alt={`Фото ${index + 1}`}
                style={{ width: '100%', cursor: 'pointer', border: '1px solid #ccc' }}
                onClick={() => setSelectedPhoto(index)}
              />
            ))}
          </div>
        )}

        {selectedPhoto !== null && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
            }}
            onClick={() => setSelectedPhoto(null)}
          >
            <div style={{ position: 'relative', maxWidth: '90%', maxHeight: '90%' }}>
              <button
                style={{ position: 'absolute', top: '10px', right: '10px', padding: '10px', fontSize: '20px' }}
                onClick={() => setSelectedPhoto(null)}
              >
                ✕
              </button>
              <img
                src={photos[selectedPhoto].url}
                alt={`Фото ${selectedPhoto + 1}`}
                style={{ maxWidth: '100%', maxHeight: '90vh' }}
              />
              <p style={{ color: 'white', textAlign: 'center', marginTop: '10px' }}>
                {selectedPhoto + 1} / {photos.length}
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}