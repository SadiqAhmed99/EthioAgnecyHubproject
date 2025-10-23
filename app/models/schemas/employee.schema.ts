import { z } from 'zod'

// User Schemas
export const UserRoleSchema = z.enum(['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'AGENT', 'VIEWER'])

export const CreateUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  role: UserRoleSchema,
  agencyId: z.string().optional(),
})

export const UpdateUserSchema = CreateUserSchema.partial().omit({ password: true })

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

// Employee Schemas
export const GenderSchema = z.enum(['MALE', 'FEMALE', 'OTHER'])

export const EmployeeStatusSchema = z.enum([
  'REGISTERED',
  'DOCUMENT_PENDING',
  'SKILL_ASSESSED',
  'READY_FOR_DEPLOYMENT',
  'DEPLOYED',
  'RETURNED',
  'SUSPENDED',
])

export const CreateEmployeeSchema = z.object({
  employeeId: z.string().min(1, 'Employee ID is required'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  middleName: z.string().optional(),
  dateOfBirth: z.string().transform((str) => new Date(str)),
  gender: GenderSchema,
  nationality: z.string().default('Ethiopian'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  email: z.string().email().optional(),
  address: z.string().min(1, 'Address is required'),
  emergencyContact: z.string().min(1, 'Emergency contact is required'),
  emergencyPhone: z.string().min(10, 'Emergency phone must be at least 10 digits'),
  agencyId: z.string().min(1, 'Agency ID is required'),
})

export const UpdateEmployeeSchema = CreateEmployeeSchema.partial()

// Passport Schemas
export const CreatePassportSchema = z.object({
  passportNumber: z.string().min(1, 'Passport number is required'),
  issueDate: z.string().transform((str) => new Date(str)),
  expiryDate: z.string().transform((str) => new Date(str)),
  issuingCountry: z.string().min(1, 'Issuing country is required'),
  issuingAuthority: z.string().min(1, 'Issuing authority is required'),
  employeeId: z.string().min(1, 'Employee ID is required'),
})

// Skill Schemas
export const SkillCategorySchema = z.enum([
  'DOMESTIC_WORK',
  'CONSTRUCTION',
  'HEALTHCARE',
  'EDUCATION',
  'TECHNICAL',
  'PROFESSIONAL',
  'OTHER',
])

export const SkillLevelSchema = z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'])

export const CreateSkillSchema = z.object({
  name: z.string().min(1, 'Skill name is required'),
  category: SkillCategorySchema,
  level: SkillLevelSchema,
  experience: z.number().min(0, 'Experience must be a positive number'),
  certification: z.string().optional(),
  employeeId: z.string().min(1, 'Employee ID is required'),
})

// Language Schemas
export const LanguageLevelSchema = z.enum(['BASIC', 'INTERMEDIATE', 'ADVANCED', 'NATIVE'])

export const CreateLanguageSchema = z.object({
  name: z.string().min(1, 'Language name is required'),
  proficiency: LanguageLevelSchema,
  certification: z.string().optional(),
  employeeId: z.string().min(1, 'Employee ID is required'),
})

// Document Schemas
export const DocumentTypeSchema = z.enum([
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
])

export const DocumentStatusSchema = z.enum(['PENDING', 'VERIFIED', 'REJECTED', 'EXPIRED'])

export const CreateDocumentSchema = z.object({
  type: DocumentTypeSchema,
  name: z.string().min(1, 'Document name is required'),
  filePath: z.string().min(1, 'File path is required'),
  fileSize: z.number().min(1, 'File size must be greater than 0'),
  mimeType: z.string().min(1, 'MIME type is required'),
  employeeId: z.string().optional(),
  agencyId: z.string().min(1, 'Agency ID is required'),
})

// Application Schemas
export const ApplicationStatusSchema = z.enum([
  'SUBMITTED',
  'UNDER_REVIEW',
  'APPROVED',
  'REJECTED',
  'DEPLOYED',
  'COMPLETED',
])

export const CreateApplicationSchema = z.object({
  jobTitle: z.string().min(1, 'Job title is required'),
  destination: z.string().min(1, 'Destination is required'),
  employer: z.string().min(1, 'Employer is required'),
  salary: z.number().optional(),
  contractStart: z.string().transform((str) => new Date(str)).optional(),
  contractEnd: z.string().transform((str) => new Date(str)).optional(),
  employeeId: z.string().min(1, 'Employee ID is required'),
})

// Travel Schemas
export const TravelStatusSchema = z.enum([
  'SCHEDULED',
  'CONFIRMED',
  'IN_TRANSIT',
  'ARRIVED',
  'CANCELLED',
])

export const CreateTravelSchema = z.object({
  flightNumber: z.string().optional(),
  departureDate: z.string().transform((str) => new Date(str)).optional(),
  arrivalDate: z.string().transform((str) => new Date(str)).optional(),
  departureAirport: z.string().optional(),
  arrivalAirport: z.string().optional(),
  employeeId: z.string().min(1, 'Employee ID is required'),
})

// Hajj & Umrah Schemas
export const PilgrimageTypeSchema = z.enum(['HAJJ', 'UMRAH'])

export const PilgrimageStatusSchema = z.enum([
  'REGISTERED',
  'DOCUMENT_PENDING',
  'APPROVED',
  'DEPARTED',
  'RETURNED',
  'CANCELLED',
])

export const CreateHajjUmrahSchema = z.object({
  type: PilgrimageTypeSchema,
  year: z.number().min(2024, 'Year must be 2024 or later'),
  groupNumber: z.string().optional(),
  employeeId: z.string().min(1, 'Employee ID is required'),
})

// Institution Schemas
export const InstitutionTypeSchema = z.enum([
  'GOVERNMENT',
  'BANKING',
  'INSURANCE',
  'MEDICAL',
  'EDUCATION',
  'OTHER',
])

export const CreateInstitutionSchema = z.object({
  name: z.string().min(1, 'Institution name is required'),
  type: InstitutionTypeSchema,
  address: z.string().min(1, 'Address is required'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  email: z.string().email('Invalid email address'),
  contactPerson: z.string().min(1, 'Contact person is required'),
  agencyId: z.string().min(1, 'Agency ID is required'),
})

// Agency Schemas
export const CreateAgencySchema = z.object({
  name: z.string().min(1, 'Agency name is required'),
  license: z.string().min(1, 'License number is required'),
  address: z.string().min(1, 'Address is required'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  email: z.string().email('Invalid email address'),
})

// Search and Filter Schemas
export const EmployeeSearchSchema = z.object({
  query: z.string().optional(),
  status: EmployeeStatusSchema.optional(),
  gender: GenderSchema.optional(),
  skillCategory: SkillCategorySchema.optional(),
  destination: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
})

export const DocumentSearchSchema = z.object({
  type: DocumentTypeSchema.optional(),
  status: DocumentStatusSchema.optional(),
  employeeId: z.string().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
})

// Export types
export type UserRole = z.infer<typeof UserRoleSchema>
export type CreateUser = z.infer<typeof CreateUserSchema>
export type UpdateUser = z.infer<typeof UpdateUserSchema>
export type LoginData = z.infer<typeof LoginSchema>

export type Gender = z.infer<typeof GenderSchema>
export type EmployeeStatus = z.infer<typeof EmployeeStatusSchema>
export type CreateEmployee = z.infer<typeof CreateEmployeeSchema>
export type UpdateEmployee = z.infer<typeof UpdateEmployeeSchema>

export type CreatePassport = z.infer<typeof CreatePassportSchema>
export type SkillCategory = z.infer<typeof SkillCategorySchema>
export type SkillLevel = z.infer<typeof SkillLevelSchema>
export type CreateSkill = z.infer<typeof CreateSkillSchema>

export type LanguageLevel = z.infer<typeof LanguageLevelSchema>
export type CreateLanguage = z.infer<typeof CreateLanguageSchema>

export type DocumentType = z.infer<typeof DocumentTypeSchema>
export type DocumentStatus = z.infer<typeof DocumentStatusSchema>
export type CreateDocument = z.infer<typeof CreateDocumentSchema>

export type ApplicationStatus = z.infer<typeof ApplicationStatusSchema>
export type CreateApplication = z.infer<typeof CreateApplicationSchema>

export type TravelStatus = z.infer<typeof TravelStatusSchema>
export type CreateTravel = z.infer<typeof CreateTravelSchema>

export type PilgrimageType = z.infer<typeof PilgrimageTypeSchema>
export type PilgrimageStatus = z.infer<typeof PilgrimageStatusSchema>
export type CreateHajjUmrah = z.infer<typeof CreateHajjUmrahSchema>

export type InstitutionType = z.infer<typeof InstitutionTypeSchema>
export type CreateInstitution = z.infer<typeof CreateInstitutionSchema>

export type CreateAgency = z.infer<typeof CreateAgencySchema>

export type EmployeeSearch = z.infer<typeof EmployeeSearchSchema>
export type DocumentSearch = z.infer<typeof DocumentSearchSchema>
