import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getPricingConfig = () => {
  const cutoffDate = new Date("2026-08-01T00:00:00+07:00");
  const isLate = new Date() >= cutoffDate;

  return [
      { label: "SD", price: isLate ? 7000 : 5000, latePrice: 7000, isLate },
      { label: "SMP", price: isLate ? 10000 : 8000, latePrice: 10000, isLate },
      { label: "SMA/SMK", price: isLate ? 12000 : 10000, latePrice: 12000, isLate },
      { label: "Umum (Maks 50 Thn)", price: isLate ? 15000 : 12000, latePrice: 15000, isLate },
  ];
};
