import { Resolver, Query, Mutation, Args, Float } from '@nestjs/graphql';
import { OutagesService } from './outages.service';
import { Outage } from './entities/outage.entity';
import { CreateOutageInput } from './dto/create-outage.input';
import { UpdateOutageInput } from './dto/update-outage.input';
import { UseGuards, ForbiddenException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtUser } from '../auth/jwt.type';

@Resolver(() => Outage)
@UseGuards(JwtAuthGuard)
export class OutagesResolver {
    constructor(private readonly outagesService: OutagesService) {}

    @Query(() => [Outage])
    outages(
        @CurrentUser() user: JwtUser,
        @Args('resolved', { nullable: true }) resolved?: boolean,
        @Args('limit', { nullable: true }) limit?: number
    ) {
        return this.outagesService.findAll(user.userId, {
            resolvedStatus: resolved,
            limit
        });
    }

    @Query(() => Outage)
    async outage(@Args('id') id: number, @CurrentUser() user: JwtUser) {
        const outage = await this.outagesService.findOne(id);
        if (outage.userId !== user.userId) {
            throw new ForbiddenException('Not authorized to access this outage');
        }
        return outage;
    }

    @Mutation(() => Outage)
    createOutage(
        @CurrentUser() user: JwtUser,
        @Args('createOutageInput') createOutageInput: CreateOutageInput,
        @Args('latitude', { type: () => Float, nullable: true }) latitude?: number,
        @Args('longitude', { type: () => Float, nullable: true }) longitude?: number
    ) {
        return this.outagesService.create({
            ...createOutageInput,
            userId: user.userId,
            resolvedStatus: false,
            reportCount: 1
        }, latitude, longitude);
    }

    @Mutation(() => Outage)
    async updateOutage(
        @CurrentUser() user: JwtUser,
        @Args('id') id: number,
        @Args('updateOutageInput') updateOutageInput: UpdateOutageInput,
        @Args('latitude', { type: () => Float, nullable: true }) latitude?: number,
        @Args('longitude', { type: () => Float, nullable: true }) longitude?: number
    ) {
        const outage = await this.outagesService.findOne(id);
        if (outage.userId !== user.userId) {
            throw new ForbiddenException('Not authorized to update this outage');
        }
        
        return this.outagesService.update(id, updateOutageInput, latitude, longitude);
    }
    
    @Mutation(() => Outage)
    async resolveOutage(
        @CurrentUser() user: JwtUser,
        @Args('id') id: number
    ) {
        const outage = await this.outagesService.findOne(id);
        if (outage.userId !== user.userId) {
            throw new ForbiddenException('Not authorized to resolve this outage');
        }
        
        return this.outagesService.resolve(id);
    }

    @Mutation(() => Outage)
    async removeOutage(
        @CurrentUser() user: JwtUser,
        @Args('id') id: number
    ) {
        const outage = await this.outagesService.findOne(id);
        if (outage.userId !== user.userId) {
            throw new ForbiddenException('Not authorized to delete this outage');
        }
        
        await this.outagesService.remove(id);
        return outage;
    }
}