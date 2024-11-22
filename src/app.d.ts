// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces

// import type {Database} from 'sqlite3'
import pkg from 'sqlite3';
const {Database} = pkg;

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
