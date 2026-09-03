import { getBookingByReference } from "@/lib/booking";

const formatICSDate = (date: Date) =>
  `${date.toISOString().replace(/[-:]/g, "").split(".")[0]}Z`;

const escapeICSText = (text: string) =>
  text.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ ref: string }> },
) {
  const { ref } = await params;
  let booking = null;
  try {
    booking = await getBookingByReference(ref);
  } catch (error) {
    console.error("[ics] database unavailable:", error instanceof Error ? error.message : error);
    return new Response("Service unavailable", { status: 503 });
  }

  if (!booking) {
    return new Response("Not found", { status: 404 });
  }

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//BarberBook//Booking//FR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:BB-${booking.reference}@barberbook.ma`,
    `DTSTAMP:${formatICSDate(new Date())}`,
    `DTSTART:${formatICSDate(booking.scheduledAt)}`,
    `DTEND:${formatICSDate(booking.endsAt)}`,
    `SUMMARY:${escapeICSText(`${booking.serviceName} — ${booking.shopName}`)}`,
    `LOCATION:${escapeICSText(`${booking.shopAddress}, ${booking.shopCity}`)}`,
    `DESCRIPTION:${escapeICSText(
      `Réservation BarberBook #BB-${booking.reference}. Barbier: ${booking.barberName}. Paiement au salon.`,
    )}`,
    "BEGIN:VALARM",
    "TRIGGER:-PT2H",
    "ACTION:DISPLAY",
    "DESCRIPTION:Rappel rendez-vous barbershop",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  return new Response(lines.join("\r\n"), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="barberbook-${booking.reference}.ics"`,
      "Cache-Control": "no-store",
    },
  });
}
