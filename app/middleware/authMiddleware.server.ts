import { redirect } from '@remix-run/node'
import { AuthService } from '~/services/auth/authService.server'
import { PermissionService } from '~/services/auth/permissions.server'
import type { UserRole } from '~/models/user.types'

export interface AuthenticatedUser {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  isActive: boolean
  agencyId?: string
}

export interface AuthContext {
  user: AuthenticatedUser
  isAuthenticated: boolean
}

// Get user from session/token
export async function getAuthenticatedUser(request: Request): Promise<AuthenticatedUser | null> {
  try {
    // Get token from Authorization header or cookie
    const authHeader = request.headers.get('Authorization')
    const token = authHeader?.replace('Bearer ', '') || 
                 request.headers.get('Cookie')?.split(';')
                   .find(c => c.trim().startsWith('auth-token='))
                   ?.split('=')[1]

    if (!token) {
      return null
    }

    // Verify token
    const decoded = AuthService.verifyToken(token)
    if (!decoded) {
      return null
    }

    // Get user from database
    const user = await AuthService.getUserById(decoded.id)
    if (!user || !user.isActive) {
      return null
    }

    return user as AuthenticatedUser
  } catch (error) {
    console.error('Authentication error:', error)
    return null
  }
}

// Require authentication middleware
export async function requireAuth(request: Request): Promise<AuthenticatedUser> {
  const user = await getAuthenticatedUser(request)
  
  if (!user) {
    throw redirect('/login')
  }

  return user
}

// Require specific permission middleware
export async function requirePermission(
  request: Request,
  permission: string
): Promise<AuthenticatedUser> {
  const user = await requireAuth(request)
  
  if (!PermissionService.hasPermission(user.role, permission)) {
    throw redirect('/unauthorized')
  }

  return user
}

// Require any of the specified permissions
export async function requireAnyPermission(
  request: Request,
  permissions: string[]
): Promise<AuthenticatedUser> {
  const user = await requireAuth(request)
  
  if (!PermissionService.hasAnyPermission(user.role, permissions)) {
    throw redirect('/unauthorized')
  }

  return user
}

// Require all of the specified permissions
export async function requireAllPermissions(
  request: Request,
  permissions: string[]
): Promise<AuthenticatedUser> {
  const user = await requireAuth(request)
  
  if (!PermissionService.hasAllPermissions(user.role, permissions)) {
    throw redirect('/unauthorized')
  }

  return user
}

// Check if user has permission (non-throwing)
export async function hasPermission(
  request: Request,
  permission: string
): Promise<boolean> {
  const user = await getAuthenticatedUser(request)
  
  if (!user) {
    return false
  }

  return PermissionService.hasPermission(user.role, permission)
}

// Check if user has any of the specified permissions (non-throwing)
export async function hasAnyPermission(
  request: Request,
  permissions: string[]
): Promise<boolean> {
  const user = await getAuthenticatedUser(request)
  
  if (!user) {
    return false
  }

  return PermissionService.hasAnyPermission(user.role, permissions)
}

// Check if user has all of the specified permissions (non-throwing)
export async function hasAllPermissions(
  request: Request,
  permissions: string[]
): Promise<boolean> {
  const user = await getAuthenticatedUser(request)
  
  if (!user) {
    return false
  }

  return PermissionService.hasAllPermissions(user.role, permissions)
}

// Get user context for loaders
export async function getUserContext(request: Request): Promise<AuthContext> {
  const user = await getAuthenticatedUser(request)
  
  return {
    user: user as AuthenticatedUser,
    isAuthenticated: !!user,
  }
}

// Agency-specific permissions
export async function requireAgencyAccess(
  request: Request,
  agencyId: string
): Promise<AuthenticatedUser> {
  const user = await requireAuth(request)
  
  // Super admin can access all agencies
  if (user.role === 'SUPER_ADMIN') {
    return user
  }
  
  // Other users can only access their own agency
  if (user.agencyId !== agencyId) {
    throw redirect('/unauthorized')
  }

  return user
}

// Check if user can access agency (non-throwing)
export async function canAccessAgency(
  request: Request,
  agencyId: string
): Promise<boolean> {
  const user = await getAuthenticatedUser(request)
  
  if (!user) {
    return false
  }
  
  // Super admin can access all agencies
  if (user.role === 'SUPER_ADMIN') {
    return true
  }
  
  // Other users can only access their own agency
  return user.agencyId === agencyId
}

// Role-based access control helpers
export async function requireRole(
  request: Request,
  roles: UserRole[]
): Promise<AuthenticatedUser> {
  const user = await requireAuth(request)
  
  if (!roles.includes(user.role)) {
    throw redirect('/unauthorized')
  }

  return user
}

export async function requireAdmin(request: Request): Promise<AuthenticatedUser> {
  return requireRole(request, ['SUPER_ADMIN', 'ADMIN'])
}

export async function requireManager(request: Request): Promise<AuthenticatedUser> {
  return requireRole(request, ['SUPER_ADMIN', 'ADMIN', 'MANAGER'])
}

export async function requireAgent(request: Request): Promise<AuthenticatedUser> {
  return requireRole(request, ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'AGENT'])
}

// Check if user is admin (non-throwing)
export async function isAdmin(request: Request): Promise<boolean> {
  const user = await getAuthenticatedUser(request)
  return user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN'
}

// Check if user is manager or above (non-throwing)
export async function isManager(request: Request): Promise<boolean> {
  const user = await getAuthenticatedUser(request)
  return ['SUPER_ADMIN', 'ADMIN', 'MANAGER'].includes(user?.role || '')
}

// Check if user is agent or above (non-throwing)
export async function isAgent(request: Request): Promise<boolean> {
  const user = await getAuthenticatedUser(request)
  return ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'AGENT'].includes(user?.role || '')
}
