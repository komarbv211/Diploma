import { createApi } from '@reduxjs/toolkit/query/react'
import { AuthResponse, IUserLoginRequest, IUserRegisterRequest, LoginGoogleRequest } from '../interfaces/account';
import { createBaseQuery } from '../utilities/createBaseQuery';
import { setCredentials } from '../store/slices/userSlice';

export const authApi = createApi({
    reducerPath: 'accountApi',
    baseQuery: createBaseQuery('Accounts'),
    tagTypes: ['AuthUser'],
    endpoints: (builder) => ({
        registerUser: builder.mutation<void, IUserRegisterRequest>({
            query: (userRegister) => ({
                url: "register",
                method: "POST",
                body: userRegister,
            }),
            invalidatesTags: ["AuthUser"],
        }),
        googleLoginUser: builder.mutation<AuthResponse, LoginGoogleRequest>({
            query: (userGoogle) => ({
                url: "google-login",
                method: "POST",
                body: userGoogle,
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const result = await queryFulfilled;
                    console.log("Google auth user", arg);
                    if (result.data && result.data.token) {
                        dispatch(setCredentials({ token: result.data.token }));
                    }
                } catch (error) {
                    console.error('Login failed:', error);
                }
            },
        }),
        loginUser: builder.mutation<AuthResponse, IUserLoginRequest>({
            query: (credentials) => ({
                url: 'login',
                method: 'POST',
                body: credentials,
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const result = await queryFulfilled;
                    console.log("User:", arg);
                    if (result.data?.token && result.data?.user) {
                        dispatch(setCredentials({
                            token: result.data.token,
                            user: result.data.user
                        }));
                    }
                } catch (error) {
                    console.error('Login failed:', error);
                }
            },
        }),
        
    }),
});

export const {
    useRegisterUserMutation,
    useGoogleLoginUserMutation,
    useLoginUserMutation
} = authApi;
