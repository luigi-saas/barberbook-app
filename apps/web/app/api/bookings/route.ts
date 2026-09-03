import { NextResponse } from "next/server";
import { z } from "zod";
import { createBooking } from "@/lib/booking";

const payloadSchema = z.object({
  shopId: z.string().min(1),
  serviceId: z.string().min(1),
  barberId: z.string().min(1).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  firstName: z.string().trim().min(2).max(80),
  lastName: z.string().trim().max(80).default(""),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+\s.-]{9,16}$/, "invalid phone"),
  notes: z.string().trim().max(500).default(""),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const parsed = payloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  let result: Awaited<ReturnType<typeof createBooking>>;  try {
    result = await createBooking(parsed.data);
  } catch (error) {
    // Unconfigured/unreachable database (e.g. DATABASE_URL missing on a fresh
    // deploy) — degrade gracefully and leave a distinctive log for operators.
    console.error(
      "[barberbook] database unavailable during booking:",
      error instanceof Error ? `${error.name}: ${error.message}` : error,
    );
    return NextResponse.json({ error: "unavailable" }, { status: 503 });
  }

  if (!result.ok) {
    const status =
      result.error === "slot_taken"
        ? 409
        : result.error === "not_found"
          ? 404
          : result.error === "closed"
            ? 422
            : 503;
    return NextResponse.json({ error: result.error }, { status });
  }

  return NextResponse.json({ reference: result.reference }, { status: 201 });
}
