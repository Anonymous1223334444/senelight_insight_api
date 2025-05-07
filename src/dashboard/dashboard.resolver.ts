import { Resolver, Query } from '@nestjs/graphql';
import { DashboardService } from './dashboard.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtUser } from '../auth/jwt.type';

@Resolver()
@UseGuards(JwtAuthGuard)
export class DashboardResolver {
  constructor(private readonly dashboardService: DashboardService) {}

  @Query(() => JSON)
  async dashboardStats(@CurrentUser() user: JwtUser) {
    return this.dashboardService.getRecentStats(user.userId);
  }

  @Query(() => JSON)
  async mapData(@CurrentUser() user: JwtUser) {
    return this.dashboardService.getMapData(user.userId);
  }
}