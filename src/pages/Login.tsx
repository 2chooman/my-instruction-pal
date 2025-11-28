import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '@/lib/apiClient';
import { useToast } from '@/hooks/use-toast';
export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await apiClient.loginWithTIDMock();
      toast({
        title: 'Успешный вход',
        description: 'Вы успешно авторизовались через T-ID'
      });
      navigate('/profile');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Ошибка входа',
        description: 'Не удалось авторизоваться. Попробуйте позже.'
      });
    } finally {
      setIsLoading(false);
    }
  };
  return <div style={{
    padding: '20px',
    fontFamily: 'Times New Roman, serif'
  }}>
      <h1 className="text-xl">КреативикФото</h1>
      <p className="text-sm">Система управления фотосессиями</p>
      <hr />
      <br />
      <h2 className="text-2xl">Вход в личный кабинет</h2>
      <p className="text-sm">Используйте T-ID для безопасной авторизации</p>
      <br />
      <button onClick={handleLogin} disabled={isLoading} style={{
      padding: '10px 20px',
      cursor: isLoading ? 'not-allowed' : 'pointer',
      opacity: isLoading ? 0.6 : 1
    }} className="bg-gray-200 hover:bg-gray-100 mx-[10px] my-[10px] px-[10px] py-[10px]">
        {isLoading ? 'Авторизация...' : 'Войти через T-ID'}
      </button>
      <br /><br />
      <hr />
      <small>Демо-версия Sprint 2</small>
      <br />
      <small>Авторизация через T-ID • Интеграция с Битрикс • СХД</small>
    </div>;
}