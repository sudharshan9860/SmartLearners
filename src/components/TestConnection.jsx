// src/components/TestConnection.jsx - Use this to debug connection issues

import React, { useState } from 'react';

const TestConnection = () => {
  const [results, setResults] = useState({});
  const [testing, setTesting] = useState(false);

  const testEndpoints = async () => {
    setTesting(true);
    const endpoints = [
      { name: 'Direct API', url: 'http://139.59.30.88/' },
      { name: 'Proxy API', url: '/api/' },
      { name: 'Health Check', url: 'http://139.59.30.88/health' },
      { name: 'Daily Rollups', url: 'http://139.59.30.88/daily-rollups' }
    ];

    const testResults = {};

    for (const endpoint of endpoints) {
      try {
        const start = Date.now();
        const response = await fetch(endpoint.url, {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Accept': 'application/json'
          }
        });
        const time = Date.now() - start;
        
        testResults[endpoint.name] = {
          status: response.status,
          ok: response.ok,
          time: `${time}ms`,
          error: null
        };
      } catch (error) {
        testResults[endpoint.name] = {
          status: 'error',
          ok: false,
          error: error.message
        };
      }
    }

    setResults(testResults);
    setTesting(false);
  };

  return (
    <div style={{ padding: '20px', background: '#f5f5f5', borderRadius: '8px', margin: '20px' }}>
      <h3>API Connection Test</h3>
      <button 
        onClick={testEndpoints} 
        disabled={testing}
        style={{
          padding: '10px 20px',
          background: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: testing ? 'not-allowed' : 'pointer',
          opacity: testing ? 0.6 : 1
        }}
      >
        {testing ? 'Testing...' : 'Test Connections'}
      </button>

      {Object.keys(results).length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h4>Test Results:</h4>
          {Object.entries(results).map(([name, result]) => (
            <div 
              key={name}
              style={{
                padding: '10px',
                margin: '5px 0',
                background: result.ok ? '#e8f5e9' : '#ffebee',
                borderLeft: `4px solid ${result.ok ? '#4CAF50' : '#f44336'}`,
                borderRadius: '4px'
              }}
            >
              <strong>{name}:</strong> 
              {result.ok ? (
                <span style={{ color: '#2e7d32' }}> ✓ Success (Status: {result.status}, Time: {result.time})</span>
              ) : (
                <span style={{ color: '#c62828' }}> ✗ Failed ({result.error || `Status: ${result.status}`})</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TestConnection;