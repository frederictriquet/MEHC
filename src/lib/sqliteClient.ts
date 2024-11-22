

export async function getStatus(event) {
	const { data, error } = await event.locals.db..from('meta').select(`value_int`).eq('key', 'status');
	if (error) console.log(error);
	if (!data) return 0;
	return data[0].value_int;
}