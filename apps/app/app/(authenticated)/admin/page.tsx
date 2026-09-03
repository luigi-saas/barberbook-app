import { database } from "@repo/database";
import type { BookingStatus } from "@repo/database/generated/client";
import type { Metadata } from "next";

/**
 * Platform admin (Design.md — Admin MVP: dashboard, shops list, users list,
 * bookings list). Role-gating by Clerk metadata lands with the admin role
 * mapping; until then this surface is behind the dashboard's auth wall.
 */

const title = "Admin — BarberBook";
const description = "Platform overview: shops, users and bookings.";

export const metadata: Metadata = { title, description };

const hourFmt = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Africa/Casablanca",
});

const statusStyles: Record<BookingStatus, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  CONFIRMED: "bg-green-100 text-green-800",
  IN_PROGRESS: "bg-blue-100 text-blue-800",
  COMPLETED: "bg-gray-100 text-gray-700",
  CANCELLED: "bg-red-100 text-red-700",
  NO_SHOW: "bg-red-100 text-red-700",
  RESCHEDULED: "bg-purple-100 text-purple-700",
};

export default async function AdminPage() {
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const [shops, users, recentBookings, shopCount, userCount, bookingCount, newUsersWeek, activeBookings] =
    await Promise.all([
      database.shop.findMany({
        orderBy: { createdAt: "desc" },
        include: { _count: { select: { bookings: true, barbers: true, services: true } } },
      }),
      database.user.findMany({ orderBy: { createdAt: "desc" }, take: 15 }),
      database.booking.findMany({
        orderBy: { createdAt: "desc" },
        take: 15,
        include: {
          customer: { select: { firstName: true, lastName: true } },
          shop: { select: { name: true } },
          services: { include: { service: { select: { name: true, price: true } } } },
        },
      }),
      database.shop.count(),
      database.user.count(),
      database.booking.count(),
      database.user.count({ where: { createdAt: { gte: weekAgo } } }),
      database.booking.count({ where: { status: { in: ["PENDING", "CONFIRMED", "IN_PROGRESS"] } } }),
    ]);

  const stats = [
    { label: "Salons", value: shopCount, hint: `${shops.filter((s) => s.status === "ACTIVE").length} actifs` },
    { label: "Utilisateurs", value: userCount, hint: `+${newUsersWeek} cette semaine` },
    { label: "Réservations", value: bookingCount, hint: `${activeBookings} actives` },
    {
      label: "Revenu plateforme",
      value: `${recentBookings.reduce((sum, b) => sum + (b.services[0]?.service.price.toNumber() ?? 0), 0)} MAD`,
      hint: "15 dernières réservations",
    },
  ];

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
      <div>
        <h1 className="font-semibold text-2xl">Admin</h1>
        <p className="text-sm text-muted-foreground">
          Vue plateforme — salons, utilisateurs et réservations.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-lg border bg-card p-6">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="text-3xl font-bold">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.hint}</p>
          </div>
        ))}
      </div>

      {/* Shops */}
      <section className="space-y-3">
        <h2 className="font-semibold">Salons</h2>
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Salon</th>
                <th className="px-4 py-3 font-medium">Ville</th>
                <th className="px-4 py-3 font-medium">Statut</th>
                <th className="px-4 py-3 font-medium">Barbiers</th>
                <th className="px-4 py-3 font-medium">Services</th>
                <th className="px-4 py-3 font-medium">Réservations</th>
              </tr>
            </thead>
            <tbody>
              {shops.map((shop) => (
                <tr key={shop.id} className="border-t">
                  <td className="px-4 py-3 font-medium">
                    {shop.name}
                    {shop.isFeatured && (
                      <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                        MIS EN AVANT
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">{shop.city}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        shop.status === "ACTIVE"
                          ? "bg-green-100 text-green-800"
                          : shop.status === "PENDING_REVIEW"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {shop.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">{shop._count.barbers}</td>
                  <td className="px-4 py-3">{shop._count.services}</td>
                  <td className="px-4 py-3">{shop._count.bookings}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Users */}
      <section className="space-y-3">
        <h2 className="font-semibold">Derniers utilisateurs</h2>
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Nom</th>
                <th className="px-4 py-3 font-medium">E-mail</th>
                <th className="px-4 py-3 font-medium">Rôle</th>
                <th className="px-4 py-3 font-medium">Inscrit</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t">
                  <td className="px-4 py-3 font-medium">
                    {user.firstName} {user.lastName}
                  </td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-muted px-2 py-1 text-xs">{user.role}</span>
                  </td>
                  <td className="px-4 py-3">{hourFmt.format(user.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Bookings */}
      <section className="space-y-3">
        <h2 className="font-semibold">Dernières réservations</h2>
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Réf.</th>
                <th className="px-4 py-3 font-medium">Client</th>
                <th className="px-4 py-3 font-medium">Salon</th>
                <th className="px-4 py-3 font-medium">Prestation</th>
                <th className="px-4 py-3 font-medium">Créneau</th>
                <th className="px-4 py-3 font-medium">Statut</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((booking) => (
                <tr key={booking.id} className="border-t">
                  <td className="px-4 py-3 font-mono text-xs">
                    #BB-{booking.id.slice(-8).toUpperCase()}
                  </td>
                  <td className="px-4 py-3">
                    {booking.customer.firstName} {booking.customer.lastName}
                  </td>
                  <td className="px-4 py-3">{booking.shop.name}</td>
                  <td className="px-4 py-3">
                    {booking.services[0]?.service.name ?? "—"}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {hourFmt.format(booking.scheduledAt)}
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
      </section>
    </div>
  );
}
