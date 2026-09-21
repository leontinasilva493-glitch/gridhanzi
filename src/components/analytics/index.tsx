import { GoogleAnalytics } from "./google-analytics";
import { Clarity } from "./clarity";
import { Plausible } from "./plausible";

const DEFAULT_CLARITY_PROJECT_ID = "xqa6y21mp0";
const DEFAULT_GOOGLE_ANALYTICS_ID = "G-GQR6DKVGGN";

export function Analytics() {
  const gaId =
    process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID?.trim() ||
    DEFAULT_GOOGLE_ANALYTICS_ID;
  const clarityProjectId =
    process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID?.trim() ||
    DEFAULT_CLARITY_PROJECT_ID;
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN?.trim();
  const plausibleSrc = process.env.NEXT_PUBLIC_PLAUSIBLE_SRC?.trim();

  if (!gaId && !plausibleDomain && !clarityProjectId) return null;

  return (
    <>
      {gaId ? <GoogleAnalytics measurementId={gaId} /> : null}
      {clarityProjectId ? <Clarity projectId={clarityProjectId} /> : null}
      {plausibleDomain ? (
        <Plausible
          domain={plausibleDomain}
          src={plausibleSrc || undefined}
        />
      ) : null}
    </>
  );
}
