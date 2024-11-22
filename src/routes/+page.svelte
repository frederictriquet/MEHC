<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import type { PageData } from './$types';
	export let data: PageData;
	let selectedSuspect = -1;
	let apiInterval;

	$: name = data.suspects?.filter((s) => s.id == selectedSuspect)[0]?.name;
	$: voteButtonLabel =
		selectedSuspect == -1 ? "Vous devez d'abord choisir un suspect." : `Je vote pour ${name}.`;

	onMount(() => {
		apiInterval = setInterval(async () => {
			let statusResponse = await fetch('/api/status.json');
			const body = await statusResponse.json();
			// console.log(body.status, data.status);
			if (body.status != data.status) {
				// console.log('redirect');
				window.location.replace('/');
			}
		}, 10000);
	});

	onDestroy(() => {
		clearInterval(apiInterval);
	});
</script>

{#if data.status == 0}
	<h1 class="text-center">Merci de vous être connecté sur cette page.</h1>
	<h1 class="text-center">Conservez-la ouverte.</h1>
	<h1 class="text-center">Vous l'utiliserez plus tard pour voter.</h1>
	<img alt="Impropulsion" class="mx-auto w-96" src="impropulsion.jpg" />
{:else}
	<h1 class="text-center">Qui est l'assassin ?</h1>
	<h1 class="text-center">
		Désignez votre coupable en cliquant sur sa photo et confirmez en cliquant sur "Je vote pour
		...".
	</h1>

	<ul class="grid gap-6 w-full md:grid-cols-3">
		{#each data.suspects as suspect}
			<li>
				<input
					id="suspect{suspect.id}"
					type="radio"
					class="hidden peer"
					bind:group={selectedSuspect}
					value={suspect.id}
				/>
				<label for="suspect{suspect.id}" class="picturebutton w-full">
					<div class="w-full text-lg font-semibold text-center">
						<img class="mx-auto" src={suspect.picture_data} alt={suspect.name} />
						<!-- {suspect.name} -->
					</div>
				</label>
				{#if selectedSuspect == suspect.id}
					<form method="POST" action="?/vote">
						<input type="hidden" name="selectedSuspect" value={selectedSuspect} />
						<button
							class="w-full bg-green-700 rounded-md text-white p-4"
							disabled={selectedSuspect == -1}
							type="submit"><div class="w-full">{voteButtonLabel}</div></button
						>
					</form>
				{/if}
			</li>
		{/each}
	</ul>
	<div class="mt-10"></div>
{/if}

<style lang="postcss">
	.picturebutton {
		@apply inline-flex;
		@apply justify-between;
		@apply items-center;
		@apply p-5;
		@apply text-gray-500;
		@apply bg-white;
		@apply rounded-lg;
		@apply border-4;
		@apply border-gray-200;
		@apply cursor-pointer;
		@apply peer-checked:border-red-500;
		@apply peer-checked:bg-zinc-900;
		/* @apply hover:text-gray-600;
  @apply hover:bg-gray-100; */
	}
</style>
