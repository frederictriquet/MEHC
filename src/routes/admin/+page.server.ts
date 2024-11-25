import {
	createSuspect,
	deleteSuspect,
	getStatus,
	getSuspects,
	resetVotesForSuspects,
	updateStatus,
	updateSuspectName
} from '$lib/sqliteClient';
import type { PageServerLoad } from './$types';

export const load = (async (event) => {
	const status = await getStatus(event);
	const suspects = await getSuspects(event, true);
	console.log(status);
	console.log(suspects);
	return { status: status, suspects: suspects };
}) satisfies PageServerLoad;

/** @type {import('./$types').Actions} */
export const actions = {
	updateStatus: async (event) => {
		const data = await event.request.formData();
		const status = data.get('status');
		await updateStatus(event, status);
		return { success: true };
	},
	updateSuspectName: async (event) => {
		const data = await event.request.formData();
		const id = data.get('id');
		const name = data.get('name');
		await updateSuspectName(event,id,name);
		return { success: true };
	},
	deleteSuspect: async (event) => {
		const data = await event.request.formData();
		const id = data.get('id');
		await deleteSuspect(event,id);
		return { success: true };
	},
	createSuspect: async (event) => {
		const data = await event.request.formData();
		const name = data.get('name');
		await createSuspect(event,name);
		return { success: true };
	},
	resetVotes: async (event) => {
		await resetVotesForSuspects(event);
		return { success: true };
	}
};
