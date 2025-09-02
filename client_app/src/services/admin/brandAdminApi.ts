import { createApi} from '@reduxjs/toolkit/query/react';
import { createBaseQueryWithReauth } from '../../utilities/createBaseQuery';
import { serialize } from 'object-to-formdata';
import { IBrand, IBrandPostRequest, IBrandPutRequest } from '../../types/brand';


export const brandAdminApi = createApi({
    reducerPath: 'brandAdminApi',
    baseQuery: createBaseQueryWithReauth('admin'),
    tagTypes: ['Brands'],
    endpoints: (builder) => ({  
        getBrands: builder.query<IBrand[], void>({
                    query: () => 'brand',
                    providesTags: ['Brands'],
                }),
        getBrandByID: builder.query<IBrand, number>({
            query: (id) => `brand/${id}`,
            providesTags: ['Brands'],
        }),     
        createBrand: builder.mutation<IBrand, IBrandPostRequest>({
            query: (newCategory) => {
                try {
                    const formData = serialize(newCategory);
                    return {
                        url: 'brand',
                        method: 'POST',
                        body: formData,
                    }
                } catch {
                    throw new Error("Error serializing the form data.");
                }
            },
            invalidatesTags: ["Brands"],
        }),
        updateBrand: builder.mutation<IBrand, IBrandPutRequest>({
            query: ({...updatedCategory }) => {
                try {
                    const formData = serialize(updatedCategory);
                    return {
                        url: `brand`,
                        method: 'PUT', 
                        body: formData,
                    };
                } catch {
                    throw new Error("Error serializing the form data.");
                }
            },
            invalidatesTags: ["Brands"],
        }), 
        deleteBrand: builder.mutation<{ success: boolean }, number>({
            query: (id) => ({
                url: `brand/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ["Brands"],
        }), 
    }),
});

export const { 
  useGetBrandByIDQuery,
  useGetBrandsQuery,
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation
} = brandAdminApi;
