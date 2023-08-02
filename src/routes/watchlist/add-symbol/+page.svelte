<script lang="ts">
	import { getUserStore } from "$lib";
	import { onMount } from "svelte";
	import Autocomplete from "../../../components/autocomplete.svelte";

    onMount(() => {
		getUserStore();
	})
</script>

<Autocomplete />
