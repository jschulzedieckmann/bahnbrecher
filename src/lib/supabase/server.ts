import "server-only";
import { createServerClient } from "@supabase/ssr";
import { createClient as createPlainClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

/** Supabase-Client mit der Sitzung der angemeldeten Person. Rechte über RLS. */
export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // In Server Components lassen sich keine Cookies setzen.
          // Der Proxy erneuert die Sitzung bei jeder Anfrage.
        }
      },
    },
  });
}

/**
 * Client mit dem geheimen Schlüssel. Umgeht RLS und darf nur in Server Actions
 * benutzt werden, nachdem geprüft wurde, dass ein Admin angemeldet ist.
 */
export function createAdminClient() {
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("SUPABASE_SECRET_KEY fehlt in .env.local");
  }
  return createPlainClient(url, secretKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
