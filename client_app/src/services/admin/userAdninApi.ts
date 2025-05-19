// userApi.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseQuery } from '../../utilities/createBaseQuery';
import { IUserDTO } from '../../types/user';

export const userAdminApi = createApi({
  reducerPath: 'userAdminApi',
  baseQuery: createBaseQuery('admin'),
  tagTypes: ['Users'],
  endpoints: (builder) => ({
    getAllUsers: builder.query<IUserDTO[], void>({
      query: () => ({
        url: 'user/users',
        method: 'GET',
      }),
      providesTags: ['Users'],
    }),    
  }),
});

export const {
  useGetAllUsersQuery,  
} = userAdminApi;
