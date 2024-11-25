import { getStatus, getSuspects, voteForSuspect } from '$lib/sqliteClient';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async (event) => {
	const status = await getStatus(event);
	if (status === 0) {
		throw redirect(303, '/');
	}
	const suspects = await getSuspects(event, false);
	const nbVotes = suspects?.map((e) => e.votes).reduce((previous, current) => previous + current);

	return {
		status: status,
		suspects: suspects,
		nbVotes: nbVotes
	};
}) satisfies PageServerLoad;

/** @type {import('./$types').Actions} */
export const actions = {
	vote: async (event) => {
		const data = await event.request.formData();
		const suspectId = data.get('selectedSuspect');
		// console.log([suspectId, roomId]);
		await voteForSuspect(event, suspectId);
		throw redirect(303, '/results');
		// return { success: true };
	}
};
