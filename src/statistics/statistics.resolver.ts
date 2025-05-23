import { Resolver, Query, Args } from '@nestjs/graphql';
import { StatisticsService } from './statistics.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { CategoryExpense, MonthlyData, CurrentMonthData } from './dto/statistics.types';
import { Float } from '@nestjs/graphql';
import { JwtUser } from '../auth/jwt.type';
import { ImpactTypeCountDto } from './dto/impact-type-count.dto';
import { MonthlyReportCountDto } from './dto/monthly-report-count.dto';
import { OutageStatisticsDto } from './dto/outage-statistics.dto';

@Resolver()
@UseGuards(JwtAuthGuard)
export class StatisticsResolver {
    constructor(private readonly statisticsService: StatisticsService) {}

    @Query(() => Float)
    async monthlyExpenses(@CurrentUser() user: JwtUser) {
        return this.statisticsService.getMonthlyExpenses(user.userId);
    }

    @Query(() => Float)
    async monthlyIncomes(@CurrentUser() user: JwtUser) {
        return this.statisticsService.getMonthlyIncomes(user.userId);
    }

    @Query(() => Float)
    async balance(@CurrentUser() user: JwtUser) {
        return this.statisticsService.getBalance(user.userId);
    }

    @Query(() => [CategoryExpense])
    async expensesByCategory(@CurrentUser() user: JwtUser) {
        return this.statisticsService.getExpensesByCategory(user.userId);
    }

    @Query(() => [MonthlyData])
    async monthlyHistory(@CurrentUser() user: JwtUser) {
        return this.statisticsService.getMonthlyHistory(user.userId);
    }

    @Query(() => CurrentMonthData)
    async currentMonthHistory(@CurrentUser() user: JwtUser) {
        return this.statisticsService.getCurrentMonthHistory(user.userId);
    }

    @Query(() => [ImpactTypeCountDto])
    async reportsByImpactType(@CurrentUser() user: JwtUser) {
        return this.statisticsService.getReportsByImpactType(user.userId);
    }

    @Query(() => [MonthlyReportCountDto])
    async monthlyReportCounts(@CurrentUser() user: JwtUser) {
        return this.statisticsService.getMonthlyReportCounts(user.userId);
    }

    @Query(() => OutageStatisticsDto)
    async outageStatistics(@CurrentUser() user: JwtUser) {
        return this.statisticsService.getOutageStatistics(user.userId);
    }
}