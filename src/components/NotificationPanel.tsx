import { useState, useEffect } from 'react';
import { Send, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/apiClient';
import { NotificationTemplate, NotificationChannel, NotificationTest } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface NotificationPanelProps {
  dealId: string;
  dealTitle: string;
  dealDate: string;
}

export const NotificationPanel = ({ dealId, dealTitle, dealDate }: NotificationPanelProps) => {
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [recentTests, setRecentTests] = useState<NotificationTest[]>([]);
  const [selectedChannels, setSelectedChannels] = useState<NotificationChannel[]>(['sms']);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [templatesData, testsData] = await Promise.all([
          apiClient.getNotificationTemplates(),
          apiClient.getNotificationTestsByDeal(dealId),
        ]);
        setTemplates(templatesData);
        setRecentTests(testsData);
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      }
    };
    loadData();
  }, [dealId]);

  const selectedTemplate = templates.find(t => t.id === selectedTemplateId);
  const availableTemplates = templates.filter(t => 
    selectedChannels.length === 0 || selectedChannels.includes(t.channel)
  );

  const formatTemplateText = (text: string) => {
    return text
      .replace('{Имя}', 'Иван')
      .replace('{Дата_фотосессии}', new Date(dealDate).toLocaleDateString('ru-RU'));
  };

  const handleSendTest = async () => {
    if (!selectedTemplateId || !phone || selectedChannels.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Заполните все поля',
      });
      return;
    }

    setIsLoading(true);
    try {
      const channel = selectedChannels[0];
      const result = await apiClient.sendNotificationTest({
        dealId,
        channel,
        phone,
        templateId: selectedTemplateId,
      });

      setRecentTests([result, ...recentTests.slice(0, 4)]);

      toast({
        title: result.status === 'success' ? 'Успешно отправлено' : 'Ошибка отправки',
        description: result.status === 'success' 
          ? 'Тестовое уведомление отправлено'
          : 'Не удалось отправить уведомление',
        variant: result.status === 'error' ? 'destructive' : 'default',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Не удалось отправить уведомление',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Управление уведомлениями</CardTitle>
          <CardDescription>Настройте и отправьте тестовое уведомление клиенту</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label>Каналы отправки</Label>
            <div className="flex flex-col gap-3">
              <div className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-accent/5">
                <Checkbox
                  id="sms"
                  checked={selectedChannels.includes('sms')}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedChannels([...selectedChannels, 'sms']);
                    } else {
                      setSelectedChannels(selectedChannels.filter(c => c !== 'sms'));
                    }
                    setSelectedTemplateId('');
                  }}
                />
                <Label htmlFor="sms" className="cursor-pointer flex-1">
                  SMS (через SMS.RU)
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-accent/5">
                <Checkbox
                  id="whatsapp"
                  checked={selectedChannels.includes('whatsapp')}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedChannels([...selectedChannels, 'whatsapp']);
                    } else {
                      setSelectedChannels(selectedChannels.filter(c => c !== 'whatsapp'));
                    }
                    setSelectedTemplateId('');
                  }}
                />
                <Label htmlFor="whatsapp" className="cursor-pointer flex-1">
                  WhatsApp (через Meta Cloud API)
                </Label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="template">Шаблон уведомления</Label>
            <Select value={selectedTemplateId} onValueChange={setSelectedTemplateId}>
              <SelectTrigger id="template">
                <SelectValue placeholder="Выберите шаблон" />
              </SelectTrigger>
              <SelectContent>
                {availableTemplates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name} ({template.channel.toUpperCase()})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedTemplate && (
            <div className="p-4 rounded-lg bg-muted space-y-2">
              <Label className="text-sm font-medium">Превью текста:</Label>
              <p className="text-sm text-foreground">{formatTemplateText(selectedTemplate.text)}</p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="phone">Номер телефона для тестовой отправки</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+7 (999) 123-45-67"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <Button 
            onClick={handleSendTest} 
            disabled={isLoading || !selectedTemplateId || !phone}
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Отправка...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Отправить тестовое уведомление
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {recentTests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Тестовые уведомления</CardTitle>
            <CardDescription>Последние 5 отправок по данной фотосессии</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTests.map((test) => (
                <div
                  key={test.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border"
                >
                  <div className="flex items-center gap-3 flex-1">
                    {test.status === 'success' ? (
                      <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
                    ) : (
                      <XCircle className="h-5 w-5 text-destructive flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {test.phone}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(test.createdAt).toLocaleString('ru-RU')}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="ml-2">
                    {test.channel.toUpperCase()}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
