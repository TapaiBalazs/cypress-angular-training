import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { ApiInterfacesModule } from '@cat/api-interfaces';
import { CustomerMainRoutingModule } from './customer-main-routing.module';

import { CustomerMainComponent } from './customer-main.component';
import { PizzaListComponent } from './components/pizza-list/pizza-list.component';
import { PizzaDisplayComponent } from './components/pizza-display/pizza-display.component';
import { CartButtonComponent } from './components/cart-button/cart-button.component';

@NgModule({
  declarations: [CustomerMainComponent, PizzaListComponent, PizzaDisplayComponent, CartButtonComponent],
  imports: [BrowserModule, BrowserAnimationsModule, CustomerMainRoutingModule, HttpClientModule, ApiInterfacesModule],
  providers: [],
  bootstrap: [CustomerMainComponent]
})
export class CustomerMainModule {
}
