import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User as UserIcon, Mail, Phone, Bell, CheckCircle2, Image, Calendar, ExternalLink, ChevronDown } from 'lucide-react';
import { Header } from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/apiClient';
import { User, Deal, Photo } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

const statusMap = {
  processing: { label: 'В обработке', variant: 'default' as const },
  ready: { label: 'Готово', variant: 'default' as const },
  cancelled: { label: 'Отменена', variant: 'destructive' as const },
};

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [photos, setPhotos] = useState<Record<string, Photo[]>>({});
  const [expandedDeal, setExpandedDeal] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [whatsappEnabled, setWhatsappEnabled] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [userData, dealsData] = await Promise.all([
          apiClient.getCurrentUser(),
          apiClient.getDeals(),
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

  const toggleDeal = async (dealId: string) => {
    if (expandedDeal === dealId) {
      setExpandedDeal(null);
    } else {
      setExpandedDeal(dealId);
      if (!photos[dealId]) {
        try {
          const dealPhotos = await apiClient.getDealPhotos(dealId);
          setPhotos(prev => ({ ...prev, [dealId]: dealPhotos }));
        } catch (error) {
          console.error('Ошибка загрузки фотографий:', error);
        }
      }
    }
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="container mx-auto p-4 md:p-8 max-w-4xl">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="space-y-4">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Header />
        <div className="container mx-auto p-4 md:p-8 max-w-4xl">
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">Не удалось загрузить профиль</p>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <Header userName={user.name} />
      <div className="container mx-auto p-4 max-w-4xl space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Личный кабинет</h1>
          <p className="text-muted-foreground text-sm">Управление профилем и настройками</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <UserIcon className="h-5 w-5" />
              Информация о пользователе
            </CardTitle>
            <CardDescription className="text-sm">Данные получены из T-ID</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-3">
              <div className="flex items-center gap-2">
                <UserIcon className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">ФИО</p>
                  <p className="text-sm font-medium text-foreground">{user.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Телефон</p>
                  <p className="text-sm font-medium text-foreground">{user.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">E-mail</p>
                  <p className="text-sm font-medium text-foreground">{user.email}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bell className="h-5 w-5" />
              Настройки уведомлений
            </CardTitle>
            <CardDescription className="text-sm">
              Выберите каналы для получения уведомлений
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2 p-3 rounded border border-border">
                <Checkbox
                  id="sms"
                  checked={smsEnabled}
                  onCheckedChange={(checked) => setSmsEnabled(checked as boolean)}
                />
                <Label htmlFor="sms" className="flex-1 cursor-pointer text-sm">
                  <div className="flex items-center gap-2">
                    <span>SMS уведомления (SMS.RU)</span>
                    {smsEnabled && <CheckCircle2 className="h-4 w-4 text-success" />}
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-2 p-3 rounded border border-border">
                <Checkbox
                  id="whatsapp"
                  checked={whatsappEnabled}
                  onCheckedChange={(checked) => setWhatsappEnabled(checked as boolean)}
                />
                <Label htmlFor="whatsapp" className="flex-1 cursor-pointer text-sm">
                  <div className="flex items-center gap-2">
                    <span>WhatsApp (Meta Cloud API)</span>
                    {whatsappEnabled && <CheckCircle2 className="h-4 w-4 text-success" />}
                  </div>
                </Label>
              </div>
            </div>

          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Image className="h-5 w-5" />
              Мои фотосессии
            </CardTitle>
            <CardDescription className="text-sm">
              Сделки синхронизируются с Битрикс
            </CardDescription>
          </CardHeader>
          <CardContent>
            {deals.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Image className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground">
                  У вас пока нет фотосессий
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {deals.map((deal) => (
                  <Card key={deal.id}>
                    <CardContent className="p-3">
                      <div 
                        className="flex flex-col gap-2 cursor-pointer"
                        onClick={() => toggleDeal(deal.id)}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-sm font-medium text-foreground">
                            {deal.title}
                          </h3>
                          <div className="flex items-center gap-2">
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
                            <ChevronDown 
                              className={`h-4 w-4 transition-transform ${
                                expandedDeal === deal.id ? 'rotate-180' : ''
                              }`}
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>
                              {new Date(deal.date).toLocaleDateString('ru-RU', {
                                day: 'numeric',
                                month: 'long',
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Image className="h-3 w-3" />
                            <span>{deal.photosCount}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            {deal.source}
                          </Badge>
                        </div>
                      </div>
                      
                      {expandedDeal === deal.id && (
                        <div className="mt-3 pt-3 border-t border-border">
                          {photos[deal.id] ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                              {photos[deal.id].map((photo) => (
                                <img
                                  key={photo.id}
                                  src={photo.thumbnailUrl}
                                  alt="Фото"
                                  className="w-full h-24 object-cover rounded"
                                />
                              ))}
                            </div>
                          ) : (
                            <div className="flex justify-center py-4">
                              <div className="text-xs text-muted-foreground">Загрузка...</div>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
