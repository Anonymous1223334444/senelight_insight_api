import { registerEnumType } from '@nestjs/graphql';

export enum FeelingType {
  UNDERSTANDING = 'UNDERSTANDING',  // "Je commence à être habitué"
  CONCERNED = 'CONCERNED',          // "Je suis inquiet pour mes appareils"
  SUPPORTIVE = 'SUPPORTIVE',        // "Bon courage SENELEC" 
  FRUSTRATED = 'FRUSTRATED'         // "Ça devient vraiment difficile"
}

registerEnumType(FeelingType, {
  name: 'FeelingType',
  description: 'Expression du ressenti des utilisateurs face aux coupures',
});