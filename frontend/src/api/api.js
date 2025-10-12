/**
 * API module for Project Zenith
 * Handles all communication with the FastAPI backend
 */

import axios from 'axios';

// Base configuration for axios
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error);
    
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.detail || 'Server error occurred';
      throw new Error(`${error.response.status}: ${message}`);
    } else if (error.request) {
      // Request made but no response received
      throw new Error('No response from server. Please check your connection.');
    } else {
      // Something else happened
      throw new Error(`Request error: ${error.message}`);
    }
  }
);

/**
 * Get beneficiary information by ID
 * @param {string} beneficiaryId - The UUID of the beneficiary
 * @returns {Promise<Object>} Beneficiary data with score and risk category
 */
export const getBeneficiary = async (beneficiaryId) => {
  try {
    const response = await api.get(`/beneficiary/${beneficiaryId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch beneficiary ${beneficiaryId}: ${error.message}`);
  }
};

/**
 * Get list of all beneficiaries with filtering
 * @param {string} tenantId - Optional tenant ID for filtering
 * @returns {Promise<Object>} List of all beneficiaries with enhanced data
 */
export const getAllBeneficiaries = async (tenantId = null) => {
  try {
    const params = tenantId ? { tenant_id: tenantId } : {};
    const response = await api.get('/beneficiaries', { params });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch beneficiaries: ${error.message}`);
  }
};

/**
 * Get a specific beneficiary by ID
 * @param {string} beneficiaryId - The UUID of the beneficiary
 * @returns {Promise<Object>} Beneficiary data
 */
export const getBeneficiaryById = async (beneficiaryId) => {
  try {
    const response = await api.get(`/beneficiaries/${beneficiaryId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch beneficiary ${beneficiaryId}: ${error.message}`);
  }
};

/**
 * Update beneficiary data and retrain model
 * @param {string} beneficiaryId - The UUID of the beneficiary
 * @param {Object} newData - New data to update
 * @returns {Promise<Object>} Update status with new score
 */
export const updateBeneficiary = async (beneficiaryId, newData) => {
  try {
    const response = await api.post('/update', {
      beneficiary_id: beneficiaryId,
      new_data: newData,
    });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to update beneficiary ${beneficiaryId}: ${error.message}`);
  }
};

/**
 * Get score history for a beneficiary
 * @param {string} beneficiaryId - The UUID of the beneficiary
 * @param {number} limit - Number of records to fetch (default: 10)
 * @returns {Promise<Object>} Score history with timestamps and explanations
 */
export const getScoreHistory = async (beneficiaryId, limit = 10) => {
  try {
    const response = await api.get(`/score-history/${beneficiaryId}`, {
      params: { limit }
    });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch score history for ${beneficiaryId}: ${error.message}`);
  }
};

/**
 * Create a new user in the system
 * @param {Object} userData - User data (email, name, role, etc.)
 * @returns {Promise<Object>} Created user information
 */
export const createUser = async (userData) => {
  try {
    const response = await api.post('/users', userData);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to create user: ${error.message}`);
  }
};

/**
 * Simulate score changes based on hypothetical improvements
 * @param {Object} currentData - Current beneficiary data
 * @param {Object} hypotheticalChanges - Proposed changes to simulate
 * @returns {Promise<Object>} Simulation results with projected score
 */
export const simulateScore = async (currentData, hypotheticalChanges) => {
  try {
    const response = await api.post('/simulate', {
      current_data: currentData,
      hypothetical_changes: hypotheticalChanges,
    });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to simulate score: ${error.message}`);
  }
};

/**
 * Get feature importance from the model
 * @returns {Promise<Object>} Feature importance data
 */
export const getFeatureImportance = async () => {
  try {
    const response = await api.get('/feature-importance');
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch feature importance: ${error.message}`);
  }
};

/**
 * Check API health status
 * @returns {Promise<Object>} Health status information
 */
export const getHealthStatus = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    throw new Error(`Failed to check health status: ${error.message}`);
  }
};

/**
 * Get beneficiary by email address
 * @param {string} email - Email address to search for
 * @returns {Promise<Object>} - Beneficiary data
 */
export const getBeneficiaryByEmail = async (email) => {
  try {
    const response = await api.get(`/beneficiaries?email=${encodeURIComponent(email)}`);
    
    // Return the first matching beneficiary if found
    if (response.data.beneficiaries && response.data.beneficiaries.length > 0) {
      return response.data.beneficiaries[0];
    }
    
    throw new Error('Beneficiary not found');
  } catch (error) {
    throw new Error(`Failed to fetch beneficiary by email: ${error.message}`);
  }
};

/**
 * Get API root information
 * @returns {Promise<Object>} API information and available endpoints
 */
export const getApiInfo = async () => {
  try {
    const response = await api.get('/');
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch API info: ${error.message}`);
  }
};

// Export the axios instance for custom requests if needed
export { api };

// Update default export to include new function
const apiExports = {
  getBeneficiary,
  getAllBeneficiaries,
  getBeneficiaryById,
  getBeneficiaryByEmail,
  updateBeneficiary,
  getScoreHistory,
  createUser,
  simulateScore,
  getFeatureImportance,
  getHealthStatus,
  getApiInfo,
};

export default apiExports;