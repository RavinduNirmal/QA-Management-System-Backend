import BaseError from "./baseError";
import logger from "../logger/logger";
import { Response } from "express";
import { StatusCodes } from "../constants/statusCodes";

export default function handleError(error: any, res: Response) {
  // Log error with stack trace in development
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  if (error instanceof BaseError) {
    logger.error(`[${error.statusCode}] ${error.desc}`);
    
    if (isDevelopment && error.stack) {
      console.error(error.stack);
    }
    
    return res.status(error.statusCode).json({ 
      success: false,
      error: error.desc,
      statusCode: error.statusCode,
      ...(isDevelopment && { stack: error.stack })
    });
  } 
  
  // Handle TypeORM specific errors
  if (error.code === 'ER_DUP_ENTRY' || error.code === '23505') {
    logger.error(`Database duplicate entry: ${error.message}`);
    return res.status(StatusCodes.CONFLICT).json({
      success: false,
      error: "Duplicate entry found",
      statusCode: StatusCodes.CONFLICT,
      ...(isDevelopment && { details: error.message })
    });
  }
  
  // Handle validation errors from class-validator
  if (error.name === 'ValidationError') {
    logger.error(`Validation error: ${error.message}`);
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      error: "Validation failed",
      statusCode: StatusCodes.BAD_REQUEST,
      ...(error.errors && { details: error.errors }),
      ...(isDevelopment && { originalError: error.message })
    });
  }
  
  // Handle JWT errors
  if (error.name === 'JsonWebTokenError') {
    logger.error(`JWT error: ${error.message}`);
    return res.status(StatusCodes.NOT_AUTHORIZED).json({
      success: false,
      error: "Invalid token",
      statusCode: StatusCodes.NOT_AUTHORIZED,
    });
  }
  
  if (error.name === 'TokenExpiredError') {
    logger.error(`Token expired: ${error.message}`);
    return res.status(StatusCodes.NOT_AUTHORIZED).json({
      success: false,
      error: "Token expired",
      statusCode: StatusCodes.NOT_AUTHORIZED,
    });
  }
  
  // Generic error handler
  console.error('Unhandled error:', error);
  logger.error(error.message || error);
  
  return res.status(StatusCodes.SERVER_ERROR).json({ 
    success: false,
    error: process.env.NODE_ENV === 'production' 
      ? "Internal Server Error" 
      : error.message || "Internal Server Error",
    statusCode: StatusCodes.SERVER_ERROR,
    ...(isDevelopment && { stack: error.stack })
  });
}