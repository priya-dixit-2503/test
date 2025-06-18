export class ApiError extends Error {
  constructor(message, statusCode, errors = null) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.name = 'ApiError';
  }
}

export const handleApiError = (error) => {
  console.error('API Error Details:', {
    error,
    message: error.message,
    response: error.response?.data
  });

  if (error.response) {
    // Server responded with error status
    const statusCode = error.response.status;
    const data = error.response.data;

    switch (statusCode) {
      case 400:
        throw new ApiError(
          data.detail || data.message || 'Invalid request',
          statusCode,
          data.errors
        );
      case 401:
        throw new ApiError(
          data.detail || 'Authentication required',
          statusCode
        );
      case 403:
        throw new ApiError(
          data.detail || 'Permission denied',
          statusCode
        );
      case 404:
        throw new ApiError(
          data.detail || 'Resource not found',
          statusCode
        );
      case 422:
        throw new ApiError(
          'Validation error',
          statusCode,
          data.errors
        );
      default:
        throw new ApiError(
          data.detail || data.message || 'An error occurred',
          statusCode
        );
    }
  }

  if (error.request) {
    // Request made but no response
    throw new ApiError(
      'No response from server. Please check your connection.',
      0
    );
  }

  // Error setting up request
  throw new ApiError(
    'Failed to make request',
    0
  );
};
