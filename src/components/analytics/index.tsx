import { GoogleAnalytics } from "./google-analytics";
import { Plausible } from "./plausible";

export function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID?.trim();
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN?.trim();
  const plausibleSrc = process.env.NEXT_PUBLIC_PLAUSIBLE_SRC?.trim();

  if (!gaId && !plausibleDomain) return null;

  return (
    <>
      {gaId ? <GoogleAnalytics measurementId={gaId} /> : null}
      {plausibleDomain ? (
        <Plausible
          domain={plausibleDomain}
          src={plausibleSrc || undefined}
        />
      ) : null}
    </>
  );
}
