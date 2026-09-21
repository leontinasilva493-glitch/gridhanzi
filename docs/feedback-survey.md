# Feedback survey

The low-distraction survey appears after 60 seconds of visible time or after a real worksheet preview loads. Dismissal suppresses automatic invitations for 30 days; a successful submission suppresses them for 180 days. The form does not upload worksheet contents.

Production configuration:

1. Configure the `FEEDBACK_EMAIL` Cloudflare Email binding for the Worker. The sender domain must be onboarded to Cloudflare Email Routing/Email Service.
2. Set `FEEDBACK_TO_EMAIL` to an already verified Destination Address (use a Wrangler secret or variable; do not commit the address).
3. Optionally set `FEEDBACK_FROM_EMAIL`; the default is `feedback@gridhanzi.org` and it must belong to the onboarded sender domain.
4. Deploy with `wrangler.jsonc`; the `FEEDBACK_RATE_LIMITER` binding is included in that deployment. Do not add a personal inbox or secret to the repository.
5. After deployment, submit one test response and check the verified Destination Address Inbox and Spam folders.

The local app returns `503` for a real submission unless these runtime bindings are available. A failed request remains in the browser form and can be retried. No real delivery is verified by local tests.
