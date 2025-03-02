import axios from 'axios';
import { BASE_URL } from '@/env/config';
import store from '@/store';

const api = axios.create({
   baseURL: BASE_URL,
   timeout: 30000, 
});

api.interceptors.request.use(
    config => {
        const token = store.getters.token;

        if (token) {
            config.headers['Authorization'] = token;
        }
        
        return config;
    },
    error => Promise.reject(error),
);

api.interceptors.response.use(
    response => response.data,
    async (error) => {
        const { config, response } = error;

        if (response) {
            if (response.config?.headers?.['skip-auth']) {
                return Promise.reject(response.data);
            }

            if (response.status === 401 && !config.retry) {
                config.retry = true;
                try {
                    await store.dispatch('autoSignin');
                    const token = store.getters.token;
                    config.headers['Authorization'] = token;
                    return api(config);
                } catch (error) {
                    return Promise.reject(error.response?.data || error);
                }
            }

            return Promise.reject(response.data);
        }

        return Promise.reject(error);
    },
);

export default api;