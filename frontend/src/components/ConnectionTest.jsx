import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_CONFIG } from '../config/api.config';

export default function ConnectionTest() {
  const [status, setStatus] = useState('checking');
  const [error, setError] = useState(null);
  const [endpoints, setEndpoints] = useState([]);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    setStatus('checking');
    setError(null);

    const endpointsToCheck = [
      { name: 'API Root', url: `${API_CONFIG.API_URL}/` },
      { name: 'Login', url: `${API_CONFIG.API_URL}${API_CONFIG.ENDPOINTS.LOGIN}` },
      { name: 'Register', url: `${API_CONFIG.API_URL}${API_CONFIG.ENDPOINTS.REGISTER}` }
    ];

    const results = await Promise.all(
      endpointsToCheck.map(async (endpoint) => {
        try {
          const startTime = Date.now();
          await axios.options(endpoint.url);
          const endTime = Date.now();
          return {
            ...endpoint,
            status: 'available',
            latency: endTime - startTime
          };
        } catch (error) {
          return {
            ...endpoint,
            status: 'error',
            error: error.message
          };
        }
      })
    );

    setEndpoints(results);
    const hasErrors = results.some(result => result.status === 'error');
    setStatus(hasErrors ? 'error' : 'connected');
  };

  return (
    <div className="max-w-lg mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Backend Connection Status</h2>
        <button
          onClick={checkConnection}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Refresh
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center">
          <span className="mr-2">Overall Status:</span>
          {status === 'checking' ? (
            <div className="flex items-center">
              <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Checking...
            </div>
          ) : (
            <span className={status === 'connected' ? 'text-green-500' : 'text-red-500'}>
              {status === 'connected' ? '✓ Connected' : '✗ Connection Issues'}
            </span>
          )}
        </div>

        <div className="space-y-2">
          {endpoints.map((endpoint, index) => (
            <div key={index} className="p-3 bg-gray-50 rounded">
              <div className="flex justify-between items-center">
                <span className="font-medium">{endpoint.name}</span>
                {endpoint.status === 'available' ? (
                  <span className="text-green-500">✓ Available ({endpoint.latency}ms)</span>
                ) : (
                  <span className="text-red-500">✗ {endpoint.error}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-700 rounded">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
