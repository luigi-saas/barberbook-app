"use server";

import { database } from "@repo/database";
import { revalidatePath } from "next/cache";

/**
 * Shop-owner management actions (Design.md — Services / Barber Management).
 * The whole apps/app surface is Clerk-authenticated; fine-grained ownership
 * checks land with multi-tenant roles.
 */

export const setServiceActive = async (formData: FormData): Promise<void> => {
  const id = String(formData.get("id") ?? "");
  const active = String(formData.get("active") ?? "") === "true";
  if (!id) return;
  await database.service.update({ where: { id }, data: { isActive: active } });
  revalidatePath("/services");
};

export const updateService = async (formData: FormData): Promise<void> => {
  const id = String(formData.get("id") ?? "");
  const price = Number(formData.get("price"));
  const duration = Number(formData.get("duration"));
  if (!id || !Number.isFinite(price) || !Number.isFinite(duration)) return;
  await database.service.update({
    where: { id },
    data: {
      price: Math.max(0, Math.min(price, 100_000)),
      duration: Math.max(10, Math.min(Math.round(duration), 480)),
    },
  });
  revalidatePath("/services");
};

export const setBarberActive = async (formData: FormData): Promise<void> => {
  const id = String(formData.get("id") ?? "");
  const active = String(formData.get("active") ?? "") === "true";
  if (!id) return;
  await database.barber.update({ where: { id }, data: { isActive: active } });
  revalidatePath("/barbers");
};
