import {GoogleResponse} from '../interfaces/account';

declare global {
    interface Window {
        google: {
            accounts: {
                id: {
                    initialize: (options: {
                        client_id: string;
                        callback: (response: GoogleResponse) => void;
                    }) => void;
                    renderButton: (element: HTMLElement, options: { theme: string; size: string; width: string }) => void;
                };
            };
        };
    }
}
