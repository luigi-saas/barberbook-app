import "server-only";

import { database } from "@repo/database";
import type {
  BookingStatus,
  DayOfWeek,
  Shop,
} from "@repo/database/generated/client";
import { cache } from "react";

/**
 * Morocco (Casablanca) is UTC+01:00 year-round. All shop-facing times —
 * opening hours, slot labels, "today" boundaries — are computed in that
 * offset. DateTime columns store UTC instants.
 */
export const SHOP_TZ_OFFSET = "+01:00";
export const SHOP_TZ = "Africa/Casablanca";
const ACTIVE_STATUSES: BookingStatus[] = ["PENDING", "CONFIRMED", "IN_PROGRESS"];

/* -------------------------------------------------------------------------------------------------
 * View models (serializable — safe to pass into client components)
 * -------------------------------------------------------------------------------------------------*/

export type ServiceCard = {
  id: string;
  name: string;
  description: string;
  duration: string;
  durationMinutes: number;
  price: string;
  priceValue: number;
  tier: string;
  imageUrl: string;
  category: string;
};

export type BarberCard = {
  id: string;
  name: string;
  specialty: string;
  bio: string;
  skills: string[];
  avatarUrl?: string;
  initials: string;
};

export type ShopSummary = {
  id: string;
  slug: string;
  name: string;
  description: string;
  city: string;
  address: string;
  coverUrl: string;
  logoUrl: string;
  rating: number;
  reviewCount: number;
  minPrice: string;
  minPriceValue: number;
  serviceNames: string[];
};

export type ShopDetail = ShopSummary & {
  phone?: string;
  openingHours: { dayOfWeek: DayOfWeek; openTime: string; closeTime: string; isClosed: boolean }[];
};

export type DayOption = {
  date: string; // YYYY-MM-DD (shop-local)
  label: string; // e.g. "Fri 5"
  weekday: DayOfWeek;
  isClosed: boolean;
  openTime?: string;
  closeTime?: string;
};

export type SlotOption = {
  time: string; // HH:mm shop-local
  period: "Morning" | "Midday" | "Afternoon" | "Evening";
  booked: boolean;
};

/* -------------------------------------------------------------------------------------------------
 * Helpers
 * -------------------------------------------------------------------------------------------------*/

const durationToLabel = (minutes: number) =>
  minutes >= 60
    ? `${Math.floor(minutes / 60)}h${minutes % 60 ? `${minutes % 60}` : ""}`
    : `${minutes} min`;

const tierForPrice = (price: number) => {
  if (price >= 500) return "Signature Experience";
  if (price >= 300) return "Premium Service";
  return "Classic Service";
};

const initialsOf = (firstName: string, lastName: string) =>
  `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

/**
 * Parse "HH:mm" shop-local on date "YYYY-MM-DD" into a UTC instant.
 */
export const shopTimeToDate = (date: string, time: string): Date =>
  new Date(`${date}T${time}:00${SHOP_TZ_OFFSET}`);

/**
 * Format a UTC instant as "HH:mm" in the shop timezone.
 */
export const formatShopTime = (instant: Date): string =>
  new Intl.DateTimeFormat("fr-MA", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: SHOP_TZ,
  }).format(instant);

/**
 * "YYYY-MM-DD" for "now" in the shop timezone.
 */
export const todayInShopTz = (): string =>
  new Intl.DateTimeFormat("en-CA", { timeZone: SHOP_TZ }).format(new Date());

const addDaysISO = (date: string, days: number): string => {
  const d = shopTimeToDate(date, "12:00");
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
};

export const weekdayOf = (date: string): DayOfWeek => {
  const names: DayOfWeek[] = [
    "SUNDAY",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
  ];
  return names[shopTimeToDate(date, "12:00").getUTCDay()];
};

const periodOf = (time: string): SlotOption["period"] => {
  const h = Number.parseInt(time.slice(0, 2), 10);
  if (h < 11) return "Morning";
  if (h < 14) return "Midday";
  if (h < 18) return "Afternoon";
  return "Evening";
};

/**
 * Every 30-min grid time from open to close (exclusive of a start that would
 * run past closing given `durationMinutes`).
 */
const gridSlots = (open: string, close: string, durationMinutes: number): string[] => {
  const toMin = (t: string) => Number.parseInt(t.slice(0, 2), 10) * 60 + Number.parseInt(t.slice(3, 5), 10);
  const toLabel = (m: number) =>
    `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  const slots: string[] = [];
  for (let m = toMin(open); m + durationMinutes <= toMin(close); m += 30) {
    slots.push(toLabel(m));
  }
  return slots;
};

/* -------------------------------------------------------------------------------------------------
 * Queries
 * -------------------------------------------------------------------------------------------------*/

const toShopSummary = (
  shop: Shop & {
    services?: { price: { toNumber?: () => number } | number }[];
    _count?: { reviews: number };
    reviews?: { rating: number }[];
  },
): ShopSummary => {
  const prices = (shop.services ?? []).map((s) =>
    typeof s.price === "number" ? s.price : (s.price.toNumber?.() ?? 0),
  );
  const ratings = shop.reviews?.map((r) => r.rating) ?? [];
  const rating =
    ratings.length > 0
      ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10
      : 0;
  return {
    id: shop.id,
    slug: shop.slug,
    name: shop.name,
    description: shop.description ?? "",
    city: shop.city ?? "",
    address: shop.address ?? "",
    coverUrl: shop.coverUrl ?? "/images/shop-cover-royal.jpg",
    logoUrl: shop.logoUrl ?? "/images/shop-logo-royal.jpg",
    rating,
    reviewCount: ratings.length,
    minPrice: prices.length ? `${Math.min(...prices)} MAD` : "—",
    minPriceValue: prices.length ? Math.min(...prices) : Number.MAX_SAFE_INTEGER,
    serviceNames: (shop.services ?? [])
      .map((s) => ("name" in s ? String((s as { name: unknown }).name) : ""))
      .filter(Boolean),
  };
};

const shopInclude = {
  services: { where: { isActive: true }, orderBy: { createdAt: "asc" as const } },
  _count: { select: { reviews: true } },
  reviews: { select: { rating: true }, where: { status: "VISIBLE" as const } },
};

/**
 * The shop a guest books at. MVP: the featured shop, falling back to the
 * oldest active shop. (Marketplace filters arrive with real shop supply.)
 */
export const getPrimaryShop = cache(async (): Promise<ShopDetail | null> => {
  const shop = await database.shop.findFirst({
    where: { status: "ACTIVE", deletedAt: null },
    orderBy: [{ isFeatured: "desc" }, { createdAt: "asc" }],
    include: { ...shopInclude, openingHours: true },
  });
  if (!shop) return null;
  return {
    ...toShopSummary(shop),
    phone: shop.phone ?? undefined,
    openingHours: shop.openingHours.map((h) => ({
      dayOfWeek: h.dayOfWeek,
      openTime: h.openTime,
      closeTime: h.closeTime,
      isClosed: h.isClosed,
    })),
  };
});

export const getShop = cache(async (idOrSlug: string): Promise<ShopDetail | null> => {
  const shop = await database.shop.findFirst({
    where: {
      OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      status: "ACTIVE",
      deletedAt: null,
    },
    include: { ...shopInclude, openingHours: true },
  });
  if (!shop) return null;
  return {
    ...toShopSummary(shop),
    phone: shop.phone ?? undefined,
    openingHours: shop.openingHours.map((h) => ({
      dayOfWeek: h.dayOfWeek,
      openTime: h.openTime,
      closeTime: h.closeTime,
      isClosed: h.isClosed,
    })),
  };
});

export const listShops = cache(async (): Promise<ShopSummary[]> => {
  const shops = await database.shop.findMany({
    where: { status: "ACTIVE", deletedAt: null },
    orderBy: [{ isFeatured: "desc" }, { createdAt: "asc" }],
    include: shopInclude,
    take: 12,
  });
  return shops.map(toShopSummary);
});

/**
 * Accent/case-insensitive normalization for search ("Fès" → "fes",
 * "Coupe " → "coupe").
 */
export const normalize = (value: string): string =>
  value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();

export const searchShops = cache(
  async (query: string): Promise<ShopSummary[]> => {
    const shops = await listShops();
    const q = normalize(query);
    if (!q) return shops;
    const terms = q.split(/\s+/);
    return shops.filter((shop) => {
      const haystack = normalize(
        [shop.name, shop.city, shop.description, ...shop.serviceNames].join(" "),
      );
      return terms.every((term) => haystack.includes(term));
    });
  },
);

export const listServices = cache(async (shopId: string): Promise<ServiceCard[]> => {
  const services = await database.service.findMany({
    where: { shopId, isActive: true },
    orderBy: { createdAt: "asc" },
    include: { category: true },
  });
  return services.map((s) => {
    const price = s.price.toNumber();
    return {
      id: s.id,
      name: s.name,
      description: s.description ?? "",
      duration: durationToLabel(s.duration),
      durationMinutes: s.duration,
      price: `${price} MAD`,
      priceValue: price,
      tier: tierForPrice(price),
      imageUrl: s.imageUrl ?? "/images/svc-classic-cut.jpg",
      category: s.category?.name.toLowerCase() ?? "classic",
    };
  });
});

export const getService = cache(async (id: string): Promise<ServiceCard | null> => {
  const s = await database.service.findUnique({ where: { id }, include: { category: true } });
  if (!s || !s.isActive) return null;
  const price = s.price.toNumber();
  return {
    id: s.id,
    name: s.name,
    description: s.description ?? "",
    duration: durationToLabel(s.duration),
    durationMinutes: s.duration,
    price: `${price} MAD`,
    priceValue: price,
    tier: tierForPrice(price),
    imageUrl: s.imageUrl ?? "/images/svc-classic-cut.jpg",
    category: s.category?.name.toLowerCase() ?? "classic",
  };
});

export type BarberWithServices = BarberCard & { serviceIds: string[] };

export const listBarbers = cache(async (shopId: string): Promise<BarberWithServices[]> => {
  const rows = await database.shopBarber.findMany({
    where: { shopId, barber: { isActive: true } },
    include: {
      barber: {
        include: {
          user: true,
          services: { where: { service: { isActive: true } } },
        },
      },
    },
    orderBy: { joinedAt: "asc" },
  });
  return rows.map(({ barber }) => ({
    id: barber.id,
    name: `${barber.user.firstName} ${barber.user.lastName}`,
    specialty: barber.bio?.split("·")[0]?.trim() || "Barbier",
    bio: barber.bio?.split("·").slice(1).join("·").trim() || barber.bio || "",
    skills: (barber.bio?.split("·")[0] ?? "")
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean),
    avatarUrl: barber.user.avatarUrl ?? undefined,
    initials: initialsOf(barber.user.firstName, barber.user.lastName),
    serviceIds: barber.services.map((bs) => bs.serviceId),
  }));
});

/* -------------------------------------------------------------------------------------------------
 * Availability
 * -------------------------------------------------------------------------------------------------*/

export const buildDayOptions = async (
  shopId: string,
  days = 14,
): Promise<DayOption[]> => {
  const hours = await database.openingHours.findMany({ where: { shopId } });
  const byDay = new Map(hours.map((h) => [h.dayOfWeek, h]));
  const start = todayInShopTz();
  const options: DayOption[] = [];
  for (let i = 0; i < days; i += 1) {
    const date = addDaysISO(start, i);
    const weekday = weekdayOf(date);
    const h = byDay.get(weekday);
    const dayLabel = new Intl.DateTimeFormat("fr-MA", {
      weekday: "short",
      day: "numeric",
      timeZone: "UTC",
    }).format(shopTimeToDate(date, "12:00"));
    options.push({
      date,
      label: dayLabel,
      weekday,
      isClosed: h?.isClosed ?? true,
      openTime: h?.openTime,
      closeTime: h?.closeTime,
    });
  }
  return options;
};

/**
 * Free 30-min slots for a date. barberId "any" → a slot is free when at least
 * one active barber of the shop is free during it.
 */
export const computeSlots = async (
  shopId: string,
  barberId: string | undefined,
  serviceId: string,
  date: string,
): Promise<SlotOption[]> => {
  const service = await database.service.findUnique({ where: { id: serviceId } });
  if (!service) return [];

  const weekday = weekdayOf(date);
  const hours = await database.openingHours.findFirst({
    where: { shopId, dayOfWeek: weekday },
  });
  if (!hours || hours.isClosed) return [];

  const barbers = await database.shopBarber.findMany({
    where: {
      shopId,
      barber: { isActive: true },
      ...(barberId && barberId !== "any" ? { barberId } : {}),
    },
    include: { barber: true },
  });
  if (barbers.length === 0) return [];

  const dayStart = shopTimeToDate(date, "00:00");
  const dayEnd = shopTimeToDate(date, "23:59");
  const bookings = await database.booking.findMany({
    where: {
      shopId,
      scheduledAt: { gte: dayStart, lt: dayEnd },
      status: { in: ACTIVE_STATUSES },
      ...(barberId && barberId !== "any" ? { barberId } : {}),
    },
    select: { barberId: true, scheduledAt: true, endsAt: true },
  });

  // Blocked times per barber (leave, errands…)
  const blocked = await database.barberBlockedTime.findMany({
    where: {
      barber: { id: { in: barbers.map((b) => b.barberId) } },
      startAt: { lt: dayEnd },
      endAt: { gte: dayStart },
    },
    select: { barberId: true, startAt: true, endAt: true },
  });

  // Per-barber working-hours overrides
  const availability = await database.barberAvailability.findMany({
    where: { barber: { id: { in: barbers.map((b) => b.barberId) } }, dayOfWeek: weekday },
    select: { barberId: true, startTime: true, endTime: true, isAvailable: true },
  });

  const now = Date.now();
  const candidateTimes = gridSlots(hours.openTime, hours.closeTime, service.duration);

  return candidateTimes.map((time) => {
    const start = shopTimeToDate(date, time).getTime();
    const end = start + service.duration * 60_000;
    const isPast = start <= now + 30 * 60_000; // 30-min booking lead time

    const freeBarber = barbers.some(({ barberId: id }) => {
      const inWindow = availability
        .filter((a) => a.barberId === id)
        .filter((a) => a.isAvailable);
      if (
        inWindow.length > 0 &&
        !inWindow.some((a) => a.startTime <= time && time < a.endTime)
      ) {
        return false;
      }
      const overlapsBooking = bookings.some(
        (b) => b.barberId === id && start < b.endsAt.getTime() && b.scheduledAt.getTime() < end,
      );
      if (overlapsBooking) return false;
      const overlapsBlocked = blocked.some(
        (b) => b.barberId === id && start < b.endAt.getTime() && b.startAt.getTime() < end,
      );
      return !overlapsBlocked;
    });

    return {
      time,
      period: periodOf(time),
      booked: isPast || !freeBarber,
    };
  });
};

/* -------------------------------------------------------------------------------------------------
 * Booking creation (guest checkout)
 * -------------------------------------------------------------------------------------------------*/

export type CreateBookingInput = {
  shopId: string;
  serviceId: string;
  barberId?: string; // "any" or a barber id
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  firstName: string;
  lastName: string;
  phone: string;
  notes?: string;
};

export type CreateBookingResult =
  | { ok: true; reference: string }
  | { ok: false; error: "slot_taken" | "not_found" | "closed" | "unavailable" };

const phoneDigits = (phone: string) => phone.replace(/\D/g, "");

export const createBooking = async (
  input: CreateBookingInput,
): Promise<CreateBookingResult> => {
  const service = await database.service.findUnique({
    where: { id: input.serviceId },
  });
  if (!service || !service.isActive) return { ok: false, error: "not_found" };

  const slots = await computeSlots(input.shopId, input.barberId, input.serviceId, input.date);
  const slot = slots.find((s) => s.time === input.time);
  if (!slot) return { ok: false, error: "closed" };
  if (slot.booked) return { ok: false, error: "slot_taken" };

  const scheduledAt = shopTimeToDate(input.date, input.time);
  const endsAt = new Date(scheduledAt.getTime() + service.duration * 60_000);

  // Resolve "any" → the free barber with the fewest bookings that day.
  let barberId = input.barberId && input.barberId !== "any" ? input.barberId : undefined;
  if (!barberId) {
    const candidates = await database.shopBarber.findMany({
      where: { shopId: input.shopId, barber: { isActive: true } },
      select: { barberId: true },
    });
    const counts = await database.booking.groupBy({
      by: ["barberId"],
      where: {
        shopId: input.shopId,
        scheduledAt: { gte: shopTimeToDate(input.date, "00:00") },
        status: { in: ACTIVE_STATUSES },
      },
      _count: true,
    });
    const countOf = (id: string) => counts.find((c) => c.barberId === id)?._count ?? 0;
    // Slot.booked === false guarantees at least one barber is free — but
    // re-derive that set to pick among the actually-free ones.
    const free: string[] = [];
    for (const c of candidates) {
      const clash = await database.booking.findFirst({
        where: {
          barberId: c.barberId,
          scheduledAt: { lt: endsAt },
          endsAt: { gt: scheduledAt },
          status: { in: ACTIVE_STATUSES },
        },
      });
      if (!clash) free.push(c.barberId);
    }
    const pool = free.length > 0 ? free : candidates.map((c) => c.barberId);
    barberId = [...pool].sort((a, b) => countOf(a) - countOf(b))[0];
  }

  const digits = phoneDigits(input.phone);
  const guest = await database.user.upsert({
    where: { email: `guest.${digits}@barberbook.ma` },
    create: {
      clerkId: `guest_${digits}`,
      role: "CUSTOMER",
      email: `guest.${digits}@barberbook.ma`,
      phone: input.phone,
      firstName: input.firstName,
      lastName: input.lastName,
      locale: "fr",
    },
    update: {
      firstName: input.firstName,
      lastName: input.lastName,
      phone: input.phone,
    },
  });

  const booking = await database.booking.create({
    data: {
      customerId: guest.id,
      barberId,
      shopId: input.shopId,
      status: "CONFIRMED",
      scheduledAt,
      endsAt,
      customerNotes: input.notes,
      services: {
        create: { serviceId: service.id, price: service.price, duration: service.duration },
      },
      payment: {
        create: { amount: service.price, method: "CASH", status: "PENDING" },
      },
    },
  });

  return { ok: true, reference: booking.id.slice(-8).toUpperCase() };
};

export const getBookingByReference = cache(async (ref: string) => {
  const bookings = await database.booking.findMany({
    where: { id: { endsWith: ref.toLowerCase() } },
    include: {
      shop: true,
      barber: { include: { user: true } },
      services: { include: { service: true } },
      payment: true,
    },
    take: 1,
  });
  const booking = bookings[0];
  if (!booking) return null;
  const service = booking.services[0];
  return {
    reference: booking.id.slice(-8).toUpperCase(),
    status: booking.status,
    scheduledAt: booking.scheduledAt,
    endsAt: booking.endsAt,
    shopName: booking.shop.name,
    shopAddress: booking.shop.address ?? "",
    shopCity: booking.shop.city ?? "",
    barberName: `${booking.barber.user.firstName} ${booking.barber.user.lastName}`,
    serviceName: service?.service.name ?? "",
    price: service ? service.price.toNumber() : 0,
    method: booking.payment?.method ?? "CASH",
    customerNotes: booking.customerNotes ?? undefined,
  };
});


/* -------------------------------------------------------------------------------------------------
 * My bookings (customer lookup by phone) + cancellation
 * -------------------------------------------------------------------------------------------------*/

export type CustomerBooking = {
  reference: string;
  status: string;
  scheduledAt: Date;
  endsAt: Date;
  shopName: string;
  shopCity: string;
  barberName: string;
  serviceName: string;
  price: number;
  canCancel: boolean;
};

const digitsOf = (phone: string) => phone.replace(/\D/g, "");
const phoneSuffix = (phone: string) => digitsOf(phone).slice(-9);

export const listBookingsByPhone = cache(
  async (phone: string): Promise<{ upcoming: CustomerBooking[]; past: CustomerBooking[] }> => {
    const suffix = phoneSuffix(phone);
    if (suffix.length < 6) return { upcoming: [], past: [] };

    const rows = await database.booking.findMany({
      where: { customer: { phone: { not: null } } },
      orderBy: { scheduledAt: "desc" },
      take: 300,
      include: {
        customer: { select: { phone: true } },
        shop: true,
        barber: { include: { user: true } },
        services: { include: { service: true } },
      },
    });

    const now = Date.now();
    const mine = rows
      .filter((b) => digitsOf(b.customer.phone ?? "").endsWith(suffix))
      .map((b): CustomerBooking => {
        const service = b.services[0];
        return {
          reference: b.id.slice(-8).toUpperCase(),
          status: b.status,
          scheduledAt: b.scheduledAt,
          endsAt: b.endsAt,
          shopName: b.shop.name,
          shopCity: b.shop.city ?? "",
          barberName: `${b.barber.user.firstName} ${b.barber.user.lastName}`,
          serviceName: service?.service.name ?? "",
          price: service ? service.price.toNumber() : 0,
          canCancel:
            (b.status === "PENDING" || b.status === "CONFIRMED") &&
            b.scheduledAt.getTime() > now + 2 * 60 * 60 * 1000,
        };
      });

    return {
      upcoming: mine
        .filter((b) => b.scheduledAt.getTime() >= now && b.status !== "CANCELLED")
        .sort((a, b) => a.scheduledAt.getTime() - b.scheduledAt.getTime()),
      past: mine.filter((b) => b.scheduledAt.getTime() < now || b.status === "CANCELLED"),
    };
  },
);

export type CancelResult = "ok" | "not_found" | "too_late";

export const cancelBookingByReference = async (
  ref: string,
  phone: string,
): Promise<CancelResult> => {
  const suffix = phoneSuffix(phone);
  const bookings = await database.booking.findMany({
    where: { id: { endsWith: ref.toLowerCase() } },
    include: { customer: true },
    take: 1,
  });
  const booking = bookings[0];
  if (!booking) return "not_found";
  if (!digitsOf(booking.customer.phone ?? "").endsWith(suffix)) return "not_found";
  const active = ["PENDING", "CONFIRMED", "IN_PROGRESS"] as const;
  if (!active.includes(booking.status as (typeof active)[number])) return "not_found";
  if (booking.scheduledAt.getTime() <= Date.now() + 2 * 60 * 60 * 1000) return "too_late";

  await database.booking.update({
    where: { id: booking.id },
    data: { status: "CANCELLED", cancellationReason: "Annulée par le client" },
  });
  return "ok";
};


/* -------------------------------------------------------------------------------------------------
 * Shop reviews (Design.md — Reviews list)
 * -------------------------------------------------------------------------------------------------*/

export type ShopReview = {
  author: string;
  rating: number;
  comment: string;
  createdAt: Date;
};

export const listShopReviews = cache(
  async (shopId: string): Promise<ShopReview[]> => {
    const reviews = await database.review.findMany({
      where: { shopId, status: "VISIBLE", comment: { not: null } },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { author: { select: { firstName: true, lastName: true } } },
    });
    return reviews.map((review) => ({
      author: `${review.author.firstName} ${review.author.lastName.charAt(0)}.`,
      rating: review.rating,
      comment: review.comment ?? "",
      createdAt: review.createdAt,
    }));
  },
);
