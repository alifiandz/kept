# Kept prototype release freeze

This checklist records the approved prototype handoff before the Jagoan Hosting VPS deployment. The prototype remains a device-local demonstration until the production database and authentication are configured.

## Frozen demo journey

- Landing page and open-trip discovery
- Bromo destination page
- Bromo Sunrise Weekend trip detail
- Promise Card and locked version
- Change Log and supporting evidence labels
- Promise versus Reality and Truth Score explanation
- Truth Guard signals
- Organizer verification status
- Contact-operator handoff
- Trip Pass `BRM-2409-017`
- Reality Check submission
- Organizer dashboard and management tabs

## Release verification

- [x] Five required JHIC partner logos are present
- [x] Destination image files are unique and locally served
- [x] Photo credits and licenses are available
- [x] Bromo price, date, capacity, score, operator, and statuses are consistent
- [x] Search, reset, operator lookup, comparison, and saved-destination flows work
- [x] Valid and invalid direct links have explicit states
- [x] Refresh preserves device-local demo records
- [x] Contact Operator does not claim to process booking or payment
- [x] Page-specific metadata, sitemap, robots, and manifest are present
- [x] TypeScript, lint, integrity tests, Sites build, and Webuzo build pass
- [ ] Final physical-phone visual check by Team Knot
- [ ] One uninterrupted seven-minute demo rehearsal

## Do not change after approval

- Brand color `#496af1`
- Kept logo and Title Case product name
- Core Bromo demo facts
- Promise Card → Change Log → Reality Check → Truth Guard product logic
- Verify-then-contact-operator model
- Five-logo competition strip

## Deployment handoff

The next phase starts only after prototype approval:

1. Back up the empty Webuzo account and confirm the document root.
2. Deploy the approved build to `kept.my.id`.
3. Configure HTTPS, compression, caching, security headers, logs, and backups.
4. Add production authentication, shared database records, and evidence storage.
5. Verify every production route on desktop and mobile.
6. Run staged internal load tests before any official stress test.
7. Record only measured results for the final JHIC deck.
