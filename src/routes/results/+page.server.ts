import { getStatus, getSuspects, voteForSuspect } from '$lib/supabaseClient';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	const status = await getStatus();
	if (status === 0) {
		throw redirect(303, '/');
	}
	const suspects = await getSuspects();
	const nbVotes = suspects?.map((e) => e.votes).reduce((previous, current) => previous + current);

	return {
		status: status,
		suspects: suspects,
		nbVotes: nbVotes
	};
}) satisfies PageServerLoad;

/** @type {import('./$types').Actions} */
export const actions = {
	vote: async ({ request }) => {
		const data = await request.formData();
		const suspectId = data.get('selectedSuspect');
		// console.log([suspectId, roomId]);
		await voteForSuspect(suspectId);
		throw redirect(303, '/results');
		return { success: true };
	}
};
