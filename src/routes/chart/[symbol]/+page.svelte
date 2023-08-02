<script lang="ts">
	import { page } from '$app/stores';
	import {
		fetchSmybolsAndUpdateStore,
		getSymbolChart,
		getUserStore,
		store,
		type $$LineProps,
		type MarketSymbol,
		type Watchlist
	} from '$lib';
	import {
		CategoryScale,
		Chart as ChartJS,
		Legend,
		LineElement,
		LinearScale,
		PointElement,
		Title,
		Tooltip
	} from 'chart.js';
	import { onMount } from 'svelte';
	import Line from './../../../components/line.svelte';

	let data: $$LineProps['data'] = {
		labels: [],
		datasets: []
	};
	let mounted = false;
	let symbolParam = $page.params.symbol;
	let symbolData: MarketSymbol | undefined;
	let watchList: Watchlist | undefined;

	store.subscribe((value) => {
		watchList = value.watchlists.find((watchlist) => watchlist.active);

		if (watchList) {
			symbolData = watchList.symbols.find(
				(symbolData: MarketSymbol) => symbolData.symbol.toLowerCase() === symbolParam.toLowerCase()
			);
		}
	});

	onMount(() => {
		getUserStore();

		getSymbolChart(symbolParam).then((res) => {
			data = {
				labels: res.map((item) => item.priceDate),
				datasets: [
					{
						label: res[0].symbol,
						borderColor: 'red',
						pointBorderColor: 'rgb(205, 130,1 58)',
						pointBorderWidth: 5,
						pointHoverRadius: 5,
						pointHoverBackgroundColor: 'rgb(0, 0, 0)',
						pointHoverBorderWidth: 2,
						data: res.map((item) => item.close)
					}
				]
			};
			mounted = true;
		});

		fetchSmybolsAndUpdateStore([{ symbol: symbolParam }]);
		const interval = setInterval(() => fetchSmybolsAndUpdateStore([{ symbol: symbolParam }]), 5000);

		return () => clearInterval(interval);
	});
	ChartJS.register(Title, Tooltip, Legend, LineElement, LinearScale, PointElement, CategoryScale);
</script>

{#if mounted}
	{#if symbolData}
		<div class="container">
			<span>{symbolData.symbol}</span>
			<span class:zero={symbolData.bidPrice === 0}>{symbolData.bidPrice} $</span>
			<span class:zero={symbolData.bidPrice === 0}>{symbolData.askPrice} $</span>
			<span>{symbolData.latestPrice} $</span>
		</div>
	{/if}
	<Line {data} options={{ responsive: true }} />
{/if}

<style>
	.container {
		display: flex;
		width: 100%;
		gap: 2px;
		margin-bottom: 48px;
	}

	span {
		flex: 1;
		text-align: center;
		padding: 32px;
	}

	span:first-child {
		background-color: rgb(237, 237, 237);
		color: rgb(32, 37, 37);
	}
	span {
		background-color: rgb(32, 37, 37);
		color: rgb(255, 255, 255);
	}

	.zero {
		background-color: rgb(224, 37, 41);
	}
</style>
