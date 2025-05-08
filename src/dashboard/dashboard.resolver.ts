import { Resolver, Query } from '@nestjs/graphql';
import { DashboardService } from './dashboard.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtUser } from '../auth/jwt.type';
import { DashboardStatsDto } from './dto/dashboard-stats.dto';
import { MapDataDto } from './dto/map-data.dto';

@Resolver()
@UseGuards(JwtAuthGuard)
export class DashboardResolver {
  constructor(private readonly dashboardService: DashboardService) {}

  @Query(() => DashboardStatsDto)
  async dashboardStats(@CurrentUser() user: JwtUser): Promise<DashboardStatsDto> {
    return this.dashboardService.getRecentStats(user.userId);
  }

  @Query(() => MapDataDto)
  async mapData(@CurrentUser() user: JwtUser): Promise<MapDataDto> {
    return this.dashboardService.getMapData(user.userId);
  }
}