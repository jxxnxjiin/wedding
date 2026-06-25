import reservations from "../data/reservations.json";
import type { Vendor } from "./schema";

export type Screen =
  | "onboard"
  | "home"
  | "vendors"
  | "vendor-compare"
  | "vendor-detail"
  | "reserve"
  | "reservation-done"
  | "reservations"
  | "visit"
  | "roadmap"
  | "task-detail"
  | "budget"
  | "ai"
  | "profile"
  | "value-test"
  | "value-result"
  | "dress-recommendation";

export type AddOnServiceRoute = {
  action: string;
  screen: Screen;
};

export type VendorTab = "recommendations" | "saved";

export type ReservationKind = keyof typeof reservations.statusStyles;

export type Reservation = {
  id: string;
  vendorId: string;
  status: string;
  kind: ReservationKind;
  slot: string;
  next: string;
  primary: string;
  secondary: string;
};

export type ReservationStyle = (typeof reservations.statusStyles)[ReservationKind];

export type ReservationCard = Reservation & {
  vendor: Vendor;
  style: ReservationStyle;
};

export type AiMessage = {
  id?: string;
  question: string;
  answer: string;
  answerType?: "budget-report";
  pending?: boolean;
};

export type Onboarding = Record<string, string>;

export type CoupleProfile = {
  role: string;
  name: string;
  initial: string;
  summary: string;
};

export type HeroAction = {
  title: string;
  desc: string;
  cta: string;
  action: () => void;
};

export const STORAGE_KEY = "easy-wedding-mvp-state";
export const ACCENT_COLOR = "#6A3357";
