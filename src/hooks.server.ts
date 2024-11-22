import type { Handle } from '@sveltejs/kit'
import Database from 'better-sqlite3'

export const handle: Handle = async ({ event, resolve }) => {
    const hasVoted = event.cookies.get('has-voted');
    event.locals.hasVoted = !!hasVoted;
    if (!event.locals.db) {
        // This will create the database within the `db.sqlite` file.
        event.locals.db = new Database('db.sqlite');
    }
    const resp = await resolve(event);
    return resp;
}
