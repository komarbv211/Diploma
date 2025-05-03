// authApi.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import { IAuthResponse, IUserLoginRequest, IUserRegisterRequest } from '../types/account';
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
    loginUser: builder.mutation<IAuthResponse, IUserLoginRequest>({
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
                if (data.accessToken) {
                    dispatch(setCredentials({ token: data.accessToken, refreshToken: data.refreshToken}));
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
    confirmGoogleLogin: builder.mutation<IAuthResponse, FormData>({
      query: (formData) => ({
          url: 'login/google',
          method: 'POST',
          body: formData,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
          const { data } = await queryFulfilled;
          if (data.accessToken) {
              dispatch(setCredentials({
                  token: data.accessToken,
                  refreshToken: data.refreshToken,
              }));
          }
      },
      invalidatesTags: ['AuthUser'],
    }),  
    confirmGoogleRegister: builder.mutation<IAuthResponse, FormData>({
      query: (formData) => ({
          url: 'register/google',
          method: 'POST',
          body: formData,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
          const { data } = await queryFulfilled;
          if (data.accessToken) {
              dispatch(setCredentials({
                  token: data.accessToken,
                  refreshToken: data.refreshToken,
              }));
          }
      },
      invalidatesTags: ['AuthUser'],
    }),  
  }),
});

export const {
    useRegisterUserMutation,
    useLoginUserMutation,
    useConfirmGoogleLoginMutation,
    useConfirmGoogleRegisterMutation,
} = authApi;
