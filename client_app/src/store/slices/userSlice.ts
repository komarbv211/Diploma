import { createSlice } from '@reduxjs/toolkit';
import { IUser, IUserState } from '../../interfaces/account';

const initialState: IUserState = {
    user: null,
    token: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setCredentials: (state, action: { payload: { user?: IUser; token: string } }) => {
            const { user, token } = action.payload;
            state.user = user ?? null;
            state.token = token;
        },
        logOut: (state) => {
            state.user = null;
            state.token = null;
        },
    },
});

export const getUser = (state: { user: IUserState }) => state.user.user;
export const getToken = (state: { user: IUserState }) => state.user.token;

export const { setCredentials, logOut } = userSlice.actions;
export default userSlice.reducer;
