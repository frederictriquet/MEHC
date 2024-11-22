import type { Handle } from '@sveltejs/kit'
import pkg from 'sqlite3';
const {Database} = pkg;

export const handle: Handle = async ({ event, resolve }) => {
  const hasVoted = event.cookies.get('has-voted');
  event.locals.hasVoted = !!hasVoted;

  if (!event.locals.db) {
    // This will create the database within the `db.sqlite` file.
    const db = new Database('db.sqlite', (err) => {
      if(err) {
        throw err;
      }
    });
    
    // Set the db as our events.db variable.
    event.locals.db = db
    
    // We can create a basic table in the db
    const query = "CREATE TABLE IF NOT EXISTS meta (key TEXT PRIMARY KEY, value INT)"
    db.run(query, (err) => {
      if(err) {
        throw err
      }
    })
  }
  const resp = await resolve(event);
  return resp;
}
