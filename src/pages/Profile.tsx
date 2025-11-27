import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User as UserIcon, Mail, Phone, Bell, CheckCircle2, Image } from 'lucide-react';
import { Header } from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { apiClient } from '@/lib/apiClient';
import { User } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [whatsappEnabled, setWhatsappEnabled] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await apiClient.getCurrentUser();
        setUser(userData);
        setSmsEnabled(userData.notificationSettings?.smsEnabled ?? true);
        setWhatsappEnabled(userData.notificationSettings?.whatsappEnabled ?? true);
      } catch (error) {
        console.error('Ошибка загрузки профиля:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

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
      <div className="container mx-auto p-4 md:p-8 max-w-4xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Личный кабинет</h1>
          <p className="text-muted-foreground">Управление профилем и настройками</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="h-5 w-5 text-primary" />
              Информация о пользователе
            </CardTitle>
            <CardDescription>Данные получены из T-ID</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <UserIcon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">ФИО</p>
                  <p className="text-base font-semibold text-foreground">{user.name}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
                  <Phone className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Телефон</p>
                  <p className="text-base font-semibold text-foreground">{user.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">E-mail</p>
                  <p className="text-base font-semibold text-foreground">{user.email}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Настройки уведомлений по умолчанию
            </CardTitle>
            <CardDescription>
              Выберите каналы для получения уведомлений о ваших фотосессиях
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-4 rounded-lg border border-border bg-card hover:bg-accent/5 transition-colors">
                <Checkbox
                  id="sms"
                  checked={smsEnabled}
                  onCheckedChange={(checked) => setSmsEnabled(checked as boolean)}
                />
                <Label
                  htmlFor="sms"
                  className="flex-1 cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  <div className="flex items-center gap-2">
                    <span>SMS уведомления (через SMS.RU)</span>
                    {smsEnabled && <CheckCircle2 className="h-4 w-4 text-success" />}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Получать SMS о готовности фотографий
                  </p>
                </Label>
              </div>

              <div className="flex items-center space-x-3 p-4 rounded-lg border border-border bg-card hover:bg-accent/5 transition-colors">
                <Checkbox
                  id="whatsapp"
                  checked={whatsappEnabled}
                  onCheckedChange={(checked) => setWhatsappEnabled(checked as boolean)}
                />
                <Label
                  htmlFor="whatsapp"
                  className="flex-1 cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  <div className="flex items-center gap-2">
                    <span>WhatsApp уведомления (через Meta Cloud API)</span>
                    {whatsappEnabled && <CheckCircle2 className="h-4 w-4 text-success" />}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Получать сообщения в WhatsApp о статусе заказа
                  </p>
                </Label>
              </div>
            </div>

            <Button className="w-full md:w-auto" onClick={() => navigate('/deals')}>
              <Image className="mr-2 h-4 w-4" />
              Перейти к моим фотосессиям
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
