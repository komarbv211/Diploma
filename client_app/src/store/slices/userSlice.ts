import {createSlice} from '@reduxjs/toolkit'
import {jwtParse} from "../../utilities/jwtParse.ts";
import {APP_ENV} from "../../env";
import {RootState} from "../store.ts";
import { IUser, IUserAuth, IUserState } from '../../types/account.ts';

const getUserFromToken = (token: string | null): IUser | null => token ? jwtParse(token) : null

const getUserAuth = (user: IUser | null): IUserAuth => {
    return ({
        isAdmin: user !== null && user.roles.includes('Admin'),
        isUser: user !== null && user.roles.includes('User'),
        isAuth: user !== null,
        roles: user?.roles || []
    })
}

const userInit = (): IUserState => {
    const token: string | null = localStorage.getItem(APP_ENV.ACCESS_KEY);
    const refreshToken: string | null = localStorage.getItem(APP_ENV.REFRESH_KEY);

    const user = getUserFromToken(token)
    const auth = getUserAuth(user);
    return ({
        user: user,
        token: token,
        refreshToken: refreshToken,
        auth: auth
    })
}

const initialState: IUserState = userInit();

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {

        setCredentials: (state, action: { payload: { token: string; refreshToken: string;} }) => {
            const {token, refreshToken} = action.payload
            state.user = getUserFromToken(token)
            state.token = token
            state.refreshToken = refreshToken
            state.auth = getUserAuth(state.user)

            if (state.user !== null) {
                localStorage.setItem(APP_ENV.ACCESS_KEY, token);
                localStorage.setItem(APP_ENV.REFRESH_KEY, refreshToken);
            }
        },
        
        logOut: (state) => {
            localStorage.removeItem(APP_ENV.ACCESS_KEY);
            localStorage.removeItem("token");
            state.user = null
            state.token = null
            state.refreshToken = null
            state.auth = getUserAuth(null)
        },

    },
});

export const getUser = (state: RootState) => state.user.user;
export const getAuth = (state: RootState) => state.user.auth;
export const getToken = (state: RootState) => state.user.token;

export const { setCredentials, logOut } = userSlice.actions
export default userSlice.reducer