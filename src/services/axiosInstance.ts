import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://updated-backend-sqlite-no-env.fly.dev',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to log requests
axiosInstance.interceptors.request.use(
    (config) => {
        console.log('Request:', config);
        return config;
    },
    (error) => {
        console.error('Request Error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor to log responses
axiosInstance.interceptors.response.use(
    (response) => {
        console.log('Response:', response);
        return response;
    },
    (error) => {
        console.error('Response Error:', error.response || error.message || error);
        return Promise.reject(error);
    }
);

export default axiosInstance;