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
export interface IGoogleLoginRequest {
    googleAccessToken: string;  
}
export interface IGoogleRegister {
    googleAccessToken: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    image?: File;
}

export interface GoogleProfile {
    sub: string;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
    email: string;
    email_verified: boolean;
    locale: string;
}
export interface IGoogleAuthProps {
    open: boolean;
    onClose: () => void;
    token: string;
  }
export interface IUser {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    image: string;
    roles: string[];
    phoneNumber: string;
    exp: number;
    createdDate?: string;
    lastActivity?: string;
}

export interface IUserRegisterRequest {
    username: string;
    password: string;
}

export interface IUserLoginRequest {
    email: string;
    password: string;
}

export interface IAuthResponse {
    accessToken: string;
    isNewUser?: boolean;
}

export interface IUserState {
    user: IUser | null;
    token: string | null;
    auth: IUserAuth;
    refreshToken?: string | null;
    isLoggingOut?: boolean;
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

export interface IForgotPasswordRequest {
    email: string;
}

export interface IResetPasswordRequest {
    id: number;
    token: string;
    password: string;
}


