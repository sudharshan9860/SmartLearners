// src/services/apiServiceWithProxy.js - Alternative API service using proxy

class ApiServiceWithProxy {
  // Use /api prefix which will be proxied
  static API_BASE_URL = '/api';

  static async fetchData(endpoint) {
    try {
      const response = await fetch(`${this.API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API call failed for ${endpoint}:`, error);
      throw error;
    }
  }

  static async getDailyRollups() {
    return this.fetchData('/daily-rollups');
  }

  static async getSchoolLogs() {
    return this.fetchData('/school-logs');
  }

  static async getClassSummary(classKey, date = null) {
    const params = date ? `?date=${date}` : '';
    return this.fetchData(`/class-summary/${classKey}${params}`);
  }

  static async getStudentActivity(username, date = null) {
    const params = date ? `?date=${date}` : '';
    return this.fetchData(`/student-activity/${username}${params}`);
  }

  static async getClasses() {
    return this.fetchData('/classes');
  }

  static async getHealth() {
    return this.fetchData('/health');
  }
}