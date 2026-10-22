# Worksheet help and optional feedback

There is no global survey, timer, preview-triggered invitation, or automatic
modal. English and Chinese copy is defined together in the help components.

## Entry points

- After a generated PDF download starts, an inline hint below the preview toolbar
  offers worksheet adjustments. It never takes focus or opens a form. Closing it
  suppresses download hints for 30 days using the existing cooldown key; previous
  cooldowns are respected. Storage failure still permits in-memory dismissal.
- The preview's permanent "Having trouble?" link opens inline help. Download
  errors also link to that help. Browser printing is offered before an issue
  report; the copy explains that paper printing does not preserve tablet 3:4.
- The templates page offers classroom, child, personal and HSK starting points.
  Every recommendation links to an existing template, word input, grid page or
  HSK picker. Browsing and printing never depend on choosing a use or role.

Adjustment links resume custom worksheets, including unfinished editor rows,
and focus the relevant setting. Template previews explicitly reopen the original
template; preview paper/margin changes do not carry over. Stroke guides require
Learn mode, and switching requires a button click rather than automatic changes.
Flashcards get card-layout help instead of nonexistent writing-cell controls.

## Feedback and data boundaries

Only an explicit request opens the inline form. It asks for one description,
an optional self-reported role, and optional permission for follow-up. The email
field appears only after that permission is checked; unchecking clears it and
omits the address from submission. Age is not requested. There is no promise of
delivery of a feature, a reply, or a response deadline.

Closing a form does not reopen an invitation and suppresses download hints for
30 days. A successful submission suppresses them for 180 days; closing afterward
never shortens that cooldown. Manual help remains available. A failed submission preserves its
text across closing/reopening within the same mounted page (not across reloads
or navigation). Requests time out after 20 seconds. Success is shown only after
the API returns an accepted result; success does not imply a feature was built.
The contact email fallback remains available on failure.

The existing mail API receives the description, optional role/contact, locale,
pathname without query/hash, allowlisted source/kind and optional selected use.
No worksheet contents are attached. Classroom use is explicitly labelled as a
use, not proof that the visitor is a teacher. Legacy API fields remain accepted
for older clients, but the new UI does not collect age or three separate essays.

`data-clarity-mask` covers the form and its descendants, following the
[Clarity masking documentation](https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-masking).
GA4 help events send only fixed categories and a query-free page URL:

| Event | Meaning |
| --- | --- |
| `worksheet_use_selected` | User selected a template use |
| `worksheet_help_open` | User opened preview help or adjustments |
| `worksheet_help_action` | User chose an adjustment, print, recommendation or form |
| `worksheet_feedback_sent` | Feedback API accepted a request |

Parameters are `help_source`, `help_action` and optional `worksheet_use`.
There is no feedback text, role, email, vocabulary or student name in these
events. Compare them with existing preview/download events to evaluate whether
help leads to task completion. A download event is not proof of a physical print.

## Production email configuration

Production configuration:

1. Configure the `FEEDBACK_EMAIL` Cloudflare Email binding for the Worker. The sender domain must be onboarded to Cloudflare Email Routing/Email Service.
2. Set `FEEDBACK_TO_EMAIL` to an already verified Destination Address (use a Wrangler secret or variable; do not commit the address).
3. Optionally set `FEEDBACK_FROM_EMAIL`; the default is `feedback@gridhanzi.org` and it must belong to the onboarded sender domain.
4. Deploy with `wrangler.jsonc`; the `FEEDBACK_RATE_LIMITER` binding is included in that deployment. Do not add a personal inbox or secret to the repository.
5. After deployment, submit one test response and check the verified Destination Address Inbox and Spam folders.

The local app returns `503` for a real submission unless these runtime bindings are available. A failed request remains in the browser form and can be retried. No real delivery is verified by local tests.
