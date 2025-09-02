// services/brandApi.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseQuery } from '../utilities/createBaseQuery';

export interface Brand {
  id: number;
  name: string;
}

export const brandApi = createApi({
  reducerPath: 'brandApi',
  baseQuery: createBaseQuery('brand'),
  endpoints: (builder) => ({
    
    getBrands: builder.query<Brand[], void>({
     query: () => ({
        url: ``,
        method: 'GET',
      }),
    }),
  }),
});


export const { useGetBrandsQuery } = brandApi;
