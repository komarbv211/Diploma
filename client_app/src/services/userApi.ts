// userApi.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseQuery } from '../utilities/createBaseQuery';
import { IUserCreateDTO, IUserDTO, IUserUpdateDTO } from '../types/user';

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
    updateUser: builder.mutation<void, IUserUpdateDTO>({
      query: (user) => ({
        url: '',
        method: 'PUT',
        body: user,
      }),
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
