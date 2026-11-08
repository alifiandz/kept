<div align="center">
  <img src="public/kept-logo.png" alt="Kept logo" width="88" />
  <h1>Kept</h1>
  <p><strong>Did they keep their promise?</strong></p>
  <p>An open-trip transparency platform that connects promises, changes, and participant experiences.</p>
</div>

## About

Kept helps travelers inspect what an operator promises before a trip and compare it with what participants experienced afterward. It focuses on evidence and transparency rather than promotional photos or a single star rating.

This repository contains the complete current application source, local image assets, attribution, dependency lockfile, build configuration, and tests. It is a working interactive prototype, not a finished production service.

## Features

- **Trip discovery:** browse destinations and filter trips by departure, month, and group size.
- **Operator lookup:** inspect sample operator records and promise-fulfillment scores.
- **Promise Card:** review the itinerary, facilities, price, and participant limits.
- **Change Log:** inspect changes, explanations, and replacement arrangements.
- **Trip Pass and Reality Check:** explore the demonstration participant flow and compare promises with experiences.
- **Traveler and organizer views:** saved destinations, comparison, and local account workflows.
- **Responsive interface:** shared layouts for desktop and mobile.

## Project status

| Implemented in the prototype | Still required for production |
| --- | --- |
| Interactive discovery, trip details, and sample evidence | Live operator onboarding and moderation |
| Device-local account and saved-item flows | Secure server-side authentication and authorization |
| Demonstration participant verification and reviews | Reliable verification with real participant records |
| Sample data and browser-local persistence | Shared database, backups, and cross-device persistence |
| Static deployment build and integrity checks | Operational monitoring and production security review |

Kept does not process bookings or payments. Demonstration verification and scores should not be interpreted as independently verified claims about real operators.

## Run locally

Requirements: Node.js **22.13+** and npm.

```sh
git clone https://github.com/alifiandz/kept.git
cd kept
npm ci
npm run dev:next
```

Open the local address printed by Next.js. No secret or environment file is required for the current static prototype.

## Build and validate

```sh
npm run typecheck
node --test tests/kept-integrity.test.mjs
npm run build:static
```

The static build writes to `out/`. Upload the complete output, including every image, to a static host. `NEXT_PUBLIC_SITE_URL` can optionally supply the canonical origin at build time; it is public configuration, not a secret.

The original Sites/Vinext path is retained through `npm run dev`, `npm run build`, and `npm run start`. Its build helpers expect Linux utilities. The rendered-HTML test and CSS portion of the component suite require the Worker build in `dist/`; they do not target the Next.js static export.

## Repository structure

```text
app/             Pages, layouts, styles, and page metadata
components/      Shared interface and account components
hooks/           Shared React hooks
lib/             Sample trip data and local account logic
public/          Images, Kept logo, and asset attribution
tests/           Integrity, rendering, and component checks
worker/          Original Worker entry point
build/, scripts/ Original Sites build helpers
db/, drizzle/    Database scaffolding; not a production database
examples/        Optional integration examples
.openai/         Original Sites hosting manifest
```

## Stack

Next.js · React · TypeScript · Tailwind CSS · shadcn/ui · Lucide

The retained alternate build path uses Vinext, Vite, and Cloudflare Workers. Database scaffolding uses Drizzle.

## Safe changes and releases

Work on a branch, review the diff, run the checks, and validate a separate preview before replacing production. Keep the previous deployment available for rollback. GitHub stores source code; pushing a commit does not itself publish the current website.

Environment files, dependencies, build artifacts, local credentials, logs, and runtime caches are excluded by `.gitignore`. Never commit real user data or deployment secrets.

## Assets and attribution

Destination photographs retain their creator and license records in `public/hero-credits.json`, `public/cover-credits.json`, and `public/image-credits.json`. The app also exposes a photo credits page. Third-party assets retain their respective rights and license conditions; repository visibility does not replace them.
