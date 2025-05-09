import { fetchBaseQuery } from '@reduxjs/toolkit/query'
import { APP_ENV } from '../env'
import { RootState } from '../store/store'; 

export const createBaseQuery = (endpoint: string) => {
    return fetchBaseQuery({
        baseUrl: `${APP_ENV.REMOTE_BASE_URL}/api/${endpoint}/`,
        prepareHeaders: (headers, { getState }) => {
            // Отримуємо токен з Redux-сховища
            const token = (getState() as RootState).user.token; 
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },        
    });
};
