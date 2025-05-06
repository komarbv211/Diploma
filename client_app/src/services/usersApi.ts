import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseQuery } from '../utilities/createBaseQuery';
import { IUser } from '../interfaces/account';
import { IUserDTO } from '../interfaces/user';

export const usersApi = createApi({
    reducerPath: 'usersApi',
    baseQuery: createBaseQuery('User'),
    tagTypes: ['Users'],
    endpoints: (builder) => ({
        getUsers: builder.query<IUser[], void>({
            query: () => ({
                url: 'users',
                method: 'GET',
            }),
            providesTags: ['Users'],
        }),
        getUserById: builder.query<IUserDTO, string | number>({
            query: (id) => ({
                url: `${id}`,
                method: 'GET',
            }),
            providesTags: (_, __, id) => [{ type: 'Users', id }],
        }),
    }),
});

export const { useGetUsersQuery, useGetUserByIdQuery } = usersApi;
