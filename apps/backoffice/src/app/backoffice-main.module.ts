import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { BackofficeMainComponent } from './backoffice-main.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [BackofficeMainComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot([], { initialNavigation: 'enabled' }),
  ],
  providers: [],
  bootstrap: [BackofficeMainComponent],
})
export class BackofficeMainModule {}
