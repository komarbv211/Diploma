import { createApi} from '@reduxjs/toolkit/query/react';
import { IProduct } from '../types/product';
import { createBaseQuery } from '../utilities/createBaseQuery';

export const productApi = createApi({
    reducerPath: 'productsApi',
    baseQuery: createBaseQuery('product'),
    tagTypes: ['Products'],
    endpoints: (builder) => ({
        getAllProducts: builder.query<IProduct[], void>({
            query: () => '',
            providesTags: ['Products'],
        }),
        getProductById: builder.query<IProduct, number>({
            query: (id) => `${id}`, 
            providesTags: ['Products'],
        }),
        getProductsByCategory: builder.query<IProduct[], number>({
            query: (categoryId) => `category/${categoryId}`,
            providesTags: ['Products'],
        }),
    }),
});

export const { 
    useGetAllProductsQuery, 
    useGetProductByIdQuery,
    useGetProductsByCategoryQuery,
} = productApi;
