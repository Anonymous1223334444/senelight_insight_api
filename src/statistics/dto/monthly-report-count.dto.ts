import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class MonthlyReportCountDto {
    @Field()
    date: string;

    @Field(() => Int)
    count: number;
}