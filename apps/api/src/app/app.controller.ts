import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';
import { Pizza } from './interfaces/pizza.interfaces';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('pizza/list')
  async getPizzas(): Promise<Pizza[]> {
    return this.appService.getPizzas();
  }
}
