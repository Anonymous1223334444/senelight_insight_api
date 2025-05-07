import { InputType, Field, Float } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

@InputType()
export class CreateReportInput {
    @Field()
    @IsNotEmpty()
    @IsString()
    description: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    sentimentText?: string;

    @Field(() => Float, { nullable: true })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    latitude?: number;

    @Field(() => Float, { nullable: true })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    longitude?: number;

    @Field()
    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    impactTypeId: number;
}