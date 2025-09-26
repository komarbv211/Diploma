import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseQueryWithReauth } from '../../utilities/createBaseQuery';
import { IProduct, IProductPutRequest, IProductSetPromotionRequest} from '../../types/product';
import { serializeProduct } from '../../utilities/serialize';
import { promotionAdminApi } from './promotionAdminApi';
import { productApi } from '../productApi';




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

        // 🔹 Використовуємо новий інтерфейс
        setProductPromotion: builder.mutation<{ message: string }, IProductSetPromotionRequest>({
            query: (dto) => ({
                url: 'product/set-promotion',
                method: 'PUT',
                body: dto,
            }),
            invalidatesTags: ["Products"],
            async onQueryStarted(dto, { dispatch, queryFulfilled }) {
                const patch = dispatch(
                    productAdminApi.util.updateQueryData('getAllProducts', undefined, (draft) => {
                        const product = draft.find((x) => x.id === dto.productId);
                        if (product) {
                            Object.assign(product, {
                                promotionId: dto.promotionId ?? undefined,
                                discountPercent: dto.discountPercent ?? 0
                            });
                        }
                    })
                );

                try {
                    await queryFulfilled;
                    dispatch(productApi.util.invalidateTags(["Products"]));
                    dispatch(promotionAdminApi.util.invalidateTags([{ type: 'Promotions', id: 'LIST' }]));
                } catch {
                    patch.undo();
                }
            }

        }),
    }),
});

export const {
    useGetAllProductsQuery,
    useGetProductByIdQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
    useSetProductPromotionMutation, // 🔹 додали хук
} = productAdminApi;
