/**
 * History seeder — demo customers plus their completed bookings, each with
 * a CASH payment and a visible review (what powers shop ratings, the
 * reviews tab and the "My bookings" lookup demo).
 */
import { db } from "../lib/db.mjs";
import { daysAgo } from "../lib/helpers.mjs";
import { guests } from "../data/guests.mjs";
import { history } from "../data/history.mjs";
import { shops } from "../data/shops.mjs";

export async function seedHistory() {
  for (const [i, g] of guests.entries()) {
    await db.user.upsert({
      where: { id: g.id },
      create: {
        id: g.id,
        role: "CUSTOMER",
        clerkId: `guest_seed_${i}`,
        email: `guest.seed.${i}@barberbook.ma`,
        phone: g.phone,
        firstName: g.first,
        lastName: g.last,
        referralCode: `seed-ref-g${i}`,
      },
      update: {},
    });
  }

  for (const [i, h] of history.entries()) {
    const bookingId = `seed_bk_${i + 1}`;
    const reviewId = `seed_review_${i + 1}`;
    const guest = guests[h.g];
    const svc = shops
      .find((s) => s.id === h.shop)
      .services.find((x) => x.id === h.svc);
    const scheduledAt = daysAgo(h.days);
    const endsAt = new Date(scheduledAt.getTime() + 30 * 60 * 1000);
    await db.booking.upsert({
      where: { id: bookingId },
      create: {
        id: bookingId,
        customerId: guest.id,
        barberId: h.barber,
        shopId: h.shop,
        status: "COMPLETED",
        scheduledAt,
        endsAt,
        services: {
          create: { id: `seed_bsi_${i + 1}`, serviceId: h.svc, price: svc.price, duration: svc.duration },
        },
        payment: {
          create: { id: `seed_pay_${i + 1}`, amount: svc.price, method: "CASH", status: "PAID", paidAt: endsAt },
        },
        review: {
          create: {
            id: reviewId,
            authorId: guest.id,
            barberId: h.barber,
            shopId: h.shop,
            rating: h.rating,
            comment: h.comment,
            status: "VISIBLE",
          },
        },
      },
      update: { status: "COMPLETED" },
    });
  }
}
