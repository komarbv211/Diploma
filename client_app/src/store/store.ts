import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

import userReducer from './slices/userSlice';

import { userApi } from '../services/userApi';
import { authApi } from '../services/authApi';
import { userAdminApi } from '../services/admin/userAdninApi';
import { categoryApi } from '../services/categoryApi';
import { categoryAdminApi } from '../services/admin/categoryAdmnApi';
import { productApi } from '../services/productApi';
import { productAdminApi } from '../services/admin/productAdminApi';

import { promotionAdminApi } from '../services/admin/promotionAdminApi';  // <-- додано

import { productRatingApi } from '../services/productRatingApi ';
import { cartApi } from '../services/cartApi';
import localCarReducer from './slices/localCartSlice';
import authReducer from './slices/userSlice';


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
                [promotionAdminApi.reducerPath]: promotionAdminApi.reducer,  // <-- додано
                [productRatingApi.reducerPath]: productRatingApi.reducer,
                [cartApi.reducerPath]: cartApi.reducer,
                localCart: localCarReducer,
                auth: authReducer
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
            ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
