import { getSuspects } from "$lib/sqliteClient";
import { json, type RequestHandler } from "@sveltejs/kit";


export const GET: RequestHandler = async (event) => {
	const suspects = await getSuspects(event, false);
	const nbVotes = suspects?.map((e) => e.votes).reduce((previous, current) => previous + current, 0) ?? 0;

  return json({nbVotes: nbVotes});
}