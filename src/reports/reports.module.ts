import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from './entities/report.entity';
import { ReportsService } from './reports.service';
import { ReportsResolver } from './reports.resolver';
import { ImpactTypesModule } from 'src/impact-types/impact-types.module';

@Module({
  imports: [TypeOrmModule.forFeature([Report]), ImpactTypesModule],
  providers: [ReportsService, ReportsResolver],
  exports: [ReportsService],
})
export class ReportsModule {}