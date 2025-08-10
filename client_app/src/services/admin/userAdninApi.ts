// // userApi.ts
// import { createApi } from '@reduxjs/toolkit/query/react';
// import { createBaseQueryWithReauth } from '../../utilities/createBaseQuery';
// import { PagedRequestDto, PagedResultDto } from '../../types/user';
// import { IUser } from '../../types/account';

// export const userAdminApi = createApi({
//   reducerPath: 'userAdminApi',
//   baseQuery: createBaseQueryWithReauth('admin'),
//   tagTypes: ['Users'],
//   endpoints: (builder) => ({
//     getAllUsers: builder.query<PagedResultDto<IUser>, PagedRequestDto>({
//       query: ({ page = 1, pageSize = 10 }) => ({
//         url: 'user/users',
//         method: 'GET',
//         params: { page, pageSize },
//       }),
//       providesTags: ['Users'],
//     }),    
//   }),
// });

// export const {
//   useGetAllUsersQuery,  
// } = userAdminApi;


// 



import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseQueryWithReauth } from '../../utilities/createBaseQuery';
import { PagedRequestDto, PagedResultDto } from '../../types/user';
import { IUser } from '../../types/account';

export const userAdminApi = createApi({
  reducerPath: 'userAdminApi',
  baseQuery: createBaseQueryWithReauth('admin'),
  tagTypes: ['Users'],
  endpoints: (builder) => ({
    getAllUsers: builder.query<PagedResultDto<IUser>, PagedRequestDto & { searchName?: string }>({

      
      query: ({ page = 1, pageSize = 10, sortBy, sortDesc, searchName }) => {
        const params = new URLSearchParams();
        params.append('Page', page.toString());
        params.append('ItemPerPAge', pageSize.toString());  // саме так, як очікує бекенд
        if (sortBy) params.append('SortBy', sortBy);
        if (sortDesc !== undefined) params.append('SortDesc', sortDesc.toString());
        if (searchName && searchName.trim() !== '') params.append('Name', searchName.trim());

        return {
          url: 'user/search',
          method: 'GET',
          params: Object.fromEntries(params.entries()),  // <--- ключова зміна тут
        };
      },
      providesTags: ['Users'],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
} = userAdminApi;


// import { createApi } from '@reduxjs/toolkit/query/react';
// import { createBaseQueryWithReauth } from '../../utilities/createBaseQuery';
// import { PagedRequestDto, PagedResultDto } from '../../types/user';
// import { IUser } from '../../types/account';

// // Розширюємо PagedRequestDto додатковими параметрами сортування
// interface UserPagedRequestDto extends PagedRequestDto {
//   sortBy?: string;
//   sortDesc?: boolean;
// }

// export const userAdminApi = createApi({
//   reducerPath: 'userAdminApi',
//   baseQuery: createBaseQueryWithReauth('admin'),
//   tagTypes: ['Users'],
//   endpoints: (builder) => ({
//     getAllUsers: builder.query<PagedResultDto<IUser>, UserPagedRequestDto>({
//       query: ({ page = 1, pageSize = 10, sortBy, sortDesc }) => {
//         const params: Record<string, string> = {
//           page: page.toString(),
//           pageSize: pageSize.toString(),
//         };
//         if (sortBy) params.sortBy = sortBy;
//         if (sortDesc !== undefined) params.sortDesc = sortDesc.toString();

//         return {
//           url: 'user/users',
//           method: 'GET',
//           params,
//         };
//       },
//       providesTags: ['Users'],
//     }),
//   }),
// });

// export const {
//   useGetAllUsersQuery,
// } = userAdminApi;
