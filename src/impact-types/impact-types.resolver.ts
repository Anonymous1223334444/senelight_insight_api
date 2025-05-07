import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ImpactTypesService } from './impact-types.service';
import { ImpactType } from './entities/impact-type.entity';
import { CreateImpactTypeInput } from './dto/create-impact-type.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtUser } from '../auth/jwt.type';

@Resolver(() => ImpactType)
@UseGuards(JwtAuthGuard)
export class ImpactTypesResolver {
    constructor(private readonly impactTypesService: ImpactTypesService) {}

    @Query(() => [ImpactType])
    impactTypes(@CurrentUser() user: JwtUser) {
        return this.impactTypesService.findAll(user.userId);
    }

    @Query(() => ImpactType)
    async impactType(@Args('id') id: number, @CurrentUser() user: JwtUser) {
        const impactType = await this.impactTypesService.findOne(id);
        if (impactType.userId !== user.userId) {
            throw new Error('Not authorized to access this impact type');
        }
        return impactType;
    }

    @Mutation(() => ImpactType)
    createImpactType(
        @Args('createImpactTypeInput') createImpactTypeInput: CreateImpactTypeInput,
        @CurrentUser() user: JwtUser,
    ) {
        return this.impactTypesService.create({
            ...createImpactTypeInput,
            userId: user.userId,
        });
    }

    @Mutation(() => ImpactType)
    async updateImpactType(
        @Args('id') id: number,
        @Args('updateImpactTypeInput') updateImpactTypeInput: CreateImpactTypeInput,
        @CurrentUser() user: JwtUser,
    ) {
        const impactType = await this.impactTypesService.findOne(id);
        if (!impactType) {
            throw new Error('Impact type not found');
        }

        if (impactType.userId !== user.userId) {
            throw new Error('Not authorized to update this impact type');
        }

        return this.impactTypesService.update(id, updateImpactTypeInput);
    }

    @Mutation(() => ImpactType)
    async removeImpactType(@Args('id') id: number, @CurrentUser() user: JwtUser) {
        const impactType = await this.impactTypesService.findOne(id);
        if (!impactType) {
            throw new Error('Impact type not found');
        }

        if (impactType.userId !== user.userId) {
            throw new Error('Not authorized to delete this impact type');
        }

        await this.impactTypesService.remove(id);
        return impactType;
    }
}