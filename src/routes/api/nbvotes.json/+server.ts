import { getTotalVotes } from "$lib/sqliteClient";
import { json, type RequestHandler } from "@sveltejs/kit";


export const GET: RequestHandler = (event) => {
	const nbVotes = getTotalVotes(event);
  return json({ nbVotes });
}