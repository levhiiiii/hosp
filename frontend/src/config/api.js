// API Configuration
// This file contains the API base URL configuration

const API_CONFIG = {
  // Development API URL (local backend)
  development: 'http://localhost:5001/api',
  
  // Production API URL (Render backend)
  production: 'https://hosp-245y.onrender.com/api',
  
  // Get the current API base URL based on environment
  getBaseURL: () => {
    // Check if we're in development mode
    if (import.meta.env.DEV) {
      return import.meta.env.VITE_API_BASE_URL || API_CONFIG.development;
    }
    
    // Production mode
    return import.meta.env.VITE_API_BASE_URL || API_CONFIG.production;
  }
};

export default API_CONFIG;
