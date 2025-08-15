// // userAdminApi.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseQueryWithReauth } from '../../utilities/createBaseQuery';
import { IUserCreateDTO, IUserMessageDTO, PagedRequestDto, PagedResultDto } from '../../types/user';
import { IUser } from '../../types/user';

export const userAdminApi = createApi({
  reducerPath: 'userAdminApi',
  baseQuery: createBaseQueryWithReauth('admin/user'),
  tagTypes: ['Users'],
  endpoints: (builder) => ({
    getAllUsers: builder.query<PagedResultDto<IUser>, PagedRequestDto & { searchName?: string,
       searchRoles?: string, startDate?: string, endDate?:string, dateField?: string }>({      
      query: ({ page, pageSize = 5, sortBy, sortDesc, searchName, searchRoles, startDate, endDate,dateField  }) => {

        console.log("search role", searchRoles)
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
          params: Object.fromEntries(params.entries()),  // <--- ключова зміна тут
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
        responseHandler: (response) => response.text(), // 👈 повертаємо текст
      }),
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useSendMessageToUserMutation,
  useCreateUserMutation,
} = userAdminApi;
