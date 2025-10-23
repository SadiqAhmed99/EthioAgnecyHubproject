import { NextFunction, Request, Response } from 'express';
import { APP_CONSTANTS } from '../config/constants';
import { isFeatureEnabled } from '../config/featureFlags';

export interface ErrorDetails {
  code: string;
  message: string;
  statusCode: number;
  timestamp: Date;
  path: string;
  method: string;
  userId?: string;
  stack?: string;
}

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, code: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, APP_CONSTANTS.ERROR_CODES.VALIDATION_ERROR);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = APP_CONSTANTS.ERROR_MESSAGES.UNAUTHORIZED) {
    super(message, 401, APP_CONSTANTS.ERROR_CODES.AUTHENTICATION_ERROR);
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = APP_CONSTANTS.ERROR_MESSAGES.UNAUTHORIZED) {
    super(message, 403, APP_CONSTANTS.ERROR_CODES.AUTHORIZATION_ERROR);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = APP_CONSTANTS.ERROR_MESSAGES.NOT_FOUND) {
    super(message, 404, APP_CONSTANTS.ERROR_CODES.NOT_FOUND);
  }
}

export class ExternalServiceError extends AppError {
  constructor(message: string = APP_CONSTANTS.ERROR_MESSAGES.EXTERNAL_SERVICE_ERROR) {
    super(message, 502, APP_CONSTANTS.ERROR_CODES.EXTERNAL_SERVICE_ERROR);
  }
}

// Global error handler middleware
export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let errorDetails: ErrorDetails;

  if (error instanceof AppError) {
    // Operational errors (known errors)
    errorDetails = {
      code: error.code,
      message: error.message,
      statusCode: error.statusCode,
      timestamp: new Date(),
      path: req.path,
      method: req.method,
      userId: (req as any).user?.id,
    };
  } else {
    // Programming errors (unknown errors)
    errorDetails = {
      code: APP_CONSTANTS.ERROR_CODES.INTERNAL_ERROR,
      message: APP_CONSTANTS.ERROR_MESSAGES.INTERNAL_ERROR,
      statusCode: 500,
      timestamp: new Date(),
      path: req.path,
      method: req.method,
      userId: (req as any).user?.id,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    };
  }

  // Log error
  console.error('Error occurred:', errorDetails);

  // Send error response
  res.status(errorDetails.statusCode).json({
    success: false,
    error: {
      code: errorDetails.code,
      message: errorDetails.message,
      timestamp: errorDetails.timestamp,
      path: errorDetails.path,
      method: errorDetails.method,
      ...(process.env.NODE_ENV === 'development' && { stack: errorDetails.stack }),
    },
  });
};

// Async error wrapper
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// 404 handler
export const notFoundHandler = (req: Request, res: Response) => {
  const error = new NotFoundError(`Route ${req.originalUrl} not found`);
  
  res.status(404).json({
    success: false,
    error: {
      code: error.code,
      message: error.message,
      timestamp: new Date(),
      path: req.path,
      method: req.method,
    },
  });
};

// Validation error handler
export const validationErrorHandler = (error: any) => {
  if (error.name === 'ValidationError') {
    const messages = Object.values(error.errors).map((err: any) => err.message);
    return new ValidationError(messages.join(', '));
  }
  
  if (error.name === 'CastError') {
    return new ValidationError(`Invalid ${error.path}: ${error.value}`);
  }
  
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    return new ValidationError(`${field} already exists`);
  }
  
  return error;
};

// Zod validation error handler
export const zodErrorHandler = (error: any) => {
  if (error.name === 'ZodError') {
    const messages = error.errors.map((err: any) => `${err.path.join('.')}: ${err.message}`);
    return new ValidationError(messages.join(', '));
  }
  return error;
};

// Database error handler
export const databaseErrorHandler = (error: any) => {
  if (error.code === 'P2002') {
    return new ValidationError('A record with this information already exists');
  }
  
  if (error.code === 'P2025') {
    return new NotFoundError('Record not found');
  }
  
  if (error.code === 'P2003') {
    return new ValidationError('Invalid reference to related record');
  }
  
  return error;
};

// Rate limiting error handler
export const rateLimitErrorHandler = (error: any) => {
  if (error.status === 429) {
    return new AppError(
      'Too many requests, please try again later',
      429,
      'RATE_LIMIT_EXCEEDED'
    );
  }
  return error;
};

// External service error handler
export const externalServiceErrorHandler = (error: any) => {
  if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
    return new ExternalServiceError('External service is currently unavailable');
  }
  
  if (error.response?.status >= 500) {
    return new ExternalServiceError('External service error');
  }
  
  return error;
};

// Error logging service
export class ErrorLogger {
  static log(error: ErrorDetails) {
    const logEntry = {
      timestamp: error.timestamp,
      level: this.getLogLevel(error.statusCode),
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
      path: error.path,
      method: error.method,
      userId: error.userId,
      stack: error.stack,
    };

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error Log:', logEntry);
    }

    // In production, you would log to a service like Winston, Sentry, etc.
    // Example: winston.error(logEntry);
  }

  private static getLogLevel(statusCode: number): string {
    if (statusCode >= 500) return 'error';
    if (statusCode >= 400) return 'warn';
    return 'info';
  }
}

// Error monitoring service
export class ErrorMonitor {
  static track(error: ErrorDetails) {
    // Track error metrics
    const metrics = {
      errorCode: error.code,
      statusCode: error.statusCode,
      path: error.path,
      method: error.method,
      timestamp: error.timestamp,
    };

    // In production, you would send metrics to monitoring services
    // Example: StatsD, DataDog, New Relic, etc.
    console.log('Error Metrics:', metrics);
  }

  static getErrorStats() {
    // Return error statistics
    // In production, this would query your monitoring service
    return {
      totalErrors: 0,
      errorsByCode: {},
      errorsByPath: {},
      errorRate: 0,
    };
  }
}

// Error recovery service
export class ErrorRecovery {
  static async recoverFromError(error: ErrorDetails): Promise<boolean> {
    try {
      // Implement recovery logic based on error type
      switch (error.code) {
        case APP_CONSTANTS.ERROR_CODES.EXTERNAL_SERVICE_ERROR:
          return await this.recoverFromExternalServiceError(error);
        
        case APP_CONSTANTS.ERROR_CODES.AUTHENTICATION_ERROR:
          return await this.recoverFromAuthError(error);
        
        default:
          return false;
      }
    } catch (recoveryError) {
      console.error('Error recovery failed:', recoveryError);
      return false;
    }
  }

  private static async recoverFromExternalServiceError(error: ErrorDetails): Promise<boolean> {
    // Implement retry logic for external services
    // Example: retry MOLS API calls
    return false;
  }

  private static async recoverFromAuthError(error: ErrorDetails): Promise<boolean> {
    // Implement auth recovery logic
    // Example: refresh tokens, redirect to login
    return false;
  }
}

// Error boundary for React components
export const ErrorBoundary = (error: Error, errorInfo: any) => {
  const errorDetails: ErrorDetails = {
    code: 'REACT_ERROR_BOUNDARY',
    message: error.message,
    statusCode: 500,
    timestamp: new Date(),
    path: window.location.pathname,
    method: 'GET',
    stack: error.stack,
  };

  ErrorLogger.log(errorDetails);
  ErrorMonitor.track(errorDetails);

  // In production, you would send this to error tracking services
  console.error('React Error Boundary:', error, errorInfo);
};

// Export error handling utilities
export const errorHandlers = {
  errorHandler,
  asyncHandler,
  notFoundHandler,
  validationErrorHandler,
  zodErrorHandler,
  databaseErrorHandler,
  rateLimitErrorHandler,
  externalServiceErrorHandler,
};

// Export error classes
export const errors = {
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ExternalServiceError,
};

// Export services
export const errorServices = {
  ErrorLogger,
  ErrorMonitor,
  ErrorRecovery,
};
