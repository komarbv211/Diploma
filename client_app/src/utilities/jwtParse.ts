import { jwtDecode } from 'jwt-decode'
import { IUser } from '../types/account'

export const jwtParse = (value: string | null): IUser | null => {
    if (!value) {
        return null;
    }
    return jwtDecode<IUser>(value);
}
