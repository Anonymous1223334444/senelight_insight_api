import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Report } from '../reports/entities/report.entity';
import { ImpactType } from '../impact-types/entities/impact-type.entity';
import { Outage } from '../outages/entities/outage.entity';
import { NetworkStatus } from '../enums/network-status.enum';

@Injectable()
export class StatisticsService {
    constructor(
        @InjectRepository(Report)
        private reportRepository: Repository<Report>,
        @InjectRepository(ImpactType)
        private impactTypeRepository: Repository<ImpactType>,
        @InjectRepository(Outage)
        private outageRepository: Repository<Outage>
    ) {}

    // Statistiques de rapport par type d'impact
    async getReportsByImpactType(userId: number) {
        return this.reportRepository
            .createQueryBuilder('report')
            .innerJoinAndSelect('report.impactType', 'impactType')
            .where('report.userId = :userId', { userId })
            .select([
                'CAST(impactType.id AS INTEGER) as "impactTypeId"',
                'impactType.name as "impactTypeName"',
                'COUNT(report.id) as "count"'
            ])
            .groupBy('impactType.id')
            .addGroupBy('impactType.name')
            .getRawMany();
    }

    // Statistiques mensuelles de signalements
    async getMonthlyReportCounts(userId: number, days: number = 30): Promise<any[]> {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        
        return this.reportRepository
            .createQueryBuilder('report')
            .where('report.userId = :userId', { userId })
            .andWhere('report.reportDate >= :startDate', { startDate })
            .select('TO_CHAR(report.reportDate, \'YYYY-MM-DD\') as "date"')
            .addSelect('COUNT(report.id)', 'count')
            .groupBy('TO_CHAR(report.reportDate, \'YYYY-MM-DD\')')
            .orderBy('"date"', 'ASC')
            .getRawMany();
    }

    // Statistiques des coupures 
    async getOutageStatistics(userId: number): Promise<any> {
        const total = await this.outageRepository
            .createQueryBuilder('outage')
            .where('outage.userId = :userId', { userId })
            .getCount();
        
        const resolved = await this.outageRepository
            .createQueryBuilder('outage')
            .where('outage.userId = :userId', { userId })
            .andWhere('outage.resolvedStatus = true')
            .getCount();
        
        const unresolved = total - resolved;
        const percentResolved = total > 0 ? Math.round((resolved / total) * 100) : 0;
        
        return {
            total,
            resolved,
            unresolved,
            percentResolved
        };
    }

    // Statistiques de signalements par statut réseau
    async getReportsByNetworkStatus(userId: number) {
        const result = await this.reportRepository
            .createQueryBuilder('report')
            .where('report.userId = :userId', { userId })
            .select('report.networkStatus', 'status')
            .addSelect('COUNT(report.id)', 'count')
            .groupBy('report.networkStatus')
            .getRawMany();

        return result.map(item => ({
            status: item.status,
            count: parseInt(item.count)
        }));
    }

    // Analyse des sentiments pour les signalements
    async getSentimentAnalysis(userId: number) {
        // Cette méthode simulerait une analyse des sentiments
        // Dans une implémentation réelle, elle utiliserait une API d'analyse de sentiment
        const positiveCount = await this.reportRepository
            .createQueryBuilder('report')
            .where('report.userId = :userId', { userId })
            .andWhere('report.sentimentText IS NOT NULL')
            .getCount();

        const neutralCount = Math.floor(positiveCount * 0.5);
        const negativeCount = Math.floor(positiveCount * 0.3);

        return {
            positive: positiveCount - neutralCount - negativeCount,
            neutral: neutralCount,
            negative: negativeCount
        };
    }

    // Régions avec le plus de signalements
    async getTopReportingRegions(userId: number, limit: number = 5) {
        // Cette méthode extrairait les régions avec le plus de signalements
        // Simulé pour l'exemple
        return [
            { region: "Dakar", count: 45 },
            { region: "Thiès", count: 32 },
            { region: "Saint-Louis", count: 28 },
            { region: "Ziguinchor", count: 15 },
            { region: "Diourbel", count: 12 }
        ];
    }

    // Pour compatibilité avec le resolver existant
    // Ces méthodes seront adaptées pour le nouveau contexte

    async getMonthlyExpenses(userId: number) {
        // Adapté pour représenter le nombre de problèmes signalés ce mois
        const result = await this.reportRepository
            .createQueryBuilder('report')
            .where('report.userId = :userId', { userId })
            .andWhere('EXTRACT(MONTH FROM report.reportDate) = EXTRACT(MONTH FROM CURRENT_DATE)')
            .andWhere('EXTRACT(YEAR FROM report.reportDate) = EXTRACT(YEAR FROM CURRENT_DATE)')
            .select('COUNT(report.id)', 'count')
            .getRawOne();

        return result?.count ? parseInt(result.count) : 0;
    }

    async getMonthlyIncomes(userId: number) {
        // Adapté pour représenter le nombre de problèmes résolus ce mois
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const result = await this.outageRepository
            .createQueryBuilder('outage')
            .where('outage.userId = :userId', { userId })
            .andWhere('outage.resolvedStatus = true')
            .andWhere('outage.endDate >= :startOfMonth', { startOfMonth })
            .select('COUNT(outage.id)', 'count')
            .getRawOne();

        return result?.count ? parseInt(result.count) : 0;
    }

    async getBalance(userId: number) {
        // Adapté pour représenter le ratio de résolution
        const totalReports = await this.reportRepository
            .createQueryBuilder('report')
            .where('report.userId = :userId', { userId })
            .getCount();

        const resolvedOutages = await this.outageRepository
            .createQueryBuilder('outage')
            .where('outage.userId = :userId', { userId })
            .andWhere('outage.resolvedStatus = true')
            .getCount();

        return totalReports > 0 ? Math.round((resolvedOutages / totalReports) * 100) : 0;
    }

    async getExpensesByCategory(userId: number) {
        // Adapté pour les types d'impact
        return this.getReportsByImpactType(userId);
    }

    async getMonthlyHistory(userId: number) {
        // Adapté pour l'historique mensuel des signalements
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        
        return this.reportRepository
            .createQueryBuilder('report')
            .where('report.userId = :userId', { userId })
            .andWhere('report.reportDate >= :sixMonthsAgo', { sixMonthsAgo })
            .select([
                'TO_CHAR(report.reportDate, \'YYYY-MM\') as month',
                'COUNT(CASE WHEN report.networkStatus = \'SENT\' THEN 1 ELSE NULL END) as sent',
                'COUNT(CASE WHEN report.networkStatus = \'PENDING\' THEN 1 ELSE NULL END) as pending',
                'COUNT(report.id) as total'
            ])
            .groupBy('TO_CHAR(report.reportDate, \'YYYY-MM\')')
            .orderBy('month', 'DESC')
            .getRawMany();
    }

    async getCurrentMonthHistory(userId: number) {
        const result = await this.reportRepository
            .createQueryBuilder('report')
            .where('report.userId = :userId', { userId })
            .andWhere('EXTRACT(MONTH FROM report.reportDate) = EXTRACT(MONTH FROM CURRENT_DATE)')
            .andWhere('EXTRACT(YEAR FROM report.reportDate) = EXTRACT(YEAR FROM CURRENT_DATE)')
            .select([
                'TO_CHAR(CURRENT_DATE, \'YYYY-MM\') as month',
                'COUNT(CASE WHEN report.networkStatus = \'SENT\' THEN 1 ELSE NULL END) as sent',
                'COUNT(CASE WHEN report.networkStatus = \'PENDING\' THEN 1 ELSE NULL END) as pending',
                'COUNT(report.id) as total'
            ])
            .getRawOne();

        if (!result) {
            const currentDate = new Date();
            const month = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
            return {
                month,
                sent: 0,
                pending: 0,
                total: 0
            };
        }
        
        return result;
    }

    // Zones silencieuses (sans signalements)
    async getSilentZones() {
        // Cette méthode nécessiterait une analyse spatiale avancée
        // Simulé pour l'exemple
        return [
            { name: "Tambacounda Est", latitude: 13.7801, longitude: -13.6961, radius: 15 },
            { name: "Kédougou Nord", latitude: 12.5598, longitude: -12.1736, radius: 20 },
            { name: "Matam Rural", latitude: 15.6559, longitude: -13.2548, radius: 25 }
        ];
    }
}