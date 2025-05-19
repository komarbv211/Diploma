import { createSlice } from '@reduxjs/toolkit';
import { IUser, IUserState } from '../../types/account';

const initialState: IUserState = {
    user: null,
    token: null,
    refreshToken: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setCredentials: (state, action: { payload: { user?: IUser; token: string; refreshToken: string } }) => {
            const { user, token, refreshToken } = action.payload;
            state.user = user ?? null;
            state.token = token;
            state.refreshToken = refreshToken;
        },
        logOut: (state) => {
            state.user = null;
            state.token = null;
            state.refreshToken = null;
        },        
    },
});

export const getUser = (state: { user: IUserState }) => state.user.user;
export const getToken = (state: { user: IUserState }) => state.user.token;

export const { setCredentials, logOut } = userSlice.actions;
export default userSlice.reducer;
