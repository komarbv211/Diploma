// userApi.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseQuery } from '../utilities/createBaseQuery';
import { IUserCreateDTO, IUserDTO } from '../types/user';
import {handleAuthQueryStarted} from "../utilities/handleAuthQueryStarted.ts";
import {IAuthResponse} from "../types/account.ts";

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: createBaseQuery('User'),
  tagTypes: ['Users'],
  endpoints: (builder) => ({    
    getUserById: builder.query<IUserDTO, number>({
      query: (id) => ({
        url: `${id}`,
        method: 'GET',
      }),
      providesTags: (_, __, id) => [{ type: 'Users', id }],
    }),
    getUserByEmail: builder.query<IUserDTO, string>({
      query: (email) => ({
        url: `email`,
        params: { email },
      }),
      providesTags: ['Users'],
    }),
    createUser: builder.mutation<void, IUserCreateDTO>({
      query: (user) => ({
        url: '',
        method: 'POST',
        body: user,
      }),
      invalidatesTags: ['Users'],
    }),
    updateUser: builder.mutation<IAuthResponse, FormData>({
      query: (formData) => ({
        url: '',
        method: 'PUT',
        body: formData,
      }),
      onQueryStarted: handleAuthQueryStarted,
      invalidatesTags: ['Users'],
    }),
    deleteUser: builder.mutation<void, number>({
      query: (id) => ({
        url: `${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Users'],
    }),
  }),
});

export const {
  useGetUserByIdQuery,
  useGetUserByEmailQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;
