import { IEX_CLOUD_API_TOKEN, IEX_CLOUD_URI, SYMBOLS_SEARCH_URI } from './constants';
import { updateAllSymbols } from './store';
import type { Batch, BatchRespose, MarketSymbol, SymbolChart, SymbolDetail } from '../types';

export const generateUrl = (symbols: string[], token: string) =>
	`${IEX_CLOUD_URI}/stock/market/batch?token=${token}&types=quote&symbols=${symbols.join()}`;

export const mapBatchResult = ({
	quote: { iexAskPrice, iexBidPrice, companyName, latestPrice, symbol }
}: Batch) => ({
	askPrice: iexAskPrice,
	bidPrice: iexBidPrice,
	latestPrice,
	symbol,
	description: companyName
});

export const fetchBatch = async (symbols: string[]): Promise<BatchRespose> => {
	const url = generateUrl(symbols, IEX_CLOUD_API_TOKEN);
	try {
		const response = await fetch(url);

		return response.json();
	} catch (error) {
		console.error('Error:', error);
		return {};
	}
};

export const fetchSmybolsAndUpdateStore = async (
	symbols: Pick<MarketSymbol, 'symbol'>[] | undefined = []
): Promise<void> => {
	const symbolsNames = symbols.map((symbol) => symbol.symbol);

	if (symbolsNames.length) {
		const res = await fetchBatch(symbolsNames);
		updateAllSymbols(res);
	}
};

export const getSymbolsBySearch = async (searchValue: string): Promise<SymbolDetail[]> => {
	try {
		const response = await fetch(`${SYMBOLS_SEARCH_URI}/symbols/search/${searchValue}`);
	
		const { data: { items } } = await response.json();
		return items;
	} catch (error) {
		console.log('Error: ', error);
		return [];
	}
};

export const getSymbolChart = async (symbol: string): Promise<SymbolChart[]> => {
	try {
		const response = await fetch(
			`${IEX_CLOUD_URI}/stock/${symbol}/chart/30d?token=${IEX_CLOUD_API_TOKEN}`
		);
	
		return response.json();
	} catch (error) {
		console.log('Error: ', error);
		return [];
	}
};
