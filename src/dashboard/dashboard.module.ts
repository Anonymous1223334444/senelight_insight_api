import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardResolver } from './dashboard.resolver';
import { OutagesModule } from '../outages/outages.module';
import { ReportsModule } from '../reports/reports.module';

@Module({
  imports: [OutagesModule, ReportsModule],
  providers: [DashboardService, DashboardResolver],
  exports: [DashboardService],
})
export class DashboardModule {}