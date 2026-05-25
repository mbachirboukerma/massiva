/** Localized specialty detail DTO (employment, reviews, salary, etc.). */
export type { MockDetail as SpecialtyDetail } from "@/lib/mockDetailData";

export type TranslateFn = (key: string, vars?: Record<string, string | number>) => string;
