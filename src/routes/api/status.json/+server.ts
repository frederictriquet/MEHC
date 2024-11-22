// import { getStatus } from "$lib/supabaseClient";
import { getStatus } from "$lib/sqliteClient";
import { json, type RequestHandler } from "@sveltejs/kit";


export const GET: RequestHandler = async (event) => {
  const status = await getStatus(event);
  return json({status: status});
}