import { ObjectType, Field, Float, Int } from '@nestjs/graphql';

@ObjectType()
export class MapPointDto {
  @Field(() => Int)
  id: number;

  @Field()
  type: string;

  @Field(() => Float)
  latitude: number;

  @Field(() => Float)
  longitude: number;
}

@ObjectType()
export class OutagePointDto extends MapPointDto {
  @Field()
  resolved: boolean;

  @Field(() => Int)
  reportCount: number;
}

@ObjectType()
export class ReportPointDto extends MapPointDto {
  @Field()
  status: string;

  @Field()
  impactType: string;
}

@ObjectType()
export class MapDataDto {
  @Field(() => [OutagePointDto])
  outages: OutagePointDto[];

  @Field(() => [ReportPointDto])
  reports: ReportPointDto[];
}