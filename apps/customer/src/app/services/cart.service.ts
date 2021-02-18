import { Injectable } from '@angular/core';
import { Pizza } from '@cat/api-interfaces';
import { BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cartContent = new BehaviorSubject<Pizza[]>(JSON.parse(localStorage.getItem('cart')) || []);

  readonly cart$ = this.cartContent.asObservable()
    .pipe(
      tap(content => localStorage.setItem('cart', JSON.stringify(content)))
    );
  readonly sum$ = this.cart$.pipe(
    tap(console.warn),
    map((cartContent: Pizza[]) => cartContent.reduce((accumulator: number, current: Pizza) => accumulator + current.price, 0)),
    tap(console.warn)
  );

  constructor() {
    console.log('constructor', JSON.parse(localStorage.getItem('cart')))
  }

  addToCart(pizza: Pizza): void {
    const cart = [...this.cartContent.getValue()];
    cart.push(pizza);
    // localStorage.setItem('cart', JSON.stringify(cart));
    this.cartContent.next(cart);
  }


}
