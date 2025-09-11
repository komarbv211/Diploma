import { createApi} from '@reduxjs/toolkit/query/react';
import { IProduct, IProductSearchRequest, IProductSearchResponse } from '../types/product';
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
       getProductsByCategories: builder.query<IProduct[], number[]>({
            query: (categoryIds) => ({
                url: 'by-categories',
                method: 'POST',
                body: categoryIds,
            }),
            providesTags: ['Products'],
        }),
        searchProducts: builder.query<IProductSearchResponse, IProductSearchRequest>({
            query: (params) => {
                const searchParams = new URLSearchParams();

                Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    if (Array.isArray(value)) {
                    value.forEach(v => searchParams.append(key, String(v)));
                    } else {
                    searchParams.append(key, String(value));
                    }
                }
                });

                return `search?${searchParams.toString()}`;
            },
            providesTags: ['Products'],
        }),


    }),
});

export const { 
    useGetAllProductsQuery, 
    useGetProductByIdQuery,
    useGetProductsByCategoryQuery,
    useGetProductsByCategoriesQuery,
    useSearchProductsQuery,
} = productApi;
