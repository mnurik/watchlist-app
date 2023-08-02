<script lang="ts">
	import { fetchSmybolsAndUpdateStore, removeSymbol, store, type Watchlist } from '$lib';
	import { onMount } from 'svelte';
	import BIN_SVG from './../images/bin.svg';

	let watchList: Watchlist | undefined;
	let updatedTime: string;

	store.subscribe((value) => {
		watchList = value.watchlists.find((watchlist) => watchlist.active);
	});

	onMount(() => {
		updatedTime = new Date().toLocaleString();
		fetchSmybolsAndUpdateStore(watchList?.symbols);

		const interval = setInterval(() => {
			updatedTime = new Date().toLocaleString();
			fetchSmybolsAndUpdateStore(watchList?.symbols);
		}, 5000);

		return () => clearInterval(interval);
	});
</script>

{#if watchList && watchList.symbols.length}
	<span class="timeInfo">Last updated: {updatedTime}</span>
	<div class="container">
		<div class="columnContainer">
			<strong>Stock Symbol</strong>
			<strong>Description</strong>
			<strong>Bid Price</strong>
			<strong>Ask Price</strong>
			<strong>Last Price</strong>
		</div>
		{#each watchList.symbols as symbol}
			<div class="columnContainer">
				<div class="symbolContainer">
					<a href={`/chart/${symbol.symbol}`}>{symbol.symbol}</a><button
						on:click={() => removeSymbol(symbol.symbol, watchList?.uuid || '')}
						><img src={BIN_SVG} alt="bin" /></button
					>
				</div>
				<span>{symbol.description}</span>
				<span>{symbol.bidPrice} $</span>
				<span>{symbol.askPrice} $</span>
				<span>{symbol.latestPrice} $</span>
			</div>
		{/each}
	</div>
{/if}

<a class="addSymbolLink" href="/watchlist/add-symbol">Add symbol</a>

<style>
	.container {
		display: grid;
		border: 1px solid black;
	}

	.columnContainer {
		display: flex;
		justify-content: flex-end;
		border-bottom: 1px solid black;
	}

	.columnContainer > * {
		padding: 8px;
		border-left: 1px solid black;
		flex: 1;
	}

	.symbolContainer {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
	}

	button {
		padding: 0;
		margin: 0;
		border: none;
	}

	img {
		width: 1rem;
		cursor: pointer;
	}

	.timeInfo {
		text-align: right;
		margin-bottom: 16px;
	}

	.addSymbolLink {
		background: var(--bg-color);
		color: rgb(255, 255, 255);
		font-weight: bold;
		text-decoration: none;
		padding: 1em;
		text-align: center;
		margin-top: 16px;
	}
</style>
