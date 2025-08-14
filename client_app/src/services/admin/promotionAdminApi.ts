import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseQueryWithReauth } from '../../utilities/createBaseQuery';
import { IPromotion } from '../../types/promotion';

export const promotionAdminApi = createApi({
    reducerPath: 'promotionAdminApi',
    baseQuery: createBaseQueryWithReauth('admin/promotion'),
    tagTypes: ['Promotions'],
    endpoints: (builder) => ({
        getAllPromotions: builder.query<IPromotion[], void>({
            query: () => '',
            providesTags: ['Promotions'],
        }),

        getPromotionById: builder.query<IPromotion, number>({
            query: (id) => `${id}`,
            providesTags: (_result, _error, id) => [{ type: 'Promotions', id }],
        }),

        createPromotion: builder.mutation<IPromotion, FormData>({
            query: (newPromotion) => ({
                url: '',
                method: 'POST',
                body: newPromotion,
            }),
            invalidatesTags: ['Promotions'],
        }),

        updatePromotion: builder.mutation<void, { id: number; formData: FormData }>( {
            query: ({formData }) => ({
                url: '',  // видаляємо id з URL
                method: 'PUT',
                body: formData,
            }),
            invalidatesTags: ['Promotions'],
        }),


        deletePromotion: builder.mutation<void, number>({
            query: (id) => ({
                url: `${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Promotions'],
        }),
    }),
});

export const {
    useGetAllPromotionsQuery,
    useGetPromotionByIdQuery,
    useCreatePromotionMutation,
    useUpdatePromotionMutation,
    useDeletePromotionMutation,
} = promotionAdminApi;
