import { JwtPayload } from "jwt-decode";

export interface GoogleJwtPayload extends JwtPayload {
    email: string;
    given_name: string;
    family_name: string;
    picture: string;
}

export interface GoogleResponse {
    credential: string;
}

export interface IUser {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    photo: string;
    exp: number;
}

export interface IUserRegisterRequest {
    username: string;
    password: string;
}

export interface IUserLoginRequest {
    username: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    user: IUser;
}

export interface IUserState {
    user: IUser | null;
    token: string | null;
}

export interface IUserAuth {
    isAdmin: boolean;
    isUser: boolean;
    isAuth: boolean;
    roles: string[];
}

export interface LoginButtonProps {
    title: string;
    onLogin: (token: string) => void;
    icon: React.ReactNode;
}

export interface LoginGoogleRequest {
    token: string;
}
