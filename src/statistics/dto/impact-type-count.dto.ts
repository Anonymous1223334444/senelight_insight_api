import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class ImpactTypeCountDto {
    @Field(() => Int)
    impactTypeId: number;

    @Field()
    impactTypeName: string;

    @Field(() => Int)
    count: number;
}