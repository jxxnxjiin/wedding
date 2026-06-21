import reservations from "../data/reservations.json";
import type { Vendor } from "./schema";

export type Screen =
  | "onboard"
  | "home"
  | "find"
  | "compare"
  | "detail"
  | "reserve"
  | "done"
  | "reservations"
  | "saved-venues"
  | "visit"
  | "roadmap"
  | "ai"
  | "my";

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
  question: string;
  answer: string;
};

export type Onboarding = Record<string, string>;

export type HeroAction = {
  title: string;
  desc: string;
  cta: string;
  action: () => void;
};

export const STORAGE_KEY = "easy-wedding-mvp-state";
export const ACCENT_COLOR = "#B5685E";
