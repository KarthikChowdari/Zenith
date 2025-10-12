/**
 * API module for Project Uday
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
 * @param {number} beneficiaryId - The ID of the beneficiary
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
 * Get list of all beneficiaries
 * @returns {Promise<Object>} List of all beneficiaries with basic info
 */
export const getAllBeneficiaries = async () => {
  try {
    const response = await api.get('/beneficiaries');
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch beneficiaries: ${error.message}`);
  }
};

/**
 * Update beneficiary data and retrain model
 * @param {number} beneficiaryId - The ID of the beneficiary
 * @param {Object} newData - New data to update
 * @returns {Promise<Object>} Update status
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

// Default export with all API functions
export default {
  getBeneficiary,
  getAllBeneficiaries,
  updateBeneficiary,
  simulateScore,
  getFeatureImportance,
  getHealthStatus,
  getApiInfo,
};