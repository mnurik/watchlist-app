import type { Store } from "../types";

export const INITIAL_STORE: Store = {
    username: '',
    watchlists: []
};

export const IEX_CLOUD_API_TOKEN = 'pk_12e4d6a83de7494fa6d5bd27e0d47f93';
export const IEX_CLOUD_URI = 'https://cloud.iexapis.com/v1';
export const SYMBOLS_SEARCH_URI = process.env.SYMBOLS_SEARCH_URI;
