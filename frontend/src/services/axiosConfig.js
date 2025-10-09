import axios from 'axios'

const API = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL
})

// Interceptor to add the auth token to every request
API.interceptors.request.use((config) => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo && userInfo.token) {
        config.headers.Authorization = `Bearer ${userInfo.token}`;
    }
    return config;
});

export default API;