import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, ExternalLink, Loader2, Image as ImageIcon } from 'lucide-react';
import { Header } from '@/components/Header';
import { PhotoGallery } from '@/components/PhotoGallery';
import { NotificationPanel } from '@/components/NotificationPanel';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/apiClient';
import { DealDetails as DealDetailsType, Photo, User } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

const statusMap = {
  processing: { label: 'В обработке', variant: 'default' as const },
  ready: { label: 'Готово', variant: 'default' as const },
  cancelled: { label: 'Отменена', variant: 'destructive' as const },
};

export default function DealDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [deal, setDeal] = useState<DealDetailsType | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
        <div className="container mx-auto p-4 md:p-8 max-w-7xl">
          <Skeleton className="h-10 w-32 mb-6" />
          <div className="space-y-6">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </>
    );
  }

  if (!deal) {
    return (
      <>
        <Header />
        <div className="container mx-auto p-4 md:p-8 max-w-7xl">
          <Button variant="ghost" onClick={() => navigate('/deals')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Назад к списку
          </Button>
          <Card className="mt-6">
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">Фотосессия не найдена</p>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <Header userName={user?.name} />
      <div className="container mx-auto p-4 max-w-7xl space-y-4">
        <Button variant="ghost" onClick={() => navigate('/deals')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Назад к списку фотосессий
        </Button>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div>
                <CardTitle className="text-xl">{deal.title}</CardTitle>
                <CardDescription className="flex flex-wrap items-center gap-2 mt-2">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(deal.date).toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <Badge variant="outline">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    {deal.source}
                  </Badge>
                </CardDescription>
              </div>
              <Badge
                variant={statusMap[deal.status].variant}
                className={
                  deal.status === 'ready'
                    ? 'bg-success text-success-foreground'
                    : deal.status === 'processing'
                    ? 'bg-muted text-foreground'
                    : ''
                }
              >
                {statusMap[deal.status].label}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {deal.description && (
              <p className="text-muted-foreground text-sm">{deal.description}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <ImageIcon className="h-5 w-5" />
              Галерея фотографий
            </CardTitle>
            <CardDescription>
              {photos.length} фото
            </CardDescription>
          </CardHeader>
          <CardContent>
            {photos.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Фотографии еще не загружены</p>
              </div>
            ) : (
              <PhotoGallery photos={photos} />
            )}
          </CardContent>
        </Card>

        <NotificationPanel 
          dealId={deal.id} 
          dealTitle={deal.title}
          dealDate={deal.date}
        />
      </div>
    </>
  );
}
