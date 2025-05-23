import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
    event.cookies.delete('has-voted', { path: '/' });
    throw redirect(303, '/');
};
