/**
 * Shops seeder — shops, opening hours (09:00–20:00, 7/7), service
 * categories, services, roster links and weekly barber availability
 * (09:00–20:00, 7/7).
 */
import { db } from "../lib/db.mjs";
import { DAYS } from "../lib/helpers.mjs";
import { shops } from "../data/shops.mjs";

export async function seedShops() {
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

    // Opening hours
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

    // Roster + weekly availability
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
}
