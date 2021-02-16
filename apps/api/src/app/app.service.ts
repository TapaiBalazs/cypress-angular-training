import { Injectable } from '@nestjs/common';
import { PizzaDto } from './data-transfer-objects/pizza.dto';
import { Pizza } from './interfaces/pizza.interfaces';

const PIZZAS = [
  {
    id: 1,
    name: 'Margherita',
    price: 1200,
    imageUrl: 'todo',
    description: 'Tomato sauce, mozzarella, basil'
  },
  {
    id: 2,
    name: 'Prosciutto',
    price: 1300,
    imageUrl: 'todo',
    description: 'Tomato sauce, ham, mozzarella, oregano'
  },
  {
    id: 3,
    name: 'Diavola',
    price: 1300,
    imageUrl: 'todo',
    description: 'Tomato sauce, Italian spicy salami, mozzarella'
  },
  {
    id: 4,
    name: 'Prosciutto e Mais',
    price: 1400,
    imageUrl: 'todo',
    description: 'Tomato sauce, ham, corn, mozzarella'
  },
  {
    id: 5,
    name: 'Piccante',
    price: 1400,
    imageUrl: 'todo',
    description: 'Tomato sauce, ham, italian spicy salami, green peppers, jalapeno, mozzarella'
  },
]

@Injectable()
export class AppService {
  async getPizzas(): Promise<Pizza[]> {
    return PIZZAS;
  }

  async getPizza(id: number): Promise<Pizza> {
    return PIZZAS.find(p => p.id === id);
  }

  async createPizza(pizza: PizzaDto): Promise<number> {
    const id = Math.floor(Math.random() * 100000);
    const newPizza = {
      id,
      ...pizza
    }
    PIZZAS.push(newPizza);
    return id;
  }

  async updatePizza(pizza: PizzaDto): Promise<number> {
    const existing = await this.getPizza(pizza.id);
    existing.name = pizza.name
    existing.price = pizza.price
    existing.description = pizza.description
    existing.imageUrl = pizza.imageUrl
    return existing.id;
  }
}
