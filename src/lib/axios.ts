import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://onix-api-gabu.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use((config) => {
  console.log('🔑 Checking for authentication token');
  const token = localStorage.getItem('token');
  if (token) {
    console.log('🔑 Token found, adding to request headers');
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.log('⚠️ No authentication token found in localStorage');
  }
  return config;
});

// Intercepteur de logs pour les requêtes
api.interceptors.request.use(
  (config) => {
    console.log('📤 API Request:', {
      url: config.url,
      fullUrl: `${config.baseURL}${config.url}`,
      method: config.method,
      headers: config.headers,
      data: config.data,
      params: config.params,
      timestamp: new Date().toISOString()
    });
    return config;
  },
  (error) => {
    console.error('📤 API Request Error:', {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    return Promise.reject(error);
  }
);

// Intercepteur de logs pour les réponses
api.interceptors.response.use(
  (response) => {
    console.log('📥 API Response Success:', {
      url: response.config.url,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      dataType: typeof response.data,
      dataPreview: typeof response.data === 'object' ? 
        (Array.isArray(response.data) ? 
          `Array(${response.data.length})` : 
          Object.keys(response.data).slice(0, 3).join(', ') + (Object.keys(response.data).length > 3 ? '...' : '')) : 
        typeof response.data,
      timing: `${Date.now() - new Date(response.config.timestamp || Date.now()).getTime()}ms`,
      timestamp: new Date().toISOString()
    });
    return response;
  },
  (error) => {
    console.error('📥 API Response Error:', {
      url: error.config?.url,
      method: error.config?.method,
      message: error.message,
      name: error.name,
      code: error.code,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.response?.headers,
      timing: error.config?.timestamp ? 
        `${Date.now() - new Date(error.config.timestamp).getTime()}ms` : 
        'unknown',
      timestamp: new Date().toISOString()
    });
    
    // Log détaillé pour erreur 500
    if (error.response?.status === 500) {
      console.error('🚨 SERVER ERROR 500:', {
        endpoint: error.config?.url,
        requestData: error.config?.data,
        responseData: error.response?.data,
        headers: error.config?.headers,
        message: 'Une erreur serveur s\'est produite. Vérifiez les logs du serveur pour plus de détails.'
      });
    }
    
    return Promise.reject(error);
  }
);

// Activer cette option facilite le débogage en cas d'erreur réseau
axios.defaults.timeoutErrorMessage = 'La requête a expiré. Vérifiez votre connexion réseau ou si le serveur est en ligne.';
