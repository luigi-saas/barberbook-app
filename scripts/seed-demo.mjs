/**
 * Demo seed — the BarberBook launch content (Casablanca pilot).
 *
 * Idempotent: fixed IDs + upserts, safe to run on every deploy.
 * Run:  DATABASE_URL=... bunx tsx scripts/seed-demo.mjs
 */
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../packages/database/generated/client";

const adapter = new PrismaPg({
  connectionString:
    process.env.DATABASE_URL ??
    "postgresql://postgres:postgres@localhost:5432/barberbook",
});
const db = new PrismaClient({ adapter });

const DAYS = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

const barbers = [
  {
    userId: "user_barber_yassine",
    barberId: "barber_yassine",
    firstName: "Yassine",
    lastName: "El Mansouri",
    email: "yassine@royalblade.ma",
    phone: "+212661000001",
    bio: "Beard Sculpting, Skin Fade, Hot Towel · Master artisan of Royal Moroccan grooming. 12 years of craft, meticulous detail, traditional techniques with a modern finish.",
    avatarUrl: "/images/barber-yassine.jpg",
  },
  {
    userId: "user_barber_mehdi",
    barberId: "barber_mehdi",
    firstName: "Mehdi",
    lastName: "Benali",
    email: "mehdi@royalblade.ma",
    phone: "+212661000002",
    bio: "Taper Fade, Hair Tattoo, Scissor Cut · The master of precision fades and contemporary urban styles. Modern architectural lines, traditional barbering soul.",
    avatarUrl: "/images/barber-mehdi.jpg",
  },
  {
    userId: "user_barber_omar",
    barberId: "barber_omar",
    firstName: "Omar",
    lastName: "Tahiri",
    email: "omar@royalblade.ma",
    phone: "+212661000003",
    bio: "Straight Razor, Classic Cut, Head Massage · Guardian of the old-world grooming legacy. Traditional straight-razor shaving and classic silhouettes.",
    avatarUrl: "/images/barber-omar.jpg",
  },
  {
    userId: "user_barber_hamza",
    barberId: "barber_hamza",
    firstName: "Hamza",
    lastName: "Idrissi",
    email: "hamza@heritage.ma",
    phone: "+212661000004",
    bio: "Classic Cut, Beard Trim, Hot Towel · Heritage craftsman. Calm, precise, old-school.",
    avatarUrl: "/images/barber-hamza.jpg",
  },
  {
    userId: "user_barber_reda",
    barberId: "barber_reda",
    firstName: "Reda",
    lastName: "Alaoui",
    email: "reda@heritage.ma",
    phone: "+212661000005",
    bio: "Skin Fade, Textured Crop, Styling · Young energy, sharp lines.",
    avatarUrl: "/images/barber-reda.jpg",
  },
  {
    userId: "user_barber_ilias",
    barberId: "barber_ilias",
    firstName: "Ilias",
    lastName: "Bennani",
    email: "ilias@atlas.ma",
    phone: "+212661000006",
    bio: "Royal Cut, Argan Facial, Grooming Ritual · Minimalist precision from Marrakech.",
    avatarUrl: "/images/barber-ilias.jpg",
  },
];

const shops = [
  {
    id: "shop_1",
    slug: "royal-blade",
    name: "Royal Blade",
    ownerId: "user_owner_1",
    ownerEmail: "owner@royalblade.ma",
    description: "Premium grooming in the heart of Casablanca — Royal Moroccan techniques, master barbers, argan oil finishes.",
    city: "Casablanca",
    address: "12 Bd Mohammed V, Maarif",
    phone: "+212522000001",
    coverUrl: "/images/shop-cover-royal.jpg",
    logoUrl: "/images/shop-logo-royal.jpg",
    featured: true,
    categories: [
      { id: "cat_classic_1", name: "classic", order: 1 },
      { id: "cat_beard_1", name: "beard", order: 2 },
      { id: "cat_care_1", name: "care", order: 3 },
      { id: "cat_ritual_1", name: "ritual", order: 4 },
    ],
    services: [
      { id: "svc_1", cat: "cat_classic_1", name: "Signature Royal Cut", description: "Precision haircut crafted to your face shape using traditional Moroccan techniques.", price: 250, duration: 45, image: "/images/svc-royal-cut.jpg" },
      { id: "svc_2", cat: "cat_classic_1", name: "Classic Cut & Style", description: "A clean, sharp cut with expert styling. The foundation of the barbershop experience.", price: 150, duration: 30, image: "/images/svc-classic-cut.jpg" },
      { id: "svc_3", cat: "cat_beard_1", name: "Royal Beard Grooming", description: "Full beard sculpt, hot towel, and premium argan oil finish.", price: 450, duration: 45, image: "/images/svc-beard-grooming.jpg" },
      { id: "svc_4", cat: "cat_beard_1", name: "Traditional Shave", description: "Straight-razor shave with traditional lather and essential oils.", price: 200, duration: 30, image: "/images/svc-traditional-shave.jpg" },
      { id: "svc_5", cat: "cat_care_1", name: "Argan Facial Ritual", description: "Deep cleanse, exfoliation, and hydrating Moroccan argan oil mask.", price: 350, duration: 60, image: "/images/svc-facial.jpg" },
      { id: "svc_6", cat: "cat_ritual_1", name: "Full Grooming Ritual", description: "The complete experience: cut, beard, and facial care.", price: 650, duration: 90, image: "/images/hero-royal.jpg" },
    ],
    barbers: ["barber_yassine", "barber_mehdi", "barber_omar"],
  },
  {
    id: "shop_2",
    slug: "heritage-grooming",
    name: "Heritage Grooming",
    ownerId: "user_owner_2",
    ownerEmail: "owner@heritage.ma",
    description: "Old-world craft in Maarif — vintage chairs, hot towels, and unhurried grooming.",
    city: "Casablanca",
    address: "8 Rue Jean Jaurès, Maarif",
    phone: "+212522000002",
    coverUrl: "/images/shop-cover-heritage.jpg",
    logoUrl: "/images/shop-logo-royal.jpg",
    featured: false,
    categories: [
      { id: "cat_classic_2", name: "classic", order: 1 },
      { id: "cat_beard_2", name: "beard", order: 2 },
    ],
    services: [
      { id: "svc_7", cat: "cat_classic_2", name: "Classic Cut", description: "Timeless cut, finished with a stylist's touch.", price: 120, duration: 30, image: "/images/svc-classic-cut.jpg" },
      { id: "svc_8", cat: "cat_beard_2", name: "Beard Trim & Oil", description: "Shape, sculpt, and nourish with pure argan oil.", price: 100, duration: 30, image: "/images/svc-beard-grooming.jpg" },
      { id: "svc_9", cat: "cat_beard_2", name: "Heritage Shave", description: "Hot towel, straight razor, essential oils.", price: 90, duration: 30, image: "/images/svc-traditional-shave.jpg" },
    ],
    barbers: ["barber_hamza", "barber_reda"],
  },
  {
    id: "shop_3",
    slug: "atlas-barbering",
    name: "Atlas Barbering",
    ownerId: "user_owner_3",
    ownerEmail: "owner@atlas.ma",
    description: "Minimalist grooming studio in Gueliz — clean lines, natural light, Marrakech calm.",
    city: "Marrakech",
    address: "5 Av. Mohammed VI, Gueliz",
    phone: "+212524000003",
    coverUrl: "/images/shop-cover-atlas.jpg",
    logoUrl: "/images/shop-logo-royal.jpg",
    featured: false,
    categories: [
      { id: "cat_classic_3", name: "classic", order: 1 },
      { id: "cat_care_3", name: "care", order: 2 },
    ],
    services: [
      { id: "svc_10", cat: "cat_classic_3", name: "Atlas Royal Cut", description: "Precision cut with a contemporary Marrakech edge.", price: 200, duration: 45, image: "/images/svc-royal-cut.jpg" },
      { id: "svc_11", cat: "cat_care_3", name: "Argan Facial Express", description: "Quick deep-cleanse and argan oil hydration.", price: 300, duration: 45, image: "/images/svc-facial.jpg" },
    ],
    barbers: ["barber_ilias"],
  },
];

async function main() {
  console.log("[seed] start");

  // Owners + barbers (guests sign in later; seed users are back-office records)
  const ownerUsers = [
    { id: "user_owner_1", email: shops[0].ownerEmail, firstName: "Yassine", lastName: "El Mansouri" },
    { id: "user_owner_2", email: shops[1].ownerEmail, firstName: "Hamza", lastName: "Idrissi" },
    { id: "user_owner_3", email: shops[2].ownerEmail, firstName: "Ilias", lastName: "Bennani" },
  ];
  for (const [i, owner] of ownerUsers.entries()) {
    await db.user.upsert({
      where: { id: owner.id },
      create: {
        id: owner.id,
        role: "SHOP_OWNER",
        clerkId: `seed_owner_${i + 1}`,
        email: owner.email,
        firstName: owner.firstName,
        lastName: owner.lastName,
        referralCode: `seed-ref-owner-${i + 1}`,
      },
      update: {},
    });
  }

  for (const b of barbers) {
    await db.user.upsert({
      where: { id: b.userId },
      create: {
        id: b.userId,
        role: "BARBER",
        clerkId: `seed_${b.barberId}`,
        email: b.email,
        phone: b.phone,
        firstName: b.firstName,
        lastName: b.lastName,
        avatarUrl: b.avatarUrl,
        referralCode: `seed-ref-${b.barberId}`,
      },
      update: {
        firstName: b.firstName,
        lastName: b.lastName,
        avatarUrl: b.avatarUrl,
      },
    });
    await db.barber.upsert({
      where: { id: b.barberId },
      create: { id: b.barberId, userId: b.userId, bio: b.bio, isVerified: true, displayOrder: 0 },
      update: { bio: b.bio },
    });
  }

  for (const shop of shops) {
    await db.shop.upsert({
      where: { id: shop.id },
      create: {
        id: shop.id,
        slug: shop.slug,
        name: shop.name,
        description: shop.description,
        city: shop.city,
        address: shop.address,
        phone: shop.phone,
        coverUrl: shop.coverUrl,
        logoUrl: shop.logoUrl,
        status: "ACTIVE",
        isFeatured: shop.featured,
        ownerId: shop.ownerId,
      },
      update: {
        slug: shop.slug,
        name: shop.name,
        description: shop.description,
        city: shop.city,
        address: shop.address,
        phone: shop.phone,
        coverUrl: shop.coverUrl,
        logoUrl: shop.logoUrl,
        status: "ACTIVE",
        isFeatured: shop.featured,
      },
    });

    // Opening hours: 09:00–20:00, 7/7
    for (const day of DAYS) {
      await db.openingHours.upsert({
        where: { id: `hours_${shop.id}_${day}` },
        create: {
          id: `hours_${shop.id}_${day}`,
          shopId: shop.id,
          dayOfWeek: day,
          openTime: "09:00",
          closeTime: "20:00",
          isClosed: false,
        },
        update: { openTime: "09:00", closeTime: "20:00", isClosed: false },
      });
    }

    // Categories + services
    for (const cat of shop.categories) {
      await db.serviceCategory.upsert({
        where: { id: cat.id },
        create: { id: cat.id, shopId: shop.id, name: cat.name, order: cat.order },
        update: { name: cat.name, order: cat.order },
      });
    }
    for (const svc of shop.services) {
      await db.service.upsert({
        where: { id: svc.id },
        create: {
          id: svc.id,
          shopId: shop.id,
          categoryId: svc.cat,
          name: svc.name,
          description: svc.description,
          price: svc.price,
          duration: svc.duration,
          imageUrl: svc.image,
          isActive: true,
        },
        update: {
          name: svc.name,
          description: svc.description,
          price: svc.price,
          duration: svc.duration,
          imageUrl: svc.image,
          categoryId: svc.cat,
          isActive: true,
        },
      });
    }

    // Barbers attached to this shop + availability
    for (const barberId of shop.barbers) {
      await db.shopBarber.upsert({
        where: { id: `sb_${shop.id}_${barberId}` },
        create: { id: `sb_${shop.id}_${barberId}`, shopId: shop.id, barberId },
        update: {},
      });
      for (const day of DAYS) {
        await db.barberAvailability.upsert({
          where: { id: `avail_${barberId}_${day}` },
          create: {
            id: `avail_${barberId}_${day}`,
            barberId,
            dayOfWeek: day,
            startTime: "09:00",
            endTime: "20:00",
            isAvailable: true,
          },
          update: { startTime: "09:00", endTime: "20:00", isAvailable: true },
        });
      }
    }
  }

  // ─── Demo history: past completed bookings + visible reviews ───
  const daysAgo = (n) => new Date(Date.now() - n * 24 * 60 * 60 * 1000);
  const guests = [
    { id: "user_g1", first: "Mehdi", last: "Kettani", phone: "+212662111222" },
    { id: "user_g2", first: "Salma", last: "Bennis", phone: "+212663333444" },
    { id: "user_g3", first: "Anas", last: "Cherkaoui", phone: "+212664555666" },
    { id: "user_g4", first: "Imane", last: "Tazi", phone: "+212665777888" },
    { id: "user_g5", first: "Karim", last: "Fassi", phone: "+212666999000" },
    { id: "user_g6", first: "Nadia", last: "Berrada", phone: "+212667121314" },
    { id: "user_g7", first: "Othmane", last: "Sqalli", phone: "+212668151617" },
    { id: "user_g8", first: "Lina", last: "Ouazzani", phone: "+212669181920" },
  ];
  for (const [i, g] of guests.entries()) {
    await db.user.upsert({
      where: { id: g.id },
      create: {
        id: g.id, role: "CUSTOMER", clerkId: `guest_seed_${i}`,
        email: `guest.seed.${i}@barberbook.ma`, phone: g.phone,
        firstName: g.first, lastName: g.last, referralCode: `seed-ref-g${i}`,
      },
      update: {},
    });
  }

  const history = [
    { shop: "shop_1", barber: "barber_yassine", svc: "svc_1", g: 0, days: 12, rating: 5, comment: "Coupe impeccable, Yassine est un artiste. Le hot towel est un must !" },
    { shop: "shop_1", barber: "barber_mehdi", svc: "svc_2", g: 1, days: 9, rating: 5, comment: "Meilleur fade de Casa, sans hésiter. Ambiance au top." },
    { shop: "shop_1", barber: "barber_omar", svc: "svc_4", g: 2, days: 7, rating: 4, comment: "Rasage traditionnel parfait, un peu d'attente mais ça vaut le coup." },
    { shop: "shop_1", barber: "barber_yassine", svc: "svc_3", g: 3, days: 4, rating: 5, comment: "Ma barbe n'a jamais été aussi bien taillée. Je recommande les yeux fermés." },
    { shop: "shop_2", barber: "barber_hamza", svc: "svc_7", g: 4, days: 10, rating: 5, comment: "Cadre magnifique, coupe classique exécutée à la perfection." },
    { shop: "shop_2", barber: "barber_reda", svc: "svc_9", g: 5, days: 6, rating: 4, comment: "Bon rasage, bon accueil. Je reviendrai." },
    { shop: "shop_3", barber: "barber_ilias", svc: "svc_10", g: 6, days: 8, rating: 5, comment: "Le meilleur salon de Gueliz. Soin du détail exceptionnel." },
    { shop: "shop_3", barber: "barber_ilias", svc: "svc_11", g: 7, days: 3, rating: 5, comment: "L'huile d'argan, la fraîcheur, le service... une parenthèse parfaite." },
  ];
  for (const [i, h] of history.entries()) {
    const bookingId = `seed_bk_${i + 1}`;
    const reviewId = `seed_review_${i + 1}`;
    const guest = guests[h.g];
    const svc = shops.find((s) => s.id === h.shop).services.find((x) => x.id === h.svc);
    const scheduledAt = daysAgo(h.days);
    const endsAt = new Date(scheduledAt.getTime() + 30 * 60 * 1000);
    await db.booking.upsert({
      where: { id: bookingId },
      create: {
        id: bookingId, customerId: guest.id, barberId: h.barber, shopId: h.shop,
        status: "COMPLETED", scheduledAt, endsAt,
        services: { create: { id: `seed_bsi_${i + 1}`, serviceId: h.svc, price: svc.price, duration: svc.duration } },
        payment: { create: { id: `seed_pay_${i + 1}`, amount: svc.price, method: "CASH", status: "PAID", paidAt: endsAt } },
        review: { create: { id: reviewId, authorId: guest.id, barberId: h.barber, shopId: h.shop, rating: h.rating, comment: h.comment, status: "VISIBLE" } },
      },
      update: { status: "COMPLETED" },
    });
  }

  const counts = {
    shops: await db.shop.count(),
    services: await db.service.count(),
    barbers: await db.barber.count(),
  };
  console.log("[seed] done", counts);
}

main()
  .catch((error) => {
    console.error("[seed] failed", error);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
