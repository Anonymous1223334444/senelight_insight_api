import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Outage } from './entities/outage.entity';
import { OutagesService } from './outages.service';
import { OutagesResolver } from './outages.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Outage])],
  providers: [OutagesService, OutagesResolver],
  exports: [OutagesService],
})
export class OutagesModule {}