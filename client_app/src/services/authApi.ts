
// authApi.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import { IAuthResponse, IGoogleLoginRequest, IUserLoginRequest, IUserRegisterRequest } from '../types/account';
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

    googleLoginUser: builder.mutation<IAuthResponse, IGoogleLoginRequest>({
      query: (data) => ({
        url: `login/google?googleAccessToken=${data.googleAccessToken}`,
        method: 'POST',
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          console.log("Google auth user", arg);
          if (result.data?.accessToken) {
            dispatch(
              setCredentials({
                token: result.data.accessToken,
                refreshToken: result.data.refreshToken,                
              })
            );
          }
        } catch (error) {
          console.error('Google login failed:', error);
        }
      },
    }),
  }),
});

export const {
    useRegisterUserMutation,
    useLoginUserMutation,
    useGoogleLoginUserMutation,
} = authApi;
