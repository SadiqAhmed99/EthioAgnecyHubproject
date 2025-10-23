// Employee Types
export interface Employee {
  id: string
  employeeId: string
  firstName: string
  lastName: string
  middleName?: string
  dateOfBirth: Date
  gender: 'MALE' | 'FEMALE' | 'OTHER'
  nationality: string
  phone: string
  email?: string
  address: string
  emergencyContact: string
  emergencyPhone: string
  status: EmployeeStatus
  registrationDate: Date
  createdAt: Date
  updatedAt: Date
  agencyId: string
  agency?: Agency
  passport?: Passport
  skills?: Skill[]
  languages?: Language[]
  documents?: Document[]
  applications?: Application[]
  travels?: Travel[]
  hajjUmrah?: HajjUmrah
}

export type EmployeeStatus = 
  | 'REGISTERED'
  | 'DOCUMENT_PENDING'
  | 'SKILL_ASSESSED'
  | 'READY_FOR_DEPLOYMENT'
  | 'DEPLOYED'
  | 'RETURNED'
  | 'SUSPENDED'

export interface Passport {
  id: string
  passportNumber: string
  issueDate: Date
  expiryDate: Date
  issuingCountry: string
  issuingAuthority: string
  createdAt: Date
  updatedAt: Date
  employeeId: string
  employee?: Employee
}

export interface Skill {
  id: string
  name: string
  category: SkillCategory
  level: SkillLevel
  experience: number
  certification?: string
  createdAt: Date
  updatedAt: Date
  employeeId: string
  employee?: Employee
}

export type SkillCategory = 
  | 'DOMESTIC_WORK'
  | 'CONSTRUCTION'
  | 'HEALTHCARE'
  | 'EDUCATION'
  | 'TECHNICAL'
  | 'PROFESSIONAL'
  | 'OTHER'

export type SkillLevel = 
  | 'BEGINNER'
  | 'INTERMEDIATE'
  | 'ADVANCED'
  | 'EXPERT'

export interface Language {
  id: string
  name: string
  proficiency: LanguageLevel
  certification?: string
  createdAt: Date
  updatedAt: Date
  employeeId: string
  employee?: Employee
}

export type LanguageLevel = 
  | 'BASIC'
  | 'INTERMEDIATE'
  | 'ADVANCED'
  | 'NATIVE'

export interface Application {
  id: string
  jobTitle: string
  destination: string
  employer: string
  salary?: number
  contractStart?: Date
  contractEnd?: Date
  status: ApplicationStatus
  submittedAt: Date
  approvedAt?: Date
  createdAt: Date
  updatedAt: Date
  employeeId: string
  employee?: Employee
}

export type ApplicationStatus = 
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'DEPLOYED'
  | 'COMPLETED'

export interface Travel {
  id: string
  flightNumber?: string
  departureDate?: Date
  arrivalDate?: Date
  departureAirport?: string
  arrivalAirport?: string
  status: TravelStatus
  createdAt: Date
  updatedAt: Date
  employeeId: string
  employee?: Employee
}

export type TravelStatus = 
  | 'SCHEDULED'
  | 'CONFIRMED'
  | 'IN_TRANSIT'
  | 'ARRIVED'
  | 'CANCELLED'

export interface HajjUmrah {
  id: string
  type: PilgrimageType
  year: number
  groupNumber?: string
  status: PilgrimageStatus
  registrationDate: Date
  departureDate?: Date
  returnDate?: Date
  createdAt: Date
  updatedAt: Date
  employeeId: string
  employee?: Employee
}

export type PilgrimageType = 'HAJJ' | 'UMRAH'

export type PilgrimageStatus = 
  | 'REGISTERED'
  | 'DOCUMENT_PENDING'
  | 'APPROVED'
  | 'DEPARTED'
  | 'RETURNED'
  | 'CANCELLED'

// Search and Filter Types
export interface EmployeeSearchParams {
  query?: string
  status?: EmployeeStatus
  gender?: 'MALE' | 'FEMALE' | 'OTHER'
  skillCategory?: SkillCategory
  destination?: string
  dateFrom?: string
  dateTo?: string
  page?: number
  limit?: number
}

export interface EmployeeFilters {
  status?: EmployeeStatus[]
  gender?: ('MALE' | 'FEMALE' | 'OTHER')[]
  skillCategory?: SkillCategory[]
  destination?: string[]
  registrationDateFrom?: Date
  registrationDateTo?: Date
}

// Dashboard and Analytics Types
export interface EmployeeStats {
  total: number
  registered: number
  documentPending: number
  skillAssessed: number
  readyForDeployment: number
  deployed: number
  returned: number
  suspended: number
}

export interface DeploymentStats {
  totalDeployments: number
  successfulDeployments: number
  failedDeployments: number
  successRate: number
  averageDeploymentTime: number
}

export interface SkillDistribution {
  category: SkillCategory
  count: number
  percentage: number
}

export interface DestinationStats {
  destination: string
  count: number
  percentage: number
  averageSalary?: number
}

export interface MonthlyStats {
  month: string
  year: number
  registrations: number
  deployments: number
  returns: number
}

// Form Data Types
export interface EmployeeFormData {
  personalInfo: {
    firstName: string
    lastName: string
    middleName?: string
    dateOfBirth: string
    gender: 'MALE' | 'FEMALE' | 'OTHER'
    nationality: string
    phone: string
    email?: string
    address: string
    emergencyContact: string
    emergencyPhone: string
  }
  passport?: {
    passportNumber: string
    issueDate: string
    expiryDate: string
    issuingCountry: string
    issuingAuthority: string
  }
  skills: Array<{
    name: string
    category: SkillCategory
    level: SkillLevel
    experience: number
    certification?: string
  }>
  languages: Array<{
    name: string
    proficiency: LanguageLevel
    certification?: string
  }>
  documents: Array<{
    type: DocumentType
    name: string
    file: File
  }>
}

// API Response Types
export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Utility Types
export type Gender = 'MALE' | 'FEMALE' | 'OTHER'
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

// Import other types
import type { Agency } from './agency.types'
import type { Document } from './document.types'
