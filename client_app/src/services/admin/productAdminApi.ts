import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseQuery } from '../../utilities/createBaseQuery';
import { IProduct, IProductPutRequest } from '../../types/product';
import { serializeProduct } from '../../utilities/serialize';

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
    query: (updatedProduct) => {
        try {
            const formData = serializeProduct(updatedProduct);
            return {
                url: `product`,
                method: 'PUT',
                body: formData,
            };
        } catch {
            throw new Error("Error serializing the product data.");
        }
    },
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
