import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImpactType } from './entities/impact-type.entity';
import { ImpactTypesService } from './impact-types.service';
import { ImpactTypesResolver } from './impact-types.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([ImpactType])],
  providers: [ImpactTypesService, ImpactTypesResolver],
  exports: [ImpactTypesService],
})
export class ImpactTypesModule {}