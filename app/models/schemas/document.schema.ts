import { z } from 'zod'

// User Schemas
export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  role: z.enum(['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'AGENT', 'VIEWER']),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  agencyId: z.string().optional(),
})

// Agency Schemas
export const AgencySchema = z.object({
  id: z.string(),
  name: z.string(),
  license: z.string(),
  address: z.string(),
  phone: z.string(),
  email: z.string().email(),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

// Document Schemas
export const DocumentSchema = z.object({
  id: z.string(),
  type: z.enum([
    'NATIONAL_ID',
    'PASSPORT',
    'BIRTH_CERTIFICATE',
    'MEDICAL_CERTIFICATE',
    'EDUCATIONAL_CERTIFICATE',
    'SKILL_CERTIFICATE',
    'POLICE_CLEARANCE',
    'EMPLOYMENT_CONTRACT',
    'VISA',
    'OTHER',
  ]),
  name: z.string(),
  filePath: z.string(),
  fileSize: z.number(),
  mimeType: z.string(),
  status: z.enum(['PENDING', 'VERIFIED', 'REJECTED', 'EXPIRED']),
  uploadedAt: z.date(),
  verifiedAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  employeeId: z.string().optional(),
  agencyId: z.string(),
})

// Application Schemas
export const ApplicationSchema = z.object({
  id: z.string(),
  jobTitle: z.string(),
  destination: z.string(),
  employer: z.string(),
  salary: z.number().optional(),
  contractStart: z.date().optional(),
  contractEnd: z.date().optional(),
  status: z.enum([
    'SUBMITTED',
    'UNDER_REVIEW',
    'APPROVED',
    'REJECTED',
    'DEPLOYED',
    'COMPLETED',
  ]),
  submittedAt: z.date(),
  approvedAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  employeeId: z.string(),
})

// Travel Schemas
export const TravelSchema = z.object({
  id: z.string(),
  flightNumber: z.string().optional(),
  departureDate: z.date().optional(),
  arrivalDate: z.date().optional(),
  departureAirport: z.string().optional(),
  arrivalAirport: z.string().optional(),
  status: z.enum(['SCHEDULED', 'CONFIRMED', 'IN_TRANSIT', 'ARRIVED', 'CANCELLED']),
  createdAt: z.date(),
  updatedAt: z.date(),
  employeeId: z.string(),
})

// Hajj & Umrah Schemas
export const HajjUmrahSchema = z.object({
  id: z.string(),
  type: z.enum(['HAJJ', 'UMRAH']),
  year: z.number(),
  groupNumber: z.string().optional(),
  status: z.enum([
    'REGISTERED',
    'DOCUMENT_PENDING',
    'APPROVED',
    'DEPARTED',
    'RETURNED',
    'CANCELLED',
  ]),
  registrationDate: z.date(),
  departureDate: z.date().optional(),
  returnDate: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  employeeId: z.string(),
})

// Institution Schemas
export const InstitutionSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['GOVERNMENT', 'BANKING', 'INSURANCE', 'MEDICAL', 'EDUCATION', 'OTHER']),
  address: z.string(),
  phone: z.string(),
  email: z.string().email(),
  contactPerson: z.string(),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  agencyId: z.string(),
})

// System Configuration Schemas
export const SystemConfigSchema = z.object({
  id: z.string(),
  key: z.string(),
  value: z.string(),
  type: z.enum(['STRING', 'NUMBER', 'BOOLEAN', 'JSON']),
  createdAt: z.date(),
  updatedAt: z.date(),
})

// Audit Log Schemas
export const AuditLogSchema = z.object({
  id: z.string(),
  userId: z.string(),
  action: z.string(),
  entity: z.string(),
  entityId: z.string(),
  oldValues: z.record(z.any()).optional(),
  newValues: z.record(z.any()).optional(),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
  createdAt: z.date(),
})

// Export types
export type User = z.infer<typeof UserSchema>
export type Agency = z.infer<typeof AgencySchema>
export type Document = z.infer<typeof DocumentSchema>
export type Application = z.infer<typeof ApplicationSchema>
export type Travel = z.infer<typeof TravelSchema>
export type HajjUmrah = z.infer<typeof HajjUmrahSchema>
export type Institution = z.infer<typeof InstitutionSchema>
export type SystemConfig = z.infer<typeof SystemConfigSchema>
export type AuditLog = z.infer<typeof AuditLogSchema>
