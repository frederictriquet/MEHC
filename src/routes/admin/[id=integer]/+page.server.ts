import type { Actions, PageServerLoad } from './$types';
import { getSuspect, updateSuspectPicture } from '$lib/sqliteClient';

export const load: PageServerLoad = (event) => {
	const id = parseInt(event.params.id);
	const suspect = getSuspect(event, id);
	return { suspect };
};

export const actions: Actions = {
	uploadPicture: async (event) => {
		const id = parseInt(event.params.id);
		const data = await event.request.formData();
		const pictureData = data.get('pictureData') as string;

		if (!pictureData) {
			return { success: false, error: 'Picture data is required' };
		}

		try {
			updateSuspectPicture(event, id, pictureData);
			return { success: true };
		} catch (error) {
			return { success: false, error: 'Failed to upload picture' };
		}
	}
};
