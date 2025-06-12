import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import userReducer from './slices/userSlice';
import { userApi } from '../services/userApi';
import { authApi } from '../services/authApi';
import { userAdminApi } from '../services/admin/userAdninApi';
import { categoryApi } from '../services/categoryApi';
import { productApi } from '../services/productApi';

export const store = configureStore({
        reducer: {
                account: userReducer,
                [authApi.reducerPath]: authApi.reducer,
                [userAdminApi.reducerPath]: userAdminApi.reducer,
                [userApi.reducerPath]: userApi.reducer,
                [categoryApi.reducerPath]: categoryApi.reducer,
                [productApi.reducerPath]: productApi.reducer,
        },
        middleware: (getDefaultMiddleware) =>
                getDefaultMiddleware().concat(
                        authApi.middleware,
                        userAdminApi.middleware,
                        userApi.middleware,
                        categoryApi.middleware,
                        productApi.middleware
                ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
