# Browser stability and Clarity follow-up

## September 2026 fixes

- `StructuredData` emits one JSON-LD object per script, including when its caller
  supplies an array. This preserves schema entities and escaping while avoiding
  the Safari parser failure documented in
  [WebKit issue 255764](https://bugs.webkit.org/show_bug.cgi?id=255764).
  That issue was moved to Safari; its resolved status is not proof of a fix.
- The generator starts with the same empty date on the server and browser, then
  sets the local date after mounting. Subsequent renders do not replace a manual
  date, an intentionally cleared date, or a restored draft date. Do not add broad
  hydration-warning suppression to hide a mismatch.
- HSK choices restore after mounting, before persistence is enabled. Blocked
  browser storage must leave the picker and practice usable in memory.
- Failed preview handoff stays in the editor with a message. A missing, invalid,
  or unreadable saved worksheet shows a recovery message, never a sample sheet.
  A valid preview remains printable if later storage writes fail. Legacy
  worksheet keys are migrated without making printing depend on migration.
- Character conversion loads on demand. The editor temporarily disables form
  changes while conversion loads, and load failure keeps the vocabulary intact.
  HSK and PDF libraries already use dynamic imports; do not treat their entire
  generated chunk size as initial page transfer.

The [React #418 reference](https://react.dev/errors/418) explains the distinction
between server markup and the browser's first render. The text variant was
reproduced with UTC server HTML and Pacific/Honolulu browser dates on opposite
calendar days. This establishes a reproducible bug, not an attribution of every
historical Clarity session.

## Regression checks

Run the commands in the README against a fresh production build. Browser tests
use new contexts, prevent analytics traffic, and block paid API calls. They
replace the unchanged external font CSS with an empty response to exercise the
existing system-font fallback independently of CDN availability. They
exercise real UI and storage failures; they do not prove Safari's proprietary
JSON-LD parser behavior. Before a production release, also check real iOS Safari
and macOS Safari on home, generator, a template, and a learning page. Verify the
same schema entities, canonical URLs, and page indexability after the change.

The public content pages remain indexable according to `docs/SEO.md`.
`/practice` and `/worksheet/preview` remain excluded from the sitemap with
their existing page-level noindex settings. Compatibility fixes must not remove
structured data or change the acquisition page policy.

## Still requires actual error details

The supplied August 11–September 9 export included 2 `#418 html` entries and
3 `Script error.` entries without URL or stack information. Do not mark these as
fixed, suppress them globally, or attribute them to Clarity itself.

For one example of each remaining group, inspect existing Clarity details for:

1. Page pathname, timestamp, browser and OS versions, and deployed revision.
2. Script URL, line/column, error stack, and any component stack.
3. Whether the recording shows translation, failed navigation, or a failed
   worksheet/print action immediately before the error.

For `#418 html`, compare the affected server HTML with the first browser DOM and
check nesting or browser-injected markup before changing the rendering pipeline.
For `Script error.`, identify the script origin first; only then assess whether
cross-origin error details are available. Any additional diagnostics must exclude
student names, vocabulary, local drafts, cookies, and full query strings. No new
telemetry service or error suppression is introduced by this change.

After an authorized release, compare only the new revision's sessions in an
equivalent observation window and browser group. Error-table percentages are not
site-wide failure rates without the corresponding total-session denominator.

## Performance follow-up

The baseline manifest showed a conversion chunk of about 1.16 MB (about 496 kB
with local gzip) and an HSK chunk of about 2.05 MB (about 380 kB with local gzip).
These are local build sizes, not measured production transfer sizes. The browser
regression checks that opening the generator does not fetch the conversion chunk
and that switching between simplified and Taiwan traditional still works.

HSK is already loaded only when requested. Split its data by version/level only
if a real device/network measurement shows a user-facing delay; a chunk-size
warning alone is insufficient. Framework migration is outside this fix.

During local verification, the external LXGW font CSS import chain intermittently
held up DOMContentLoaded for more than 45 seconds; the corresponding local HTTP
page completed in about 20 ms. This is separate from the Clarity fixes. Evaluate
font self-hosting with the original font license and PDF font-consistency checks
before changing that delivery path. Browser regression success does not establish
that the external font CDN is reliable.
