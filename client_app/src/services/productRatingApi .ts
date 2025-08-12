import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseQuery } from '../utilities/createBaseQuery';

interface RateProductRequest {
  productId: number;
  rating: number;
  userId: number;
}

export const productRatingApi = createApi({
  reducerPath: 'productRatingApi',
  baseQuery: createBaseQuery('productRating'),
  tagTypes: ['Products'],
  endpoints: (builder) => ({
    rateProduct: builder.mutation<void, RateProductRequest>({
      query: ({ productId, rating, userId }) => ({
        url: '',
        method: 'POST',
        body: { productId, rating, userId }, 
      }),
      invalidatesTags: ['Products'],
    }),
  }),
});

export const { useRateProductMutation } = productRatingApi;
