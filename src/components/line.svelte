<script lang="ts">
	import type { $$LineProps, ChartBaseProps } from '$lib';
	import { Chart, LineController } from 'chart.js';
	import ChartWrapper from './chart-wrapper.svelte';

	Chart.register(LineController);

	export let chart: $$LineProps['chart'] = null;
	let props: $$LineProps;
	let baseChartRef: ChartWrapper;

	$: props = $$props as $$LineProps;
</script>

<ChartWrapper bind:this={baseChartRef} bind:chart type="line" {...props} />
