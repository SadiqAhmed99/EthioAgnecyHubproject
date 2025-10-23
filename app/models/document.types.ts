// Document Types
export interface Document {
  id: string
  type: DocumentType
  name: string
  filePath: string
  fileSize: number
  mimeType: string
  status: DocumentStatus
  uploadedAt: Date
  verifiedAt?: Date
  createdAt: Date
  updatedAt: Date
  employeeId?: string
  agencyId: string
  employee?: Employee
  agency?: Agency
}

export type DocumentType = 
  | 'NATIONAL_ID'
  | 'PASSPORT'
  | 'BIRTH_CERTIFICATE'
  | 'MEDICAL_CERTIFICATE'
  | 'EDUCATIONAL_CERTIFICATE'
  | 'SKILL_CERTIFICATE'
  | 'POLICE_CLEARANCE'
  | 'EMPLOYMENT_CONTRACT'
  | 'VISA'
  | 'OTHER'

export type DocumentStatus = 
  | 'PENDING'
  | 'VERIFIED'
  | 'REJECTED'
  | 'EXPIRED'

// Visa Management Types
export interface VisaApplication {
  id: string
  visaNumber?: string
  type: VisaType
  destination: string
  embassy: string
  applicationDate: Date
  submissionDate?: Date
  approvalDate?: Date
  expiryDate?: Date
  status: VisaStatus
  notes?: string
  createdAt: Date
  updatedAt: Date
  employeeId: string
  employee?: Employee
}

export type VisaType = 
  | 'WORK'
  | 'VISITOR'
  | 'STUDENT'
  | 'BUSINESS'
  | 'TOURIST'
  | 'HAJJ'
  | 'UMRAH'

export type VisaStatus = 
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'EXPIRED'
  | 'CANCELLED'

// MOLS Integration Types
export interface MOLSSubmission {
  id: string
  submissionId?: string
  employeeId: string
  contractId?: string
  status: MOLSStatus
  submittedAt?: Date
  approvedAt?: Date
  rejectedAt?: Date
  rejectionReason?: string
  createdAt: Date
  updatedAt: Date
  employee?: Employee
}

export type MOLSStatus = 
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'REQUIRES_REVISION'

// Missing Employee Report Types
export interface MissingEmployeeReport {
  id: string
  reportNumber: string
  employeeId: string
  reportDate: Date
  lastSeenDate?: Date
  lastSeenLocation?: string
  contactAttempts: ContactAttempt[]
  status: ReportStatus
  priority: ReportPriority
  assignedTo?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
  employee?: Employee
}

export interface ContactAttempt {
  id: string
  date: Date
  method: ContactMethod
  result: ContactResult
  notes?: string
}

export type ContactMethod = 
  | 'PHONE'
  | 'EMAIL'
  | 'SMS'
  | 'SOCIAL_MEDIA'
  | 'FAMILY_CONTACT'
  | 'EMPLOYER_CONTACT'

export type ContactResult = 
  | 'SUCCESSFUL'
  | 'NO_ANSWER'
  | 'WRONG_NUMBER'
  | 'DISCONNECTED'
  | 'MESSAGE_SENT'
  | 'NO_RESPONSE'

export type ReportStatus = 
  | 'OPEN'
  | 'INVESTIGATING'
  | 'CONTACTED'
  | 'RESOLVED'
  | 'CLOSED'

export type ReportPriority = 
  | 'LOW'
  | 'MEDIUM'
  | 'HIGH'
  | 'URGENT'

// Cross-Match Verification Types
export interface CrossMatchVerification {
  id: string
  employeeId: string
  verificationDate: Date
  status: VerificationStatus
  discrepancies: DocumentDiscrepancy[]
  verifiedBy: string
  notes?: string
  createdAt: Date
  updatedAt: Date
  employee?: Employee
}

export interface DocumentDiscrepancy {
  id: string
  documentType: DocumentType
  field: string
  expectedValue: string
  actualValue: string
  severity: DiscrepancySeverity
  description: string
  resolved: boolean
  resolvedAt?: Date
  resolvedBy?: string
}

export type VerificationStatus = 
  | 'PENDING'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'FAILED'
  | 'REQUIRES_REVIEW'

export type DiscrepancySeverity = 
  | 'LOW'
  | 'MEDIUM'
  | 'HIGH'
  | 'CRITICAL'

// Document Upload Types
export interface DocumentUpload {
  file: File
  type: DocumentType
  name: string
  description?: string
  employeeId?: string
}

export interface DocumentUploadResult {
  success: boolean
  document?: Document
  error?: string
}

// Document Search and Filter Types
export interface DocumentSearchParams {
  query?: string
  type?: DocumentType
  status?: DocumentStatus
  employeeId?: string
  dateFrom?: string
  dateTo?: string
  page?: number
  limit?: number
}

export interface DocumentFilters {
  type?: DocumentType[]
  status?: DocumentStatus[]
  employeeId?: string[]
  uploadedDateFrom?: Date
  uploadedDateTo?: Date
  verifiedDateFrom?: Date
  verifiedDateTo?: Date
}

// Document Statistics Types
export interface DocumentStats {
  total: number
  pending: number
  verified: number
  rejected: number
  expired: number
  verificationRate: number
  averageVerificationTime: number
}

export interface DocumentTypeStats {
  type: DocumentType
  count: number
  pending: number
  verified: number
  rejected: number
  expired: number
}

// Import other types
import type { Employee } from './employee.types'
import type { Agency } from './agency.types'
