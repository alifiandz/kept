# Kept

Editable source for the Kept open-trip transparency prototype.

## Development

Requires Node.js 22.13 or newer and npm.

```sh
npm ci
npm run dev
```

## Structure

- `app/`: pages, layouts, styles, and metadata
- `components/`, `hooks/`, `lib/`: interface components and prototype logic
- `public/`: original images, logos, and image attribution
- `tests/`: existing integrity and component checks
- `worker/`, `build/`, `scripts/`, `.openai/`: retained Sites build support
- `db/`, `drizzle/`, `examples/`: existing database scaffolding

## Build and checks

```sh
npm run typecheck
node --test tests/kept-integrity.test.mjs
npm run build:webuzo
```

The portable Next.js configuration exports static files into `out/`. Serve that output on a staging host to review before any production release. `npm run build` retains the original Sites/Vinext build path; its helper scripts expect Linux utilities. The rendered-HTML test and CSS portion of the component suite require that Worker build in `dist/`, rather than the static export. Run the full existing test suite after a successful Worker build on its supported Linux environment.

## Source provenance

Migrated from the existing `kept-free-hosting` editable checkout. Its baseline matches original Sites version 37, commit `22851350a968b4cd89da8cfe2a92246e952334c3`. The existing portable hosting adaptations are preserved. This repository begins with a sanitized source snapshot; old Git history and local runtime data are not imported.

This remains a prototype using browser local storage. Stored browser data is separate from the source repository. No production database or authentication backend was added.

## Future releases

1. Work on a feature branch and review the diff.
2. Install from the lockfile and run the checks above.
3. Build and validate a staging copy, including all assets and attribution.
4. Release only after review, retaining a backup of the current production files.

The migration does not connect automatic deployment, alter DNS, or change existing hosting. Domain configuration is intentionally omitted here. The existing Vercel configuration supports a static export; a future deployment should upload the complete output, including every image. Existing deployments may use a separate image asset project, so keep current projects intact until a replacement is tested.

## Secrets and generated files

Environment files, credentials, dependency folders, build output, caches, logs, and local deployment records are excluded. Configure any future secrets through the deployment provider. No secret is required for the current static prototype. Third-party assets retain their existing credit and license files.
