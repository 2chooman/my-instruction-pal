import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { apiClient } from '@/lib/apiClient';
import { Photo, PhotoGroup, DealDetails, User } from '@/types';
import { useToast } from '@/hooks/use-toast';

export default function GroupPhotos() {
  const { dealId, groupId } = useParams<{ dealId: string; groupId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [group, setGroup] = useState<PhotoGroup | null>(null);
  const [deal, setDeal] = useState<DealDetails | null>(null);
  const [childGroups, setChildGroups] = useState<PhotoGroup[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);
  const [selectedPhotos, setSelectedPhotos] = useState<Set<string>>(new Set());

  useEffect(() => {
    const loadData = async () => {
      if (!dealId || !groupId) return;
      
      try {
        const [photosData, groupData, dealData, childData, userData] = await Promise.all([
          apiClient.getGroupPhotos(groupId),
          apiClient.getGroupDetails(groupId, dealId),
          apiClient.getDealDetails(dealId),
          apiClient.getChildGroups(groupId, dealId),
          apiClient.getCurrentUser(),
        ]);
        setPhotos(photosData);
        setGroup(groupData);
        setDeal(dealData);
        setChildGroups(childData);
        setUser(userData);
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [dealId, groupId]);

  const togglePhotoSelection = (photoId: string) => {
    setSelectedPhotos(prev => {
      const newSet = new Set(prev);
      if (newSet.has(photoId)) {
        newSet.delete(photoId);
      } else {
        newSet.add(photoId);
      }
      return newSet;
    });
  };

  const handleOrder = () => {
    if (selectedPhotos.size === 0) {
      toast({
        title: 'Выберите фотографии',
        description: 'Отметьте фотографии для заказа',
      });
      return;
    }
    toast({
      title: 'Заказ оформлен',
      description: `Выбрано фотографий: ${selectedPhotos.size}`,
    });
    setSelectedPhotos(new Set());
  };

  const handleShare = () => {
    if (selectedPhotos.size === 0) {
      toast({
        title: 'Выберите фотографии',
        description: 'Отметьте фотографии для отправки',
      });
      return;
    }
    toast({
      title: 'Ссылка скопирована',
      description: `Фотографии готовы к отправке: ${selectedPhotos.size}`,
    });
  };

  const getBackUrl = () => {
    if (group?.parentId) {
      return `/photosessions/${dealId}/groups/${group.parentId}`;
    }
    return `/photosessions/${dealId}`;
  };

  const getBackLabel = () => {
    if (group?.parentId) {
      return '← Назад к родительской группе';
    }
    return '← Назад к группам';
  };

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

  if (!group || !deal) {
    return (
      <>
        <Header userName={user?.name} />
        <div style={{ padding: '20px', fontFamily: 'Times New Roman, serif' }}>
          <button onClick={() => navigate(`/photosessions/${dealId}`)}>← Назад к группам</button>
          <p>Группа не найдена</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header userName={user?.name} />
      <div style={{ padding: '20px', fontFamily: 'Times New Roman, serif' }}>
        <button onClick={() => navigate(getBackUrl())}>{getBackLabel()}</button>
        <hr />
        
        <h1>{group.name}</h1>
        <p><small>Фотосессия: {deal.title}</small></p>
        {photos.length > 0 && photos[0].shootingDate && (
          <p>
            <strong>Дата съёмки:</strong>{' '}
            {new Date(photos[0].shootingDate).toLocaleDateString('ru-RU', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        )}
        
        <hr />
        
        {/* Child folders section */}
        {childGroups.length > 0 && (
          <>
            <h2>Вложенные папки ({childGroups.length})</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '20px' }}>
              {childGroups.map(child => (
                <div
                  key={child.id}
                  onClick={() => navigate(`/photosessions/${dealId}/groups/${child.id}`)}
                  style={{
                    border: '1px solid #ccc',
                    cursor: 'pointer',
                    backgroundColor: '#f9f9f9',
                  }}
                >
                  <img
                    src={child.coverUrl}
                    alt={child.name}
                    style={{ width: '100%', height: '80px', objectFit: 'cover', display: 'block' }}
                  />
                  <div style={{ padding: '8px' }}>
                    <small><strong>{child.name}</strong></small>
                    <p style={{ margin: '3px 0', fontSize: '12px' }}>Фото: {child.photosCount}</p>
                  </div>
                </div>
              ))}
            </div>
            <hr />
          </>
        )}
        
        {/* Controls */}
        <div style={{ marginBottom: '15px' }}>
          <button onClick={handleOrder} style={{ marginRight: '10px', padding: '8px 15px' }}>
            Заказать выбранные ({selectedPhotos.size})
          </button>
          <button onClick={handleShare} style={{ padding: '8px 15px' }}>
            Поделиться выбранными
          </button>
        </div>
        
        <h2>Фотографии ({photos.length})</h2>
        
        {photos.length === 0 ? (
          <p>В этой группе пока нет фотографий</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
            {photos.map((photo, index) => (
              <div
                key={photo.id}
                style={{
                  position: 'relative',
                  border: selectedPhotos.has(photo.id) ? '3px solid #007bff' : '1px solid #ccc',
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedPhotos.has(photo.id)}
                  onChange={() => togglePhotoSelection(photo.id)}
                  style={{ position: 'absolute', top: '5px', left: '5px', zIndex: 1 }}
                />
                <img
                  src={photo.thumbnailUrl}
                  alt={`Фото ${index + 1}`}
                  style={{ width: '100%', height: '120px', objectFit: 'cover', cursor: 'pointer', display: 'block' }}
                  onClick={() => setSelectedPhoto(index)}
                />
              </div>
            ))}
          </div>
        )}

        {/* Lightbox */}
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
                style={{ position: 'absolute', top: '10px', right: '10px', padding: '10px', fontSize: '20px', color: 'white', background: 'rgba(0,0,0,0.5)', border: 'none', cursor: 'pointer' }}
                onClick={() => setSelectedPhoto(null)}
              >
                ✕
              </button>
              <button
                style={{ position: 'absolute', left: '-50px', top: '50%', transform: 'translateY(-50%)', padding: '10px', fontSize: '24px', color: 'white', background: 'rgba(0,0,0,0.5)', border: 'none', cursor: 'pointer' }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPhoto(prev => prev !== null && prev > 0 ? prev - 1 : photos.length - 1);
                }}
              >
                ‹
              </button>
              <button
                style={{ position: 'absolute', right: '-50px', top: '50%', transform: 'translateY(-50%)', padding: '10px', fontSize: '24px', color: 'white', background: 'rgba(0,0,0,0.5)', border: 'none', cursor: 'pointer' }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPhoto(prev => prev !== null && prev < photos.length - 1 ? prev + 1 : 0);
                }}
              >
                ›
              </button>
              <img
                src={photos[selectedPhoto].url}
                alt={`Фото ${selectedPhoto + 1}`}
                style={{ maxWidth: '100%', maxHeight: '90vh' }}
                onClick={(e) => e.stopPropagation()}
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
