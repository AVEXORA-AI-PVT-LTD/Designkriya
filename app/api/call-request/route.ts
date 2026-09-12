import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let body: { name?: string; phone?: string; when?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!body.name || !body.phone) {
    return NextResponse.json({ error: "Name and phone are required" }, { status: 400 });
  }

  // TODO: replace with real delivery - e.g. send an email (Resend/SendGrid),
  // post to a CRM webhook, or push to a Slack channel. For now this just
  // logs server-side so the request isn't silently dropped during
  // development.
  console.log("[call-request]", {
    name: body.name,
    phone: body.phone,
    when: body.when || "no preference given",
    receivedAt: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}
