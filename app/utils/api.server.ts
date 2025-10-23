// Server-side API utilities
import { json, type ActionFunctionArgs, type LoaderFunctionArgs } from '@remix-run/node';
import { ValidationError, AuthenticationError, AuthorizationError } from '~/middleware/errorMiddleware.server';
import { APP_CONSTANTS } from '~/config/constants';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface FilterParams {
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  [key: string]: any;
}

// Success response helper
export function successResponse<T>(
  data: T,
  message?: string,
  status: number = 200
) {
  return json({
    success: true,
    data,
    message,
  }, { status });
}

// Error response helper
export function errorResponse(
  message: string,
  status: number = 400,
  code?: string
) {
  return json({
    success: false,
    error: message,
    code,
  }, { status });
}

// Validation error response helper
export function validationErrorResponse(errors: Record<string, string>) {
  return json({
    success: false,
    error: 'Validation failed',
    errors,
  }, { status: 400 });
}

// Pagination helper
export function createPagination(
  page: number,
  limit: number,
  total: number
): PaginationParams {
  const pages = Math.ceil(total / limit);
  
  return {
    page: Math.max(1, Math.min(page, pages)),
    limit: Math.max(1, Math.min(limit, APP_CONSTANTS.MAX_PAGE_SIZE)),
    total,
    pages: Math.max(1, pages),
  };
}

// Extract pagination from URL
export function extractPaginationParams(request: Request) {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || APP_CONSTANTS.DEFAULT_PAGE_SIZE.toString());
  
  return {
    page: Math.max(1, page),
    limit: Math.max(1, Math.min(limit, APP_CONSTANTS.MAX_PAGE_SIZE)),
  };
}

// Extract filters from URL
export function extractFilterParams(request: Request): FilterParams {
  const url = new URL(request.url);
  const params: FilterParams = {};
  
  for (const [key, value] of url.searchParams.entries()) {
    if (key === 'page' || key === 'limit') continue;
    
    if (key === 'sortBy' || key === 'sortOrder') {
      params[key] = value;
    } else if (key === 'skills' || key === 'tags') {
      params[key] = value.split(',').filter(Boolean);
    } else {
      params[key] = value;
    }
  }
  
  return params;
}

// Validate required fields
export function validateRequiredFields(
  data: Record<string, any>,
  requiredFields: string[]
): void {
  const missingFields = requiredFields.filter(field => 
    !data[field] || (typeof data[field] === 'string' && data[field].trim() === '')
  );
  
  if (missingFields.length > 0) {
    throw new ValidationError(
      `Missing required fields: ${missingFields.join(', ')}`
    );
  }
}

// Validate email format
export function validateEmail(email: string): boolean {
  return APP_CONSTANTS.VALIDATION.EMAIL_REGEX.test(email);
}

// Validate phone format
export function validatePhone(phone: string): boolean {
  return APP_CONSTANTS.VALIDATION.PHONE_REGEX.test(phone);
}

// Sanitize input data
export function sanitizeInput(data: Record<string, any>): Record<string, any> {
  const sanitized: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      sanitized[key] = value.trim();
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
}

// Generate API key
export function generateApiKey(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
}

// Rate limiting helper
export function createRateLimiter(
  windowMs: number = 15 * 60 * 1000, // 15 minutes
  maxRequests: number = 100
) {
  const requests = new Map<string, { count: number; resetTime: number }>();
  
  return (identifier: string): boolean => {
    const now = Date.now();
    const windowStart = now - windowMs;
    
    // Clean up old entries
    for (const [key, value] of requests.entries()) {
      if (value.resetTime < windowStart) {
        requests.delete(key);
      }
    }
    
    const current = requests.get(identifier);
    
    if (!current) {
      requests.set(identifier, { count: 1, resetTime: now });
      return true;
    }
    
    if (current.resetTime < windowStart) {
      requests.set(identifier, { count: 1, resetTime: now });
      return true;
    }
    
    if (current.count >= maxRequests) {
      return false;
    }
    
    current.count++;
    return true;
  };
}

// File upload validation
export function validateFileUpload(
  file: File,
  maxSize: number = APP_CONSTANTS.MAX_FILE_SIZE,
  allowedTypes: string[] = APP_CONSTANTS.ALLOWED_FILE_TYPES.ALL
): void {
  // Check file size
  if (file.size > maxSize) {
    throw new ValidationError(
      `File size exceeds maximum limit of ${maxSize / 1024 / 1024}MB`
    );
  }
  
  // Check file type
  const fileExtension = file.name.split('.').pop()?.toLowerCase();
  if (!fileExtension || !allowedTypes.includes(fileExtension)) {
    throw new ValidationError(
      `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`
    );
  }
}

// Database query helpers
export function createWhereClause(filters: FilterParams): any {
  const where: any = {};
  
  if (filters.search) {
    where.OR = [
      { firstName: { contains: filters.search, mode: 'insensitive' } },
      { lastName: { contains: filters.search, mode: 'insensitive' } },
      { email: { contains: filters.search, mode: 'insensitive' } },
    ];
  }
  
  if (filters.status) {
    where.status = filters.status;
  }
  
  return where;
}

export function createOrderByClause(sortBy?: string, sortOrder?: string): any {
  if (!sortBy) return { createdAt: 'desc' };
  
  return {
    [sortBy]: sortOrder === 'asc' ? 'asc' : 'desc',
  };
}

// Response caching helper
export function createCacheHeaders(maxAge: number = 300): HeadersInit {
  return {
    'Cache-Control': `public, max-age=${maxAge}`,
    'Expires': new Date(Date.now() + maxAge * 1000).toUTCString(),
  };
}

// Error logging helper
export function logApiError(
  error: any,
  context: {
    action?: string;
    userId?: string;
    requestId?: string;
    additionalData?: any;
  } = {}
) {
  const errorLog = {
    timestamp: new Date().toISOString(),
    error: error.message || error,
    stack: error.stack,
    ...context,
  };
  
  console.error('API Error:', errorLog);
  
  // In production, you would send this to a logging service
  // Example: winston.error(errorLog);
}

// Request ID generator
export function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
