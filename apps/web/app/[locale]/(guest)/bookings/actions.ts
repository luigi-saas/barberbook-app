"use server";

import { cancelBookingByReference } from "@/lib/booking";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

/**
 * Cancel a booking after phone verification (Design.md — My bookings /
 * Cancel booking). Redirects back to the lookup with a status flag.
 */
export const cancelBookingAction = async (formData: FormData): Promise<void> => {
  const ref = String(formData.get("ref") ?? "");
  const phone = String(formData.get("phone") ?? "");
  const locale = String(formData.get("locale") ?? "fr");

  const result = await cancelBookingByReference(ref, phone).catch((error: unknown) => {
    console.error("[bookings] cancel failed:", error instanceof Error ? error.message : error);
    return "not_found" as const;
  });

  revalidatePath(`/${locale}/bookings`);
  redirect(
    `/${locale}/bookings?phone=${encodeURIComponent(phone)}&cancel=${result}`,
  );
};
