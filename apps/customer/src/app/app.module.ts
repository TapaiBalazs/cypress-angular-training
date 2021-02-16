import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { ApiInterfacesModule } from '@cat/api-interfaces';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { PizzaListComponent } from './components/pizza-list/pizza-list.component';
import { PizzaDisplayComponent } from './components/pizza-display/pizza-display.component';

@NgModule({
  declarations: [AppComponent, PizzaListComponent, PizzaDisplayComponent],
  imports: [BrowserModule, BrowserAnimationsModule, AppRoutingModule, HttpClientModule, ApiInterfacesModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
