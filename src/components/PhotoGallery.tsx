import { useState } from 'react';
import { Photo } from '@/types';

interface PhotoGalleryProps {
  photos: Photo[];
}

export const PhotoGallery = ({ photos }: PhotoGalleryProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
  };

  const closeLightbox = () => {
    setSelectedIndex(null);
  };

  const goToPrevious = () => {
    if (selectedIndex !== null && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  };

  const goToNext = () => {
    if (selectedIndex !== null && selectedIndex < photos.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
  };

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
        {photos.map((photo, index) => (
          <img
            key={photo.id}
            src={photo.thumbnailUrl}
            alt={`Фото ${index + 1}`}
            style={{ width: '100%', cursor: 'pointer', border: '1px solid #ccc' }}
            onClick={() => openLightbox(index)}
          />
        ))}
      </div>

      {selectedIndex !== null && (
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
          onClick={closeLightbox}
        >
          <button
            style={{ position: 'absolute', top: '10px', right: '10px', padding: '10px', fontSize: '20px', color: 'white' }}
            onClick={closeLightbox}
          >
            ✕
          </button>

          {selectedIndex > 0 && (
            <button
              style={{ position: 'absolute', left: '10px', padding: '10px', fontSize: '30px', color: 'white' }}
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
            >
              ‹
            </button>
          )}

          <div style={{ maxWidth: '90%', maxHeight: '90%' }} onClick={(e) => e.stopPropagation()}>
            <img
              src={photos[selectedIndex].url}
              alt={`Фото ${selectedIndex + 1}`}
              style={{ maxWidth: '100%', maxHeight: '90vh' }}
            />
            <p style={{ color: 'white', textAlign: 'center', marginTop: '10px' }}>
              {selectedIndex + 1} / {photos.length}
            </p>
          </div>

          {selectedIndex < photos.length - 1 && (
            <button
              style={{ position: 'absolute', right: '10px', padding: '10px', fontSize: '30px', color: 'white' }}
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
            >
              ›
            </button>
          )}
        </div>
      )}
    </>
  );
};