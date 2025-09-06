import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseQueryWithReauth } from '../utilities/createBaseQuery';
import { ReviewItemProduct, ReviewProductRequest } from '../types/review';



export const productCommentsApi = createApi({
  reducerPath: 'productCommentsApi',
  baseQuery: createBaseQueryWithReauth('Comment'),
  tagTypes: ['Comments'],
  endpoints: (builder) => ({
    // ✅ правильний GET-запит
    getCommentsByProductId: builder.query<ReviewItemProduct[], number>({
      query: (productId) => ({
        url: `GetByProduct/${productId}`,
        method: 'GET /api/products/search?brandIds=1&brandIds=2&brandIds=3',
      }),
      providesTags: ['Comments'],
    }),

    // ✅ POST-запит для створення коментаря
    reviewProduct: builder.mutation<void, ReviewProductRequest>({
      query: ({ productId, userId, text }) => ({
        url: 'Create',
        method: 'POST',
        body: { productId, userId, text },
      }),
      invalidatesTags: ['Comments'],
    }),
  }),
});

// hooks
export const { 
  useGetCommentsByProductIdQuery, 
  useReviewProductMutation 
} = productCommentsApi;
