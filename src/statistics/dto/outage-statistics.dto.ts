import { ObjectType, Field, Int, Float } from '@nestjs/graphql';

@ObjectType()
export class OutageStatisticsDto {
    @Field(() => Int)
    total: number;

    @Field(() => Int)
    resolved: number;

    @Field(() => Int)
    unresolved: number;

    @Field(() => Int)
    percentResolved: number;
}