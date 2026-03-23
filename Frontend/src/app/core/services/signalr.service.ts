import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

declare var signalR: any;

@Injectable({ providedIn: 'root' })
export class SignalRService {
  private hubConnection: any;
  private connected = false;

  public messageReceived$ = new Subject<any>();
  public userTyping$ = new Subject<any>();
  public messageRead$ = new Subject<any>();

  constructor(private auth: AuthService) {}

  async startConnection(): Promise<void> {
    if (this.connected) return;

    const token = this.auth.getToken();
    if (!token) return;

    try {
      // Dynamic import for signalR
      const signalRModule = await import('@microsoft/signalr');

      this.hubConnection = new signalRModule.HubConnectionBuilder()
        .withUrl(environment.signalRUrl, {
          accessTokenFactory: () => this.auth.getToken() || ''
        })
        .withAutomaticReconnect()
        .build();

      this.hubConnection.on('ReceiveMessage', (message: any) => {
        this.messageReceived$.next(message);
      });

      this.hubConnection.on('UserTyping', (data: any) => {
        this.userTyping$.next(data);
      });

      this.hubConnection.on('MessageRead', (data: any) => {
        this.messageRead$.next(data);
      });

      await this.hubConnection.start();
      this.connected = true;
      console.log('SignalR connected');
    } catch (err) {
      console.error('SignalR connection error:', err);
      this.connected = false;
    }
  }

  async stopConnection(): Promise<void> {
    if (this.hubConnection && this.connected) {
      await this.hubConnection.stop();
      this.connected = false;
    }
  }

  async joinConversation(conversationId: number): Promise<void> {
    if (this.hubConnection && this.connected) {
      await this.hubConnection.invoke('JoinConversation', conversationId);
    }
  }

  async leaveConversation(conversationId: number): Promise<void> {
    if (this.hubConnection && this.connected) {
      await this.hubConnection.invoke('LeaveConversation', conversationId);
    }
  }

  async sendMessage(conversationId: number, content: string, messageType: string = 'Text'): Promise<void> {
    if (this.hubConnection && this.connected) {
      await this.hubConnection.invoke('SendMessage', conversationId, content, messageType);
    }
  }

  async sendTypingIndicator(conversationId: number, isTyping: boolean): Promise<void> {
    if (this.hubConnection && this.connected) {
      await this.hubConnection.invoke('TypingIndicator', conversationId, isTyping);
    }
  }

  async sendMessageRead(conversationId: number, messageId: number): Promise<void> {
    if (this.hubConnection && this.connected) {
      await this.hubConnection.invoke('MessageRead', conversationId, messageId);
    }
  }

  isConnected(): boolean {
    return this.connected;
  }
}
