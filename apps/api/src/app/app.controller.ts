import { Pizza } from '@cat/api-interfaces';
import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Res, ValidationPipe } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';

import { AppService } from './app.service';
import { PizzaDto } from './data-transfer-objects/pizza.dto';

/**
 Since this is only a mock back-end, I'm inclined to do everything in one controller.
 */

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
  }

  @Get('pizza/list')
  async getPizzas(): Promise<Pizza[]> {
    return this.appService.getPizzas();
  }

  @Get('pizza/images/:fileName')
  async getPizzaImage(@Param('fileName') fileName: string, @Res() res: Response): Promise<any> {
    res.sendFile(join(__dirname, '..', 'api', 'assets', fileName));
  }

  // TODO: make these authenticated endpoints
  @Get('pizza/:id')
  async getPizza(@Param('id', ParseIntPipe) id: number): Promise<Pizza> {
    return this.appService.getPizza(id);
  }

  @Post('pizza')
  async createPizza(@Body(ValidationPipe) pizzaDto: PizzaDto): Promise<number> {
    return this.appService.createPizza(pizzaDto);
  }

  @Put('pizza')
  async updatePizza(@Body(ValidationPipe) pizzaDto: PizzaDto): Promise<number> {
    return this.appService.updatePizza(pizzaDto);
  }
}
