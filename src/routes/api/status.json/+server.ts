import { getStatus } from "$lib/sqliteClient";
import { json, type RequestHandler } from "@sveltejs/kit";


export const GET: RequestHandler = (event) => {
  const status = getStatus(event);
  return json({ status });
}