# Public page rendering and Cloudflare 1102

## Evidence

The authenticated Cloudflare dashboard showed 127 CPU-time-limit errors and
zero memory-limit errors in the inspected 24-hour window. The resource account
uses Workers Free (10 ms CPU per request). Rendering the public React pages on
every request exceeded this budget. Repeated HTTP requests reproduced 1102.

## Release pipeline

Cloudflare Workers Builds must use `pnpm run deploy:public` as its deploy command,
with the existing repository, production branch and credentials unchanged.

1. `pnpm run build:public` cleans only the reproducible `dist` directory and runs
   the existing Vinext build.
2. A temporary local production server renders each sitemap route and its
   Chinese counterpart to matching HTML and RSC assets. Any failed render,
   incomplete HTML or non-RSC response fails the build.
3. The manifest records route paths, Git revision, RSC compatibility ID and
   route parameters. Assets and Worker are deployed together by
   `vinext deploy --skip-build`.
4. The lightweight Worker serves exact manifest paths through the ASSETS binding.
   It imports the React server only for other requests. Direct requests to the
   internal `/_public-pages/` artifacts return 404.

Tracking parameters and the RSC cache buster can use these public assets.
Business parameters, actions, API requests, authorization headers and unknown
paths retain the existing application behavior. User input and print previews
are never included in the manifest. Locale is selected by the route path.
Public HTML retains its existing canonical and robots metadata, including
Chinese-page noindex rules. No plan, CPU limit, email or rate-limit settings
are changed.

The prerender build rejects parallel/intercepting route directories. This is
necessary because ordinary Vinext client navigation includes the previous URL
in `X-Vinext-Interception-Context`; the current pages do not vary by that value.
Adding such routing requires reviewing this static dispatch boundary first.

## Verification

Run the unit suite, TypeScript check and `pnpm run build:public`. Start the actual
Worker using `pnpm exec wrangler dev --config dist/server/wrangler.json --port 4351 --local`.
Then run:

```powershell
$env:QA_BASE_URL = 'http://127.0.0.1:4351'
pnpm.cmd test:browser
node scripts/check-public-assets.mjs http://127.0.0.1:4351
```

The public probe checks both HTML and RSC for every generated path, does not
retry failures, and requires one consistent `X-GridHanzi-Build` value. Run it
against production after the Git build succeeds, with an optional third
argument naming a JSON evidence file. Also verify actual client navigation,
query-based worksheet prefills, preview/PDF, canonical redirects, unknown-path
404s and blocked internal artifacts. Production success must be checked
separately from local tests. Dynamic routes remain subject to Workers limits;
this change removes repeated rendering for the public acquisition pages.
