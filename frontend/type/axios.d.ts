import 'axios';

declare module 'axios' {
    export interface AxiosError {
        /**
         * Mengembalikan objek { message, status } dari error
         */
        parse?: () => string[];
    }
}
