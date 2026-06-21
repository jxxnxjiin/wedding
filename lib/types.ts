import reservations from "../data/reservations.json";
import venues from "../data/venues.json";

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

export type Venue = (typeof venues.venues)[number];
export type ReservationKind = keyof typeof reservations.statusStyles;

export type Reservation = {
  id: string;
  venueId: string;
  status: string;
  kind: ReservationKind;
  slot: string;
  next: string;
  primary: string;
  secondary: string;
};

export type ReservationStyle = (typeof reservations.statusStyles)[ReservationKind];

export type ReservationCard = Reservation & {
  venue: Venue;
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
