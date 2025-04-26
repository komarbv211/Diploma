import { jwtDecode } from 'jwt-decode'

export const jwtParse = (value: string | null) => {
    if (!value) {
        return null
    }
    return jwtDecode(value)
}