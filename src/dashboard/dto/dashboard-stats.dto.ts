import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class DashboardStatsDto {
  @Field(() => Int)
  totalOutages: number;

  @Field(() => Int)
  activeOutages: number;

  @Field(() => Int)
  totalReports: number;

  @Field(() => Int)
  pendingReports: number;
}