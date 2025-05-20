// userApi.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseQuery } from '../../utilities/createBaseQuery';
import { PagedRequestDto, PagedResultDto } from '../../types/user';
import { IUser } from '../../types/account';

export const userAdminApi = createApi({
  reducerPath: 'userAdminApi',
  baseQuery: createBaseQuery('admin'),
  tagTypes: ['Users'],
  endpoints: (builder) => ({
    getAllUsers: builder.query<PagedResultDto<IUser>, PagedRequestDto>({
      query: ({ page = 1, pageSize = 10 }) => ({
        url: 'user/users',
        method: 'GET',
        params: { page, pageSize },
      }),
      providesTags: ['Users'],
    }),    
  }),
});

export const {
  useGetAllUsersQuery,  
} = userAdminApi;
