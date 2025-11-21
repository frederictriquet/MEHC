import { getStatus, getSuspects, voteForSuspect } from '$lib/sqliteClient';
import { redirect, type ServerLoadEvent } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = (event) => {
	const status = getStatus(event);
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
	const suspects = getSuspects(event, false);
	return { status, suspects };
};

export const actions: Actions = {
	vote: async (event) => {
		const status = getStatus(event);

		// Only allow voting if status is 1
		if (status !== 1) {
			throw redirect(303, '/');
		}

		const data = await event.request.formData();
		const suspectIdStr = data.get('selectedSuspect');

		if (!suspectIdStr) {
			throw redirect(303, '/'); // No suspect selected
		}

		const suspectId = parseInt(String(suspectIdStr));
		if (isNaN(suspectId) || suspectId < 1) {
			throw redirect(303, '/'); // Invalid suspect ID
		}

		try {
			voteForSuspect(event, suspectId);
		} catch (error) {
			console.error('Vote failed:', error);
			// Still set cookie to prevent retry
		}

		event.cookies.set('has-voted', 'true', {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			secure: true,
			maxAge: 60 * 60 * 24
		});

		throw redirect(303, '/results');
	}
};
