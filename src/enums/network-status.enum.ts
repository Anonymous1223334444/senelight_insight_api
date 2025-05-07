import { registerEnumType } from '@nestjs/graphql';

export enum NetworkStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  FAILED = 'FAILED'
}

registerEnumType(NetworkStatus, {
  name: 'NetworkStatus',
  description: 'Status of report network synchronization',
});