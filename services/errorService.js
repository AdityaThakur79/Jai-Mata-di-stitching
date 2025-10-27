class ErrorService {
  constructor() {
    this.errorLogs = [];
    this.maxLogs = 1000;
  }

  /**
   * Log error with context
   */
  logError(error, context = {}) {
    const errorLog = {
      timestamp: new Date().toISOString(),
      message: error.message,
      stack: error.stack,
      context,
      type: error.constructor.name
    };

    this.errorLogs.push(errorLog);
    
    // Keep only the latest logs
    if (this.errorLogs.length > this.maxLogs) {
      this.errorLogs = this.errorLogs.slice(-this.maxLogs);
    }

    console.error('Error logged:', errorLog);
    return errorLog;
  }

  /**
   * Handle API errors with proper status codes
   */
  handleApiError(error, res, context = {}) {
    const errorLog = this.logError(error, context);
    
    let statusCode = 500;
    let message = 'Internal server error';
    
    // Handle specific error types
    if (error.name === 'ValidationError') {
      statusCode = 400;
      message = 'Validation error';
    } else if (error.name === 'CastError') {
      statusCode = 400;
      message = 'Invalid ID format';
    } else if (error.code === 11000) {
      statusCode = 409;
      message = 'Duplicate entry';
    } else if (error.message.includes('not found')) {
      statusCode = 404;
      message = error.message;
    } else if (error.message.includes('already exists')) {
      statusCode = 409;
      message = error.message;
    } else if (error.message.includes('permission') || error.message.includes('unauthorized')) {
      statusCode = 403;
      message = 'Access denied';
    }

    res.status(statusCode).json({
      success: false,
      message,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      errorId: errorLog.timestamp // For tracking in logs
    });
  }

  /**
   * Retry mechanism for operations
   */
  async retryOperation(operation, maxRetries = 3, delay = 1000) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        console.log(`Attempt ${attempt}/${maxRetries} failed:`, error.message);
        
        if (attempt === maxRetries) {
          throw error;
        }
        
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt - 1)));
      }
    }
  }

  /**
   * Validate required fields
   */
  validateRequiredFields(data, requiredFields) {
    const missingFields = requiredFields.filter(field => {
      const value = data[field];
      return value === undefined || value === null || value === '';
    });

    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }
  }

  /**
   * Sanitize error message for client
   */
  sanitizeErrorMessage(error) {
    // Remove sensitive information
    let message = error.message || 'An error occurred';
    
    // Remove stack traces and file paths
    message = message.replace(/at\s+.*\s+\(.*\)/g, '');
    message = message.replace(/Error:\s*/g, '');
    message = message.trim();
    
    return message || 'An unexpected error occurred';
  }

  /**
   * Get error statistics
   */
  getErrorStats() {
    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    const recentErrors = this.errorLogs.filter(log => 
      new Date(log.timestamp) > last24Hours
    );

    const errorTypes = recentErrors.reduce((acc, log) => {
      acc[log.type] = (acc[log.type] || 0) + 1;
      return acc;
    }, {});

    return {
      totalErrors: this.errorLogs.length,
      recentErrors: recentErrors.length,
      errorTypes,
      lastError: this.errorLogs[this.errorLogs.length - 1] || null
    };
  }

  /**
   * Clear error logs
   */
  clearLogs() {
    this.errorLogs = [];
    console.log('Error logs cleared');
  }
}

export default new ErrorService();
