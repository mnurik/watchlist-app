<script lang="ts">
	import { addWatchlist, removeWatchlist, store, switchWatchlist, type Watchlist } from '$lib';

	let isEditActive = false;
	let watchlists: Watchlist[] = [];

	store.subscribe((value) => {
		watchlists = value.watchlists;
	});

	const handleWatchListClick = (event: Event) => {
		const elTarget = event.target as HTMLLIElement | HTMLButtonElement;

		switch (elTarget.getAttribute('data-actionType')) {
			case 'remove':
				handleRemoveWatchList(event);
				break;
			case 'switch':
				handleWatchListChange(event);
				break;
			case 'create':
				isEditActive = true;
				break;

			default:
				break;
		}
	};

	const handleWatchListChange = (event: Event) => {
		const tabValue = (event.target as HTMLLIElement)?.getAttribute('data-tabValue');

		if (tabValue) {
			switchWatchlist(tabValue);
		}
	};

	const handleRemoveWatchList = (event: Event) => {
		const watchListId = (event.target as HTMLButtonElement)?.getAttribute('data-tabValue');

		if (watchListId) {
			removeWatchlist(watchListId);
		}
	};

	const handleTabNameChange = (event: Event) => {
		const inputTarget = event.target as HTMLInputElement;
		if (inputTarget.value !== '') {
			addWatchlist(inputTarget.value);
			isEditActive = false;
		}
	};

	const handleInputKeyDown = (event: KeyboardEvent) => {
		if (event.key === 'Enter') {
			(event.target as HTMLInputElement).blur();
		}
	};
</script>

<nav>
	<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<ul on:click={handleWatchListClick}>
		{#each watchlists as watchlist}
			<li
				aria-current={watchlist.active ? 'true' : undefined}
				data-tabValue={watchlist.uuid}
				data-actionType="switch"
			>
				{watchlist.name}
				<button data-actionType="remove" data-tabValue={watchlist.uuid}>x</button>
			</li>
		{/each}
		<li data-tabValue="-1" data-actionType="create">
			{#if isEditActive}
				<!-- svelte-ignore a11y-autofocus -->
				<input on:blur={handleTabNameChange} autofocus on:keydown={handleInputKeyDown} />
			{:else}
				+
			{/if}
		</li>
	</ul>
</nav>

<style>
	nav {
		display: flex;
		justify-content: center;
		--background: rgb(32, 37, 37);
		--color-text: white;
		--transition: opacity 0.2s linear;
		margin-bottom: 16px;
	}

	ul {
		position: relative;
		padding: 0;
		margin: 0;
		height: 3em;
		display: flex;
		justify-content: center;
		align-items: center;
		list-style: none;
		background: var(--background);
		background-size: contain;
	}

	li {
		display: flex;
		position: relative;
		height: 100%;
		align-items: center;
		padding: 0 1.5rem;
		color: var(--color-text);
		font-weight: 700;
		font-size: 0.8rem;
		letter-spacing: 0.1em;
		transition: var(--transition);
		cursor: pointer;
		opacity: 0.6;
	}

	li:not(:first-child) {
		border-left: 1px solid rgb(163, 159, 159);
	}

	li[aria-current='true'] {
		background: var(--bg-color);
		opacity: 1;
	}

	li:hover {
		opacity: 1;
	}

	input {
		border: none;
		color: var(--color-text);
	}
	input:focus {
		outline: none;
	}

	button {
		border: none;
		padding: 0 0 8px;
		position: absolute;
		right: 0;
		top: -5px;
		opacity: 0;
		cursor: pointer;
		color: var(--color-text);
		transition: var(--transition);
	}

	li:hover button {
		opacity: 1;
	}
</style>
