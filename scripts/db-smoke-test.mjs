/**
 * Smoke test: exercise the full Booking domain against a local Postgres
 * using the generated Prisma Client (queryCompiler/WASM — no engine binary).
 *
 * Run: node scripts/db-smoke-test.mjs
 */
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../packages/database/generated/client.ts";

const adapter = new PrismaPg({
  connectionString:
    process.env.DATABASE_URL ??
    "postgresql://postgres:postgres@localhost:5432/barberbook",
});
const db = new PrismaClient({ adapter });



async function main() {
  // 1. Create shop owner + shop
  const owner = await db.user.create({
    data: {
      id: "user_owner_1",
      role: "SHOP_OWNER",
      clerkId: "clerk_owner_1",
      email: "yassine@example.ma",
      firstName: "Yassine",
      lastName: "El Mansouri",
      referralCode: "ref-yassine-1",
    },
  });
  const shop = await db.shop.create({
    data: {
      id: "shop_1",
      ownerId: owner.id,
      slug: "royal-blade-casablanca",
      name: "Royal Blade",
      description: "Premium grooming in the heart of Casablanca",
      city: "Casablanca",
      address: "12 Bd Mohammed V",
      status: "ACTIVE",
    },
  });
  // 2. Barber + service
  const barberUser = await db.user.create({
    data: {
      id: "user_barber_1",
      role: "BARBER",
      clerkId: "clerk_barber_1",
      email: "mehdi@example.ma",
      firstName: "Mehdi",
      lastName: "Benali",
      referralCode: "ref-mehdi-1",
    },
  });
  const barber = await db.barber.create({
    data: { id: "barber_1", userId: barberUser.id, bio: "12 years of craft" },
  });
  await db.shopBarber.create({
    data: { id: "sb_1", shopId: shop.id, barberId: barber.id, isOwner: true },
  });
  const category = await db.serviceCategory.create({
    data: { id: "cat_1", shopId: shop.id, name: "Cuts" },
  });
  const service = await db.service.create({
    data: {
      id: "svc_1",
      shopId: shop.id,
      categoryId: category.id,
      name: "Signature Royal Cut",
      price: "250.00",
      duration: 45,
    },
  });
  // 3. Customer + booking
  const customer = await db.user.create({
    data: {
      id: "user_cust_1",
      role: "CUSTOMER",
      clerkId: "clerk_cust_1",
      email: "omar@example.ma",
      firstName: "Omar",
      lastName: "Tahiri",
      referralCode: "ref-omar-1",
    },
  });
  const booking = await db.booking.create({
    data: {
      id: "bk_1",
      customerId: customer.id,
      barberId: barber.id,
      shopId: shop.id,
      status: "CONFIRMED",
      scheduledAt: new Date("2026-09-03T15:00:00Z"),
      endsAt: new Date("2026-09-03T15:45:00Z"),
      services: {
        create: { id: "bks_1", serviceId: service.id, price: "250.00", duration: 45 },
      },
    },
    include: { services: true, customer: true, shop: true },
  });
  console.log("booking created:", booking.id, booking.status, "| shop:", booking.shop.name, "| services:", booking.services.length);
  // 4. Query back with aggregation
  const agg = await db.booking.aggregate({ _count: true, where: { shopId: shop.id } });
  const enums = await db.booking.findMany({
    where: { status: { in: ["CONFIRMED", "PENDING"] } },
    select: { id: true, status: true },
  });
  console.log("aggregate bookings for shop:", agg._count, "| enum query rows:", enums.length);
  console.log("✅ DB smoke test passed");
}

main()
  .catch((e) => {
    console.error("❌ smoke test failed:", e.message);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
