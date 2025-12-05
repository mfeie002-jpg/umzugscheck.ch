import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Send, Phone, Mail, Clock, CheckCheck, User, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface Message {
  id: string;
  leadId: string;
  leadName: string;
  content: string;
  sender: 'provider' | 'customer';
  timestamp: Date;
  read: boolean;
  type: 'message' | 'email' | 'call';
}

interface Props {
  providerId: string;
}

export const CommunicationHub = ({ providerId }: Props) => {
  const [activeConversation, setActiveConversation] = useState<string | null>('1');
  const [newMessage, setNewMessage] = useState('');

  const [conversations] = useState([
    {
      id: '1',
      leadName: 'Michael Schmidt',
      lastMessage: 'Vielen Dank für das Angebot!',
      unread: 2,
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      status: 'active',
    },
    {
      id: '2',
      leadName: 'Anna Weber',
      lastMessage: 'Können Sie auch am Samstag?',
      unread: 0,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: 'active',
    },
    {
      id: '3',
      leadName: 'Peter Müller',
      lastMessage: 'Offerte erhalten, danke.',
      unread: 0,
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      status: 'archived',
    },
  ]);

  const [messages] = useState<Message[]>([
    {
      id: '1',
      leadId: '1',
      leadName: 'Michael Schmidt',
      content: 'Guten Tag, ich habe Ihre Offerte erhalten.',
      sender: 'customer',
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      read: true,
      type: 'message',
    },
    {
      id: '2',
      leadId: '1',
      leadName: 'Michael Schmidt',
      content: 'Freut mich! Haben Sie noch Fragen zur Offerte?',
      sender: 'provider',
      timestamp: new Date(Date.now() - 55 * 60 * 1000),
      read: true,
      type: 'message',
    },
    {
      id: '3',
      leadId: '1',
      leadName: 'Michael Schmidt',
      content: 'Ist der Preis verhandelbar?',
      sender: 'customer',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      read: true,
      type: 'message',
    },
    {
      id: '4',
      leadId: '1',
      leadName: 'Michael Schmidt',
      content: 'Vielen Dank für das Angebot!',
      sender: 'customer',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      read: false,
      type: 'message',
    },
  ]);

  const quickReplies = [
    'Vielen Dank für Ihre Anfrage!',
    'Wir melden uns in Kürze bei Ihnen.',
    'Haben Sie noch Fragen?',
    'Die Offerte ist ab sofort gültig.',
  ];

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    toast.success('Nachricht gesendet');
    setNewMessage('');
  };

  const activeMessages = messages.filter(m => m.leadId === activeConversation);
  const activeConv = conversations.find(c => c.id === activeConversation);

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (minutes < 60) return `vor ${minutes} Min.`;
    if (hours < 24) return `vor ${hours} Std.`;
    return date.toLocaleDateString('de-CH');
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Kommunikations-Hub
        </CardTitle>
        <CardDescription>Alle Kundeninteraktionen an einem Ort</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 p-0 overflow-hidden">
        <div className="grid grid-cols-3 h-full border-t">
          {/* Conversation List */}
          <div className="border-r">
            <div className="p-3 border-b">
              <Input placeholder="Konversation suchen..." className="h-8" />
            </div>
            <ScrollArea className="h-[calc(100%-48px)]">
              {conversations.map(conv => (
                <button
                  key={conv.id}
                  onClick={() => setActiveConversation(conv.id)}
                  className={`w-full p-3 text-left border-b hover:bg-muted/50 transition-colors ${
                    activeConversation === conv.id ? 'bg-muted' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        {conv.leadName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{conv.leadName}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatTime(conv.timestamp)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground truncate">
                          {conv.lastMessage}
                        </p>
                        {conv.unread > 0 && (
                          <Badge variant="default" className="h-5 w-5 p-0 flex items-center justify-center text-xs">
                            {conv.unread}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </ScrollArea>
          </div>

          {/* Messages */}
          <div className="col-span-2 flex flex-col">
            {activeConv ? (
              <>
                {/* Header */}
                <div className="p-3 border-b flex items-center justify-between bg-muted/30">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {activeConv.leadName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{activeConv.leadName}</p>
                      <p className="text-xs text-muted-foreground">Lead #12345</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Mail className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <FileText className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {activeMessages.map(message => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === 'provider' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[70%] ${
                          message.sender === 'provider' 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted'
                        } rounded-lg p-3`}>
                          <p className="text-sm">{message.content}</p>
                          <div className={`flex items-center gap-1 mt-1 ${
                            message.sender === 'provider' ? 'justify-end' : ''
                          }`}>
                            <span className="text-xs opacity-70">
                              {formatTime(message.timestamp)}
                            </span>
                            {message.sender === 'provider' && message.read && (
                              <CheckCheck className="h-3 w-3" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                {/* Quick Replies */}
                <div className="p-2 border-t bg-muted/30">
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {quickReplies.map((reply, i) => (
                      <Button
                        key={i}
                        variant="outline"
                        size="sm"
                        className="whitespace-nowrap text-xs"
                        onClick={() => setNewMessage(reply)}
                      >
                        {reply}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Input */}
                <div className="p-3 border-t flex gap-2">
                  <Textarea
                    placeholder="Nachricht schreiben..."
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    className="min-h-[40px] max-h-[100px] resize-none"
                    onKeyDown={e => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button onClick={handleSendMessage}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Wählen Sie eine Konversation</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
