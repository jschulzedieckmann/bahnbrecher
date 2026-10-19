import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

// Täglicher Aufruf durch Vercel Cron (siehe vercel.json). Eine kleine Abfrage
// verhindert, dass Supabase im Gratis-Tarif nach 7 Tagen ohne Nutzung pausiert.
export async function GET(request: NextRequest) {
  const geheim = process.env.CRON_SECRET;
  if (!geheim || request.headers.get("authorization") !== `Bearer ${geheim}`) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const { error } = await createAdminClient().from("einstellungen").select("id").limit(1);
  return NextResponse.json({ ok: !error, zeit: new Date().toISOString() }, { status: error ? 500 : 200 });
}
