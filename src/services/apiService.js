// src/services/apiService.js
// Updated to connect directly to the backend server

class ApiService {
  // Direct backend URL - no localhost
  static API_BASE_URL = 'http://139.59.30.88';
  
  // Alternative: Use environment variable for flexibility
  // static API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://139.59.30.88';

  static async fetchWithRetry(url, options = {}, retries = 3) {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...options.headers
          },
          // Important for CORS
          mode: 'cors',
          credentials: 'omit' // or 'include' if you need cookies
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
      } catch (error) {
        console.error(`Attempt ${i + 1} failed for ${url}:`, error);
        
        if (i === retries - 1) {
          // Better error handling
          if (error.message.includes('Failed to fetch')) {
            throw new Error('Unable to connect to server. Please check your connection or try again later.');
          }
          throw error;
        }
        
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
      }
    }
  }

  // API Methods with proper error handling
  static async getDailyRollups() {
    try {
      return await this.fetchWithRetry(`${this.API_BASE_URL}/daily-rollups`);
    } catch (error) {
      console.error('Failed to fetch daily rollups:', error);
      // Return empty data structure to prevent app crashes
      return {};
    }
  }

  static async getSchoolLogs() {
    try {
      return await this.fetchWithRetry(`${this.API_BASE_URL}/school-logs`);
    } catch (error) {
      console.error('Failed to fetch school logs:', error);
      return {};
    }
  }

  static async getClassSummary(classKey, date = null) {
    try {
      const params = date ? `?date=${date}` : '';
      return await this.fetchWithRetry(`${this.API_BASE_URL}/class-summary/${classKey}${params}`);
    } catch (error) {
      console.error('Failed to fetch class summary:', error);
      return null;
    }
  }

  static async getStudentActivity(username, date = null) {
    try {
      const params = date ? `?date=${date}` : '';
      return await this.fetchWithRetry(`${this.API_BASE_URL}/student-activity/${username}${params}`);
    } catch (error) {
      console.error('Failed to fetch student activity:', error);
      return null;
    }
  }

  static async getClasses() {
    try {
      return await this.fetchWithRetry(`${this.API_BASE_URL}/classes`);
    } catch (error) {
      console.error('Failed to fetch classes:', error);
      return [];
    }
  }

  static async getHealth() {
    try {
      return await this.fetchWithRetry(`${this.API_BASE_URL}/health`);
    } catch (error) {
      console.error('Health check failed:', error);
      return { status: 'unhealthy', error: error.message };
    }
  }

  // Test connection method for debugging
  static async testConnection() {
    console.log('Testing connection to:', this.API_BASE_URL);
    try {
      const response = await fetch(`${this.API_BASE_URL}/health`, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        console.log('✅ Connection successful!');
        return true;
      } else {
        console.log('❌ Connection failed with status:', response.status);
        return false;
      }
    } catch (error) {
      console.error('❌ Connection error:', error);
      return false;
    }
  }
}

export default ApiService;