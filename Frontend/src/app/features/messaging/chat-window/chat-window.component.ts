import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { SignalRService } from '../../../core/services/signalr.service';
import { ChatMessage } from '../../../core/models';

@Component({
  selector: 'app-chat-window',
  template: `
    <div class="chat-container">
      <!-- Chat Header -->
      <div class="chat-header">
        <div class="header-left">
          <button class="back-btn" (click)="goBack()"><i class="fa-solid fa-arrow-left"></i></button>
          <div class="contact-avatar">{{ otherUserName?.charAt(0)?.toUpperCase() || '?' }}</div>
          <div class="contact-info">
            <strong class="contact-name">{{ otherUserName || 'Loading...' }}</strong>
            <span class="contact-status" *ngIf="typingUser">
              <span class="typing-dots"><span></span><span></span><span></span></span> typing...
            </span>
            <span class="contact-status" *ngIf="!typingUser && projectName">
              <i class="fa-solid fa-building me-1"></i>{{ projectName }}
            </span>
            <span class="contact-status online" *ngIf="!typingUser && !projectName">Online</span>
          </div>
        </div>
      </div>

      <!-- Messages -->
      <div class="chat-messages" #messageContainer>
        <!-- Date separator -->
        <div *ngIf="messages.length > 0" class="date-separator">
          <span>{{ messages[0]?.createdDate | date:'mediumDate' }}</span>
        </div>

        <div *ngFor="let msg of messages; let i = index" class="message-wrapper">
          <!-- Date separator between different days -->
          <div class="date-separator" *ngIf="i > 0 && isDifferentDay(messages[i-1].createdDate, msg.createdDate)">
            <span>{{ msg.createdDate | date:'mediumDate' }}</span>
          </div>

          <div class="message" [class.sent]="msg.senderUserId === currentUserId" [class.received]="msg.senderUserId !== currentUserId">
            <div class="msg-avatar" *ngIf="msg.senderUserId !== currentUserId">
              {{ msg.senderUserName?.charAt(0)?.toUpperCase() || '?' }}
            </div>
            <div class="message-bubble">
              <p class="msg-text">{{ msg.content }}</p>
              <div class="msg-meta">
                <span class="msg-time">{{ msg.createdDate | date:'shortTime' }}</span>
                <i *ngIf="msg.senderUserId === currentUserId" class="fa-solid fa-check-double"
                   [class.read]="msg.isRead" style="font-size:11px; margin-left:4px;"></i>
              </div>
            </div>
          </div>
        </div>

        <div *ngIf="messages.length === 0 && !loading" class="no-messages">
          <i class="fa-regular fa-comments" style="font-size:40px; color:#cbd5e1;"></i>
          <p class="mt-2">No messages yet. Say hello!</p>
        </div>

        <div *ngIf="loading" class="no-messages">
          <div class="spinner-border spinner-border-sm text-primary"></div>
          <p class="mt-2 text-muted">Loading messages...</p>
        </div>
      </div>

      <!-- Input Area -->
      <div class="chat-input-area">
        <div class="input-wrapper">
          <input type="text" [(ngModel)]="newMessage"
                 placeholder="Type a message..."
                 (keyup.enter)="sendMessage()"
                 (input)="onTyping()"
                 class="msg-input">
          <button class="send-btn" (click)="sendMessage()" [disabled]="!newMessage.trim()" [class.active]="newMessage.trim()">
            <i class="fa-solid fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .chat-container {
      display: flex;
      flex-direction: column;
      height: calc(100vh - 120px);
      background: #f8fafc;
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid #e2e8f0;
    }

    /* Header */
    .chat-header {
      padding: 14px 20px;
      background: #fff;
      border-bottom: 1px solid #e2e8f0;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .header-left { display: flex; align-items: center; gap: 12px; }
    .back-btn {
      width: 36px; height: 36px; border-radius: 10px; border: 1px solid #e2e8f0;
      background: #fff; display: flex; align-items: center; justify-content: center;
      cursor: pointer; color: #475569; font-size: 14px; transition: all 0.15s;
    }
    .back-btn:hover { background: #f1f5f9; }
    .contact-avatar {
      width: 42px; height: 42px; border-radius: 50%;
      background: linear-gradient(135deg, #2563eb, #7c3aed);
      display: flex; align-items: center; justify-content: center;
      color: #fff; font-weight: 700; font-size: 18px; flex-shrink: 0;
    }
    .contact-info { display: flex; flex-direction: column; }
    .contact-name { font-size: 15px; color: #1e293b; }
    .contact-status { font-size: 12px; color: #94a3b8; }
    .contact-status.online { color: #22c55e; }

    /* Typing animation */
    .typing-dots { display: inline-flex; gap: 3px; margin-right: 4px; }
    .typing-dots span {
      width: 5px; height: 5px; border-radius: 50%; background: #94a3b8;
      animation: typingBounce 1.2s infinite;
    }
    .typing-dots span:nth-child(2) { animation-delay: 0.2s; }
    .typing-dots span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes typingBounce {
      0%, 60%, 100% { transform: translateY(0); }
      30% { transform: translateY(-4px); }
    }

    /* Messages area */
    .chat-messages {
      flex: 1; overflow-y: auto; padding: 20px;
      background: linear-gradient(180deg, #f1f5f9 0%, #f8fafc 100%);
    }
    .chat-messages::-webkit-scrollbar { width: 4px; }
    .chat-messages::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }

    .date-separator {
      text-align: center; margin: 16px 0;
    }
    .date-separator span {
      background: #e2e8f0; color: #64748b; font-size: 11px; font-weight: 600;
      padding: 4px 12px; border-radius: 12px;
    }

    .message-wrapper { margin-bottom: 4px; }

    .message {
      display: flex; align-items: flex-end; gap: 8px; margin-bottom: 4px;
      animation: msgIn 0.2s ease-out;
    }
    @keyframes msgIn {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .message.sent { justify-content: flex-end; }
    .message.received { justify-content: flex-start; }

    .msg-avatar {
      width: 28px; height: 28px; border-radius: 50%;
      background: #94a3b8; color: #fff; font-size: 12px; font-weight: 700;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }

    .message-bubble {
      max-width: 65%; padding: 10px 14px; border-radius: 16px;
      position: relative; word-wrap: break-word;
    }
    .message.sent .message-bubble {
      background: linear-gradient(135deg, #2563eb, #1d4ed8);
      color: #fff; border-bottom-right-radius: 4px;
    }
    .message.received .message-bubble {
      background: #fff; color: #1e293b;
      border: 1px solid #e2e8f0; border-bottom-left-radius: 4px;
    }

    .msg-text { margin: 0; font-size: 14px; line-height: 1.5; }
    .msg-meta { display: flex; align-items: center; justify-content: flex-end; margin-top: 4px; }
    .msg-time { font-size: 10px; opacity: 0.6; }
    .message.sent .msg-meta .read { color: #93c5fd; }

    .no-messages { text-align: center; padding: 60px 20px; color: #94a3b8; }

    /* Input area */
    .chat-input-area {
      padding: 12px 20px; background: #fff; border-top: 1px solid #e2e8f0;
    }
    .input-wrapper {
      display: flex; align-items: center; gap: 8px;
      background: #f1f5f9; border-radius: 24px; padding: 4px 4px 4px 16px;
      border: 1px solid #e2e8f0; transition: border-color 0.2s;
    }
    .input-wrapper:focus-within { border-color: #2563eb; background: #fff; }
    .msg-input {
      flex: 1; border: none; outline: none; background: transparent;
      font-size: 14px; color: #1e293b; padding: 8px 0;
    }
    .msg-input::placeholder { color: #94a3b8; }
    .send-btn {
      width: 40px; height: 40px; border-radius: 50%; border: none;
      background: #e2e8f0; color: #94a3b8; font-size: 16px;
      cursor: pointer; display: flex; align-items: center; justify-content: center;
      transition: all 0.2s;
    }
    .send-btn.active { background: #2563eb; color: #fff; }
    .send-btn.active:hover { background: #1d4ed8; }
  `]
})
export class ChatWindowComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('messageContainer') messageContainer!: ElementRef;

  messages: ChatMessage[] = [];
  newMessage = '';
  conversationId = 0;
  currentUserId = 0;
  otherUserName = '';
  projectName = '';
  typingUser: string | null = null;
  loading = false;
  private subscriptions: Subscription[] = [];
  private typingTimeout: any;
  private shouldScroll = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private auth: AuthService,
    private signalR: SignalRService
  ) {}

  async ngOnInit(): Promise<void> {
    this.currentUserId = this.auth.getUserId();
    this.conversationId = +this.route.snapshot.params['id'];

    this.loading = true;
    this.loadConversationInfo();
    this.loadMessages();
    this.api.put(`Messaging/messages/${this.conversationId}/read`).subscribe();

    // SignalR is optional - chat works without real-time via API polling
    try {
      await this.signalR.startConnection();
      await this.signalR.joinConversation(this.conversationId);

      this.subscriptions.push(
        this.signalR.messageReceived$.subscribe(msg => {
          if (msg.conversationId === this.conversationId && !this.messages.some(m => m.id === msg.id)) {
            this.messages.push(msg);
            this.shouldScroll = true;
            this.api.put(`Messaging/messages/${this.conversationId}/read`).subscribe();
          }
        }),
        this.signalR.userTyping$.subscribe(data => {
          if (data.conversationId === this.conversationId && data.userId !== this.currentUserId.toString()) {
            this.typingUser = data.isTyping ? data.userName : null;
          }
        })
      );
    } catch (err) {
      console.warn('SignalR connection failed, real-time messaging disabled:', err);
    }
  }

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  async ngOnDestroy(): Promise<void> {
    this.subscriptions.forEach(s => s.unsubscribe());
    clearTimeout(this.typingTimeout);
    try { await this.signalR.leaveConversation(this.conversationId); } catch {}
  }

  loadConversationInfo(): void {
    this.api.get<any[]>('Messaging/conversations').subscribe(res => {
      if (res.success && res.data) {
        const conv = (res.data as any[]).find((c: any) => c.id === this.conversationId);
        if (conv) {
          const myName = this.auth.getUserDisplayName();
          this.otherUserName = conv.buyerUserName === myName ? conv.sellerUserName : conv.buyerUserName;
          this.projectName = conv.projectName || '';
        }
      }
    });
  }

  loadMessages(): void {
    this.api.get<ChatMessage[]>(`Messaging/conversations/${this.conversationId}/messages`).subscribe(res => {
      if (res.success && res.data) {
        this.messages = res.data.reverse();
        this.shouldScroll = true;
      }
      this.loading = false;
    });
  }

  sendMessage(): void {
    if (!this.newMessage.trim()) return;
    const content = this.newMessage;
    this.newMessage = '';
    this.api.post<ChatMessage>('Messaging/messages', {
      conversationId: this.conversationId, content, messageType: 'Text'
    }).subscribe(res => {
      if (res.success && res.data) {
        this.messages.push(res.data);
        this.shouldScroll = true;
        this.signalR.sendMessage(this.conversationId, res.data.content);
      }
    });
  }

  onTyping(): void {
    this.signalR.sendTypingIndicator(this.conversationId, true);
    clearTimeout(this.typingTimeout);
    this.typingTimeout = setTimeout(() => {
      this.signalR.sendTypingIndicator(this.conversationId, false);
    }, 2000);
  }

  goBack(): void {
    this.router.navigate(['/messaging']);
  }

  isDifferentDay(d1: Date, d2: Date): boolean {
    const a = new Date(d1), b = new Date(d2);
    return a.toDateString() !== b.toDateString();
  }

  private scrollToBottom(): void {
    try {
      const el = this.messageContainer?.nativeElement;
      if (el) el.scrollTop = el.scrollHeight;
    } catch {}
  }
}
