import { auth } from "@repo/auth/server";
import { notFound, redirect } from "next/navigation";
import { Header } from "../components/header";

interface SearchPageProperties {
  searchParams: Promise<{
    q: string;
  }>;
}

export const generateMetadata = async ({
  searchParams,
}: SearchPageProperties) => {
  const { q } = await searchParams;

  return {
    title: `${q} - Search results`,
    description: `Search results for ${q}`,
  };
};

/**
 * Placeholder search: the demo `Page` model was removed with the BarberBook
 * schema migration. Merchant-side search lands with the Phase 2 dashboard.
 */
const SearchPage = async ({ searchParams }: SearchPageProperties) => {
  const { q } = await searchParams;
  const { orgId } = await auth();

  if (!orgId) {
    notFound();
  }

  if (!q) {
    redirect("/");
  }

  return (
    <>
      <Header page="Search" pages={["Getting Started"]}>
        <></>
      </Header>
      <div className="flex flex-1 items-center justify-center p-4">
        <div className="flex min-h-[40vh] w-full max-w-2xl items-center justify-center rounded-xl border bg-muted/30 p-10 text-center text-muted-foreground">
          No results for &quot;{q}&quot; — search arrives with the Phase 2
          dashboard.
        </div>
      </div>
    </>
  );
};

export default SearchPage;
