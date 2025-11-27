import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Image, Calendar, ExternalLink, Loader2 } from 'lucide-react';
import { Header } from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/apiClient';
import { Deal, User } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

const statusMap = {
  processing: { label: 'В обработке', variant: 'default' as const },
  ready: { label: 'Готово', variant: 'default' as const },
  cancelled: { label: 'Отменена', variant: 'destructive' as const },
};

export default function Deals() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [dealsData, userData] = await Promise.all([
          apiClient.getDeals(),
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
        <Header />
        <div className="container mx-auto p-4 md:p-8 max-w-6xl">
          <Skeleton className="h-8 w-64 mb-6" />
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header userName={user?.name} />
      <div className="container mx-auto p-4 max-w-6xl space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Мои фотосессии</h1>
          <p className="text-muted-foreground text-sm">
            Сделки синхронизируются с Битрикс
          </p>
        </div>

        {deals.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Image className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium text-foreground mb-1">
                У вас пока нет фотосессий
              </p>
              <p className="text-sm text-muted-foreground">
                Ваши фотосессии появятся здесь после создания сделки в Битрикс
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {deals.map((deal) => (
              <Card
                key={deal.id}
                className="cursor-pointer hover:border-primary transition-colors"
                onClick={() => navigate(`/deals/${deal.id}`)}
              >
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded border border-border bg-muted flex-shrink-0">
                          <Image className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-base font-medium text-foreground mb-1">
                            {deal.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
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
                            <Badge variant="outline" className="text-xs">
                              <ExternalLink className="h-3 w-3 mr-1" />
                              {deal.source}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
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
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Image className="h-4 w-4" />
                        <span>{deal.photosCount}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
