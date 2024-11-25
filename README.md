
## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.


# Packages
npm i tailwindcss
npm i @observablehq/plot
npm i better-sqlite3
npm i -D @types/better-sqlite3
npm i -D @types/node
npm i -D autoprefixer
npm i -D @sveltejs/adapter-node
rm db.sqlite; sqlite3 db.sqlite < init.sql 