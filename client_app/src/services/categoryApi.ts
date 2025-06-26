import { createApi} from '@reduxjs/toolkit/query/react';
import { ICategory, ICategoryName } from '../types/category';
import { createBaseQuery } from '../utilities/createBaseQuery';

export const categoryApi = createApi({
    reducerPath: 'categoryApi',
    baseQuery: createBaseQuery('category'),
    tagTypes: ['Categories'],
    endpoints: (builder) => ({
        getCategoryTree: builder.query<ICategory[], void>({
            query: () => '',
            providesTags: ['Categories'],
        }),
        getCategoryById: builder.query<ICategory, number>({
            query: (id) => `${id}`, 
            providesTags: ['Categories'],
        }),
        getRootCategories: builder.query<ICategory[], void>({
            query: () => 'root',
            providesTags: ['Categories'],
        }),
        getChildrenById: builder.query<ICategory[], number>({
            query: (parentId) => `children/${parentId}`,
            providesTags: ['Categories'],
        }),
        getCategoriesNames: builder.query<ICategoryName[], void>({
            query: () => `names`,
            providesTags: ['Categories'],
        }),
    }),
});

export const { 
    useGetCategoryTreeQuery, 
    useGetCategoryByIdQuery,
    useGetRootCategoriesQuery, 
    useGetChildrenByIdQuery, 
    useGetCategoriesNamesQuery
} = categoryApi;
