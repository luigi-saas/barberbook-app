/** Weekday enum values used by OpeningHours and BarberAvailability. */
export const DAYS = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

/** Date n days ago (demo-history timestamps). */
export const daysAgo = (n) => new Date(Date.now() - n * 24 * 60 * 60 * 1000);
