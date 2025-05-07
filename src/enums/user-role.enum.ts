import { registerEnumType } from '@nestjs/graphql';

export enum UserRole {
  CLIENT = 'CLIENT',
  ADMIN = 'ADMIN',
  TECHNICIAN = 'TECHNICIAN'
}

registerEnumType(UserRole, {
  name: 'UserRole',
  description: 'Rôles des utilisateurs dans le système',
});