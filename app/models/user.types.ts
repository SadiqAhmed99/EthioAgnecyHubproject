// User Types
export interface User {
  id: string
  email: string
  password: string
  firstName: string
  lastName: string
  role: UserRole
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  agencyId?: string
  agency?: Agency
  createdBy?: string
  updatedBy?: string
}

export type UserRole = 
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'MANAGER'
  | 'AGENT'
  | 'VIEWER'

// Agency Types
export interface Agency {
  id: string
  name: string
  license: string
  address: string
  phone: string
  email: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  users?: User[]
  employees?: Employee[]
  documents?: Document[]
  institutions?: Institution[]
}

// Institution Types
export interface Institution {
  id: string
  name: string
  type: InstitutionType
  address: string
  phone: string
  email: string
  contactPerson: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  agencyId: string
  agency?: Agency
}

export type InstitutionType = 
  | 'GOVERNMENT'
  | 'BANKING'
  | 'INSURANCE'
  | 'MEDICAL'
  | 'EDUCATION'
  | 'OTHER'

// System Configuration Types
export interface SystemConfig {
  id: string
  key: string
  value: string
  type: ConfigType
  createdAt: Date
  updatedAt: Date
}

export type ConfigType = 
  | 'STRING'
  | 'NUMBER'
  | 'BOOLEAN'
  | 'JSON'

// Audit Log Types
export interface AuditLog {
  id: string
  userId: string
  action: string
  entity: string
  entityId: string
  oldValues?: Record<string, any>
  newValues?: Record<string, any>
  ipAddress?: string
  userAgent?: string
  createdAt: Date
}

// Session Types
export interface Session {
  id: string
  userId: string
  expiresAt: Date
  createdAt: Date
  updatedAt: Date
}

// Permission Types
export interface Permission {
  id: string
  name: string
  description?: string
  resource: string
  action: string
  createdAt: Date
  updatedAt: Date
}

export interface RolePermission {
  id: string
  roleId: string
  permissionId: string
  createdAt: Date
}

// User Activity Types
export interface UserActivity {
  id: string
  userId: string
  action: string
  resource: string
  resourceId?: string
  ipAddress?: string
  userAgent?: string
  createdAt: Date
}

// Authentication Types
export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  confirmPassword: string
  firstName: string
  lastName: string
  agencyId?: string
}

export interface ChangePasswordData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface ResetPasswordData {
  email: string
}

export interface UpdatePasswordData {
  password: string
  confirmPassword: string
  token: string
}

export interface UpdateProfileData {
  firstName: string
  lastName: string
  email: string
  phone?: string
  address?: string
}

// User Management Types
export interface CreateUserData {
  email: string
  password: string
  firstName: string
  lastName: string
  role: UserRole
  agencyId?: string
}

export interface UpdateUserData {
  firstName: string
  lastName: string
  email: string
  role: UserRole
  isActive: boolean
  agencyId?: string
}

// Search and Filter Types
export interface UserSearchParams {
  query?: string
  role?: UserRole
  isActive?: boolean
  agencyId?: string
  page?: number
  limit?: number
}

export interface UserFilters {
  role?: UserRole[]
  isActive?: boolean
  agencyId?: string[]
  createdDateFrom?: Date
  createdDateTo?: Date
}

// User Statistics Types
export interface UserStats {
  total: number
  active: number
  inactive: number
  byRole: Record<UserRole, number>
  byAgency: Record<string, number>
}

export interface UserActivityStats {
  totalActivities: number
  activitiesByAction: Record<string, number>
  activitiesByResource: Record<string, number>
  recentActivities: UserActivity[]
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

// Import other types
import type { Employee } from './employee.types'
import type { Document } from './document.types'
