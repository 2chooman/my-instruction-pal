import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { apiClient } from '@/lib/apiClient';
import { useToast } from '@/hooks/use-toast';

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await apiClient.loginWithTIDMock();
      toast({
        title: 'Успешный вход',
        description: 'Вы успешно авторизовались через T-ID',
      });
      navigate('/profile');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Ошибка входа',
        description: 'Не удалось авторизоваться. Попробуйте позже.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded border border-border bg-card mb-3">
            <Camera className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">КреативикФото</h1>
          <p className="text-muted-foreground text-sm mt-1">Система управления фотосессиями</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-center">Вход в личный кабинет</CardTitle>
            <CardDescription className="text-center text-sm">
              Используйте T-ID для безопасной авторизации
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full"
            >
              <LogIn className="mr-2 h-4 w-4" />
              {isLoading ? 'Авторизация...' : 'Войти через T-ID'}
            </Button>

            <div className="text-xs text-center text-muted-foreground pt-3 border-t">
              <p>Демо-версия Sprint 2</p>
              <p className="mt-1">Авторизация через T-ID • Интеграция с Битрикс • СХД</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
