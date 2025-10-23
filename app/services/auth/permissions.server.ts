import type { UserRole } from '~/models/user.types'

// Permission definitions
export const PERMISSIONS = {
  // Employee Management
  EMPLOYEE_CREATE: 'employee:create',
  EMPLOYEE_READ: 'employee:read',
  EMPLOYEE_UPDATE: 'employee:update',
  EMPLOYEE_DELETE: 'employee:delete',
  EMPLOYEE_EXPORT: 'employee:export',

  // Document Management
  DOCUMENT_CREATE: 'document:create',
  DOCUMENT_READ: 'document:read',
  DOCUMENT_UPDATE: 'document:update',
  DOCUMENT_DELETE: 'document:delete',
  DOCUMENT_VERIFY: 'document:verify',

  // Travel Management
  TRAVEL_CREATE: 'travel:create',
  TRAVEL_READ: 'travel:read',
  TRAVEL_UPDATE: 'travel:update',
  TRAVEL_DELETE: 'travel:delete',

  // Hajj & Umrah Management
  HAJJ_UMRAH_CREATE: 'hajj_umrah:create',
  HAJJ_UMRAH_READ: 'hajj_umrah:read',
  HAJJ_UMRAH_UPDATE: 'hajj_umrah:update',
  HAJJ_UMRAH_DELETE: 'hajj_umrah:delete',

  // Institution Management
  INSTITUTION_CREATE: 'institution:create',
  INSTITUTION_READ: 'institution:read',
  INSTITUTION_UPDATE: 'institution:update',
  INSTITUTION_DELETE: 'institution:delete',

  // User Management
  USER_CREATE: 'user:create',
  USER_READ: 'user:read',
  USER_UPDATE: 'user:update',
  USER_DELETE: 'user:delete',

  // Agency Management
  AGENCY_CREATE: 'agency:create',
  AGENCY_READ: 'agency:read',
  AGENCY_UPDATE: 'agency:update',
  AGENCY_DELETE: 'agency:delete',

  // Reporting & Analytics
  REPORT_READ: 'report:read',
  REPORT_EXPORT: 'report:export',

  // System Administration
  SYSTEM_CONFIG: 'system:config',
  AUDIT_LOG_READ: 'audit:read',
} as const

// Role-based permissions
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  SUPER_ADMIN: Object.values(PERMISSIONS),
  ADMIN: [
    PERMISSIONS.EMPLOYEE_CREATE,
    PERMISSIONS.EMPLOYEE_READ,
    PERMISSIONS.EMPLOYEE_UPDATE,
    PERMISSIONS.EMPLOYEE_DELETE,
    PERMISSIONS.EMPLOYEE_EXPORT,
    PERMISSIONS.DOCUMENT_CREATE,
    PERMISSIONS.DOCUMENT_READ,
    PERMISSIONS.DOCUMENT_UPDATE,
    PERMISSIONS.DOCUMENT_DELETE,
    PERMISSIONS.DOCUMENT_VERIFY,
    PERMISSIONS.TRAVEL_CREATE,
    PERMISSIONS.TRAVEL_READ,
    PERMISSIONS.TRAVEL_UPDATE,
    PERMISSIONS.TRAVEL_DELETE,
    PERMISSIONS.HAJJ_UMRAH_CREATE,
    PERMISSIONS.HAJJ_UMRAH_READ,
    PERMISSIONS.HAJJ_UMRAH_UPDATE,
    PERMISSIONS.HAJJ_UMRAH_DELETE,
    PERMISSIONS.INSTITUTION_CREATE,
    PERMISSIONS.INSTITUTION_READ,
    PERMISSIONS.INSTITUTION_UPDATE,
    PERMISSIONS.INSTITUTION_DELETE,
    PERMISSIONS.USER_CREATE,
    PERMISSIONS.USER_READ,
    PERMISSIONS.USER_UPDATE,
    PERMISSIONS.USER_DELETE,
    PERMISSIONS.AGENCY_READ,
    PERMISSIONS.REPORT_READ,
    PERMISSIONS.REPORT_EXPORT,
  ],
  MANAGER: [
    PERMISSIONS.EMPLOYEE_CREATE,
    PERMISSIONS.EMPLOYEE_READ,
    PERMISSIONS.EMPLOYEE_UPDATE,
    PERMISSIONS.EMPLOYEE_EXPORT,
    PERMISSIONS.DOCUMENT_CREATE,
    PERMISSIONS.DOCUMENT_READ,
    PERMISSIONS.DOCUMENT_UPDATE,
    PERMISSIONS.DOCUMENT_VERIFY,
    PERMISSIONS.TRAVEL_CREATE,
    PERMISSIONS.TRAVEL_READ,
    PERMISSIONS.TRAVEL_UPDATE,
    PERMISSIONS.HAJJ_UMRAH_CREATE,
    PERMISSIONS.HAJJ_UMRAH_READ,
    PERMISSIONS.HAJJ_UMRAH_UPDATE,
    PERMISSIONS.INSTITUTION_READ,
    PERMISSIONS.INSTITUTION_UPDATE,
    PERMISSIONS.USER_READ,
    PERMISSIONS.REPORT_READ,
    PERMISSIONS.REPORT_EXPORT,
  ],
  AGENT: [
    PERMISSIONS.EMPLOYEE_CREATE,
    PERMISSIONS.EMPLOYEE_READ,
    PERMISSIONS.EMPLOYEE_UPDATE,
    PERMISSIONS.DOCUMENT_CREATE,
    PERMISSIONS.DOCUMENT_READ,
    PERMISSIONS.DOCUMENT_UPDATE,
    PERMISSIONS.TRAVEL_CREATE,
    PERMISSIONS.TRAVEL_READ,
    PERMISSIONS.TRAVEL_UPDATE,
    PERMISSIONS.HAJJ_UMRAH_CREATE,
    PERMISSIONS.HAJJ_UMRAH_READ,
    PERMISSIONS.HAJJ_UMRAH_UPDATE,
    PERMISSIONS.INSTITUTION_READ,
  ],
  VIEWER: [
    PERMISSIONS.EMPLOYEE_READ,
    PERMISSIONS.DOCUMENT_READ,
    PERMISSIONS.TRAVEL_READ,
    PERMISSIONS.HAJJ_UMRAH_READ,
    PERMISSIONS.INSTITUTION_READ,
    PERMISSIONS.REPORT_READ,
  ],
}

export class PermissionService {
  // Check if user has specific permission
  static hasPermission(userRole: UserRole, permission: string): boolean {
    const rolePermissions = ROLE_PERMISSIONS[userRole] || []
    return rolePermissions.includes(permission)
  }

  // Check if user has any of the specified permissions
  static hasAnyPermission(userRole: UserRole, permissions: string[]): boolean {
    const rolePermissions = ROLE_PERMISSIONS[userRole] || []
    return permissions.some(permission => rolePermissions.includes(permission))
  }

  // Check if user has all of the specified permissions
  static hasAllPermissions(userRole: UserRole, permissions: string[]): boolean {
    const rolePermissions = ROLE_PERMISSIONS[userRole] || []
    return permissions.every(permission => rolePermissions.includes(permission))
  }

  // Get all permissions for a role
  static getRolePermissions(userRole: UserRole): string[] {
    return ROLE_PERMISSIONS[userRole] || []
  }

  // Check if user can access employee management
  static canManageEmployees(userRole: UserRole): boolean {
    return this.hasAnyPermission(userRole, [
      PERMISSIONS.EMPLOYEE_CREATE,
      PERMISSIONS.EMPLOYEE_UPDATE,
      PERMISSIONS.EMPLOYEE_DELETE,
    ])
  }

  // Check if user can access document management
  static canManageDocuments(userRole: UserRole): boolean {
    return this.hasAnyPermission(userRole, [
      PERMISSIONS.DOCUMENT_CREATE,
      PERMISSIONS.DOCUMENT_UPDATE,
      PERMISSIONS.DOCUMENT_DELETE,
      PERMISSIONS.DOCUMENT_VERIFY,
    ])
  }

  // Check if user can access travel management
  static canManageTravel(userRole: UserRole): boolean {
    return this.hasAnyPermission(userRole, [
      PERMISSIONS.TRAVEL_CREATE,
      PERMISSIONS.TRAVEL_UPDATE,
      PERMISSIONS.TRAVEL_DELETE,
    ])
  }

  // Check if user can access Hajj & Umrah management
  static canManageHajjUmrah(userRole: UserRole): boolean {
    return this.hasAnyPermission(userRole, [
      PERMISSIONS.HAJJ_UMRAH_CREATE,
      PERMISSIONS.HAJJ_UMRAH_UPDATE,
      PERMISSIONS.HAJJ_UMRAH_DELETE,
    ])
  }

  // Check if user can access institution management
  static canManageInstitutions(userRole: UserRole): boolean {
    return this.hasAnyPermission(userRole, [
      PERMISSIONS.INSTITUTION_CREATE,
      PERMISSIONS.INSTITUTION_UPDATE,
      PERMISSIONS.INSTITUTION_DELETE,
    ])
  }

  // Check if user can access user management
  static canManageUsers(userRole: UserRole): boolean {
    return this.hasAnyPermission(userRole, [
      PERMISSIONS.USER_CREATE,
      PERMISSIONS.USER_UPDATE,
      PERMISSIONS.USER_DELETE,
    ])
  }

  // Check if user can access agency management
  static canManageAgencies(userRole: UserRole): boolean {
    return this.hasAnyPermission(userRole, [
      PERMISSIONS.AGENCY_CREATE,
      PERMISSIONS.AGENCY_UPDATE,
      PERMISSIONS.AGENCY_DELETE,
    ])
  }

  // Check if user can access reports
  static canAccessReports(userRole: UserRole): boolean {
    return this.hasPermission(userRole, PERMISSIONS.REPORT_READ)
  }

  // Check if user can export data
  static canExportData(userRole: UserRole): boolean {
    return this.hasAnyPermission(userRole, [
      PERMISSIONS.EMPLOYEE_EXPORT,
      PERMISSIONS.REPORT_EXPORT,
    ])
  }

  // Check if user can access system configuration
  static canAccessSystemConfig(userRole: UserRole): boolean {
    return this.hasPermission(userRole, PERMISSIONS.SYSTEM_CONFIG)
  }

  // Check if user can access audit logs
  static canAccessAuditLogs(userRole: UserRole): boolean {
    return this.hasPermission(userRole, PERMISSIONS.AUDIT_LOG_READ)
  }
}

// Middleware helper for checking permissions
export function requirePermission(permission: string) {
  return (userRole: UserRole): boolean => {
    return PermissionService.hasPermission(userRole, permission)
  }
}

// Middleware helper for checking multiple permissions
export function requireAnyPermission(permissions: string[]) {
  return (userRole: UserRole): boolean => {
    return PermissionService.hasAnyPermission(userRole, permissions)
  }
}

// Middleware helper for checking all permissions
export function requireAllPermissions(permissions: string[]) {
  return (userRole: UserRole): boolean => {
    return PermissionService.hasAllPermissions(userRole, permissions)
  }
}
