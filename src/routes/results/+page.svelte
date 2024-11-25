<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;

	import Graph from '$lib/Graph.svelte';
	import Podium from '$lib/Podium.svelte';
	import { onDestroy, onMount } from 'svelte';
	let width = 500;
	let height = 200;
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
	let textIndex = 0;
	$: text = texts[textIndex % texts.length];
	let nbVotes = data.nbVotes;
	let apiInterval, refreshNbVotesInterval;
	onMount(() => {
		apiInterval = setInterval(async () => {
			let statusResponse = await fetch('/api/status.json');
			const body = await statusResponse.json();
			if (body.status != data.status) {
				window.location.replace('/results');
			}
			textIndex++;
		}, 10000);
		refreshNbVotesInterval = setInterval(async () => {
			let nbVotesResponse = await fetch('/api/nbvotes.json');
			const body = await nbVotesResponse.json();

			nbVotes = body.nbVotes;
		}, 1000);
	});

	onDestroy(() => {
		clearInterval(apiInterval);
		clearInterval(refreshNbVotesInterval);
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
