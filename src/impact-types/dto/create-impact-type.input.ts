import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNotEmpty, Length } from 'class-validator';

@InputType()
export class CreateImpactTypeInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsString()
  @Length(1, 8)
  emoji: string;
}