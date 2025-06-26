import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseQuery } from '../../utilities/createBaseQuery';
import { IProduct, IProductPutRequest } from '../../types/product';

export const productAdminApi = createApi({
    reducerPath: 'productAdminApi',
    baseQuery: createBaseQuery('admin'),
    tagTypes: ['Products'],
    endpoints: (builder) => ({
        createProduct: builder.mutation<IProduct, FormData>({
            query: (newProd) => ({
                url: 'product',
                method: 'POST',
                body: newProd,
            }),
            invalidatesTags: ["Products"],
        }),
        updateProduct: builder.mutation<IProduct, IProductPutRequest>({
            query: ({ ...upd }) => ({
                url: `product`,
                method: 'PUT',
                body: upd,
            }),
            invalidatesTags: ["Products"],
        }),
        deleteProduct: builder.mutation<void, number>({
            query: (id) => ({
                url: `product/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ["Products"],
        }),
    }),
});

export const {
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
} = productAdminApi;
