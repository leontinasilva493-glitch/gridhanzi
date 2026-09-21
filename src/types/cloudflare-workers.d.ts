declare module "cloudflare:workers" {
  export const env: {
    WORKSHEET_RATE_LIMITER?: {
      limit(options: { key: string }): Promise<{ success: boolean }>;
    };
    FEEDBACK_RATE_LIMITER?: {
      limit(options: { key: string }): Promise<{ success: boolean }>;
    };
    FEEDBACK_EMAIL?: {
      send(message: {
        to: string;
        from: string;
        subject: string;
        text: string;
        html: string;
        replyTo?: string;
      }): Promise<{ messageId: string }>;
    };
    FEEDBACK_TO_EMAIL?: string;
    FEEDBACK_FROM_EMAIL?: string;
  };
}
