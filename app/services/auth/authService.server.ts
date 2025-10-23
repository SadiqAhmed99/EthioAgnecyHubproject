import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '~/lib/prisma.server'
import type { User, UserRole } from '~/models/user.types'
import { LoginSchema, CreateUserSchema } from '~/models/schemas/user.schema'

const JWT_SECRET = process.env.SESSION_SECRET || 'your-super-secret-session-key-here'
const SALT_ROUNDS = 12

export class AuthService {
  // Hash password
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS)
  }

  // Verify password
  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword)
  }

  // Generate JWT token
  static generateToken(user: Pick<User, 'id' | 'email' | 'role'>): string {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    )
  }

  // Verify JWT token
  static verifyToken(token: string): any {
    try {
      return jwt.verify(token, JWT_SECRET)
    } catch (error) {
      return null
    }
  }

  // Login user
  static async login(email: string, password: string): Promise<{ user: User; token: string } | null> {
    try {
      // Validate input
      const validatedData = LoginSchema.parse({ email, password })

      // Find user by email
      const user = await prisma.user.findUnique({
        where: { email: validatedData.email },
        include: {
          agency: true,
        },
      })

      if (!user || !user.isActive) {
        return null
      }

      // Verify password
      const isValidPassword = await this.verifyPassword(password, user.password)
      if (!isValidPassword) {
        return null
      }

      // Generate token
      const token = this.generateToken(user)

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user

      return {
        user: userWithoutPassword as User,
        token,
      }
    } catch (error) {
      console.error('Login error:', error)
      return null
    }
  }

  // Register new user
  static async register(userData: {
    email: string
    password: string
    firstName: string
    lastName: string
    role?: UserRole
    agencyId?: string
  }): Promise<{ user: User; token: string } | null> {
    try {
      // Validate input
      const validatedData = CreateUserSchema.parse({
        ...userData,
        role: userData.role || 'AGENT',
      })

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: validatedData.email },
      })

      if (existingUser) {
        throw new Error('User with this email already exists')
      }

      // Hash password
      const hashedPassword = await this.hashPassword(validatedData.password)

      // Create user
      const user = await prisma.user.create({
        data: {
          email: validatedData.email,
          password: hashedPassword,
          firstName: validatedData.firstName,
          lastName: validatedData.lastName,
          role: validatedData.role,
          agencyId: validatedData.agencyId,
        },
        include: {
          agency: true,
        },
      })

      // Generate token
      const token = this.generateToken(user)

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user

      return {
        user: userWithoutPassword as User,
        token,
      }
    } catch (error) {
      console.error('Registration error:', error)
      return null
    }
  }

  // Get user by ID
  static async getUserById(id: string): Promise<User | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        include: {
          agency: true,
        },
      })

      if (!user) {
        return null
      }

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user
      return userWithoutPassword as User
    } catch (error) {
      console.error('Get user error:', error)
      return null
    }
  }

  // Update user profile
  static async updateProfile(
    id: string,
    data: {
      firstName?: string
      lastName?: string
      email?: string
    }
  ): Promise<User | null> {
    try {
      const user = await prisma.user.update({
        where: { id },
        data,
        include: {
          agency: true,
        },
      })

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user
      return userWithoutPassword as User
    } catch (error) {
      console.error('Update profile error:', error)
      return null
    }
  }

  // Change password
  static async changePassword(
    id: string,
    currentPassword: string,
    newPassword: string
  ): Promise<boolean> {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
      })

      if (!user) {
        return false
      }

      // Verify current password
      const isValidPassword = await this.verifyPassword(currentPassword, user.password)
      if (!isValidPassword) {
        return false
      }

      // Hash new password
      const hashedPassword = await this.hashPassword(newPassword)

      // Update password
      await prisma.user.update({
        where: { id },
        data: { password: hashedPassword },
      })

      return true
    } catch (error) {
      console.error('Change password error:', error)
      return false
    }
  }

  // Deactivate user
  static async deactivateUser(id: string): Promise<boolean> {
    try {
      await prisma.user.update({
        where: { id },
        data: { isActive: false },
      })
      return true
    } catch (error) {
      console.error('Deactivate user error:', error)
      return false
    }
  }

  // Activate user
  static async activateUser(id: string): Promise<boolean> {
    try {
      await prisma.user.update({
        where: { id },
        data: { isActive: true },
      })
      return true
    } catch (error) {
      console.error('Activate user error:', error)
      return false
    }
  }

  // Get all users (for admin)
  static async getAllUsers(
    page: number = 1,
    limit: number = 20,
    filters?: {
      role?: UserRole
      isActive?: boolean
      agencyId?: string
    }
  ): Promise<{ users: User[]; total: number }> {
    try {
      const skip = (page - 1) * limit
      const where = {
        ...(filters?.role && { role: filters.role }),
        ...(filters?.isActive !== undefined && { isActive: filters.isActive }),
        ...(filters?.agencyId && { agencyId: filters.agencyId }),
      }

      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where,
          skip,
          take: limit,
          include: {
            agency: true,
          },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.user.count({ where }),
      ])

      // Remove passwords from response
      const usersWithoutPasswords = users.map(({ password, ...user }) => user as User)

      return {
        users: usersWithoutPasswords,
        total,
      }
    } catch (error) {
      console.error('Get all users error:', error)
      return { users: [], total: 0 }
    }
  }
}
