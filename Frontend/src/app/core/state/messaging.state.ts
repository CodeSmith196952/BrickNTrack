import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../services/api.service';
import { SignalRService } from '../services/signalr.service';
import { Conversation, ChatMessage } from '../models';

@Injectable({ providedIn: 'root' })
export class MessagingState {
  private conversationsSubject = new BehaviorSubject<Conversation[]>([]);

  conversations$: Observable<Conversation[]> = this.conversationsSubject.asObservable();

  totalUnread$: Observable<number> = this.conversations$.pipe(
    map(convs => convs.reduce((sum, c) => sum + c.unreadCount, 0))
  );

  constructor(private api: ApiService, private signalR: SignalRService) {
    this.signalR.messageReceived$.subscribe((message: ChatMessage) => {
      this.handleIncomingMessage(message);
    });
  }

  loadConversations(): void {
    this.api.get<Conversation[]>('Messaging/conversations').subscribe(res => {
      if (res.success && res.data) {
        this.conversationsSubject.next(res.data);
      }
    });
  }

  addMessage(msg: ChatMessage): void {
    const convs = this.conversationsSubject.value.map(c => {
      if (c.id === msg.conversationId) {
        return {
          ...c,
          lastMessageContent: msg.content,
          lastMessageAt: msg.createdDate,
        };
      }
      return c;
    });
    this.conversationsSubject.next(convs);
  }

  private handleIncomingMessage(message: ChatMessage): void {
    const convs = this.conversationsSubject.value.map(c => {
      if (c.id === message.conversationId) {
        return {
          ...c,
          lastMessageContent: message.content,
          lastMessageAt: message.createdDate,
          unreadCount: c.unreadCount + 1,
        };
      }
      return c;
    });
    this.conversationsSubject.next(convs);
  }
}
