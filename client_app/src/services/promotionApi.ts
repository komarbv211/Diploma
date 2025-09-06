import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseQuery } from '../utilities/createBaseQuery';
import { IPromotion } from '../types/promotion';

export const promotionApi = createApi({
    reducerPath: 'promotionApi',
    baseQuery: createBaseQuery('promotion'),
    tagTypes: ['Promotions'],
    endpoints: (builder) => ({
        getAllPromotions: builder.query<IPromotion[], void>({
        query: () => '',
        providesTags: (result) =>
            result
            ? [
                // теги для кожної акції
                ...result.map((p) => ({ type: 'Promotions' as const, id: p.id })),
                // і тег для списку
                { type: 'Promotions' as const, id: 'LIST' },
                ]
            : [{ type: 'Promotions' as const, id: 'LIST' }],
        }),
        getPromotionById: builder.query<IPromotion, number>({
            query: (id) => `${id}`,
            providesTags: (_result, _error, id) => [{ type: 'Promotions', id }],
        }),

    }),
});

export const {
    useGetAllPromotionsQuery,
    useGetPromotionByIdQuery,
} = promotionApi;
