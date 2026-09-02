import { database } from "@repo/database";
import type { BookingStatus } from "@repo/database/generated/client";
import type { Metadata } from "next";

const title = "Bookings — BarberBook";
const description = "Today's schedule, upcoming appointments and recent bookings.";

export const metadata: Metadata = { title, description };

const ACTIVE: BookingStatus[] = ["PENDING", "CONFIRMED", "IN_PROGRESS"];

const statusStyles: Record<BookingStatus, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  CONFIRMED: "bg-green-100 text-green-800",
  IN_PROGRESS: "bg-blue-100 text-blue-800",
  COMPLETED: "bg-gray-100 text-gray-700",
  CANCELLED: "bg-red-100 text-red-700",
  NO_SHOW: "bg-red-100 text-red-700",
  RESCHEDULED: "bg-purple-100 text-purple-700",
};

const timeFmt = new Intl.DateTimeFormat("fr-FR", {
  weekday: "short",
  day: "numeric",
  month: "short",
  timeZone: "Africa/Casablanca",
});
const hourFmt = new Intl.DateTimeFormat("fr-FR", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Africa/Casablanca",
});

export default async function BookingsPage() {
  const now = new Date();
  const [upcoming, recent, todayCount] = await Promise.all([
    database.booking.findMany({
      where: { scheduledAt: { gte: now }, status: { in: ACTIVE } },
      orderBy: { scheduledAt: "asc" },
      take: 25,
      include: {
        customer: true,
        barber: { include: { user: true } },
        services: { include: { service: true } },
        payment: true,
      },
    }),
    database.booking.findMany({
      where: { scheduledAt: { lt: now } },
      orderBy: { scheduledAt: "desc" },
      take: 10,
      include: {
        customer: true,
        barber: { include: { user: true } },
        services: { include: { service: true } },
        payment: true,
      },
    }),
    database.booking.count({
      where: { status: { in: ACTIVE } },
    }),
  ]);

  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Casablanca",
  }).format(now);
  const todayBookings = upcoming.filter(
    (b) =>
      new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Casablanca" }).format(
        b.scheduledAt,
      ) === today,
  );

  const revenueThisMonth = recent
    .concat(upcoming)
    .filter((b) => b.payment?.status === "PAID")
    .reduce((sum, b) => sum + (b.services[0]?.price.toNumber() ?? 0), 0);

  const table = (rows: typeof upcoming, emptyLabel: string) => (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50 text-left text-muted-foreground">
          <tr>
            <th className="px-4 py-3 font-medium">Créneau</th>
            <th className="px-4 py-3 font-medium">Client</th>
            <th className="px-4 py-3 font-medium">Service</th>
            <th className="px-4 py-3 font-medium">Barbier</th>
            <th className="px-4 py-3 font-medium">Paiement</th>
            <th className="px-4 py-3 font-medium">Statut</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                {emptyLabel}
              </td>
            </tr>
          )}
          {rows.map((booking) => (
            <tr key={booking.id} className="border-t">
              <td className="px-4 py-3 whitespace-nowrap">
                <span className="font-medium">
                  {timeFmt.format(booking.scheduledAt)}
                </span>
                <span className="block text-xs text-muted-foreground">
                  {hourFmt.format(booking.scheduledAt)} –{" "}
                  {hourFmt.format(booking.endsAt)}
                </span>
              </td>
              <td className="px-4 py-3">
                <span className="font-medium">
                  {booking.customer.firstName} {booking.customer.lastName}
                </span>
                <span className="block text-xs text-muted-foreground">
                  {booking.customer.phone ?? booking.customer.email}
                </span>
              </td>
              <td className="px-4 py-3">
                {booking.services[0]?.service.name ?? "—"}
                <span className="block text-xs text-muted-foreground">
                  {booking.services[0]?.service.price.toNumber() ?? 0} MAD
                </span>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                {booking.barber.user.firstName} {booking.barber.user.lastName}
              </td>
              <td className="px-4 py-3">
                <span className="text-xs rounded-full bg-muted px-2 py-1">
                  {booking.payment?.method ?? "—"}
                </span>
              </td>
              <td className="px-4 py-3">
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[booking.status]}`}
                >
                  {booking.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
      <div>
        <h1 className="font-semibold text-2xl">Bookings</h1>
        <p className="text-sm text-muted-foreground">
          Le planning de vos salons — mis à jour en direct depuis le site public.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-6">
          <p className="text-sm text-muted-foreground">Aujourd&apos;hui</p>
          <p className="text-3xl font-bold">{todayBookings.length}</p>
          <p className="text-xs text-muted-foreground">réservations actives</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <p className="text-sm text-muted-foreground">À venir</p>
          <p className="text-3xl font-bold">{upcoming.length}</p>
          <p className="text-xs text-muted-foreground">prochains créneaux confirmés</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <p className="text-sm text-muted-foreground">Revenu encaissé</p>
          <p className="text-3xl font-bold">{revenueThisMonth} MAD</p>
          <p className="text-xs text-muted-foreground">paiements réglés</p>
        </div>
      </div>

      {/* Upcoming */}
      <section className="space-y-3">
        <h2 className="font-semibold">Prochaines réservations</h2>
        {table(upcoming, "Aucune réservation à venir pour le moment.")}
      </section>

      {/* Recent */}
      <section className="space-y-3">
        <h2 className="font-semibold">Historique récent</h2>
        {table(recent, "Pas encore d'historique.")}
      </section>
    </div>
  );
}
