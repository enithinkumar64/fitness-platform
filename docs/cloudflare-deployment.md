# VAJRYA Cloudflare Workers deployment preparation

Prepared October 20, 2026. **Nothing has been deployed. No account, paid plan, resource, domain, cloud credential or Git integration was activated.** Review these changes before any later deployment.

## Adapter decision

Use the pinned **@opennextjs/cloudflare 1.20.12** adapter with **Wrangler 4.151.3**. The adapter peer range includes this project's Next.js 16.4.2. It adapts the existing Next build rather than replacing the framework. App Router, static exercise guides, Server Components and route handlers match its supported features; our original Turbopack build remains. No Node middleware, database, Server Actions, ISR, remote image optimization or filesystem-dependent application server code was found that requires an extra Cloudflare product.

Cloudflare currently recommends **vinext** for new Next.js projects. It provides a Vite-based Next API implementation and can coexist with Next development, but introduces a second compiler/runtime path. For this existing tested app, OpenNext is the smaller change. Do not run automatic Wrangler framework configuration or `vinext init` as part of these instructions. `@cloudflare/next-on-pages` and static export are not appropriate replacements for the retained Node route handlers.

Official sources, reviewed on the preparation date: [Cloudflare Next.js/vinext guide](https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/), [OpenNext adapter guide](https://developers.cloudflare.com/workers/framework-guides/web-apps/opennext/), [adapter compatibility](https://opennext.js.org/cloudflare), and [static-assets cache guidance](https://opennext.js.org/cloudflare/caching#ssg-site). Pinned registry peers and the actual local build/runtime tests are the project-specific evidence; broad feature support alone is not a guarantee.

## Local commands

Node **22 or newer** is needed for the pinned Wrangler (tested with 22.20.0); use a supported LTS release. Existing commands remain unchanged:

```sh
npm run dev
npm run build
npm run start
npm run test
```

Cloudflare commands:

```sh
npm run build:cloudflare
npm run check:cloudflare
npm run preview:cloudflare
npm run test:cloudflare
```

Build first. `check:cloudflare` is a **local dry run**, not an upload. Preview runs workerd locally at `http://localhost:8787`; stop it before `test:cloudflare`, which starts its own preview. Tests do not deploy. Normal Playwright uses its separate production Next server at port 3100.

**Do not run the following yet:** `npm run deploy:cloudflare`. It is the actual remote deployment command provided for a future approved release. It deploys the already built artifact; rebuild after changing source/configuration or SEO variables. No upload/version-publish command was executed during preparation.

## Secret-free build and files

OpenNext's `compileEnvFiles` reads all standard environment modes and serializes dotenv values into its Worker output. Simply leaving a key out of `wrangler.json`, or clearing a shell variable, does **not** prevent a developer's `.env.local` from being included. For this reason, `scripts/cloudflare.mjs` builds an allowlisted copy in ignored `.cloudflare-build/`, excluding all original dotenv files, tests, personal data and Git metadata. It reuses local installed dependencies via a filesystem copy (copy-on-write where supported). It does not install dependencies, rename/delete original environment files or edit developer credentials.

Only normal OS build settings and the two public SEO settings are passed to the build. An empty staging `.dev.vars` and disabled Wrangler dotenv fallback keep the local Worker preview independent of the original developer key. Before preview/check/deploy the wrapper verifies that all three compiled dotenv exports are empty. Use these npm scripts, not raw OpenNext commands from the repository root. Local staging uses disk space; it is disposable and recreated by the next Cloudflare build. Additional build-time environment needs must be explicitly reviewed before being allowlisted.

The root `wrangler.json` points to staged output. Its staging copy adjusts paths for OpenNext, defines only ASSETS and a self Worker service reference, and has no USDA key, R2, KV, D1, Queues, Images or Durable Object bindings. Read-only prerendered cache assets are populated **locally** during the build; official OpenNext preview/deploy commands also perform the adapter's cache preparation. There is no writable ISR cache; adding revalidation later requires a separate architecture/cost review. `public/_headers` marks hashed static assets immutable.

Do not add **FDC_API_KEY**, **NEXT_PUBLIC_FDC_API_KEY**, or USDA credentials to Cloudflare build variables, runtime variables, secrets or bindings. The dashboard must also be checked for pre-existing secrets: a local configuration cannot remove an already configured cloud secret. Both production-prepared endpoints correctly return helpful **503** responses without the key, while validation still returns **400** for bad input. Starter-food logging remains available. Enabling live USDA later needs the FF-04 deployment-wide protection work, not just an API key.

## Production URL and indexing (FF-06)

No final hostname is configured or invented. The Worker name is `vajrya`; its account subdomain is not known until the owner creates/configures the Worker. A worker name is not a complete production URL. If changing the Worker name, change the self-reference service name in `wrangler.json` to match.

| Build environment variable | Initial value | After the real URL is assigned |
| --- | --- | --- |
| `SITE_URL` | Unset | Copy the exact public HTTPS origin from Cloudflare; no path, query, fragment, credentials, custom port or localhost/IP address |
| `SITE_INDEXABLE` | Unset / `false` | Set exactly `true` only after public release review |
| `FDC_API_KEY` | **Absent** | Keep absent |

Supply SITE settings as **build variables**, then rebuild/redeploy. They are public metadata, not secrets. Changing only a runtime variable cannot update prerendered metadata. They are intentionally not taken from `.env.local` by the Cloudflare wrapper. For an explicitly configured local build, set shell SITE variables before `npm run build:cloudflare`; the hostname in unit tests is reserved test data, not an assigned deployment address.

`src/lib/site-url.ts` validates the origin and supplies canonical/Open Graph URLs for each known page; titles and descriptions remain unchanged. Exercise metadata uses its actual slug. `/sitemap.xml` contains the 112 actual public destinations when configured and indexable, excluding APIs, query strings and saved user data. It does not invent last-modified dates. `/robots.txt` references the configured sitemap and excludes API crawling when indexing is enabled.

With no URL or no explicit indexing opt-in, pages say **noindex, nofollow**, robots disallows crawling and the sitemap contains no URL entries. No localhost canonical is emitted. Preview version URLs are disabled in Wrangler configuration. If enabling preview deployments later, build them with `SITE_INDEXABLE=false` and never expose their hostname as a production canonical. Robots directives are indexing guidance, **not access control**.

FF-06 is **partially mitigated/prepared**, not fully resolved until the owner supplies the real hostname and verifies canonical, Open Graph, sitemap and robots responses on the deployed origin. Favicon/social preview artwork remains the separately tracked FF-12 work.

## First deployment later — owner steps

These are instructions for **after review and approval**, not actions already performed:

1. Create/sign in to a Cloudflare account, verify email and enable account security. Stay on **Workers Free**. Do not add a payment method/product, buy a domain, enable R2 billing or upgrade a plan as part of this setup. Review the [Developer Platform terms](https://www.cloudflare.com/service-specific-terms-developer-platform/) and account agreement for the intended business use. The published free offering/terms reviewed here do not impose a hobby-only workflow; this is not a legal eligibility certification.
2. After approving the code, save and push it yourself when ready. Cloudflare's Git integration builds committed repository content, not unsaved local changes. This task has not committed or pushed anything.
3. In **Workers & Pages**, choose the Workers/Git repository connection/import workflow. Authorize the Cloudflare GitHub app for this existing repository only. Select the production branch and repository-root directory. Keep the repository name unchanged. UI labels may evolve; do not choose a Pages static-export preset or accept an automatic vinext migration.
4. Review build settings **before saving/deploying**: Node 22 LTS or newer (for example set `NODE_VERSION=22.20.0` if the build UI requires it); install with `npm ci` including devDependencies; build command **`npm run build:cloudflare`**; deployment command **`npm run deploy:cloudflare`**. There is no Pages output-folder setting. Do not run `npm run build` alone as the Worker build. Do not omit devDependencies before building.
5. Confirm all USDA credentials are absent from both build and runtime settings, and the project has no existing secret bindings. Initially leave SITE_URL unset and indexing disabled. Disable automatic preview/branch deployments if not intended. Connecting/saving a build can immediately deploy: stop until explicit release approval.
6. When deployment is approved, allow the first noindex deployment, copy the **actual assigned workers.dev HTTPS address** from Cloudflare, and verify the app. Set that exact origin as build SITE_URL while keeping SITE_INDEXABLE false, rebuild and check canonicals/OG. When release checks pass, set SITE_INDEXABLE true and rebuild/deploy again. Do not use a sample hostname. A custom domain is optional and not purchased or configured here.
7. Smoke-test all routes, unknown guide 404, mobile navigation, one calculator, starter food logging, Progress saving/CSV and cross-tab conflicts. Verify `/robots.txt`, `/sitemap.xml`, unique canonicals, Open Graph URLs, API 503 without a key, HTTPS and browser Web Locks. Inspect host errors/CPU/request metrics, including cold starts, before advertising the Free deployment as reliable. Do not log diary contents, sensitive notes or credentials.
8. Keep a rollback path to the previous reviewed Worker version, monitor usage/errors, and confirm Cloudflare account quotas/terms again on release day. Do not automatically enable a paid plan if the free runtime proves insufficient.

See [GitHub integration](https://developers.cloudflare.com/workers/ci-cd/builds/git-integration/github-integration/) and [Workers build settings](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/). The CLI deployment alternative requires the owner to authenticate later; no authentication was performed here.

## Cost and operational limits

Expected infrastructure cost is **$0 while using Workers Free within its quotas**, the included workers.dev address and no optional paid products. The paid Worker plan starts at $5/month but was not activated. This is not a guaranteed forever-free workload estimate. [Pricing](https://developers.cloudflare.com/workers/platform/pricing/)

Current documented Free limits: **100,000 Worker requests/day, 10 ms CPU/invocation, 128 MB memory, 50 subrequests/request, 1-second startup**, 20,000 asset files, 25 MiB per asset. The current official limit is **64 MiB uncompressed Worker code, no compressed size cap**; some older OpenNext material still quotes earlier compressed limits, so recheck the current platform page/account at release. Static-asset delivery is free/unlimited; requests that actually execute the Worker still use its budget. [Limits](https://developers.cloudflare.com/workers/platform/limits/)

Workers Builds Free includes **3,000 minutes/month, one concurrent build and a 20-minute timeout**. Avoid builds on every experimental branch unnecessarily. [Build limits/pricing](https://developers.cloudflare.com/workers/ci-cd/builds/limits-and-pricing/)

Local workerd confirms functionality, not billed CPU, cold-start acceptance, real traffic capacity, SLA or deployed security headers. Prerendered assets/cache reduce runtime work, but cannot prove the app fits 10 ms CPU under real cold/warm traffic. Exceeding free quotas can fail requests. No durable user storage is provided by this Worker.

## Privacy, browser data and monetization review

Nutrition/Progress keep their original storage keys, schemas, IDs, units and cross-tab protocol. Records remain in the **current browser/profile and origin**, are not encrypted or cloud-synchronized, and can be lost when site data is cleared. Localhost data will not appear automatically on workers.dev; a later custom-domain move also uses a different origin. Progress CSV export is not a full importable backup; Nutrition has no export/import. No migration or user-data transfer is silently attempted.

The site retains educational estimate disclaimers, adult bounds, screening safeguards and original external-video attribution. Before monetization, the owner should establish truthful operator/contact/privacy information: browser-local sensitive tracking, hosting request/log handling, data deletion limits and third-party links. Review applicable privacy/consent requirements for the intended users, especially **before** adding ad networks, analytics or affiliate tracking. Affiliate/sponsored relationships and advertising must be distinguishable and appropriately disclosed; see [FTC endorsement/advertising guidance](https://www.ftc.gov/business-guidance/advertising-marketing/endorsements-influencers-reviews). No ads, analytics, consent provider, policy page, legal identity or medical claim was invented in this task. This preparation is not a legal-compliance or clinical certification.

## Verification and dependency notes

- Original lint, TypeScript and Next production build passed. Two full Next Playwright runs: **376 passed, 8 intentional skips** each (59.9 s / 54.6 s).
- Unit tests: **150 passed** including new URL/indexing/sitemap tests. They use a reserved test origin and do not invent the real hostname.
- Isolated OpenNext build and local cache population passed. Final workerd smoke suite: **4 passed (4.1 s)**, covering all 112 routes, unknown guide 404, both USDA 503 endpoints/400 validation, noindex discovery defaults and 320px diary reload persistence. After cache population, the earlier read-only-cache write errors were absent.
- Local Wrangler dry run: **6,440.70 KiB uncompressed / 1,301.56 KiB gzip**, **217 asset files**. Only ASSETS/self-reference bindings were listed; no upload occurred. Startup/CPU acceptance still needs the eventual deployed test.
- Secret check inspected **1,565** staged output/dry-run/client files: the existing local private USDA key was absent; all compiled dotenv modes were empty. No secret value was printed, changed or saved in documentation.
- Installation adds pinned OpenNext/Wrangler development tooling and its transitive tree. A scoped npm override for **@node-minify/core → glob 10.5.0** fixes the newly introduced GHSA-5j98-mcp5-4vw2 glob CLI issue; parent code uses the unchanged `globSync` API and full builds pass. No formerly installed package version changed. Framework versions remain Next 16.4.2 / React 19.3.0.
- Full dependency audit remains **5 high development-chain affected nodes**, the original unpatched braces advisory (FF-08); production audit remains **0**. The temporary nine-node result after installing adapter tooling dropped back to five after the narrow same-major override. No forced fix or framework downgrade occurred.
- Initial isolated dependency symlinks failed Turbopack's filesystem boundary; dependency copies fixed it. Direct Wrangler preview before cache population returned working pages but logged cache write errors; the adapter's documented local cache-population/preview path fixed those. Restricted local HTTP probing needed approved process permissions. No final build/test was blocked.

Review `docs/launch-readiness-audit.md` for FF-04, FF-06, FF-08 and remaining release decisions. No live deployment, upload, cloud resource creation, GitHub connection, paid activation, commit or push was performed.
