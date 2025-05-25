import axios, { AxiosInstance } from "axios";
import { getToken } from './getToken';
import router from 'next/router';
import Cookies from 'js-cookie';

const baseURL = 'http://localhost:3001/';

// Crea una instancia de Axios
const api: AxiosInstance = axios.create({
  baseURL,
});

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add an interceptor to the custom instance
api.interceptors.response.use(
  (response: any) => {
    response.ok = response.status >= 200 && response.status < 300;
    return response;
  },
  (error: any) => {
    // Handle error responses here
    if (error.response.status === 401) {
     Cookies.remove('unsisToken');
      router.push('/');
    }

    return Promise.reject(error);
  }
);

export default api;
