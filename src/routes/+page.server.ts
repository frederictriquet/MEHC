import { getStatus, getSuspects, voteForSuspect } from '$lib/sqliteClient';
import { redirect, type ServerLoadEvent } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async (event) => {
	const status = await getStatus(event);
	switch (status) {
		case 0:
			event.cookies.delete('has-voted', { path: "/" });
			break;
		case 2:
			throw redirect(303, '/results');
		default:
			break;
	}
	if (event.cookies.get('has-voted')) {
		throw redirect(303, '/results');
	}
	const suspects = await getSuspects(event, false);
	return { status: status, suspects: suspects };
}) satisfies PageServerLoad;

/** @type {import('./$types').Actions} */
export const actions = {
	vote: async (event: ServerLoadEvent) => {
		const status = await getStatus(event);
		if (status === 1) {
			const data = await event.request.formData();
			const suspectId = String(data.get('selectedSuspect') ?? '0');
			await voteForSuspect(event, parseInt(suspectId));
		}
		event.cookies.set('has-voted', 'true', {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			secure: true,
			maxAge: 60 * 60 * 24
		});

		throw redirect(303, '/results');
		// return { success: true };
	}
};
