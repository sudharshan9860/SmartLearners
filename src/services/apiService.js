// src/services/apiService.js
// Updated API Service with Chatbot Integration

class ApiService {
  // Direct backend URL
  static API_BASE_URL = 'http://139.59.30.88';
  static CHAT_API_BASE_URL = 'http://127.0.0.1:8000'; // Update this to your actual chatbot API URL
  
  // Helper method for fetch with retry
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
          mode: 'cors',
          credentials: 'omit'
        });

        if (!response.ok) {
          // Try to get error details from response
          let errorDetail = '';
          try {
            const errorData = await response.json();
            errorDetail = errorData.detail || errorData.message || JSON.stringify(errorData);
            console.error('API Error Details:', errorData);
          } catch (e) {
            // Response body is not JSON
            errorDetail = await response.text();
          }
          throw new Error(`HTTP error! status: ${response.status}, detail: ${errorDetail}`);
        }

        const data = await response.json();
        return data;
      } catch (error) {
        console.error(`Attempt ${i + 1} failed for ${url}:`, error);
        
        if (i === retries - 1) {
          if (error.message.includes('Failed to fetch')) {
            throw new Error('Unable to connect to server. Please check your connection or try again later.');
          }
          throw error;
        }
        
        // Don't retry on 400 errors - it's a client error
        if (error.message.includes('status: 400')) {
          throw error;
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
      }
    }
  }

  // Existing API Methods
  static async getDailyRollups() {
    try {
      return await this.fetchWithRetry(`${this.API_BASE_URL}/daily-rollups`);
    } catch (error) {
      console.error('Failed to fetch daily rollups:', error);
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

  // ===== NEW CHATBOT API METHODS =====
  
  // Create a new chat session
  static async createChatSession() {
    try {
      return await this.fetchWithRetry(
        `${this.CHAT_API_BASE_URL}/create-session`,
        {
          method: 'POST'
        }
      );
    } catch (error) {
      console.error('Failed to create chat session:', error);
      throw error;
    }
  }

  // Send a chat message
  static async sendChatMessage(sessionId, question) {
    try {
      // The API expects exactly this format based on the schema
      const requestBody = {
        question: question,
        session_id: sessionId
      };
      
      console.log('Sending chat request:', requestBody);
      
      const response = await this.fetchWithRetry(
        `${this.CHAT_API_BASE_URL}/chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(requestBody)
        }
      );
      return response;
    } catch (error) {
      console.error('Failed to send chat message:', error);
      throw error;
    }
  }

  // Get chat session history
  static async getChatHistory(sessionId) {
    try {
      return await this.fetchWithRetry(
        `${this.CHAT_API_BASE_URL}/session/${sessionId}`,
        {
          method: 'GET'
        }
      );
    } catch (error) {
      console.error('Failed to get chat history:', error);
      throw error;
    }
  }

  // Get chatbot statistics
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

  // Clear chat session
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

  // Trigger data sync (admin function)
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