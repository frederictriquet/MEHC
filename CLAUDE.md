# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MEHC is a murder mystery voting application built with SvelteKit 5. It allows participants to view suspects in a murder mystery game, cast votes for who they think is the killer, and view voting results in real-time. The application uses server-side rendering with a SQLite database backend and includes an admin interface for game management.

## Development Commands

### Local Development
```bash
npm run dev              # Start development server
npm run dev -- --open    # Start dev server and open browser
```

### Build & Production
```bash
npm run build            # Build for production (outputs to build/)
npm run preview          # Preview production build locally
node build               # Run production build
```

### Type Checking
```bash
npm run check            # Run type checking
npm run check:watch      # Run type checking in watch mode
```

### Database Management
```bash
./init-db.sh             # Initialize database with images from images/ directory
rm db.sqlite; sqlite3 db.sqlite < init.sql  # Reset database schema only
```

### Docker
```bash
docker build -t mehc .                      # Build Docker image
docker run -p 3000:3000 mehc               # Run container
./launch-docker.sh                          # Launch with docker-compose
```

## Architecture

### Application State Machine

The application operates with a global status flag stored in the `meta` table:
- **Status 0**: Pre-voting (participants see waiting screen)
- **Status 1**: Voting active (participants can vote)
- **Status 2**: Results visible (redirect all users to results page)

Status transitions are managed through the admin interface at `/admin`.

### Data Flow

1. **Database Layer** ([src/lib/sqliteClient.ts](src/lib/sqliteClient.ts))
   - All database operations are centralized here
   - Functions expect `event` object (not direct DB connection) for accessing `event.locals.db`
   - Database connection is initialized once per request in [hooks.server.ts](src/hooks.server.ts)
   - Uses synchronous `better-sqlite3` API (`.prepare()`, `.run()`, `.get()`, `.all()`)

2. **Cookie-Based Voting Control**
   - `has-voted` cookie prevents double voting
   - Set after vote with 24-hour expiration, httpOnly, secure, sameSite strict
   - Cleared automatically when status returns to 0 (in main page load)
   - Can be manually cleared via `/revote` endpoint

3. **Client Polling**
   - Main voting page polls `/api/status.json` every 10 seconds
   - Automatically redirects users when game status changes
   - Polling cleanup handled in `onDestroy` lifecycle hook

4. **Redirect Flow**
   - Status 0: Users with `has-voted` cookie are allowed on `/`, cookie cleared
   - Status 1: Users with `has-voted` cookie redirected from `/` to `/results`
   - Status 2: All users redirected from `/` to `/results`
   - Status 0: Users redirected from `/results` back to `/`

### Key Routes

- `/` - Main voting interface (redirects based on status and voting state)
- `/results` - Live results with bar chart visualization
- `/revote` - Clears voting cookie and redirects to home (useful for testing)
- `/admin` - Game management (status control, suspect management)
- `/admin/[id=integer]` - Individual suspect editing (uses custom param matcher in [src/params/integer.js](src/params/integer.js))
- `/api/status.json` - Status endpoint for client polling
- `/api/nbvotes.json` - Vote count endpoint

### Database Schema

**meta table**: Stores application state
- `key`: 'status' (primary key)
- `value_int`: Current status (0, 1, or 2)

**suspects table**:
- `rowid`: Auto-generated ID (used as suspect identifier)
- `real_name`: Person's actual name
- `name`: Display name (can be modified for mystery)
- `is_playing`: Boolean (0/1) - whether suspect is active in current game
- `votes`: Vote counter
- `picture_data`: Base64-encoded image data URI

### Important Implementation Details

- **Suspect IDs**: Use `rowid` not `id` field - queries use `rowid as id`
- **Image Storage**: Pictures stored as base64 data URIs directly in database
- **Admin Access**: No authentication - admin routes are publicly accessible
- **Adapter**: Uses `@sveltejs/adapter-node` with CSRF protection disabled
- **Database Library**: Uses `better-sqlite3` (synchronous), not `sqlite3`. Type definitions in [app.d.ts](src/app.d.ts) import from `sqlite3` but runtime uses `better-sqlite3`
- **Param Matchers**: Custom `integer` param matcher validates numeric IDs using regex `/^\d+$/`

### Component Structure

- **Graph.svelte**: Uses Observable Plot for bar chart visualization
- **Podium.svelte**: Displays top 3 suspects
- **Breadcrumb.svelte**: Navigation breadcrumbs for admin
- **HomeLink.svelte**: Home button component

### Styling

- Uses Tailwind CSS with PostCSS
- Custom styles in component `<style>` blocks use PostCSS with `@apply` directives
- Main layout in [src/routes/+layout.svelte](src/routes/+layout.svelte)

## Admin Capabilities

The admin interface at `/admin` provides:
- **Status Control**: Toggle between statuses 0, 1, 2 to control game flow
- **Reset Votes**: Clear all vote counts to restart voting
- **Suspect Management**:
  - Toggle `is_playing` flag to include/exclude suspects from current game
  - Edit suspect display names (keeps `real_name` unchanged)
  - Delete suspects from database
  - Add new suspects
- **Picture Upload**: Upload/update suspect pictures at `/admin/[id]` (converted to base64 data URI)

## Common Workflows

### Running a Complete Voting Session

1. **Setup**: Ensure database is initialized with suspects via `./init-db.sh`
2. **Pre-Game**: Set status to 0 - participants navigate to `/` and see waiting screen
3. **Start Voting**: Change status to 1 via admin - participants can now vote
4. **View Results**: Change status to 2 - all users redirected to `/results` with live bar chart
5. **Reset**: Use "Reset Votes" button in admin, set status back to 0 for next round

### Testing Workflow

- Visit `/revote` to clear your voting cookie and vote again
- Check `/api/status.json` to see current status value
- Use admin to toggle suspects' `is_playing` status to test different lineups

## Database Initialization Workflow

The `init-db.sh` script:
1. Drops and recreates database from `init.sql`
2. Loads all `.jpg` images from `images/` directory
3. Inserts suspects with base64-encoded images
4. Marks suspects as "playing" based on names in `players.txt`

**Note**: Place suspect photos (`.jpg`) in `images/` directory with filenames matching their real names before running the script.

## Deployment

The app is designed for Docker deployment:
- Multi-stage build optimizes image size
- Database file (`db.sqlite`) must be present at runtime (copied into image)
- Runs on port 3000 in production
- Uses Node 20 Alpine base image
- Production dependencies only in final image (`npm prune --production`)

## Gotchas & Common Issues

- **Type mismatch**: [app.d.ts](src/app.d.ts) imports `sqlite3` types but code uses `better-sqlite3` - type errors may occur
- **CSRF disabled**: CSRF protection is disabled in [svelte.config.js](svelte.config.js) (`checkOrigin: false`) - acceptable for local/controlled network use
- **No authentication**: Admin routes are completely public - secure the deployment environment accordingly
- **Base64 storage**: Large images stored as base64 in database increase size significantly - consider external storage for production scale
- **Polling overhead**: Every connected client polls status every 10 seconds - consider WebSockets for high user counts
- **Cookie clearing**: Status 0 only clears cookies for users who load the main page - stale cookies may persist for inactive users
