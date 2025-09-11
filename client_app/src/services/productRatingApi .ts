import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseQuery } from '../utilities/createBaseQuery';
import { IRateProductRequest } from '../types/product';
import { ProductRating} from '../types/rating';

export const productRatingApi = createApi({
  reducerPath: 'productRatingApi',
  baseQuery: createBaseQuery('productRating'),
  tagTypes: ['Products'],
  endpoints: (builder) => ({
    rateProduct: builder.mutation<void, IRateProductRequest>({
      query: ({ productId, rating, userId }) => ({
        url: '',
        method: 'POST',
        body: { productId, rating, userId }, 
      }),
      invalidatesTags: ['Products'],
    }),
    getRatingsByProduct: builder.query<ProductRating[], number>({
      query: (productId) => `${productId}`,
      providesTags: ['Products'],
    }),
  }),
});

export const { useRateProductMutation, useGetRatingsByProductQuery } = productRatingApi;
