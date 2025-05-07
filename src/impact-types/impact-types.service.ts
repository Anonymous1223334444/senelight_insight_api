import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImpactType } from './entities/impact-type.entity';

@Injectable()
export class ImpactTypesService {
    constructor(
        @InjectRepository(ImpactType)
        private impactTypeRepository: Repository<ImpactType>,
    ) {}

    findAll(userId: number): Promise<ImpactType[]> {
        return this.impactTypeRepository.find({
            where: { userId },
        });
    }

    async findOne(id: number): Promise<ImpactType> {
        const impactType = await this.impactTypeRepository.findOne({ where: { id } });
        if (!impactType) {
            throw new NotFoundException(`Impact type with ID ${id} not found`);
        }
        return impactType;
    }

    async create(data: Partial<ImpactType>): Promise<ImpactType> {
        const existingType = await this.impactTypeRepository.findOne({
            where: {
                name: data.name,
                userId: data.userId
            }
        });

        if (existingType) {
            throw new ConflictException(`An impact type with name "${data.name}" already exists for this user`);
        }
        const impactType = this.impactTypeRepository.create(data);
        return this.impactTypeRepository.save(impactType);
    }

    async update(id: number, data: Partial<ImpactType>): Promise<ImpactType> {
        const impactType = await this.impactTypeRepository.findOne({ where: { id } });
        if (!impactType) {
            throw new NotFoundException(`Impact type with ID ${id} not found`);
        }
        this.impactTypeRepository.merge(impactType, data);
        return this.impactTypeRepository.save(impactType);
    }

    async remove(id: number): Promise<void> {
        const impactType = await this.impactTypeRepository.findOne({
            where: { id },
            relations: ['reports']
        });
        
        if (!impactType) {
            throw new NotFoundException(`Impact type with ID ${id} not found`);
        }
        
        if (impactType.reports && impactType.reports.length > 0) {
            throw new ConflictException('Cannot delete impact type that has reports linked to it');
        }
        
        await this.impactTypeRepository.delete(id);
    }
}