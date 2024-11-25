import { getStatus, getSuspects, voteForSuspect } from '$lib/supabaseClient';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async (event) => {
	const status = await getStatus();
	switch (status) {
		case 0:
			event.cookies.delete('has-voted');
			break;
		case 2:
			throw redirect(303, '/results');
		default:
			break;
	}
	if (event.cookies.get('has-voted')) {
		throw redirect(303, '/results');
	}
	const suspects = await getSuspects();
	return { status: status, suspects: suspects };
}) satisfies PageServerLoad;

/** @type {import('./$types').Actions} */
export const actions = {
	vote: async ({ request, cookies }) => {
		const status = await getStatus();
		if (status === 1) {
			const data = await request.formData();
			const suspectId = data.get('selectedSuspect');
			await voteForSuspect(suspectId);
		}
		cookies.set('has-voted', true, {
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
