import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseQueryWithReauth } from '../../utilities/createBaseQuery';
import { IProduct, IProductPutRequest } from '../../types/product';
import { serializeProduct } from '../../utilities/serialize';

export const productAdminApi = createApi({
    reducerPath: 'productAdminApi',
    baseQuery: createBaseQueryWithReauth('admin'),
    tagTypes: ['Products'],
    endpoints: (builder) => ({
        getAllProducts: builder.query<IProduct[], void>({
            query: () => 'product',
            providesTags: ['Products'],
        }),

        getProductById: builder.query<IProduct, number>({
            query: (id) => `product/${id}`, 
            providesTags: ['Products'],
        }),

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
    useGetAllProductsQuery, 
    useGetProductByIdQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
} = productAdminApi;
