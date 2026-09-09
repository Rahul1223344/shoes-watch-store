"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";

import { FB_PIXEL_ID, pageview } from "@/lib/fpixel";

function PixelTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isFirstRender = useRef(true);

  useEffect(() => {
    // Initial PageView is already sent by the Meta Pixel script.
    // Therefore, don't send it again on the first render.
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (FB_PIXEL_ID) {
      pageview();
    }
  }, [pathname, searchParams]);

  return null;
}

export default function FacebookPixel() {
  if (!FB_PIXEL_ID) {
    return null;
  }

  return (
    <>
      <Script
        id="facebook-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;
            n.push=n;
            n.loaded=!0;
            n.version='2.0';
            n.queue=[];
            t=b.createElement(e);
            t.async=!0;
            t.src=v;
            s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)
            }(
              window,
              document,
              'script',
              'https://connect.facebook.net/en_US/fbevents.js'
            );

            fbq('init', '${FB_PIXEL_ID}');
            fbq('track', 'PageView');
          `,
        }}
      />

      <PixelTracker />
    </>
  );
}