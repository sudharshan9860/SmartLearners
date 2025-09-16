// src/services/apiService.js
class ApiService {
  static API_BASE_URL = '/api';

  static async fetchWithRetry(url, options = {}, retries = 3) {
  let lastErr;
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(options.headers || {}),
        },
      });

      if (!res.ok) {
        let detail = '';
        try {
          const ct = res.headers.get('content-type') || '';
          if (ct.includes('application/json')) {
            const j = await res.json();
            detail = j?.detail || JSON.stringify(j);
          } else {
            detail = await res.text();
          }
        } catch {}
        throw new Error(`HTTP ${res.status}${detail ? ` - ${detail}` : ''}`);
      }

      return await res.json();
    } catch (err) {
      lastErr = err;
      if (i === retries - 1) throw err;
      await new Promise(r => setTimeout(r, 1000 * (i + 1)));
    }
  }
  throw lastErr || new Error('Unknown fetch error');
}


  static getDailyRollups() { return this.fetchWithRetry(`${this.API_BASE_URL}/daily-rollups`); }
  static getSchoolLogs()  { return this.fetchWithRetry(`${this.API_BASE_URL}/school-logs`); }
  static getClassSummary(classKey, date=null) {
    const params = date ? `?date=${encodeURIComponent(date)}` : '';
    return this.fetchWithRetry(`${this.API_BASE_URL}/class-summary/${encodeURIComponent(classKey)}${params}`);
  }
  static getStudentActivity(username, date=null) {
    const params = date ? `?date=${encodeURIComponent(date)}` : '';
    return this.fetchWithRetry(`${this.API_BASE_URL}/student-activity/${encodeURIComponent(username)}${params}`);
  }
  static getClasses() { return this.fetchWithRetry(`${this.API_BASE_URL}/classes`); }
  static getHealth()  { return this.fetchWithRetry(`${this.API_BASE_URL}/health`); }
}
export default ApiService;
