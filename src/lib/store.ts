import { writable, type Writable } from 'svelte/store';
import { v4 as uuid } from 'uuid';
import { mapBatchResult } from './api';
import { INITIAL_STORE } from './constants';
import type { BatchRespose, MarketSymbol, Store, Watchlist } from '../types';

export let store: Writable<Store> = writable(INITIAL_STORE);

export function createStore(username: string) {
	const DEFAULT_STORE = {
		username,
		watchlists: [
			{
				name: `${username} first list`,
				active: true,
				uuid: uuid(),
				symbols: [
					{
						askPrice: 0,
						bidPrice: 0,
						description: '',
						latestPrice: 0,
						symbol: 'AAPL'
					},
					{
						askPrice: 0,
						bidPrice: 0,
						description: '',
						latestPrice: 0,
						symbol: 'MSFT'
					},
					{
						askPrice: 0,
						bidPrice: 0,
						description: '',
						latestPrice: 0,
						symbol: 'SPY'
					}
				]
			}
		]
	};

	const userStore = localStorage.getItem(username);

	store.set(userStore ? JSON.parse(userStore) : DEFAULT_STORE);

	store.subscribe((value) => {
		localStorage.setItem(username, JSON.stringify(value));
	});

	return store;
}

export const getUserStore = () => {
	const username = sessionStorage.getItem('username');

	if (username) {
		return createStore(username);
	} else {
		window.location.href = '/';
	}
};

export const addWatchlist = (name: string) => {
	store.update((st) => {
		const newWatchlist: Watchlist = { name, symbols: [], uuid: uuid(), active: true };
		const deactivate = (watchlist: Watchlist): Watchlist => ({
			...watchlist,
			active: false
		});
		return {
			...st,
			watchlists: [...st.watchlists.map(deactivate), newWatchlist]
		};
	});
};

export const removeWatchlist = (watchlistId: string) => {
	store.update((st) => {
		if (st.watchlists.length === 1) {
			return st;
		}
		const watchlists = st.watchlists.filter((w) => w.uuid !== watchlistId);
		if (!watchlists.some((w) => w.active)) {
			watchlists[0].active = true;
		}
		return {
			...st,
			watchlists
		};
	});
};

export const switchWatchlist = (watchlistId: string) => {
	store.update((st) => {
		const watchlists = st.watchlists.map((w) => ({
			...w,
			active: w.uuid === watchlistId
		}));
		return {
			...st,
			watchlists
		};
	});
};

export const addSymbol = (symbol: string, watchlistId: string) => {
	store.update((st) => {
		const newMarketSymbol: MarketSymbol = {
			askPrice: 0,
			bidPrice: 0,
			description: '',
			latestPrice: 0,
			symbol
		};

		const watchlists = st.watchlists.map((watchlist) => {
			if (watchlist.uuid === watchlistId) {
				const isSymbolExist = watchlist.symbols.some((s) => s.symbol === symbol);

				if (isSymbolExist) {
					return watchlist;
				} else {
					return {
						...watchlist,
						symbols: [...watchlist.symbols, newMarketSymbol]
					};
				}
			} else return watchlist;
		});

		return {
			...st,
			watchlists
		};
	});
};

export const removeSymbol = (symbol: string, watchlistId: string) => {
	store.update((st) => {
		const watchlists = st.watchlists.map((watchlist) => {
			if (watchlist.uuid === watchlistId) {
				return {
					...watchlist,
					symbols: watchlist.symbols.filter((s) => s.symbol !== symbol)
				};
			} else return watchlist;
		});

		return {
			...st,
			watchlists
		};
	});
};

export const updateAllSymbols = (batch: BatchRespose) => {
	store.update((st) => {
		const watchlists = st.watchlists.map((w) => {
			return {
				...w,
				symbols: w.symbols.map((symbol) => {
					if (typeof batch[symbol.symbol] !== 'undefined') {
						return {
							...mapBatchResult(batch[symbol.symbol])
						};
					} else {
						return symbol;
					}
				})
			};
		});
		return {
			...st,
			watchlists
		};
	});
};
