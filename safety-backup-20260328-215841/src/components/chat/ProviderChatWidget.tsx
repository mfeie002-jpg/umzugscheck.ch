import { useState, useRef, useEffect, memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  Send, 
  X, 
  Paperclip, 
  Image as ImageIcon,
  Smile,
  MoreVertical,
  Phone,
  Minimize2,
  Maximize2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  createChatSession,
  addMessage,
  markMessagesAsRead,
  formatMessageTime,
  generateAutoResponse,
  simulateTyping,
  QUICK_REPLIES,
  type ChatSession,
  type ChatMessage,
} from '@/lib/provider-chat';

interface ProviderChatWidgetProps {
  providerId: string;
  providerName: string;
  providerLogo?: string;
  userId?: string;
  userName?: string;
  isOnline?: boolean;
  onClose?: () => void;
  className?: string;
}

export const ProviderChatWidget = memo(function ProviderChatWidget({
  providerId,
  providerName,
  providerLogo,
  userId = 'user_demo',
  userName = 'Kunde',
  isOnline = true,
  onClose,
  className = '',
}: ProviderChatWidgetProps) {
  const [session, setSession] = useState<ChatSession | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize chat session
  useEffect(() => {
    const newSession = createChatSession(
      providerId,
      providerName,
      userId,
      userName
    );
    setSession(newSession);
  }, [providerId, providerName, userId, userName]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [session?.messages]);

  // Mark messages as read when chat is visible
  useEffect(() => {
    if (session && !isMinimized && session.unreadCount > 0) {
      setSession(markMessagesAsRead(session));
    }
  }, [isMinimized, session?.unreadCount]);

  const sendMessage = useCallback((content: string) => {
    if (!content.trim() || !session) return;

    // Add user message
    const updatedSession = addMessage(session, content, 'user', userName);
    setSession(updatedSession);
    setInputValue('');
    setShowQuickReplies(false);

    // Simulate provider typing and response
    setIsTyping(true);
    simulateTyping(() => {
      setIsTyping(false);
      const response = generateAutoResponse(content, providerName);
      setSession(prev => prev ? addMessage(prev, response, 'provider', providerName) : null);
    }, 1500, 3000);
  }, [session, userName, providerName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const handleQuickReply = (message: string) => {
    sendMessage(message);
  };

  if (!session) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className={`
        fixed bottom-4 right-4 z-50 
        bg-background border border-border rounded-xl shadow-xl
        flex flex-col overflow-hidden
        ${isMinimized ? 'w-72 h-16' : 'w-80 sm:w-96 h-[500px]'}
        transition-all duration-200
        ${className}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b bg-muted/30">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Avatar className="h-9 w-9">
              <AvatarImage src={providerLogo} alt={providerName} />
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                {providerName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {isOnline && (
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-background" />
            )}
          </div>
          <div>
            <h3 className="font-medium text-sm leading-tight">{providerName}</h3>
            <p className="text-xs text-muted-foreground">
              {isOnline ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </Button>
          {onClose && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Chat Body */}
      <AnimatePresence>
        {!isMinimized && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="flex-1 flex flex-col min-h-0"
          >
            {/* Messages */}
            <ScrollArea className="flex-1 p-3" ref={scrollRef}>
              <div className="space-y-3">
                {session.messages.map((message) => (
                  <MessageBubble key={message.id} message={message} />
                ))}
                
                {/* Typing indicator */}
                {isTyping && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="flex gap-1">
                      <motion.span
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="w-2 h-2 bg-muted-foreground rounded-full"
                      />
                      <motion.span
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                        className="w-2 h-2 bg-muted-foreground rounded-full"
                      />
                      <motion.span
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                        className="w-2 h-2 bg-muted-foreground rounded-full"
                      />
                    </div>
                    <span className="text-xs">{providerName} schreibt...</span>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Quick Replies */}
            {showQuickReplies && (
              <div className="p-2 border-t">
                <div className="flex flex-wrap gap-1">
                  {QUICK_REPLIES.slice(0, 4).map((reply) => (
                    <Button
                      key={reply.id}
                      variant="outline"
                      size="sm"
                      className="text-xs h-7"
                      onClick={() => handleQuickReply(reply.message)}
                    >
                      {reply.label}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-3 border-t bg-muted/30">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Nachricht schreiben..."
                  className="flex-1 h-10"
                />
                <Button 
                  type="submit" 
                  size="icon" 
                  className="h-10 w-10"
                  disabled={!inputValue.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

// Message bubble component
const MessageBubble = memo(function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.senderType === 'user';
  const isSystem = message.senderType === 'system';

  if (isSystem) {
    return (
      <div className="text-center">
        <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
          {message.content}
        </span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`
          max-w-[80%] rounded-2xl px-4 py-2
          ${isUser 
            ? 'bg-primary text-primary-foreground rounded-br-md' 
            : 'bg-muted rounded-bl-md'
          }
        `}
      >
        <p className="text-sm">{message.content}</p>
        <p className={`text-[10px] mt-1 ${isUser ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
          {formatMessageTime(message.timestamp)}
        </p>
      </div>
    </motion.div>
  );
});

export default ProviderChatWidget;
