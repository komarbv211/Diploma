import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQueryWithReauth } from "../utilities/createBaseQuery.ts";
import { IFavoriteItem, IFavoriteAddRequest } from "../types/favorite";

export const favoriteApi = createApi({
    reducerPath: "apiFavorite",
    baseQuery: createBaseQueryWithReauth("Favorite"),
    tagTypes: ["Favorites"],
    endpoints: (builder) => ({
        getFavorites: builder.query<IFavoriteItem[], void>({
            query: () => ({
                url: "GetFavorites",
                method: "GET",
            }),
            providesTags: ["Favorites"],
        }),

        addFavorite: builder.mutation<void, IFavoriteAddRequest>({
            query: (item) => ({
                url: "Add",
                method: "POST",
                body: item,
            }),
            invalidatesTags: ["Favorites"],
        }),

        addFavoritesRange: builder.mutation<void, IFavoriteAddRequest[]>({
            query: (items) => ({
                url: "AddRange",
                method: "POST",
                body: items,
            }),
            invalidatesTags: ["Favorites"],
        }),

        removeFavorite: builder.mutation<void, number>({
            query: (productId) => ({
                url: `Remove/${productId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Favorites"],
        }),

        clearFavorites: builder.mutation<void, void>({
            query: () => ({
                url: "ClearFavorites",
                method: "DELETE",
            }),
            invalidatesTags: ["Favorites"],
        }),
    }),
});

export const {
    useGetFavoritesQuery,
    useAddFavoriteMutation,
    useAddFavoritesRangeMutation,
    useRemoveFavoriteMutation,
    useClearFavoritesMutation,
} = favoriteApi;
