import { database } from "@repo/database";
import type { Metadata } from "next";
import { setServiceActive, updateService } from "../../actions/shop";

const title = "Services — BarberBook";
const description = "Manage your shop's services, prices and durations.";

export const metadata: Metadata = { title, description };

export default async function ServicesPage() {
  const services = await database.service.findMany({
    orderBy: { createdAt: "asc" },
    include: { shop: { select: { name: true } }, category: { select: { name: true } } },
  });

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
      <div>
        <h1 className="font-semibold text-2xl">Services</h1>
        <p className="text-sm text-muted-foreground">
          Prix, durées et visibilité sur le site public — les modifications
          sont appliquées immédiatement.
        </p>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Service</th>
              <th className="px-4 py-3 font-medium">Salon</th>
              <th className="px-4 py-3 font-medium">Prix (MAD)</th>
              <th className="px-4 py-3 font-medium">Durée (min)</th>
              <th className="px-4 py-3 font-medium">Statut</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                  Aucun service pour le moment.
                </td>
              </tr>
            )}
            {services.map((service) => (
              <tr key={service.id} className="border-t">
                <td className="px-4 py-3">
                  <span className="font-medium">{service.name}</span>
                  {service.category && (
                    <span className="block text-xs text-muted-foreground">
                      {service.category.name}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">{service.shop.name}</td>
                <td colSpan={2} className="px-4 py-3">
                  <form action={updateService} className="flex items-center gap-2">
                    <input type="hidden" name="id" value={service.id} />
                    <input
                      name="price"
                      type="number"
                      min={0}
                      step={10}
                      defaultValue={service.price.toNumber()}
                      className="w-24 rounded-md border px-2 py-1.5 text-sm"
                      aria-label="Prix"
                    />
                    <input
                      name="duration"
                      type="number"
                      min={10}
                      max={480}
                      step={5}
                      defaultValue={service.duration}
                      className="w-20 rounded-md border px-2 py-1.5 text-sm"
                      aria-label="Durée"
                    />
                    <button
                      type="submit"
                      className="rounded-md bg-foreground px-3 py-1.5 text-xs font-semibold text-background hover:opacity-90"
                    >
                      Enregistrer
                    </button>
                  </form>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      service.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {service.isActive ? "EN LIGNE" : "MASQUÉ"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <form action={setServiceActive}>
                    <input type="hidden" name="id" value={service.id} />
                    <input type="hidden" name="active" value={service.isActive ? "false" : "true"} />
                    <button
                      type="submit"
                      className="rounded-lg border px-3 py-1.5 text-xs font-semibold hover:bg-muted"
                    >
                      {service.isActive ? "Masquer" : "Publier"}
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
