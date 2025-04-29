import { createApi } from '@reduxjs/toolkit/query/react';
import { AuthResponse, IUserRegisterRequest, LoginGoogleRequest, IUserLoginRequest } from '../interfaces/account';
import { createBaseQuery } from '../utilities/createBaseQuery';
import { setCredentials } from '../store/slices/userSlice';

export const authApi = createApi({
    reducerPath: 'accountApi',
    baseQuery: createBaseQuery('Accounts'),
    tagTypes: ['AuthUser'],
    endpoints: (builder) => ({
        registerUser: builder.mutation<void, IUserRegisterRequest>({
            query: (userRegister) => ({
                url: 'register',
                method: 'POST',
                body: userRegister,
            }),
            invalidatesTags: ['AuthUser'],
        }),
        loginUser: builder.mutation<AuthResponse, IUserLoginRequest>({
            query: (loginCredentials) => {
                console.log('Відправка запиту логіну:', loginCredentials);
                return {
                    url: 'login',
                    method: 'POST',
                    body: loginCredentials,
                };
            },
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    console.log('Успішна відповідь логіну:', data);
                    if (data?.token) {
                        dispatch(setCredentials({ token: data.token }));
                    }
                } catch (error) {
                    const typedError = error as { status?: number | string; data?: { message?: string } };
                    console.error('Помилка логіну:', {
                        status: typedError?.status,
                        data: typedError?.data,
                        error,
                    });
                    // Не кидаємо помилку, щоб компонент міг обробити її через unwrap
                }
            },
            invalidatesTags: ['AuthUser'],
        }),
        googleLoginUser: builder.mutation<AuthResponse, LoginGoogleRequest>({
            query: (userGoogle) => ({
                url: 'google-login',
                method: 'POST',
                body: userGoogle,
            }),
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    console.log('Google auth user:', _arg);
                    console.log('Google auth response:', data);
                    if (data?.token) {
                        dispatch(setCredentials({ token: data.token }));
                    }
                } catch (error) {
                    const typedError = error as { status?: number | string; data?: { message?: string } };
                    console.error('Google login failed:', {
                        status: typedError?.status,
                        data: typedError?.data,
                        error,
                    });
                    // Не кидаємо помилку, щоб компонент міг обробити її через unwrap
                }
            },
            invalidatesTags: ['AuthUser'],
        }),
    }),
});

export const {
    useRegisterUserMutation,
    useLoginUserMutation,
    useGoogleLoginUserMutation,
} = authApi;