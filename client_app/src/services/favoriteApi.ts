// services/favoriteApi.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQueryWithReauth } from "../utilities/createBaseQuery.ts";
import { IFavoriteItem, IFavoriteAddRequest } from "../types/favorite";

export const favoriteApi = createApi({
  reducerPath: "apiFavorite",
  baseQuery: createBaseQueryWithReauth("Favorite"),
  tagTypes: ["Favorites"],
  endpoints: (builder) => ({
    getFavorites: builder.query<IFavoriteItem[], void>({
      query: () => ({ url: "GetFavorites", method: "GET" }),
      providesTags: ["Favorites"],
    }),

    addFavorite: builder.mutation<void, IFavoriteAddRequest>({
      query: (item) => ({
        url: "Add",
        method: "POST",
        body: item,
      }),
      async onQueryStarted(item, { dispatch, queryFulfilled }) {
        // Optimistic update
        const patchResult = dispatch(
          favoriteApi.util.updateQueryData("getFavorites", undefined, (draft) => {
            draft.push({
              productId: item.productId,
              name: "",
              categoryId: 0,
              categoryName: "",
              price: 0,
            });
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo(); // відкат якщо помилка
        }
      },
      invalidatesTags: ["Favorites"],
    }),

    removeFavorite: builder.mutation<void, number>({
      query: (productId) => ({
        url: `Remove/${productId}`,
        method: "DELETE",
      }),
      async onQueryStarted(productId, { dispatch, queryFulfilled }) {
        // Optimistic update
        const patchResult = dispatch(
          favoriteApi.util.updateQueryData("getFavorites", undefined, (draft) => {
            return draft.filter((f) => f.productId !== productId);
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: ["Favorites"],
    }),
  }),
});

export const {
  useGetFavoritesQuery,
  useAddFavoriteMutation,
  useRemoveFavoriteMutation,
} = favoriteApi;
