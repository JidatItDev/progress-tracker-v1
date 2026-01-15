// utils/errorHandler.ts
import { AppError } from './appError';  
import { logger } from '../config/logger';  

export const handleError = (err: AppError) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  logger.error({
    message,
    statusCode,
    stack: err.stack,
  });

  return {
    error: {
      message,
      status: statusCode,
      timestamp: new Date().toISOString(),
    },
  };
};
