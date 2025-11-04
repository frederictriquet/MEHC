import type { Handle } from '@sveltejs/kit'
import Database from 'better-sqlite3'

// Create a single database connection at module level to be reused for all requests
const db = new Database('db.sqlite');

export const handle: Handle = async ({ event, resolve }) => {
    const hasVoted = event.cookies.get('has-voted');
    event.locals.hasVoted = !!hasVoted;
    // Reuse the single database connection for all requests
    event.locals.db = db;
    const resp = await resolve(event);
    return resp;
}
