// services/brandApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Brand {
  id: number;
  name: string;
}

export const brandApi = createApi({
  reducerPath: 'brandApi',
  baseQuery: fetchBaseQuery({
  baseUrl: 'http://localhost:5209/api', // <-- явно вказати адресу бекенду
}),
// query: () => 'brands',
//   baseQuery: fetchBaseQuery({ baseUrl: '/api' }), // ⚠️ змінити на свій базовий URL
  endpoints: (builder) => ({
    
    getBrands: builder.query<Brand[], void>({
      query: () => '/brands',
    }),
  }),
});

export const { useGetBrandsQuery } = brandApi;
