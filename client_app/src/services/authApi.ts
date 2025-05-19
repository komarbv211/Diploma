import { createApi } from '@reduxjs/toolkit/query/react';
import { IAuthResponse, IUserLoginRequest, IUserRegisterRequest } from '../types/account';
import { createBaseQuery } from '../utilities/createBaseQuery';
import { handleAuthQueryStarted } from '../utilities/handleAuthQueryStarted';

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
        onQueryStarted: handleAuthQueryStarted,
        invalidatesTags: ['AuthUser'],
    }),
    confirmGoogleLogin: builder.mutation<IAuthResponse, FormData>({
      query: (formData) => ({
          url: 'login/google',
          method: 'POST',
          body: formData,
      }),
        onQueryStarted: handleAuthQueryStarted,
      invalidatesTags: ['AuthUser'],
    }),  
    confirmGoogleRegister: builder.mutation<IAuthResponse, FormData>({
        query: (formData) => ({
            url: 'register/google',
            method: 'POST',
            body: formData,
        }),   
        onQueryStarted: handleAuthQueryStarted,
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
