const REMOTE_BASE_URL: string = import.meta.env.VITE_BASE_URL;
const CLIENT_ID: string = import.meta.env.VITE_APP_CLIENT_ID;
const GOOGLE_USERINFO_URL = import.meta.env.VITE_GOOGLE_USERINFO_URL;
const ACCESS_KEY: string = import.meta.env.VITE_APP_ACCESS_KEY;
const REFRESH_KEY: string = import.meta.env.VITE_APP_REFRESH_KEY;
const IMAGES_URL:  string = REMOTE_BASE_URL + import.meta.env.VITE_APP_IMAGES_FOLDER;
const IMAGES_100_URL: string = IMAGES_URL + '/100_';
const IMAGES_200_URL: string = IMAGES_URL+ '/200_';
const IMAGES_400_URL: string = IMAGES_URL + '/400_';
const IMAGES_800_URL: string = IMAGES_URL + '/800_';
const IMAGES_1200_URL: string = IMAGES_URL + '/1200_';

const APP_ENV = {
    REMOTE_BASE_URL,
    CLIENT_ID,
    GOOGLE_USERINFO_URL,
    ACCESS_KEY,
    REFRESH_KEY,
    IMAGES_100_URL,
    IMAGES_200_URL,
    IMAGES_400_URL,
    IMAGES_800_URL,
    IMAGES_1200_URL,
}

console.log('REMOTE_BASE_URL:', REMOTE_BASE_URL);
export { APP_ENV };