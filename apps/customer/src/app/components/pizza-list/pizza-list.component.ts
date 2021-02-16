import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PizzaService } from '../../services/pizza.service';

@Component({
  selector: 'cat-pizza-list',
  templateUrl: './pizza-list.component.html',
  styleUrls: ['./pizza-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PizzaListComponent {

  readonly pizzaList$ = this.pizzaService.getPizzaList();

  constructor(private pizzaService: PizzaService) {
  }

  trackBy(index: number, element: any) {
    return element?.id;
  }




}
