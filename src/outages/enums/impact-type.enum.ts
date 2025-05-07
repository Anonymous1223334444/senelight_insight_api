import { registerEnumType } from '@nestjs/graphql';

export enum ImpactType {
  HOUSEHOLD = 'HOUSEHOLD',
  BUSINESS = 'BUSINESS',
  EDUCATION = 'EDUCATION',
  HEALTH = 'HEALTH',
  OTHER = 'OTHER'
}

registerEnumType(ImpactType, {
  name: 'ImpactType',
  description: 'Types of impact a power outage can have',
});