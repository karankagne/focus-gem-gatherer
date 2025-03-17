
import React, { useState, useRef, useEffect } from 'react';
import { Send, UserRound } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';

// Define the message type
interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: Date;
}

interface ChatDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  challengeId: string;
  challengeTitle: string;
  participants: Array<{ id: string; name: string }>;
}

// Mock current user - in a real app, this would come from auth context
const currentUser = { id: 'current-user', name: 'You' };

const ChatDialog = ({
  isOpen,
  onOpenChange,
  challengeId,
  challengeTitle,
  participants,
}: ChatDialogProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock initial messages - in a real app, these would come from API
  useEffect(() => {
    const initialMessages: Message[] = [
      {
        id: '1',
        senderId: participants[0]?.id || 'u1',
        senderName: participants[0]?.name || 'Alex',
        text: "Hey everyone! How's your progress on this challenge?",
        timestamp: new Date(Date.now() - 3600000),
      },
      {
        id: '2',
        senderId: participants[1]?.id || 'u2',
        senderName: participants[1]?.name || 'Morgan',
        text: "I'm already at 40% completion! This topic is interesting.",
        timestamp: new Date(Date.now() - 1800000),
      },
    ];
    
    if (isOpen) {
      setMessages(initialMessages);
    }
  }, [isOpen, participants]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newMessage.trim()) {
      const message: Message = {
        id: `msg-${Date.now()}`,
        senderId: currentUser.id,
        senderName: currentUser.name,
        text: newMessage.trim(),
        timestamp: new Date(),
        
      };
      
      setMessages(prev => [...prev, message]);
      setNewMessage('');
    }
  };

  // Format time for messages
  const formatMessageTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{challengeTitle} - Group Chat</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col h-[50vh]">
          <div className="text-sm text-muted-foreground mb-2">
            {participants.length} participants in this challenge
          </div>
          
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div 
                  key={message.id}
                  className={`flex ${message.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`flex gap-2 max-w-[80%] ${
                      message.senderId === currentUser.id 
                        ? 'flex-row-reverse' 
                        : 'flex-row'
                    }`}
                  >
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarFallback className={message.senderId === currentUser.id ? 'bg-primary text-primary-foreground' : ''}>
                        {message.senderName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div 
                      className={`rounded-2xl px-3 py-2 ${
                        message.senderId === currentUser.id 
                          ? 'bg-primary text-primary-foreground rounded-tr-none' 
                          : 'bg-muted rounded-tl-none'
                      }`}
                    >
                      <div className="flex justify-between items-center gap-4 mb-1">
                        <span className="text-xs font-medium">
                          {message.senderId === currentUser.id ? 'You' : message.senderName}
                        </span>
                        <span className="text-xs opacity-70">
                          {formatMessageTime(message.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm break-words">{message.text}</p>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          
          <form onSubmit={handleSendMessage} className="mt-4 flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
            />
            <Button type="submit" size="icon" disabled={!newMessage.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChatDialog;
