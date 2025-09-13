// src/services/apiService.js
// Updated to use the working proxy URL

class ApiService {
  // Use the working proxy URL
  static API_BASE_URL = 'http://localhost:8010/proxy';

  static async fetchWithRetry(url, options = {}, retries = 3) {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...options.headers
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
      } catch (error) {
        console.error(`Attempt ${i + 1} failed for ${url}:`, error);
        
        if (i === retries - 1) {
          throw error;
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
  }

  static async getDailyRollups() {
    return await this.fetchWithRetry(`${this.API_BASE_URL}/daily-rollups`);
  }

  static async getSchoolLogs() {
    return await this.fetchWithRetry(`${this.API_BASE_URL}/school-logs`);
  }

  static async getClassSummary(classKey, date = null) {
    const params = date ? `?date=${date}` : '';
    return await this.fetchWithRetry(`${this.API_BASE_URL}/class-summary/${classKey}${params}`);
  }

  static async getStudentActivity(username, date = null) {
    const params = date ? `?date=${date}` : '';
    return await this.fetchWithRetry(`${this.API_BASE_URL}/student-activity/${username}${params}`);
  }

  static async getClasses() {
    return await this.fetchWithRetry(`${this.API_BASE_URL}/classes`);
  }

  static async getHealth() {
    return await this.fetchWithRetry(`${this.API_BASE_URL}/health`);
  }
}

export default ApiService;