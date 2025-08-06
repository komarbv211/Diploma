import { BaseQueryApi, FetchArgs, fetchBaseQuery } from '@reduxjs/toolkit/query'
import { APP_ENV } from '../env'
import { RootState } from '../store/store'; 
import { Mutex } from 'async-mutex';
import { setCredentials} from '../store/slices/userSlice';
import { logOut } from '../store/slices/userSlice';

export const createBaseQuery = (endpoint: string) => {
    return fetchBaseQuery({
        baseUrl: `${APP_ENV.REMOTE_BASE_URL}/api/${endpoint}/`,
        credentials: "include", // щоб refreshToken з cookie передавався автоматично 
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).account.token;
            if (token && token.length > 0) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    });
};

const mutex = new Mutex();

export const createBaseQueryWithReauth = (endpoint: string) => {
    const baseQuery = createBaseQuery(endpoint);

    return async (
        args: string | FetchArgs,
        api: BaseQueryApi,
        extraOptions: Record<string, unknown>
    ) => {
        await mutex.waitForUnlock();
        let result = await baseQuery(args, api, extraOptions);

        if (result.error && result.error.status === 401) {
            console.warn('[AUTH] 401 detected, trying refresh...');
            if (!mutex.isLocked()) {
                const release = await mutex.acquire();
                try {
                    // Спроба оновити токен
                    const refreshBaseQuery = createBaseQuery('accounts');
                    const refreshResult = await refreshBaseQuery(
                        { url: 'refresh', method: 'POST' },
                        api,
                        extraOptions
                    );
                    console.log('[AUTH] Refresh response:', refreshResult);

                    if ((refreshResult.data as { accessToken?: string })?.accessToken) {
                        console.log('[AUTH] Refresh success, updating token...');
                        api.dispatch(setCredentials({ token: (refreshResult.data as { accessToken: string }).accessToken }));
                        result = await baseQuery(args, api, extraOptions);
                    } else {
                        console.warn('[AUTH] Refresh failed, logging out...');
                        api.dispatch(logOut());
                    }
                } finally {
                    release();
                }
            } else {
                await mutex.waitForUnlock();
                result = await baseQuery(args, api, extraOptions);
            }
        }
        return result;
    };
};