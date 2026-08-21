import { createServerClient } from "@supabase/ssr";
import {
  NextResponse,
  type NextRequest,
} from "next/server";

export async function updateSession(
  request: NextRequest
) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },

        setAll(cookiesToSet, headers) {
          // Update request cookies so the
          // Server Components receive the
          // refreshed session.
          cookiesToSet.forEach(
            ({ name, value }) => {
              request.cookies.set(
                name,
                value
              );
            }
          );

          // Recreate response with the
          // updated request cookies.
          supabaseResponse =
            NextResponse.next({
              request,
            });

          // Store refreshed cookies in the
          // browser response.
          cookiesToSet.forEach(
            ({
              name,
              value,
              options,
            }) => {
              supabaseResponse.cookies.set(
                name,
                value,
                options
              );
            }
          );

          // Apply headers supplied by
          // Supabase SSR.
          if (headers) {
            Object.entries(headers).forEach(
              ([key, value]) => {
                supabaseResponse.headers.set(
                  key,
                  value
                );
              }
            );
          }
        },
      },
    }
  );

  // IMPORTANT:
  // This refreshes/verifies the Auth session.
  await supabase.auth.getClaims();

  return supabaseResponse;
}