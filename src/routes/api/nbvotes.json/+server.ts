import { getSuspects } from "$lib/supabaseClient";
import { json, type RequestHandler } from "@sveltejs/kit";


export const GET: RequestHandler = async () => {
	const suspects = await getSuspects();
	const nbVotes = suspects?.map((e) => e.votes).reduce((previous, current) => previous + current);

  return json({nbVotes: nbVotes});
}