// src/store/store.ts
import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

// Слайси
import userReducer from "./slices/userSlice";
import localCartReducer from "./slices/localCartSlice";

// API
import { authApi } from "../services/authApi";
import { userApi } from "../services/userApi";
import { userAdminApi } from "../services/admin/userAdminApi";
import { categoryApi } from "../services/categoryApi";
import { categoryAdminApi } from "../services/admin/categoryAdmnApi.ts";
import { productApi } from "../services/productApi";
import { productAdminApi } from "../services/admin/productAdminApi";
import { promotionAdminApi } from "../services/admin/promotionAdminApi";
import { promotionApi } from "../services/promotionApi";
import { brandApi } from "../services/brandApi";
import { brandAdminApi } from "../services/admin/brandAdminApi";
import { productRatingApi } from "../services/productRatingApi .ts";
import { cartApi } from "../services/cartApi";
import { productCommentsApi } from "../services/productCommentsApi";
import { orderApi } from "../services/orderApi";
import { orderAdminApi } from "../services/admin/orderAdminApi";
import { locationApi } from "../services/locationApi";
import { analyticsAdminApi } from "../services/admin/analyticsAdminApi";
import { favoriteApi } from "../services/favoriteApi"; // <-- твій API для улюблених товарів

export const store = configureStore({
    reducer: {
        account: userReducer,
        auth: userReducer,
        localCart: localCartReducer,

        // RTK Query reducers
        [authApi.reducerPath]: authApi.reducer,
        [userApi.reducerPath]: userApi.reducer,
        [userAdminApi.reducerPath]: userAdminApi.reducer,
        [categoryApi.reducerPath]: categoryApi.reducer,
        [categoryAdminApi.reducerPath]: categoryAdminApi.reducer,
        [productApi.reducerPath]: productApi.reducer,
        [productAdminApi.reducerPath]: productAdminApi.reducer,
        [promotionAdminApi.reducerPath]: promotionAdminApi.reducer,
        [promotionApi.reducerPath]: promotionApi.reducer,
        [brandApi.reducerPath]: brandApi.reducer,
        [brandAdminApi.reducerPath]: brandAdminApi.reducer,
        [productRatingApi.reducerPath]: productRatingApi.reducer,
        [cartApi.reducerPath]: cartApi.reducer,
        [productCommentsApi.reducerPath]: productCommentsApi.reducer,
        [orderApi.reducerPath]: orderApi.reducer,
        [orderAdminApi.reducerPath]: orderAdminApi.reducer,
        [locationApi.reducerPath]: locationApi.reducer,
        [analyticsAdminApi.reducerPath]: analyticsAdminApi.reducer,
        [favoriteApi.reducerPath]: favoriteApi.reducer, // додано
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            authApi.middleware,
            userApi.middleware,
            userAdminApi.middleware,
            categoryApi.middleware,
            categoryAdminApi.middleware,
            productApi.middleware,
            productAdminApi.middleware,
            promotionAdminApi.middleware,
            promotionApi.middleware,
            brandApi.middleware,
            brandAdminApi.middleware,
            productRatingApi.middleware,
            cartApi.middleware,
            productCommentsApi.middleware,
            orderApi.middleware,
            orderAdminApi.middleware,
            locationApi.middleware,
            analyticsAdminApi.middleware,
            favoriteApi.middleware // додано
        ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Кастомні хуки
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Додаткові типи для Thunk
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;
