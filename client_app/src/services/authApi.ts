// authApi.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import { IAuthResponse, IGoogleLoginRequest, IUserRegisterRequest } from '../types/account';
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
  useGoogleLoginUserMutation,
} = authApi;
