import type { PageServerLoad } from './$types';
import { getSuspect, updateSuspectPicture } from '$lib/supabaseClient';

export const load = (async ({ params }) => {
	const id = parseInt(params.id);
	const suspect = await getSuspect(id);
	// console.log(suspect);
	return { suspect }; //{ url: url };
}) satisfies PageServerLoad;

/** @type {import('./$types').Actions} */
export const actions = {
	uploadPicture: async ({ params, request }) => {
		const id = parseInt(params.id);
		const data = await request.formData();
		const pictureData = data.get('pictureData');
		await updateSuspectPicture(id, pictureData);
		return { success: true };
	}
};
