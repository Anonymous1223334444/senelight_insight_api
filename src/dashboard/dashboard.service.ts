import { Injectable } from '@nestjs/common';
import { OutagesService } from '../outages/outages.service';
import { ReportsService } from '../reports/reports.service';

@Injectable()
export class DashboardService {
  constructor(
    private readonly outagesService: OutagesService,
    private readonly reportsService: ReportsService
  ) {}

  async getRecentStats(userId: number) {
    const outages = await this.outagesService.findAll(userId, { limit: 5 });
    const reports = await this.reportsService.findAll(userId, { limit: 5 });
    
    const activeOutages = outages.filter(o => !o.resolvedStatus).length;
    const pendingReports = reports.filter(r => r.networkStatus === 'PENDING').length;

    return {
      totalOutages: outages.length,
      activeOutages,
      totalReports: reports.length,
      pendingReports
    };
  }

  async getMapData(userId: number) {
    const outages = await this.outagesService.findAll(userId);
    const reports = await this.reportsService.findAll(userId);
    
    // Filtrer les données avec des coordonnées valides
    const outagePoints = outages
      .filter(o => o.latitude && o.longitude)
      .map(o => ({
        id: o.id,
        type: 'outage',
        latitude: o.latitude,
        longitude: o.longitude,
        resolved: o.resolvedStatus,
        reportCount: o.reportCount
      }));
      
    const reportPoints = reports
      .filter(r => r.latitude && r.longitude)
      .map(r => ({
        id: r.id,
        type: 'report',
        latitude: r.latitude,
        longitude: r.longitude,
        status: r.networkStatus,
        impactType: r.impactType?.name || 'Non spécifié'
      }));

    return {
      outages: outagePoints,
      reports: reportPoints
    };
  }
}