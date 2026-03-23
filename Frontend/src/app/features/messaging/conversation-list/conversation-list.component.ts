import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { Conversation } from '../../../core/models';

@Component({
  selector: 'app-conversation-list',
  template: `
    <div class="conversations-container">
      <div class="conv-header"><h2>Messages</h2></div>

      <!-- New conversation banner -->
      <div class="new-conv-banner" *ngIf="pendingBuilderName">
        <div class="d-flex align-items-center gap-3">
          <i class="fa-solid fa-paper-plane" style="font-size:20px; color:#2563eb;"></i>
          <div>
            <strong>Start conversation with {{ pendingBuilderName }}</strong>
            <p class="mb-0 text-muted" style="font-size:13px;" *ngIf="pendingProjectName">About: {{ pendingProjectName }}</p>
          </div>
        </div>
        <div class="mt-3 d-flex gap-2">
          <input type="text" class="form-control" placeholder="Type your message..." [(ngModel)]="initialMessage" (keyup.enter)="startConversation()">
          <button class="btn btn-primary" (click)="startConversation()" [disabled]="!initialMessage.trim()">
            <i class="fa-solid fa-paper-plane me-1"></i>Send
          </button>
        </div>
      </div>

      <div class="conversation-list">
        <div *ngFor="let conv of conversations" class="conversation-item" (click)="openChat(conv.id)" [class.unread]="conv.unreadCount > 0">
          <div class="conv-avatar">{{ getOtherName(conv).charAt(0).toUpperCase() }}</div>
          <div class="conv-info">
            <strong>{{ getOtherName(conv) }}</strong>
            <span class="project-tag" *ngIf="conv.projectName">{{ conv.projectName }}</span>
            <p class="last-msg">{{ conv.lastMessageContent || 'No messages yet' }}</p>
          </div>
          <div class="conv-meta">
            <span class="time">{{ conv.lastMessageAt | date:'short' }}</span>
            <span class="unread-badge" *ngIf="conv.unreadCount > 0">{{ conv.unreadCount }}</span>
          </div>
        </div>
        <div *ngIf="conversations.length === 0 && !pendingBuilderName" class="no-data">
          <i class="fa-solid fa-comments" style="font-size:40px; color:#cbd5e1;"></i>
          <h5 class="mt-3">No conversations yet</h5>
          <p class="text-muted">Click "Contact Builder" on any property to start.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .conversations-container { }
    .conv-header { padding: 20px 20px 12px; border-bottom: 1px solid #f1f5f9; }
    .conv-header h2 { margin: 0; font-size: 20px; font-weight: 700; }
    .new-conv-banner { padding: 16px 20px; background: #f0f5ff; border-bottom: 1px solid #dbeafe; }
    .conversation-item { display: flex; align-items: center; padding: 14px 20px; border-bottom: 1px solid #f1f5f9; cursor: pointer; gap: 12px; transition: background 0.12s; }
    .conversation-item:hover { background: #f8fafc; }
    .conversation-item.unread { background: #eff6ff; }
    .conv-avatar { width: 40px; height: 40px; border-radius: 10px; background: linear-gradient(135deg, #2563eb, #7c3aed); display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 700; font-size: 16px; flex-shrink: 0; }
    .conv-info { flex: 1; min-width: 0; }
    .conv-info strong { display: block; font-size: 14px; color: #1e293b; }
    .project-tag { font-size: 11px; color: #64748b; background: #f1f5f9; padding: 1px 6px; border-radius: 4px; }
    .last-msg { margin: 2px 0 0; font-size: 13px; color: #94a3b8; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .conv-meta { text-align: right; flex-shrink: 0; }
    .time { font-size: 11px; color: #94a3b8; display: block; }
    .unread-badge { display: inline-flex; align-items: center; justify-content: center; background: #2563eb; color: #fff; border-radius: 50%; width: 20px; height: 20px; font-size: 11px; font-weight: 700; margin-top: 4px; }
    .no-data { text-align: center; padding: 60px 20px; }
  `]
})
export class ConversationListComponent implements OnInit, OnDestroy {
  conversations: Conversation[] = [];
  currentUserName = '';
  pendingBuilderId: number | null = null;
  pendingProjectId: number | null = null;
  pendingProjectName = '';
  pendingBuilderName = '';
  initialMessage = '';
  private destroy$ = new Subject<void>();

  constructor(private api: ApiService, private auth: AuthService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.currentUserName = this.auth.getUserDisplayName();

    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      if (params['builderId']) {
        this.pendingBuilderId = +params['builderId'];
        this.pendingProjectId = params['projectId'] ? +params['projectId'] : null;
        this.pendingProjectName = params['projectName'] || '';
        this.api.get<any>('Builder/getBuilderById', { builderId: this.pendingBuilderId })
          .pipe(takeUntil(this.destroy$))
          .subscribe(res => {
            if (res.success && res.data) {
              this.pendingBuilderName = res.data.name;
              this.initialMessage = this.pendingProjectName
                ? `Hi, I'm interested in ${this.pendingProjectName}. Could you share more details?`
                : `Hi, I'd like to know more about your properties.`;
            }
          });
      }
    });

    this.loadConversations();
  }

  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }

  loadConversations(): void {
    this.api.get<Conversation[]>('Messaging/conversations').pipe(takeUntil(this.destroy$))
      .subscribe(res => { if (res.success && res.data) this.conversations = res.data; });
  }

  startConversation(): void {
    if (!this.initialMessage.trim() || !this.pendingBuilderId) return;
    this.api.post<any>('Messaging/conversations', { builderId: this.pendingBuilderId, projectId: this.pendingProjectId })
      .pipe(takeUntil(this.destroy$)).subscribe(res => {
        if (res.success && res.data) {
          const convId = res.data.id;
          this.api.post<any>('Messaging/messages', { conversationId: convId, content: this.initialMessage, messageType: 'Text' })
            .pipe(takeUntil(this.destroy$)).subscribe(() => {
              this.pendingBuilderName = '';
              this.pendingBuilderId = null;
              this.loadConversations();
              this.router.navigate(['/messaging', convId]);
            });
        }
      });
  }

  openChat(id: number): void { this.router.navigate(['/messaging', id]); }

  getOtherName(conv: Conversation): string {
    return conv.buyerUserName === this.currentUserName ? conv.sellerUserName : conv.buyerUserName;
  }
}
