// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces

import type { Database } from 'better-sqlite3';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			hasVoted: boolean;
			db: Database;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
