<script lang="ts">
	import type { PageData } from './$types';
	import Graph from '$lib/Graph.svelte';
	import Podium from '$lib/Podium.svelte';
	import { onDestroy, onMount } from 'svelte';

	let { data }: { data: PageData } = $props();
	let width = $state(500);
	let height = $state(200);
	const texts = [
		'Le vote est en cours...',
		'Quel suspense insoutenable !',
		"Mais qui peut bien être l'assassin ?",
		'Bientôt le dénouement de cette histoire incroyable.',
		"Je n'en peux plus d'attendre.",
		"C'était vraiment un spectacle formidable",
		"J'en parlerai autour de moi",
		'Ils sont sur Facebook et Instagram',
		"Ça devient vraiment long d'attendre",
		"Bon... Ils font quoi les autres ?"
	];
	let textIndex = $state(0);
	let text = $derived(texts[textIndex % texts.length]);
	let nbVotes = $state(data.nbVotes);
	let textInterval: number;
	let eventSource: EventSource;

	onMount(() => {
		// Rotate text every 10 seconds
		textInterval = setInterval(() => {
			textIndex++;
		}, 10000);

		// Use Server-Sent Events for real-time updates
		eventSource = new EventSource('/api/events');

		eventSource.onmessage = (event) => {
			try {
				const eventData = JSON.parse(event.data);

				// Update vote count
				nbVotes = eventData.nbVotes;

				// If status changed, reload page
				if (eventData.status !== data.status) {
					window.location.replace('/results');
				}
			} catch (error) {
				console.error('Error parsing SSE data:', error);
			}
		};

		eventSource.onerror = (error) => {
			console.error('SSE connection error:', error);
			// Auto-reconnect is handled by EventSource
		};
	});

	onDestroy(() => {
		clearInterval(textInterval);
		if (eventSource) {
			eventSource.close();
		}
	});
</script>

{#if data.status === 1}
	<div>
		<h1 class="text-center">{text}</h1>
		<h1 class="text-center">Déjà {nbVotes} vote{nbVotes > 1 ? 's' : ''}</h1>
		<img alt="Impropulsion" class="mx-auto w-96" src="impropulsion.jpg" />
	</div>
{:else if data.status === 2}
	<h1 class="text-center">La personne désignée par le public comme étant l'assassin est</h1>
	<Podium data={data.suspects?.sort((a, b) => b.votes - a.votes)[0]} />
	<Graph {width} {height} points={data.suspects} />
{/if}

<style type="postcss">
	div {
		@apply text-center;
	}
</style>
