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
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
            <Camera className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">КреативикФото</h1>
          <p className="text-muted-foreground mt-2">Система управления фотосессиями</p>
        </div>

        <Card className="border-border/50 shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Вход в личный кабинет</CardTitle>
            <CardDescription className="text-center">
              Используйте T-ID для безопасной авторизации
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full h-12 text-base"
              size="lg"
            >
              <LogIn className="mr-2 h-5 w-5" />
              {isLoading ? 'Авторизация...' : 'Войти через T-ID'}
            </Button>

            <div className="text-xs text-center text-muted-foreground pt-4 border-t">
              <p>Демо-версия Sprint 2</p>
              <p className="mt-1">Авторизация через T-ID • Интеграция с Битрикс • СХД</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
