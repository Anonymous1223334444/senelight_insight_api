import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, FindOptionsWhere } from 'typeorm';
import { Report } from './entities/report.entity';
import { NetworkStatus } from '../enums/network-status.enum';

export interface ReportFilterOptions {
    startDate?: Date;
    endDate?: Date;
    impactTypeId?: number;
    networkStatus?: NetworkStatus;
    limit?: number;
    offset?: number;
}

@Injectable()
export class ReportsService {
    constructor(
        @InjectRepository(Report)
        private reportRepository: Repository<Report>,
    ) {}
    
    findAll(userId: number, filters?: ReportFilterOptions): Promise<Report[]> {
        const where: FindOptionsWhere<Report> = { userId };
        
        if (filters) {
            if (filters.startDate && filters.endDate) {
                where.reportDate = Between(filters.startDate, filters.endDate);
            } else if (filters.startDate) {
                where.reportDate = Between(filters.startDate, new Date());
            } else if (filters.endDate) {
                where.reportDate = Between(new Date('1970-01-01'), filters.endDate);
            }
            
            if (filters.impactTypeId) {
                where.impactTypeId = filters.impactTypeId;
            }
            
            if (filters.networkStatus) {
                where.networkStatus = filters.networkStatus;
            }
        }
        
        return this.reportRepository.find({
            where,
            order: { reportDate: 'DESC' },
            take: filters?.limit,
            skip: filters?.offset,
            relations: ['impactType'] 
        });
    }

    async findOne(id: number): Promise<Report> {
        const report = await this.reportRepository.findOne({ 
            where: { id },
            relations: ['impactType'] 
        });
        if (!report) {
            throw new NotFoundException(`Report with ID ${id} not found`);
        }
        return report;
    }

    async create(data: Partial<Report>): Promise<Report>{
        const report = this.reportRepository.create(data);
        return this.reportRepository.save(report);
    }

    async update(id: number, data: Partial<Report>): Promise<Report> {
        const report = await this.findOne(id);
        Object.assign(report, data);
        return this.reportRepository.save(report);
    }

    async remove(id: number): Promise<void> {
        await this.findOne(id);
        await this.reportRepository.delete(id);
    }
}