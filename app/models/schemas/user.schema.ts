import { z } from 'zod'

// User Authentication Schemas
export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const RegisterSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  agencyId: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export const ResetPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export const UpdatePasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  token: z.string().min(1, 'Reset token is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

// User Profile Schemas
export const UpdateProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  address: z.string().optional(),
})

// User Role and Permission Schemas
export const UserRoleSchema = z.enum(['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'AGENT', 'VIEWER'])

export const CreateUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  role: UserRoleSchema,
  agencyId: z.string().optional(),
})

export const UpdateUserSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  role: UserRoleSchema,
  isActive: z.boolean(),
  agencyId: z.string().optional(),
})

// Session Schemas
export const SessionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  expiresAt: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

// Permission Schemas
export const PermissionSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  resource: z.string(),
  action: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const RolePermissionSchema = z.object({
  id: z.string(),
  roleId: z.string(),
  permissionId: z.string(),
  createdAt: z.date(),
})

// User Activity Schemas
export const UserActivitySchema = z.object({
  id: z.string(),
  userId: z.string(),
  action: z.string(),
  resource: z.string(),
  resourceId: z.string().optional(),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
  createdAt: z.date(),
})

// Export types
export type LoginData = z.infer<typeof LoginSchema>
export type RegisterData = z.infer<typeof RegisterSchema>
export type ChangePasswordData = z.infer<typeof ChangePasswordSchema>
export type ResetPasswordData = z.infer<typeof ResetPasswordSchema>
export type UpdatePasswordData = z.infer<typeof UpdatePasswordSchema>
export type UpdateProfileData = z.infer<typeof UpdateProfileSchema>
export type UserRole = z.infer<typeof UserRoleSchema>
export type CreateUserData = z.infer<typeof CreateUserSchema>
export type UpdateUserData = z.infer<typeof UpdateUserSchema>
export type Session = z.infer<typeof SessionSchema>
export type Permission = z.infer<typeof PermissionSchema>
export type RolePermission = z.infer<typeof RolePermissionSchema>
export type UserActivity = z.infer<typeof UserActivitySchema>
