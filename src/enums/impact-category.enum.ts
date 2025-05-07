import { registerEnumType } from '@nestjs/graphql';

export enum ImpactCategory {
  HOME = 'HOME',            // Impacts domestiques
  BUSINESS = 'BUSINESS',    // Impacts sur une activité commerciale
  EDUCATION = 'EDUCATION',  // Impacts sur l'éducation/études
  HEALTH = 'HEALTH',        // Impacts santé
  COMFORT = 'COMFORT'       // Confort général
}

registerEnumType(ImpactCategory, {
  name: 'ImpactCategory',
  description: 'Types d\'impact des coupures électriques',
});