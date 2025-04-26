const REMOTE_BASE_URL: string = import.meta.env.VITE_BASE_URL;
const CLIENT_ID: string = import.meta.env.VITE_APP_CLIENT_ID;

const APP_ENV = {
    REMOTE_BASE_URL,
    CLIENT_ID,
}
console.log('REMOTE_BASE_URL:', REMOTE_BASE_URL);
export { APP_ENV };