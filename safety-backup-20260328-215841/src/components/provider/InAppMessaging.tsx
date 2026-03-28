import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Send, Paperclip, Check, CheckCheck, Search } from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  read: boolean;
  attachments?: { name: string; url: string }[];
}

interface Conversation {
  id: string;
  customerName: string;
  customerEmail: string;
  leadId: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  messages: Message[];
}

// Mock data
const mockConversations: Conversation[] = [
  {
    id: '1',
    customerName: 'Max Müller',
    customerEmail: 'max@example.com',
    leadId: 'lead-1',
    lastMessage: 'Vielen Dank für das Angebot!',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 30),
    unreadCount: 2,
    messages: [
      {
        id: 'm1',
        senderId: 'customer',
        senderName: 'Max Müller',
        content: 'Guten Tag, ich interessiere mich für Ihr Angebot für meinen Umzug.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        read: true,
      },
      {
        id: 'm2',
        senderId: 'provider',
        senderName: 'Sie',
        content: 'Vielen Dank für Ihre Anfrage! Ich habe Ihnen ein detailliertes Angebot erstellt.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60),
        read: true,
      },
      {
        id: 'm3',
        senderId: 'customer',
        senderName: 'Max Müller',
        content: 'Vielen Dank für das Angebot!',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        read: false,
      },
    ],
  },
  {
    id: '2',
    customerName: 'Anna Schmidt',
    customerEmail: 'anna@example.com',
    leadId: 'lead-2',
    lastMessage: 'Können Sie auch Samstags?',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 5),
    unreadCount: 1,
    messages: [
      {
        id: 'm4',
        senderId: 'customer',
        senderName: 'Anna Schmidt',
        content: 'Können Sie auch Samstags?',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
        read: false,
      },
    ],
  },
];

export const InAppMessaging = () => {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedConversation?.messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const message: Message = {
      id: `m-${Date.now()}`,
      senderId: 'provider',
      senderName: 'Sie',
      content: newMessage,
      timestamp: new Date(),
      read: true,
    };

    setConversations(prev =>
      prev.map(conv =>
        conv.id === selectedConversation.id
          ? {
              ...conv,
              messages: [...conv.messages, message],
              lastMessage: newMessage,
              lastMessageTime: new Date(),
            }
          : conv
      )
    );

    setSelectedConversation(prev =>
      prev
        ? {
            ...prev,
            messages: [...prev.messages, message],
            lastMessage: newMessage,
            lastMessageTime: new Date(),
          }
        : null
    );

    setNewMessage('');
  };

  const filteredConversations = conversations.filter(conv =>
    conv.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const markAsRead = (convId: string) => {
    setConversations(prev =>
      prev.map(conv =>
        conv.id === convId
          ? {
              ...conv,
              unreadCount: 0,
              messages: conv.messages.map(m => ({ ...m, read: true })),
            }
          : conv
      )
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[600px]">
      {/* Conversations List */}
      <Card className="md:col-span-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Nachrichten</CardTitle>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Suchen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[480px]">
            {filteredConversations.map(conv => (
              <div
                key={conv.id}
                onClick={() => {
                  setSelectedConversation(conv);
                  markAsRead(conv.id);
                }}
                className={`p-3 border-b cursor-pointer hover:bg-muted/50 transition-colors ${
                  selectedConversation?.id === conv.id ? 'bg-muted' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {conv.customerName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-medium truncate">{conv.customerName}</span>
                      {conv.unreadCount > 0 && (
                        <Badge variant="destructive" className="ml-2">
                          {conv.unreadCount}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                    <span className="text-xs text-muted-foreground">
                      {format(conv.lastMessageTime, 'dd.MM. HH:mm', { locale: de })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Chat Area */}
      <Card className="md:col-span-2">
        {selectedConversation ? (
          <>
            <CardHeader className="pb-2 border-b">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>
                    {selectedConversation.customerName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{selectedConversation.customerName}</CardTitle>
                  <p className="text-sm text-muted-foreground">{selectedConversation.customerEmail}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 flex flex-col h-[480px]">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {selectedConversation.messages.map(message => (
                    <div
                      key={message.id}
                      className={`flex ${message.senderId === 'provider' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg px-4 py-2 ${
                          message.senderId === 'provider'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p>{message.content}</p>
                        <div className="flex items-center justify-end gap-1 mt-1">
                          <span className="text-xs opacity-70">
                            {format(message.timestamp, 'HH:mm')}
                          </span>
                          {message.senderId === 'provider' && (
                            message.read ? (
                              <CheckCheck className="h-3 w-3 opacity-70" />
                            ) : (
                              <Check className="h-3 w-3 opacity-70" />
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Input
                    placeholder="Nachricht schreiben..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </>
        ) : (
          <CardContent className="h-full flex items-center justify-center text-muted-foreground">
            Wählen Sie eine Konversation aus
          </CardContent>
        )}
      </Card>
    </div>
  );
};
