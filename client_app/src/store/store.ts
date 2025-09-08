import {configureStore} from "@reduxjs/toolkit";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";

import userReducer from "./slices/userSlice";

import {userApi} from "../services/userApi";
import {authApi} from "../services/authApi";
import {userAdminApi} from "../services/admin/userAdminApi";
import {categoryApi} from "../services/categoryApi";
import {categoryAdminApi} from "../services/admin/categoryAdmnApi";
import {productApi} from "../services/productApi";
import {productAdminApi} from "../services/admin/productAdminApi";

import {promotionAdminApi} from "../services/admin/promotionAdminApi";

import {productRatingApi} from "../services/productRatingApi ";
import {cartApi} from "../services/cartApi";
import localCarReducer from "./slices/localCartSlice";
import authReducer from "./slices/userSlice";
import {productCommentsApi} from "../services/productCommentsApi";
import {brandApi} from '../services/brandApi';
import {brandAdminApi} from "../services/admin/brandAdminApi";
import {orderApi} from "../services/orderApi";
import {orderAdminApi} from "../services/admin/orderAdminApi";

import {locationApi} from "../services/locationApi";
import {promotionApi} from '../services/promotionApi';

export const store = configureStore({
    reducer: {
        account: userReducer,
        [authApi.reducerPath]: authApi.reducer,
        [userAdminApi.reducerPath]: userAdminApi.reducer,
        [userApi.reducerPath]: userApi.reducer,
        [categoryApi.reducerPath]: categoryApi.reducer,
        [categoryAdminApi.reducerPath]: categoryAdminApi.reducer,
        [productApi.reducerPath]: productApi.reducer,
        [productAdminApi.reducerPath]: productAdminApi.reducer,
        [promotionAdminApi.reducerPath]: promotionAdminApi.reducer,  // <-- ������
        [brandApi.reducerPath]: brandApi.reducer, // ?? ����� ����
        [productRatingApi.reducerPath]: productRatingApi.reducer,
        [cartApi.reducerPath]: cartApi.reducer,
        [productCommentsApi.reducerPath]: productCommentsApi.reducer,
        [brandAdminApi.reducerPath]: brandAdminApi.reducer,
        [promotionApi.reducerPath]: promotionApi.reducer,
        localCart: localCarReducer,
        auth: authReducer,
        [orderApi.reducerPath]: orderApi.reducer,
        [orderAdminApi.reducerPath]: orderAdminApi.reducer,
        [locationApi.reducerPath]: locationApi.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            authApi.middleware,
            userAdminApi.middleware,
            userApi.middleware,
            categoryApi.middleware,
            categoryAdminApi.middleware,
            productApi.middleware,
            productAdminApi.middleware,
            promotionAdminApi.middleware,
            productRatingApi.middleware,
            cartApi.middleware,
            productCommentsApi.middleware,
            brandApi.middleware,
            brandAdminApi.middleware,
            promotionApi.middleware,
            orderApi.middleware,
            orderAdminApi.middleware,
            locationApi.middleware
        ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
