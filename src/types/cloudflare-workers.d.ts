declare module "cloudflare:workers" {
  export const env: {
    WORKSHEET_RATE_LIMITER?: {
      limit(options: { key: string }): Promise<{ success: boolean }>;
    };
  };
}
