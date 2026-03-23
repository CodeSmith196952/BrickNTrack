import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { ConversationListComponent } from './conversation-list/conversation-list.component';
import { ChatWindowComponent } from './chat-window/chat-window.component';

const routes: Routes = [
  { path: '', component: ConversationListComponent },
  { path: ':id', component: ChatWindowComponent }
];

@NgModule({
  declarations: [ConversationListComponent, ChatWindowComponent],
  imports: [SharedModule, RouterModule.forChild(routes)]
})
export class MessagingModule {}
