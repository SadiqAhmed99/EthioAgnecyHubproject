import { prisma } from '../../lib/prisma.server';
import { molsConfig } from '../../config/env.server';

export interface MOLSDocument {
  id: string;
  employeeId: string;
  documentType: string;
  documentNumber: string;
  status: 'active' | 'expired' | 'suspended';
  issueDate: Date;
  expiryDate: Date;
  issuingAuthority: string;
}

export interface MOLSSyncResult {
  success: boolean;
  syncedCount: number;
  errors: string[];
  lastSyncDate: Date;
  newDocuments: MOLSDocument[];
  updatedDocuments: MOLSDocument[];
}

export interface MOLSVerificationResult {
  isValid: boolean;
  documentStatus: string;
  expiryDate?: Date;
  issues: string[];
  recommendations: string[];
}

export class MOLSService {
  // Test MOLS connection
  static async testConnection(): Promise<boolean> {
    try {
      if (!molsConfig.apiUrl || !molsConfig.apiKey) {
        throw new Error('MOLS configuration not found');
      }

      // Mock connection test
      // In a real implementation, this would make an actual API call
      const response = await this.makeMOLSRequest('/health');
      
      return response.status === 'ok';
    } catch (error) {
      console.error('MOLS connection test failed:', error);
      return false;
    }
  }

  // Sync documents with MOLS
  static async syncDocuments(): Promise<MOLSSyncResult> {
    try {
      const connectionTest = await this.testConnection();
      if (!connectionTest) {
        throw new Error('MOLS connection failed');
      }

      // Get all employees with pending documents
      const employees = await prisma.employee.findMany({
        where: {
          status: 'active',
        },
        include: {
          documents: {
            where: {
              status: 'verified',
            },
          },
        },
      });

      let syncedCount = 0;
      const errors: string[] = [];
      const newDocuments: MOLSDocument[] = [];
      const updatedDocuments: MOLSDocument[] = [];

      for (const employee of employees) {
        try {
          // Sync employee documents with MOLS
          const syncResult = await this.syncEmployeeDocuments(employee);
          syncedCount += syncResult.syncedCount;
          newDocuments.push(...syncResult.newDocuments);
          updatedDocuments.push(...syncResult.updatedDocuments);
        } catch (error) {
          errors.push(`Failed to sync employee ${employee.id}: ${error}`);
        }
      }

      // Update last sync date
      await this.updateLastSyncDate();

      return {
        success: errors.length === 0,
        syncedCount,
        errors,
        lastSyncDate: new Date(),
        newDocuments,
        updatedDocuments,
      };
    } catch (error) {
      return {
        success: false,
        syncedCount: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        lastSyncDate: new Date(),
        newDocuments: [],
        updatedDocuments: [],
      };
    }
  }

  // Sync documents for a specific employee
  private static async syncEmployeeDocuments(employee: any): Promise<{
    syncedCount: number;
    newDocuments: MOLSDocument[];
    updatedDocuments: MOLSDocument[];
  }> {
    const newDocuments: MOLSDocument[] = [];
    const updatedDocuments: MOLSDocument[] = [];
    let syncedCount = 0;

    // Get employee documents from MOLS
    const molsDocuments = await this.getEmployeeDocumentsFromMOLS(employee.id);

    for (const molsDoc of molsDocuments) {
      try {
        // Check if document exists in our system
        const existingDoc = await prisma.document.findFirst({
          where: {
            employeeId: employee.id,
            type: molsDoc.documentType,
            documentNumber: molsDoc.documentNumber,
          },
        });

        if (existingDoc) {
          // Update existing document
          await prisma.document.update({
            where: { id: existingDoc.id },
            data: {
              status: molsDoc.status === 'active' ? 'verified' : 'expired',
              expiryDate: molsDoc.expiryDate,
              molsSyncedAt: new Date(),
            },
          });
          updatedDocuments.push(molsDoc);
        } else {
          // Create new document
          await prisma.document.create({
            data: {
              employeeId: employee.id,
              type: molsDoc.documentType,
              documentNumber: molsDoc.documentNumber,
              status: molsDoc.status === 'active' ? 'verified' : 'expired',
              issueDate: molsDoc.issueDate,
              expiryDate: molsDoc.expiryDate,
              issuingAuthority: molsDoc.issuingAuthority,
              molsSyncedAt: new Date(),
            },
          });
          newDocuments.push(molsDoc);
        }

        syncedCount++;
      } catch (error) {
        console.error(`Failed to sync document ${molsDoc.id}:`, error);
      }
    }

    return { syncedCount, newDocuments, updatedDocuments };
  }

  // Get employee documents from MOLS (mock implementation)
  private static async getEmployeeDocumentsFromMOLS(employeeId: string): Promise<MOLSDocument[]> {
    // Mock implementation - in reality this would call MOLS API
    const mockDocuments: MOLSDocument[] = [
      {
        id: `mols_${employeeId}_passport`,
        employeeId,
        documentType: 'passport',
        documentNumber: `ET${Math.random().toString().substr(2, 7)}`,
        status: 'active',
        issueDate: new Date('2020-01-01'),
        expiryDate: new Date('2030-01-01'),
        issuingAuthority: 'Ethiopian Immigration Office',
      },
      {
        id: `mols_${employeeId}_work_permit`,
        employeeId,
        documentType: 'work_permit',
        documentNumber: `WP${Math.random().toString().substr(2, 6)}`,
        status: 'active',
        issueDate: new Date('2023-01-01'),
        expiryDate: new Date('2025-01-01'),
        issuingAuthority: 'Ministry of Labor and Social Affairs',
      },
    ];

    return mockDocuments;
  }

  // Verify document with MOLS
  static async verifyDocumentWithMOLS(
    documentType: string,
    documentNumber: string
  ): Promise<MOLSVerificationResult> {
    try {
      // Mock verification - in reality this would call MOLS API
      const verificationResult = await this.makeMOLSRequest('/verify', {
        documentType,
        documentNumber,
      });

      return {
        isValid: verificationResult.isValid,
        documentStatus: verificationResult.status,
        expiryDate: verificationResult.expiryDate ? new Date(verificationResult.expiryDate) : undefined,
        issues: verificationResult.issues || [],
        recommendations: verificationResult.recommendations || [],
      };
    } catch (error) {
      return {
        isValid: false,
        documentStatus: 'error',
        issues: ['MOLS verification failed'],
        recommendations: ['Please contact MOLS support'],
      };
    }
  }

  // Get MOLS statistics
  static async getMOLSStats() {
    const [
      totalSynced,
      lastSyncDate,
      syncErrors,
      verifiedDocuments,
    ] = await Promise.all([
      prisma.document.count({
        where: {
          molsSyncedAt: {
            not: null,
          },
        },
      }),
      prisma.document.findFirst({
        where: {
          molsSyncedAt: {
            not: null,
          },
        },
        orderBy: {
          molsSyncedAt: 'desc',
        },
        select: {
          molsSyncedAt: true,
        },
      }),
      prisma.document.count({
        where: {
          molsSyncError: {
            not: null,
          },
        },
      }),
      prisma.document.count({
        where: {
          status: 'verified',
          molsSyncedAt: {
            not: null,
          },
        },
      }),
    ]);

    return {
      totalSynced,
      lastSyncDate: lastSyncDate?.molsSyncedAt,
      syncErrors,
      verifiedDocuments,
      syncSuccessRate: totalSynced > 0 ? ((totalSynced - syncErrors) / totalSynced) * 100 : 0,
    };
  }

  // Get documents pending MOLS sync
  static async getDocumentsPendingSync() {
    return prisma.document.findMany({
      where: {
        status: 'verified',
        molsSyncedAt: null,
      },
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
      orderBy: {
        verifiedAt: 'asc',
      },
    });
  }

  // Update last sync date
  private static async updateLastSyncDate() {
    // Store last sync date in a system settings table or cache
    // For now, we'll use a simple approach
    const lastSync = new Date();
    // In a real implementation, this would be stored in a system settings table
    console.log('Last MOLS sync:', lastSync);
  }

  // Make MOLS API request (mock implementation)
  private static async makeMOLSRequest(endpoint: string, data?: any): Promise<any> {
    // Mock implementation - in reality this would make actual HTTP requests
    const mockResponses: Record<string, any> = {
      '/health': { status: 'ok', timestamp: new Date() },
      '/verify': {
        isValid: true,
        status: 'active',
        expiryDate: '2030-01-01',
        issues: [],
        recommendations: [],
      },
    };

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return mockResponses[endpoint] || { error: 'Endpoint not found' };
  }

  // Get MOLS integration status
  static async getIntegrationStatus() {
    const connectionTest = await this.testConnection();
    const stats = await this.getMOLSStats();
    const pendingSync = await this.getDocumentsPendingSync();

    return {
      connected: connectionTest,
      lastSyncDate: stats.lastSyncDate,
      totalSynced: stats.totalSynced,
      syncErrors: stats.syncErrors,
      syncSuccessRate: stats.syncSuccessRate,
      pendingSyncCount: pendingSync.length,
      configuration: {
        apiUrl: molsConfig.apiUrl ? 'Configured' : 'Not configured',
        apiKey: molsConfig.apiKey ? 'Configured' : 'Not configured',
      },
    };
  }

  // Resolve MOLS sync conflicts
  static async resolveSyncConflicts(conflicts: Array<{
    documentId: string;
    molsData: MOLSDocument;
    localData: any;
  }>) {
    const resolvedConflicts = [];

    for (const conflict of conflicts) {
      try {
        // Apply MOLS data to local document
        await prisma.document.update({
          where: { id: conflict.documentId },
          data: {
            status: conflict.molsData.status === 'active' ? 'verified' : 'expired',
            expiryDate: conflict.molsData.expiryDate,
            molsSyncedAt: new Date(),
            molsSyncError: null,
          },
        });

        resolvedConflicts.push({
          documentId: conflict.documentId,
          resolved: true,
          appliedData: conflict.molsData,
        });
      } catch (error) {
        resolvedConflicts.push({
          documentId: conflict.documentId,
          resolved: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return resolvedConflicts;
  }

  // Export MOLS sync report
  static async exportMOLSSyncReport() {
    const stats = await this.getMOLSStats();
    const pendingSync = await this.getDocumentsPendingSync();
    const lastSync = await prisma.document.findFirst({
      where: {
        molsSyncedAt: {
          not: null,
        },
      },
      orderBy: {
        molsSyncedAt: 'desc',
      },
      select: {
        molsSyncedAt: true,
      },
    });

    return {
      reportDate: new Date(),
      summary: {
        totalSynced: stats.totalSynced,
        syncErrors: stats.syncErrors,
        syncSuccessRate: stats.syncSuccessRate,
        lastSyncDate: lastSync?.molsSyncedAt,
        pendingSyncCount: pendingSync.length,
      },
      pendingSync: pendingSync.map(doc => ({
        documentId: doc.id,
        employeeName: `${doc.employee.firstName} ${doc.employee.lastName}`,
        employeeEmail: doc.employee.email,
        documentType: doc.type,
        documentNumber: doc.documentNumber,
        verifiedAt: doc.verifiedAt,
      })),
    };
  }
}

// Export singleton instance
export const molsService = MOLSService;
