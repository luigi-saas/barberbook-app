import { database } from "@repo/database";
import type { Metadata } from "next";
import { setBarberActive } from "../../actions/shop";

const title = "Barbers — BarberBook";
const description = "Manage your shop's barbers.";

export const metadata: Metadata = { title, description };

export default async function BarbersPage() {
  const rows = await database.shopBarber.findMany({
    include: {
      shop: { select: { name: true } },
      barber: { include: { user: { select: { firstName: true, lastName: true, avatarUrl: true, phone: true } } } },
    },
    orderBy: { joinedAt: "asc" },
  });

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
      <div>
        <h1 className="font-semibold text-2xl">Barbers</h1>
        <p className="text-sm text-muted-foreground">
          Votre équipe — désactivez un barbier pour le retirer du site public et
          du planning.
        </p>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Barbier</th>
              <th className="px-4 py-3 font-medium">Salon</th>
              <th className="px-4 py-3 font-medium">Téléphone</th>
              <th className="px-4 py-3 font-medium">Statut</th>
              <th className="px-4 py-3 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">
                  Aucun barbier pour le moment.
                </td>
              </tr>
            )}
            {rows.map(({ id, shop, barber }) => (
              <tr key={id} className="border-t">
                <td className="px-4 py-3 font-medium">
                  {barber.user.firstName} {barber.user.lastName}
                  {barber.isVerified && (
                    <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700">
                      VÉRIFIÉ
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">{shop.name}</td>
                <td className="px-4 py-3">{barber.user.phone ?? "—"}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      barber.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-700"
                    }`}
                  >
                    {barber.isActive ? "ACTIF" : "INACTIF"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <form action={setBarberActive}>
                    <input type="hidden" name="id" value={barber.id} />
                    <input type="hidden" name="active" value={barber.isActive ? "false" : "true"} />
                    <button
                      type="submit"
                      className="rounded-lg border px-3 py-1.5 text-xs font-semibold hover:bg-muted"
                    >
                      {barber.isActive ? "Désactiver" : "Réactiver"}
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
