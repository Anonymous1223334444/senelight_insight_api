import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatisticsService } from './statistics.service';
import { StatisticsResolver } from './statistics.resolver';
import { Report } from '../reports/entities/report.entity';
import { ImpactType } from '../impact-types/entities/impact-type.entity';
import { Outage } from '../outages/entities/outage.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Report, ImpactType, Outage])
  ],
  providers: [StatisticsResolver, StatisticsService],
})
export class StatisticsModule {}