import type {
	ChartType,
	ChartData,
	ChartOptions,
	DefaultDataPoint,
	Plugin,
	UpdateMode,
	Chart
} from 'chart.js';
import type { HTMLAttributes } from './html';

export interface MarketSymbol {
	symbol: string;
	description: string;
	bidPrice: number;
	askPrice: number;
	latestPrice: number;
}

export interface SymbolDetail {
	symbol: string;
	description: string;
	'listed-market': string;
	'price-increments': string;
	'trading-hours': string;
	options: boolean;
	'instrument-type': string;
}

export interface SymbolChart {
	close: number;
	priceDate: string;
	symbol: string;
}

export interface Watchlist {
	active: boolean;
	name: string;
	uuid: string;
	symbols: MarketSymbol[];
}

export interface Store {
	username: string;
	watchlists: Watchlist[];
}

export interface Quote extends MarketSymbol {
	companyName: string;
	iexAskPrice: number;
	iexBidPrice: number;
}
export interface Batch {
	quote: Quote;
}

export interface BatchRespose {
	[K: string]: Batch;
}

export interface $$LineProps<TData = DefaultDataPoint<'line'>, TLabel = unknown>
	extends Omit<ChartBaseProps<'line', TData, TLabel>, 'type'> {
	chart?: Chart<'line', TData, TLabel> | null;
}

export interface ChartBaseProps<
	TType extends ChartType = ChartType,
	TData = DefaultDataPoint<TType>,
	TLabel = unknown
> extends Omit<HTMLAttributes, 'type' | 'data' | 'options' | 'plugins'> {
	/**
	 * Chart.js chart type
	 */
	type: TType;
	/**
	 * The data object that is passed into the Chart.js chart
	 * @see https://www.chartjs.org/docs/latest/getting-started/
	 */
	data: ChartData<TType, TData, TLabel>;
	/**
	 * The options object that is passed into the Chart.js chart
	 * @see https://www.chartjs.org/docs/latest/general/options.html
	 * @default {}
	 */
	options?: ChartOptions<TType>;
	/**
	 * The plugins array that is passed into the Chart.js chart
	 * @see https://www.chartjs.org/docs/latest/developers/plugins.html
	 * @default []
	 */
	plugins?: Plugin<TType>[];
	/**
	 * A mode string to indicate transition configuration should be used.
	 * @see https://www.chartjs.org/docs/latest/developers/api.html#update-mode
	 */
	updateMode?: UpdateMode;
}
