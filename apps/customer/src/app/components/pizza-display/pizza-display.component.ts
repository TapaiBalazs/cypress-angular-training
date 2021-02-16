import { Component, Input } from '@angular/core';
import { Pizza } from '@cat/api-interfaces';

@Component({
  selector: 'cat-pizza-display',
  templateUrl: './pizza-display.component.html',
  styleUrls: ['./pizza-display.component.css']
})
export class PizzaDisplayComponent {

  @Input() pizza: Pizza = null;

}
