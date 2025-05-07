import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from '../reports/entities/report.entity';
import { ImpactType } from '../impact-types/entities/impact-type.entity';
import { 
    ImpactTypeCount, 
    LocationHeatmap, 
    DailyReportCount,
    SilentZone,
    SentimentAnalysis 
} from './dto/analytics.types';

@Injectable()
export class AnalyticsService {
    constructor(
        @InjectRepository(Report)
        private reportRepository: Repository<Report>,
        @InjectRepository(ImpactType)
        private impactTypeRepository: Repository<ImpactType>,
    ) {}

    async getReportsByImpactType(): Promise<ImpactTypeCount[]> {
        return this.reportRepository
            .createQueryBuilder('report')
            .innerJoinAndSelect('report.impactType', 'impactType')
            .select([
                'CAST(impactType.id AS INTEGER) as "impactTypeId"',
                'impactType.name as "impactTypeName"',
                'COUNT(report.id) as "count"'
            ])
            .groupBy('impactType.id')
            .addGroupBy('impactType.name')
            .getRawMany();
    }

    async getLocationHeatmap(): Promise<LocationHeatmap[]> {
        // Regrouper les rapports par régions géographiques
        // Ici une implémentation simplifiée qui arrondit les coordonnées
        return this.reportRepository
            .createQueryBuilder('report')
            .select([
                'ROUND(report.latitude, 2) as "latitude"',
                'ROUND(report.longitude, 2) as "longitude"',
                'COUNT(report.id) as "count"'
            ])
            .where('report.latitude IS NOT NULL')
            .andWhere('report.longitude IS NOT NULL')
            .groupBy('ROUND(report.latitude, 2)')
            .addGroupBy('ROUND(report.longitude, 2)')
            .getRawMany();
    }

    async getDailyReportCounts(days: number = 30): Promise<DailyReportCount[]> {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        
        return this.reportRepository
            .createQueryBuilder('report')
            .select([
                'TO_CHAR(report.reportDate, \'YYYY-MM-DD\') as "date"',
                'COUNT(report.id) as "count"'
            ])
            .where('report.reportDate >= :startDate', { startDate })
            .groupBy('TO_CHAR(report.reportDate, \'YYYY-MM-DD\')')
            .orderBy('"date"', 'ASC')
            .getRawMany();
    }

    async getSilentZones(): Promise<SilentZone[]> {
        // Cette implémentation est complexe et nécessiterait un algorithme
        // de détection des zones sans signalements
        // Renvoie des données simulées pour le moment
        
        return [
            { latitude: 14.7167, longitude: -17.4677, radius: 5 }, // Dakar
            { latitude: 14.7828, longitude: -16.9456, radius: 3 }, // Thiès
            { latitude: 14.1652, longitude: -16.0769, radius: 4 }  // Kaolack
        ];
    }

    async getSentimentAnalysis(): Promise<SentimentAnalysis[]> {
        // Simule une analyse de sentiment (qui serait idéalement effectuée par un service d'IA)
        return this.reportRepository
            .createQueryBuilder('report')
            .innerJoinAndSelect('report.impactType', 'impactType')
            .select([
                'impactType.name as "impactTypeName"',
                'AVG(0.5) as "averageSentiment"', // Simulé
                'COUNT(report.id) as "count"'
            ])
            .where('report.sentimentText IS NOT NULL')
            .groupBy('impactType.name')
            .getRawMany();
    }
}