import { prisma } from '../../lib/prisma.server';
import { APP_CONSTANTS } from '../../config/constants';

export interface VisaApplication {
  id: string;
  employeeId: string;
  country: string;
  visaType: string;
  status: 'pending' | 'submitted' | 'approved' | 'rejected' | 'expired';
  applicationDate: Date;
  expiryDate?: Date;
  documents: string[];
  notes?: string;
}

export interface MOLSSyncResult {
  success: boolean;
  syncedCount: number;
  errors: string[];
  lastSyncDate: Date;
}

export interface DocumentVerificationResult {
  isValid: boolean;
  confidence: number;
  issues: string[];
  recommendations: string[];
}

export class VisaService {
  // Create visa application
  static async createVisaApplication(data: {
    employeeId: string;
    country: string;
    visaType: string;
    documents: string[];
    notes?: string;
  }) {
    const { employeeId, country, visaType, documents, notes } = data;

    // Validate employee exists
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
    });

    if (!employee) {
      throw new Error('Employee not found');
    }

    // Check if visa application already exists
    const existingApplication = await prisma.visa.findFirst({
      where: {
        employeeId,
        country,
        status: {
          in: ['pending', 'submitted'],
        },
      },
    });

    if (existingApplication) {
      throw new Error('Visa application already exists for this employee and country');
    }

    return prisma.visa.create({
      data: {
        employeeId,
        country,
        visaType,
        status: 'pending',
        applicationDate: new Date(),
        documents,
        notes,
      },
    });
  }

  // Update visa application status
  static async updateVisaStatus(
    visaId: string,
    status: 'submitted' | 'approved' | 'rejected' | 'expired',
    expiryDate?: Date,
    notes?: string
  ) {
    const updateData: any = { status };
    
    if (expiryDate) updateData.expiryDate = expiryDate;
    if (notes) updateData.notes = notes;

    return prisma.visa.update({
      where: { id: visaId },
      data: updateData,
    });
  }

  // Get visa applications by employee
  static async getVisaApplicationsByEmployee(employeeId: string) {
    return prisma.visa.findMany({
      where: { employeeId },
      orderBy: { applicationDate: 'desc' },
    });
  }

  // Get visa applications by status
  static async getVisaApplicationsByStatus(status: string) {
    return prisma.visa.findMany({
      where: { status },
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: { applicationDate: 'desc' },
    });
  }

  // Get visa statistics
  static async getVisaStats() {
    const [
      total,
      pending,
      submitted,
      approved,
      rejected,
      expired,
      byCountry,
    ] = await Promise.all([
      prisma.visa.count(),
      prisma.visa.count({ where: { status: 'pending' } }),
      prisma.visa.count({ where: { status: 'submitted' } }),
      prisma.visa.count({ where: { status: 'approved' } }),
      prisma.visa.count({ where: { status: 'rejected' } }),
      prisma.visa.count({ where: { status: 'expired' } }),
      prisma.visa.groupBy({
        by: ['country'],
        _count: { country: true },
      }),
    ]);

    const countryStats: Record<string, number> = {};
    byCountry.forEach(item => {
      countryStats[item.country] = item._count.country;
    });

    return {
      total,
      pending,
      submitted,
      approved,
      rejected,
      expired,
      approvalRate: total > 0 ? (approved / total) * 100 : 0,
      byCountry: countryStats,
    };
  }

  // Get expiring visas
  static async getExpiringVisas(days = 30) {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + days);

    return prisma.visa.findMany({
      where: {
        status: 'approved',
        expiryDate: {
          lte: expiryDate,
        },
      },
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: { expiryDate: 'asc' },
    });
  }

  // Submit visa application to embassy
  static async submitVisaApplication(visaId: string) {
    const visa = await prisma.visa.findUnique({
      where: { id: visaId },
      include: {
        employee: true,
        documents: true,
      },
    });

    if (!visa) {
      throw new Error('Visa application not found');
    }

    if (visa.status !== 'pending') {
      throw new Error('Visa application has already been submitted');
    }

    // Validate required documents
    const requiredDocuments = ['passport', 'cv', 'medical', 'educational'];
    const submittedDocuments = visa.documents.map(doc => doc.type);
    const missingDocuments = requiredDocuments.filter(
      doc => !submittedDocuments.includes(doc)
    );

    if (missingDocuments.length > 0) {
      throw new Error(`Missing required documents: ${missingDocuments.join(', ')}`);
    }

    // Update status to submitted
    return prisma.visa.update({
      where: { id: visaId },
      data: {
        status: 'submitted',
        submittedAt: new Date(),
      },
    });
  }

  // Track visa application status
  static async trackVisaStatus(visaId: string) {
    const visa = await prisma.visa.findUnique({
      where: { id: visaId },
      include: {
        employee: true,
      },
    });

    if (!visa) {
      throw new Error('Visa application not found');
    }

    // Mock tracking implementation
    // In a real implementation, this would integrate with embassy APIs
    const trackingInfo = {
      visaId: visa.id,
      status: visa.status,
      applicationDate: visa.applicationDate,
      submittedAt: visa.submittedAt,
      lastUpdate: new Date(),
      estimatedProcessingTime: '15-30 business days',
      nextSteps: this.getNextSteps(visa.status),
    };

    return trackingInfo;
  }

  // Get next steps based on visa status
  private static getNextSteps(status: string): string[] {
    switch (status) {
      case 'pending':
        return [
          'Complete document verification',
          'Submit application to embassy',
          'Pay visa fees',
        ];
      case 'submitted':
        return [
          'Wait for embassy processing',
          'Check application status regularly',
          'Prepare for potential interview',
        ];
      case 'approved':
        return [
          'Collect visa from embassy',
          'Plan travel arrangements',
          'Prepare for departure',
        ];
      case 'rejected':
        return [
          'Review rejection reasons',
          'Address any issues',
          'Consider reapplication',
        ];
      default:
        return [];
    }
  }

  // Cancel visa application
  static async cancelVisaApplication(visaId: string, reason: string) {
    return prisma.visa.update({
      where: { id: visaId },
      data: {
        status: 'cancelled',
        notes: reason,
        cancelledAt: new Date(),
      },
    });
  }

  // Get visa application history
  static async getVisaApplicationHistory(employeeId: string) {
    return prisma.visa.findMany({
      where: { employeeId },
      orderBy: { applicationDate: 'desc' },
    });
  }

  // Export visa data
  static async exportVisaData(filters: {
    status?: string;
    country?: string;
    dateFrom?: Date;
    dateTo?: Date;
  } = {}) {
    const where: any = {};

    if (filters.status) where.status = filters.status;
    if (filters.country) where.country = filters.country;
    if (filters.dateFrom || filters.dateTo) {
      where.applicationDate = {};
      if (filters.dateFrom) where.applicationDate.gte = filters.dateFrom;
      if (filters.dateTo) where.applicationDate.lte = filters.dateTo;
    }

    const visas = await prisma.visa.findMany({
      where,
      include: {
        employee: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: { applicationDate: 'desc' },
    });

    return visas.map(visa => ({
      id: visa.id,
      employeeName: `${visa.employee.firstName} ${visa.employee.lastName}`,
      employeeEmail: visa.employee.email,
      employeePhone: visa.employee.phone,
      country: visa.country,
      visaType: visa.visaType,
      status: visa.status,
      applicationDate: visa.applicationDate,
      expiryDate: visa.expiryDate,
      submittedAt: visa.submittedAt,
    }));
  }
}

// Export singleton instance
export const visaService = VisaService;
