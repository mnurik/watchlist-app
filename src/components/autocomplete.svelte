<script lang="ts">
	import { addSymbol, getSymbolsBySearch, store, type SymbolDetail } from '$lib';
	import { onDestroy } from 'svelte';
	import { get } from 'svelte/store';

	let symbols: SymbolDetail[] = [];
	let selectedSymbol: string = '';
	let highlightedValue: string = '';

	let timoeoutId: unknown;
	const debounce = (cb: () => void, timer: number) => {
		if (timoeoutId) {
			clearTimeout(timoeoutId as number);
		}
		timoeoutId = setTimeout(cb, timer);
	};

	const handleSearchInput = (event: Event) => {
		const inputValue = (event.target as HTMLInputElement).value;

		if (inputValue.length > 2) {
			debounce(
				() =>
					getSymbolsBySearch(inputValue).then((response) => {
						symbols = response;
					}),
				800
			);
		} else {
			symbols = [];
		}
	};

	const handleSelect = (event: Event) => {
		selectedSymbol = (event.target as HTMLLIElement).getAttribute('data-value') || '';
		symbols = [];
	};

	const handleAddClick = () => {
		const watchlistId = get(store).watchlists.find((watchlist) => watchlist.active)?.uuid || '';
		addSymbol(selectedSymbol, watchlistId);
		window.location.href = '/watchlist';
	};

	const handleKeyPress = (event: KeyboardEvent) => {
		switch (event.code) {
			case 'Enter':
				selectedSymbol = highlightedValue;
				symbols = [];
				break;
			case 'Escape':
				symbols = [];
				break;
			case 'ArrowUp': {
				const highlightedValueIndex = symbols.findIndex(
					(symbol) => symbol.symbol === highlightedValue
				);
				if (highlightedValueIndex > 0) {
					highlightedValue = symbols[highlightedValueIndex - 1].symbol;
				}
				break;
			}
			case 'ArrowDown': {
				const highlightedValueIndex = symbols.findIndex(
					(symbol) => symbol.symbol === highlightedValue
				);
				if (symbols.length && highlightedValueIndex < symbols.length - 1) {
					highlightedValue = symbols[highlightedValueIndex + 1].symbol;
				}
				break;
			}
		}
	};

	onDestroy(() => {
		clearTimeout(timoeoutId as number);
	});
</script>

<div class="autocompleteContainer">
	<div class="autocompleteSearch">
		<input
			on:input={handleSearchInput}
			bind:value={selectedSymbol}
			on:keypress={handleKeyPress}
			on:keydown={handleKeyPress}
			placeholder="Insert more than 3 symbols"
		/>
		{#if symbols.length > 0}
			<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<ul on:click={handleSelect}>
				{#each symbols as symbol}
					<li class:active={highlightedValue === symbol.symbol} data-value={symbol.symbol}>
						{symbol.symbol}
					</li>
				{/each}
			</ul>
		{/if}
	</div>
	<button on:click={handleAddClick}>Add</button>
</div>

<style>
	.autocompleteContainer {
		display: flex;
		justify-content: center;
		gap: 16px;
	}

	.autocompleteSearch {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
	}

	ul {
		list-style: none;
		max-height: 50vh;
		overflow-y: auto;
		border-left: 1px solid black;
		border-right: 1px solid black;
		width: 100%;
	}

	li {
		padding: 8px;
		border-bottom: 1px solid black;
		cursor: pointer;
	}

	li:hover,
	.active {
		background-color: darkgrey;
	}

	button {
		align-self: flex-start;
	}

	input {
		width: 40vw;
	}

	input,
	button {
		margin: 0;
	}
</style>
