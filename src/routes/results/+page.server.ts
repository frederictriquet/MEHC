import { getStatus, getSuspects, getTotalVotes } from '$lib/sqliteClient';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = (event) => {
	const status = getStatus(event);
	if (status === 0) {
		throw redirect(303, '/');
	}
	const suspects = getSuspects(event, false);
	const nbVotes = getTotalVotes(event);

	return {
		status,
		suspects,
		nbVotes
	};
};
