import { Injectable } from '@angular/core';
import { Pizza } from '@cat/api-interfaces';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cartContent = new BehaviorSubject<Pizza[]>([]);

  readonly cart$ = this.cartContent.asObservable();
  readonly sum$ = this.cart$.pipe(
    map((cartContent: Pizza[]) => cartContent.reduce((accumulator: number, current: Pizza) => accumulator + current.price, 0))
  );

  constructor() {
  }

  addToCart(pizza: Pizza): void {
    const cart = [...this.cartContent.getValue()];
    cart.push(pizza);
    this.cartContent.next(cart);
  }


}
