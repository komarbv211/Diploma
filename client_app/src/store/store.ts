import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import userReducer from './slices/userSlice';
import { userApi } from '../services/userApi';
import { authApi } from '../services/authApi';
import { userAdminApi } from '../services/admin/userAdninApi';

export const store = configureStore({
        reducer: {
                user: userReducer,
                [authApi.reducerPath]: authApi.reducer,
                [userAdminApi.reducerPath]: userAdminApi.reducer,
                [userApi.reducerPath]: userApi.reducer,
        },
        middleware: (getDefaultMiddleware) =>
                getDefaultMiddleware().concat(
                        authApi.middleware,
                        userAdminApi.middleware,
                        userApi.middleware
                ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
