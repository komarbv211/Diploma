import { createApi } from '@reduxjs/toolkit/query/react';
import {
    IAuthResponse,
    IGoogleLoginRequest,
    IGoogleRegister,
    IUserLoginRequest,
    IUserRegisterRequest,
    IForgotPasswordRequest,
    IResetPasswordRequest
} from '../types/account';
import { createBaseQuery } from '../utilities/createBaseQuery';
import { handleAuthQueryStarted } from '../utilities/handleAuthQueryStarted';
import { serialize } from 'object-to-formdata';


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
            query: (loginCredentials) => ({
                url: 'login',
                method: 'POST',
                body: loginCredentials,
            }),
            onQueryStarted: handleAuthQueryStarted,
            invalidatesTags: ['AuthUser'],
        }),

        confirmGoogleLogin: builder.mutation<IAuthResponse, IGoogleLoginRequest>({
            query: (data) => ({
                url: 'login/google',
                method: 'POST',
                body: serialize(data),
            }),
            onQueryStarted: handleAuthQueryStarted,
            invalidatesTags: ['AuthUser'],
        }),

        confirmGoogleRegister: builder.mutation<IAuthResponse, IGoogleRegister>({
            query: (data) => ({
                url: 'register/google',
                method: 'POST',
                body: serialize(data),
            }),
            onQueryStarted: handleAuthQueryStarted,
            invalidatesTags: ['AuthUser'],
        }),

        checkGoogleRegistered: builder.query<{ isGoogleUser: boolean }, string>({
            query: (email) => ({
                url: `is-registered-google?email=${encodeURIComponent(email)}`,
                method: 'GET',
            }),
        }),

        forgotPassword: builder.mutation<void, IForgotPasswordRequest>({
            query: (data) => ({
                url: 'forgot-password',
                method: 'POST',
                body: { Email: data.email },
            }),
        }),

        resetPassword: builder.mutation<void, IResetPasswordRequest>({
            query: (data) => ({
                url: 'reset-password',
                method: 'POST',
                body: {
                    Email: data.email,
                    Token: data.token,
                    Password: data.password,
                },
            }),
            invalidatesTags: ['AuthUser'],
        }),
    }),
});

export const {
    useRegisterUserMutation,
    useLoginUserMutation,
    useConfirmGoogleLoginMutation,
    useConfirmGoogleRegisterMutation,
    useLazyCheckGoogleRegisteredQuery,
    useForgotPasswordMutation,
    useResetPasswordMutation,
} = authApi;