/**
 * Accounts seeder — shop owners (SHOP_OWNER) and barbers (BARBER user +
 * Barber profile). Guests are created by the history seeder.
 */
import { db } from "../lib/db.mjs";
import { barbers } from "../data/barbers.mjs";
import { shops } from "../data/shops.mjs";

export async function seedAccounts() {
  // Owners (back-office records — guests sign in later)
  for (const [i, shop] of shops.entries()) {
    await db.user.upsert({
      where: { id: shop.ownerId },
      create: {
        id: shop.ownerId,
        role: "SHOP_OWNER",
        clerkId: `seed_owner_${i + 1}`,
        email: shop.ownerEmail,
        firstName: shop.ownerFirstName,
        lastName: shop.ownerLastName,
        referralCode: `seed-ref-owner-${i + 1}`,
      },
      update: {},
    });
  }

  // Barbers: user + verified profile
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
}
