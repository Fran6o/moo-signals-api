import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { VaultsController } from './app.controller.vaults';

import { AppService } from './app.service';
import { VaultService } from './app.service.vaults';

import { ScanCriteria, ScanCriteriaSchema } from './schemas/scanCriteria.schema';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [ConfigModule.forRoot(),
  MongooseModule.forRoot(process.env.MONGODB_CONNECTION),
  MongooseModule.forFeature([{ name: ScanCriteria.name, schema: ScanCriteriaSchema }])],
  controllers: [AppController, VaultsController],
  providers: [AppService, VaultService],
})
export class AppModule { }
