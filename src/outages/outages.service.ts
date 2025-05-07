import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, FindOptionsWhere } from 'typeorm';
import { Outage } from './entities/outage.entity';
import { Point } from 'geojson';

export interface OutageFilterOptions {
    startDate?: Date;
    endDate?: Date;
    resolvedStatus?: boolean;
    limit?: number;
    offset?: number;
}

@Injectable()
export class OutagesService {
    constructor(
        @InjectRepository(Outage)
        private outageRepository: Repository<Outage>,
    ) {}
    
    findAll(userId: number, filters?: OutageFilterOptions): Promise<Outage[]> {
        const where: FindOptionsWhere<Outage> = { userId };
        
        if (filters) {
            if (filters.startDate && filters.endDate) {
                where.startDate = Between(filters.startDate, filters.endDate);
            } else if (filters.startDate) {
                where.startDate = Between(filters.startDate, new Date());
            } else if (filters.endDate) {
                where.startDate = Between(new Date('1970-01-01'), filters.endDate);
            }
            
            if (filters.resolvedStatus !== undefined) {
                where.resolvedStatus = filters.resolvedStatus;
            }
        }
        
        return this.outageRepository.find({
            where,
            order: { startDate: 'DESC' },
            take: filters?.limit,
            skip: filters?.offset
        });
    }

    async findOne(id: number): Promise<Outage> {
        const outage = await this.outageRepository.findOne({ 
            where: { id }
        });
        if (!outage) {
            throw new NotFoundException(`Outage with ID ${id} not found`);
        }
        return outage;
    }

    async create(data: Partial<Outage>, latitude?: number, longitude?: number): Promise<Outage> {
        const outage = this.outageRepository.create(data);
        
        if (latitude && longitude) {
            outage.location = {
                type: 'Point',
                coordinates: [longitude, latitude]
            };
        }
        
        return this.outageRepository.save(outage);
    }

    async update(id: number, data: Partial<Outage>, latitude?: number, longitude?: number): Promise<Outage> {
        const outage = await this.findOne(id);
        Object.assign(outage, data);
        
        if (latitude && longitude) {
            outage.location = {
                type: 'Point',
                coordinates: [longitude, latitude]
            };
        }
        
        return this.outageRepository.save(outage);
    }

    async resolve(id: number): Promise<Outage> {
        const outage = await this.findOne(id);
        outage.resolvedStatus = true;
        outage.endDate = new Date();
        return this.outageRepository.save(outage);
    }

    async remove(id: number): Promise<void> {
        await this.findOne(id);
        await this.outageRepository.delete(id);
    }
}