// src/services/apiService.js
// Updated API Service with new chatbot URL

import axios from 'axios';
import config from '../config/apiConfig';

class ApiService {
  // Base URLs from config
  static BASE_URL = config.dashboard.baseUrl;
  static CHAT_API_BASE_URL = config.chatbot.baseUrl; // Now using http://64.227.155.231:8000
  
  // Authentication credentials
  static AUTH = {
    username: process.env.REACT_APP_API_USERNAME || 'admin',
    password: process.env.REACT_APP_API_PASSWORD || 'Orcalex@54321'
  };

  // Helper method for retrying failed requests
  static async fetchWithRetry(url, options = {}, retries = 3) {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            ...options.headers
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error(`Attempt ${i + 1} failed:`, error);
        if (i === retries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
  }

  // Dashboard API Methods
  static async getHealth() {
    try {
      const response = await axios.get(`${this.BASE_URL}/health`, {
        auth: this.AUTH
      });
      return response.data;
    } catch (error) {
      console.error('Health check failed:', error);
      return { status: 'unhealthy', error: error.message };
    }
  }

  static async getDailyRollups() {
    try {
      const response = await axios.get(`${this.BASE_URL}/daily-rollups`, {
        auth: this.AUTH
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch daily rollups:', error);
      throw error;
    }
  }

  static async getSchoolLogs() {
    try {
      const response = await axios.get(`${this.BASE_URL}/school-logs`, {
        auth: this.AUTH
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch school logs:', error);
      throw error;
    }
  }

  static async getStudentActivity(username, date) {
    try {
      const response = await axios.get(`${this.BASE_URL}/student-activity/${encodeURIComponent(username)}`,
       {
        params: { date },
        auth: this.AUTH
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch student activity:', error);
      throw error;
    }
  }

  static async getClasses() {
    try {
      const response = await axios.get(`${this.BASE_URL}/classes`, {
        auth: this.AUTH
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch classes:', error);
      throw error;
    }
  }

  // Chatbot API Methods - Using new server http://64.227.155.231:8000
  static async createChatSession() {
    try {
      console.log('Creating chat session at:', `${this.CHAT_API_BASE_URL}/create-session`);
      
      const response = await this.fetchWithRetry(
        `${this.CHAT_API_BASE_URL}/create-session`,
        {
          method: 'POST',
          body: JSON.stringify({})
        }
      );
      
      console.log('Chat session created:', response);
      return response;
    } catch (error) {
      console.error('Failed to create chat session:', error);
      throw error;
    }
  }

  static async sendChatMessage(sessionId, message) {
    try {
      console.log('Sending message to:', `${this.CHAT_API_BASE_URL}/chat`);
      
      const response = await this.fetchWithRetry(
        `${this.CHAT_API_BASE_URL}/chat`,
        {
          method: 'POST',
          body: JSON.stringify({
            session_id: sessionId,
            question: message
          })
        }
      );
      
      return response;
    } catch (error) {
      console.error('Failed to send chat message:', error);
      throw error;
    }
  }

  static async getChatSession(sessionId) {
    try {
      return await this.fetchWithRetry(
        `${this.CHAT_API_BASE_URL}/session/${sessionId}`,
        {
          method: 'GET'
        }
      );
    } catch (error) {
      console.error('Failed to get chat session:', error);
      throw error;
    }
  }

  static async getChatbotStats() {
    try {
      return await this.fetchWithRetry(
        `${this.CHAT_API_BASE_URL}/stats`,
        {
          method: 'GET'
        }
      );
    } catch (error) {
      console.error('Failed to get chatbot stats:', error);
      throw error;
    }
  }

  static async getDataFreshness() {
    try {
      return await this.fetchWithRetry(
        `${this.CHAT_API_BASE_URL}/data-freshness`,
        {
          method: 'GET'
        }
      );
    } catch (error) {
      console.error('Failed to get data freshness:', error);
      throw error;
    }
  }

  static async clearChatSession(sessionId) {
    try {
      return await this.fetchWithRetry(
        `${this.CHAT_API_BASE_URL}/clear/${sessionId}`,
        {
          method: 'DELETE'
        }
      );
    } catch (error) {
      console.error('Failed to clear chat session:', error);
      throw error;
    }
  }

  static async triggerDataSync(apiKey) {
    try {
      return await this.fetchWithRetry(
        `${this.CHAT_API_BASE_URL}/admin/sync`,
        {
          method: 'POST',
          headers: {
            'X-API-Key': apiKey
          }
        }
      );
    } catch (error) {
      console.error('Failed to trigger data sync:', error);
      throw error;
    }
  }
}

export default ApiService;