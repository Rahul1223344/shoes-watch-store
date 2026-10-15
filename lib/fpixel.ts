
export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}

export const pageview = () => {
  if (typeof window === "undefined") return;

  if (typeof window.fbq === "function") {
    window.fbq("track", "PageView");
  } else {
    console.warn("[Meta Pixel] PageView skipped: Pixel not initialized.");
  }
};

export const event = (
  name: string,
  options: Record<string, unknown> = {}
) => {
  if (typeof window === "undefined") return;

  if (typeof window.fbq === "function") {
    window.fbq("track", name, options);
    console.info(`[Meta Pixel] ${name} event sent`, options);
  } else {
    console.warn(`[Meta Pixel] ${name} skipped: Pixel not initialized.`);
  }
};
