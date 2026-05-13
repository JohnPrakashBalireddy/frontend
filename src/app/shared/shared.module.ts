import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppHeaderComponent } from './components/app-header/app-header.component';
import { MailInboxComponent } from './components/mail-inbox/mail-inbox.component';

@NgModule({
  imports: [CommonModule, RouterModule],
  declarations: [AppHeaderComponent, MailInboxComponent],
  exports: [AppHeaderComponent, MailInboxComponent]
})
export class SharedModule { }
