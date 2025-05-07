import { ObjectType, Field, Float, Int } from '@nestjs/graphql';

@ObjectType()
export class ImpactTypeCount {
    @Field()
    impactTypeId: number;

    @Field()
    impactTypeName: string;

    @Field(() => Int)
    count: number;
}

@ObjectType()
export class LocationHeatmap {
    @Field(() => Float)
    latitude: number;

    @Field(() => Float)
    longitude: number;

    @Field(() => Int)
    count: number;
}

@ObjectType()
export class DailyReportCount {
    @Field()
    date: string;

    @Field(() => Int)
    count: number;
}

@ObjectType()
export class SilentZone {
    @Field(() => Float)
    latitude: number;

    @Field(() => Float)
    longitude: number;

    @Field(() => Float)
    radius: number; // en km
}

@ObjectType()
export class SentimentAnalysis {
    @Field()
    impactTypeName: string;

    @Field(() => Float)
    averageSentiment: number; // de -1 (négatif) à 1 (positif)
    
    @Field(() => Int)
    count: number;
}