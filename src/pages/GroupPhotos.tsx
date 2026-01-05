import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { apiClient } from '@/lib/apiClient';
import { Photo, PhotoGroup, DealDetails, User } from '@/types';
import { Share2, Trash2, AlertCircle, Plus, Layers } from 'lucide-react';

export default function GroupPhotos() {
  const { dealId, groupId } = useParams<{ dealId: string; groupId: string }>();
  const navigate = useNavigate();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [group, setGroup] = useState<PhotoGroup | null>(null);
  const [deal, setDeal] = useState<DealDetails | null>(null);
  const [childGroups, setChildGroups] = useState<PhotoGroup[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);

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

  const getBackUrl = () => {
    if (group?.parentId) {
      return `/photosessions/${dealId}/groups/${group.parentId}`;
    }
    return `/photosessions/${dealId}`;
  };

  const getBackLabel = () => {
    if (group?.parentId) {
      return `‹ ${group.name}`;
    }
    return '‹ Вся фотосессия';
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

  if (!group || !deal) {
    return (
      <>
        <Header userName={user?.name} />
        <div style={{ padding: '24px 32px', fontFamily: 'Times New Roman, serif' }}>
          <button
            onClick={() => navigate(`/photosessions/${dealId}`)}
            style={{
              background: '#f5f5f5',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            ‹ Вся фотосессия
          </button>
          <p style={{ marginTop: '20px' }}>Группа не найдена</p>
        </div>
      </>
    );
  }

  // Check if this is a "parent group" view (has children, should show child folders)
  const hasChildGroups = childGroups.length > 0;
  const hasPhotos = photos.length > 0;

  return (
    <>
      <Header userName={user?.name} />
      <div style={{ padding: '24px 32px', fontFamily: 'Times New Roman, serif', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Breadcrumb navigation */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
          {group.parentId && (
            <button
              onClick={() => navigate(`/photosessions/${dealId}`)}
              style={{
                background: '#f5f5f5',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              ‹ Фотосессия
            </button>
          )}
          <button
            onClick={() => navigate(getBackUrl())}
            style={{
              background: '#f5f5f5',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            {getBackLabel()}
          </button>
        </div>
        
        {/* Header row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>
              {group.name}
              <sup style={{ fontSize: '14px', color: '#666', marginLeft: '4px' }}>{photos.length}</sup>
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

        {/* Child folders section (like image-5.png) */}
        {hasChildGroups && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
            {childGroups.map(child => (
              <div
                key={child.id}
                onClick={() => navigate(`/photosessions/${dealId}/groups/${child.id}`)}
                style={{
                  cursor: 'pointer',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  background: '#fff',
                  border: '1px solid #f0f0f0',
                }}
              >
                <div style={{ position: 'relative' }}>
                  <img
                    src={child.coverUrl}
                    alt={child.name}
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                  {/* Photo count badge */}
                  <span style={{
                    position: 'absolute',
                    bottom: '12px',
                    right: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    background: 'rgba(0, 0, 0, 0.6)',
                    color: '#fff',
                    padding: '4px 10px',
                    borderRadius: '12px',
                    fontSize: '13px',
                  }}>
                    <Layers size={14} />
                    {child.photosCount}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Photos section */}
        {hasPhotos && (
          <>
            {hasChildGroups && (
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>Фото</h2>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
              {photos.map((photo, index) => (
                <div
                  key={photo.id}
                  style={{
                    position: 'relative',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    background: '#fff',
                    border: '1px solid #f0f0f0',
                    cursor: 'pointer',
                  }}
                  onClick={() => setSelectedPhoto(index)}
                >
                  <img
                    src={photo.thumbnailUrl}
                    alt={`Фото ${index + 1}`}
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                  {/* Add to cart button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Add to cart logic
                      console.log('Add to cart:', photo.id);
                    }}
                    style={{
                      position: 'absolute',
                      bottom: '12px',
                      right: '12px',
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.9)',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    }}
                  >
                    <Plus size={18} color="#333" />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {!hasPhotos && !hasChildGroups && (
          <p>В этой группе пока нет фотографий</p>
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
                style={{ position: 'absolute', top: '10px', right: '10px', padding: '10px', fontSize: '20px', color: 'white', background: 'rgba(0,0,0,0.5)', border: 'none', cursor: 'pointer', borderRadius: '8px' }}
                onClick={() => setSelectedPhoto(null)}
              >
                ✕
              </button>
              <button
                style={{ position: 'absolute', left: '-60px', top: '50%', transform: 'translateY(-50%)', padding: '12px 16px', fontSize: '24px', color: 'white', background: 'rgba(0,0,0,0.5)', border: 'none', cursor: 'pointer', borderRadius: '8px' }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPhoto(prev => prev !== null && prev > 0 ? prev - 1 : photos.length - 1);
                }}
              >
                ‹
              </button>
              <button
                style={{ position: 'absolute', right: '-60px', top: '50%', transform: 'translateY(-50%)', padding: '12px 16px', fontSize: '24px', color: 'white', background: 'rgba(0,0,0,0.5)', border: 'none', cursor: 'pointer', borderRadius: '8px' }}
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
                style={{ maxWidth: '100%', maxHeight: '90vh', borderRadius: '8px' }}
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
