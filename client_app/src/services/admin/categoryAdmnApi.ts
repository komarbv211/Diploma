import { createApi} from '@reduxjs/toolkit/query/react';
import { createBaseQuery } from '../../utilities/createBaseQuery';
import { ICategory, ICategoryPostRequest, ICategoryPutRequest } from '../../types/category';
import { serialize } from 'object-to-formdata';


export const categoryAdminApi = createApi({
    reducerPath: 'categoryAdminApi',
    baseQuery: createBaseQuery('admin'),
    tagTypes: ['Categories'],
    endpoints: (builder) => ({  
        getCategoryByID: builder.query<ICategory, number>({
            query: (id) => `category/${id}`,
            providesTags: ['Categories'],
        }),     
        createCategory: builder.mutation<ICategory, ICategoryPostRequest>({
            query: (newCategory) => {
                try {
                    const formData = serialize(newCategory);
                    return {
                        url: 'category',
                        method: 'POST',
                        body: formData,
                    }
                } catch {
                    throw new Error("Error serializing the form data.");
                }
            },
            invalidatesTags: ["Categories"],
        }),
        updateCategory: builder.mutation<ICategory, ICategoryPutRequest>({
            query: ({...updatedCategory }) => {
                try {
                    const formData = serialize(updatedCategory);
                    return {
                        url: `category`,
                        method: 'PUT', 
                        body: formData,
                    };
                } catch {
                    throw new Error("Error serializing the form data.");
                }
            },
            invalidatesTags: ["Categories"],
        }), 
        deleteCategory: builder.mutation<{ success: boolean }, number>({
            query: (id) => ({
                url: `category/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ["Categories"],
        }), 
        
        getCategoryTree: builder.query<ICategory[], void>({
            query: () => 'category',
            providesTags: ['Categories'],
        }),
        getRootCategories: builder.query<ICategory[], void>({
            query: () => 'category/root',
            providesTags: ['Categories'],
        }),
        getChildrenById: builder.query<ICategory[], number>({
            query: (parentId) => `category/children/${parentId}`,
            providesTags: ['Categories'],
        }),
        getCategoriesNames: builder.query<ICategoryName[], void>({
            query: () => `category/names`,
            providesTags: ['Categories'],
        }),
    }),
});

export const {   
    useGetCategoryByIDQuery,  
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
    useGetCategoryTreeQuery,
    useGetRootCategoriesQuery,
    useGetChildrenByIdQuery,
    useGetCategoriesNamesQuery,
} = categoryAdminApi;
