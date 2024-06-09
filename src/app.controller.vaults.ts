import { Controller, Get, Put, Req } from '@nestjs/common';
import { VaultService } from './app.service.vaults';
import { Request } from 'express';

@Controller('vaults')
export class VaultsController {
  constructor(private readonly vaultService: VaultService) { }

  @Get()
  async search(@Req() request: Request): Promise<string> {
    return await this.vaultService.findAll(request.query);
  }

  @Put()
  async add(@Req() request: Request): Promise<string> {
    return await this.vaultService.add(request.body);
  }
}
