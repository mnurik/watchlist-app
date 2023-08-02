<script lang="ts">
	import { getUserStore } from '$lib';
	import { onMount } from 'svelte';
	import WatchListTable from '../../components/watchlist-table.svelte';
	import WatchListNav from '../../components/watchlist-nav.svelte';

	onMount(() => {
		getUserStore();
	})
</script>

<WatchListNav />
<WatchListTable />
