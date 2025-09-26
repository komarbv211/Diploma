import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseQueryWithReauth } from '../utilities/createBaseQuery';
import { IUserDTO, IUserListResponse } from '../types/user';
import { handleAuthQueryStarted } from '../utilities/handleAuthQueryStarted.ts';
import { IAuthResponse } from '../types/account.ts';
import { userAdminApi } from './admin/userAdminApi.ts';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: createBaseQueryWithReauth('User'),
  tagTypes: ['Users'],
  endpoints: (builder) => ({
    getAllUsers: builder.query<IUserListResponse, {
      page: number;
      pageSize: number;
      sortBy?: string;
      sortDesc?: boolean;
    }>({
      query: ({ page, pageSize, sortBy, sortDesc }) => {
        const params = new URLSearchParams();
        params.append('Page', page.toString());
        params.append('ItemPerPAge', pageSize.toString());
        if (sortBy) params.append('SortBy', sortBy);
        if (sortDesc !== undefined) params.append('SortDesc', sortDesc.toString());

        return {
          url: `search`,
          method: 'GET',
          params,
        };
      },
      providesTags: ['Users'],
    }),

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
    updateUser: builder.mutation<IAuthResponse, FormData>({
      query: (formData) => ({
        url: '',
        method: 'PUT',
        body: formData,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          // 🔑 оновлюємо токен і userSlice (handleAuthQueryStarted)
          await handleAuthQueryStarted(arg, { dispatch, queryFulfilled });

          // 🔄 інвалідація тегів у userApi
          dispatch(userApi.util.invalidateTags(['Users']));

          // 🔄 інвалідація тегів у userAdminApi
          dispatch(userAdminApi.util.invalidateTags(['Users']));
        } catch (error) {
          console.error("updateUser error:", error);
        }
      },
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
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;

