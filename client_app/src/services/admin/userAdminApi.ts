// userAdminApi.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseQueryWithReauth } from '../../utilities/createBaseQuery';
import {
  IUserCreateDTO,
  IUserMessageDTO,
  UserBlockDTO,
  PagedRequestDto,
  PagedResultDto
} from '../../types/user';
import { IUser } from '../../types/user';

export const userAdminApi = createApi({
  reducerPath: 'userAdminApi',
  baseQuery: createBaseQueryWithReauth('admin/user'),
  tagTypes: ['Users'],
  endpoints: (builder) => ({
    getAllUsers: builder.query<
        PagedResultDto<IUser>,
        PagedRequestDto & { searchName?: string; searchRoles?: string; startDate?: string; endDate?: string; dateField?: string }
    >({
      query: ({ page, pageSize, sortBy, sortDesc, searchName, searchRoles, startDate, endDate, dateField }) => {
        const params = new URLSearchParams();
        params.append('Page', `${page}`);
        params.append('ItemPerPage', `${pageSize}`);
        if (sortBy) params.append('SortBy', sortBy);
        if (sortDesc !== undefined) params.append('SortDesc', sortDesc.toString());
        if (searchName && searchName.trim() !== '') params.append('Name', searchName.trim());
        if (searchRoles && searchRoles.trim() !== '') params.append('Roles', searchRoles.trim());
        if (startDate) params.append('StartDate', startDate);
        if (endDate) params.append('EndDate', endDate);
        if (dateField) params.append('DateField', dateField);

        return {
          url: 'search',
          method: 'GET',
          params: Object.fromEntries(params.entries()),
        };
      },
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

    sendMessageToUser: builder.mutation<string, IUserMessageDTO>({
      query: (message) => ({
        url: 'send-message',
        method: 'POST',
        body: message,
        responseHandler: (response) => response.text(),
      }),
    }),

    // 🔒 Блокування користувача
    blockUser: builder.mutation<void, UserBlockDTO>({
      query: (dto) => ({
        url: 'block',
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['Users'],
    }),

    promoteUserToAdmin: builder.mutation<void, { id: number }>({
      query: ({ id }) => ({
        url: `${id}/promote-to-admin`,
        method: 'POST',
      }),
      invalidatesTags: ['Users'], // оновлюємо список користувачів після зміни ролі
    }),


    // 🔓 Розблокування користувача
    unblockUser: builder.mutation<void, { id: number }>({
      query: ({ id }) => ({
        url: `${id}/unblock`,
        method: 'POST',
      }),
      invalidatesTags: ['Users'],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useSendMessageToUserMutation,
  useCreateUserMutation,
  useBlockUserMutation,
  useUnblockUserMutation,
  usePromoteUserToAdminMutation, // <-- новий хук
} = userAdminApi;

