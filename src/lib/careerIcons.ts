import {
  Stethoscope, Pill, Smile, Code2, Building2, Ruler, TrendingUp,
  Briefcase, Languages, Globe2, Zap,
  type LucideIcon,
} from "lucide-react";
import type { CareerIconKey } from "@/lib/data";

export const CAREER_ICONS: Record<CareerIconKey, LucideIcon> = {
  stethoscope: Stethoscope,
  pill: Pill,
  tooth: Smile,
  code: Code2,
  building: Building2,
  ruler: Ruler,
  trending: TrendingUp,
  briefcase: Briefcase,
  languages: Languages,
  globe: Globe2,
  zap: Zap,
};
