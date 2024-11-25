<script lang="ts">
	// import { scaleLinear } from 'd3-scale';
	// import * as d3 from "d3";
	export let width;
	export let height;
	export let points;

	import * as Plot from '@observablehq/plot';
	import { onMount } from 'svelte';
	let chart;
	let chartEl: Element;

	const renderChart = (node: Element) => {
		// chart = Plot.barX(points, {x: "votes", y: "name", fill: 'gray'}).plot();
		chart = Plot.plot({
			marginLeft: 100,
			x: {
				label: '',
  		},
			y: {
				label: ''
			},
			marks: [Plot.barX(points, { x: 'votes', y: 'name', fill: 'gray' }), Plot.ruleY([0])]
		});
		node.appendChild(chart);
	};
	onMount(() => {
		renderChart(chartEl);
	});
</script>

<div class="chart" bind:clientWidth={width} bind:clientHeight={height} bind:this={chartEl} />

<style type="postcss">
	.chart {
		width: 100%;
		max-width: 500px;
		margin: 0 auto;
	}
</style>
