import { auth } from "@repo/auth/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "./components/header";

const title = "BarberBook — Dashboard";
const description = "Merchant operating system for barbershops in Morocco.";

export const metadata: Metadata = {
  title,
  description,
};

/**
 * Dashboard shell placeholder. The merchant OS (calendar, services, team,
 * CRM) is Phase 2 of docs/Roadmap.md — this page proves the auth wiring and
 * gives the deployment a working landing surface in the meantime.
 * The previous next-forge demo queried a stub `Page` model that no longer
 * exists in the Prisma schema (32-model BarberBook schema replaced it).
 */
const App = async () => {
  const { orgId } = await auth();

  if (!orgId) {
    notFound();
  }

  return (
    <>
      <Header page="Overview" pages={["Getting Started"]}>
        <></>
      </Header>
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-4">
        <div className="flex min-h-[50vh] w-full max-w-2xl flex-col items-center justify-center gap-4 rounded-xl border bg-muted/30 p-10 text-center">
          <h1 className="font-bold text-2xl">Merchant dashboard coming soon</h1>
          <p className="max-w-md text-muted-foreground">
            This is BarberBook&apos;s shop-owner operating system in the making:
            booking calendar, services, team and customer CRM (Phase 2 of the
            roadmap). The public booking experience is live on the web app.
          </p>
        </div>
      </div>
    </>
  );
};

export default App;
