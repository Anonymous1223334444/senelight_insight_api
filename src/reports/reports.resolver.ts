import { Resolver, Query, Mutation, Args, Float } from '@nestjs/graphql';
import { ReportsService } from './reports.service';
import { Report } from './entities/report.entity';
import { CreateReportInput } from './dto/create-report.input';
import { UseGuards, ForbiddenException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtUser } from '../auth/jwt.type';
import { NetworkStatus } from '../enums/network-status.enum';

@Resolver(() => Report)
@UseGuards(JwtAuthGuard)
export class ReportsResolver {
    constructor(private readonly reportsService: ReportsService) {}

    @Query(() => [Report])
    reports(
        @CurrentUser() user: JwtUser,
        @Args('status', { nullable: true }) status?: NetworkStatus,
        @Args('limit', { nullable: true }) limit?: number
    ) {
        return this.reportsService.findAll(user.userId, {
            networkStatus: status,
            limit
        });
    }

    @Query(() => Report)
    async report(@Args('id') id: number, @CurrentUser() user: JwtUser) {
        const report = await this.reportsService.findOne(id);
        if (report.userId !== user.userId) {
            throw new ForbiddenException('Not authorized to access this report');
        }
        return report;
    }

    @Mutation(() => Report)
    createReport(
        @Args('createReportInput') createReportInput: CreateReportInput,
        @CurrentUser() user: JwtUser
    ) {
        return this.reportsService.create({
            ...createReportInput,
            userId: user.userId,
            networkStatus: NetworkStatus.SENT
        });
    }

    @Mutation(() => Report)
    async updateReportStatus(
        @Args('id') id: number,
        @Args('networkStatus') networkStatus: NetworkStatus,
        @CurrentUser() user: JwtUser
    ) {
        const report = await this.reportsService.findOne(id);
        if (report.userId !== user.userId) {
            throw new ForbiddenException('Not authorized to update this report');
        }
        
        return this.reportsService.update(id, { networkStatus });
    }

    @Mutation(() => Report)
    async removeReport(
        @Args('id') id: number,
        @CurrentUser() user: JwtUser
    ) {
        const report = await this.reportsService.findOne(id);
        if (report.userId !== user.userId) {
            throw new ForbiddenException('Not authorized to delete this report');
        }
        
        await this.reportsService.remove(id);
        return report;
    }
}