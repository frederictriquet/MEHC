import type { PageServerLoad } from './$types';
import { getSuspect, updateSuspectPicture } from '$lib/sqliteClient';

export const load = (async (event) => {
	const id = parseInt(event.params.id);
	const suspect = await getSuspect(event, id);
	// console.log(suspect);
	return { suspect }; //{ url: url };
}) satisfies PageServerLoad;

/** @type {import('./$types').Actions} */
export const actions = {
	uploadPicture: async (event) => {
		const id = parseInt(event.params.id);
		const data = await event.request.formData();
		const pictureData = data.get('pictureData');
		await updateSuspectPicture(event, id, pictureData);
		return { success: true };
	}
};
