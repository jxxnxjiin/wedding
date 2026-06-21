import { ACCENT_COLOR } from "../lib/types";

export function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2 7.5l3 3 7-7.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill={filled ? ACCENT_COLOR : "none"} aria-hidden="true">
      <path
        d="M12 20s-7-4.6-9.2-9C1.3 7.6 3 4.5 6.2 4.5c1.9 0 3.2 1.1 3.8 2.2.6-1.1 1.9-2.2 3.8-2.2 3.2 0 4.9 3.1 3.4 6.5C19 15.4 12 20 12 20z"
        stroke={filled ? ACCENT_COLOR : "#9A8A82"}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SparkIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3l1.6 4.6L18 9l-4.4 1.4L12 15l-1.6-4.6L6 9l4.4-1.4L12 3z" fill="#9A4F46" />
      <circle cx="18.5" cy="17.5" r="2.5" fill="#C98B7F" />
    </svg>
  );
}

export function CalendarIcon() {
  return (
    <svg width="23" height="23" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="5" width="16" height="15" rx="3" stroke="currentColor" strokeWidth="1.7" />
      <path d="M4 9h16M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export function InfoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 11v5M12 7.5v.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 4h4l1.5 4-2 1.5a12 12 0 005 5l1.5-2 4 1.5v4a1.5 1.5 0 01-1.6 1.5C9 19.5 4.5 15 3.5 6.6A1.5 1.5 0 015 4z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

export function ClockIcon({ color }: { color: string }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9.5" stroke={color} strokeWidth="1.5" />
      <path d="M12 7.5v5l3 2" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function HomeIcon() {
  return (
    <svg width="23" height="23" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 11l8-7 8 7v8a1 1 0 01-1 1h-4v-6h-6v6H5a1 1 0 01-1-1v-8z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  );
}

export function ListIcon() {
  return (
    <svg width="23" height="23" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 6h14M5 12h14M5 18h9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <circle cx="20" cy="18" r="1.6" fill="currentColor" />
    </svg>
  );
}

export function SearchIcon() {
  return (
    <svg width="23" height="23" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.7" />
      <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export function UserIcon() {
  return (
    <svg width="23" height="23" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8.5" r="3.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="M5 20c0-3.3 3.1-5.5 7-5.5s7 2.2 7 5.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export function SignalIcon() {
  return (
    <svg width="18" height="12" viewBox="0 0 18 12" fill="none" aria-hidden="true">
      <rect x="0" y="7" width="3" height="5" rx="1" fill="currentColor" />
      <rect x="5" y="4.5" width="3" height="7.5" rx="1" fill="currentColor" />
      <rect x="10" y="2" width="3" height="10" rx="1" fill="currentColor" />
      <rect x="15" y="0" width="3" height="12" rx="1" fill="currentColor" />
    </svg>
  );
}

export function WifiIcon() {
  return (
    <svg width="17" height="12" viewBox="0 0 17 12" fill="none" aria-hidden="true">
      <path d="M8.5 2.2c2.3 0 4.4.9 6 2.3l1.2-1.4C13.8 1.3 11.3.3 8.5.3 5.7.3 3.2 1.3 1.3 3.1L2.5 4.5c1.6-1.4 3.7-2.3 6-2.3z" fill="currentColor" />
      <path d="M8.5 6c1.3 0 2.5.5 3.4 1.3l1.2-1.4C11.9 4.7 10.3 4 8.5 4S5.1 4.7 3.9 5.9L5.1 7.3C6 6.5 7.2 6 8.5 6z" fill="currentColor" />
      <circle cx="8.5" cy="10" r="1.6" fill="currentColor" />
    </svg>
  );
}

export function BatteryIcon() {
  return (
    <svg width="26" height="13" viewBox="0 0 26 13" fill="none" aria-hidden="true">
      <rect x="1" y="1" width="21" height="11" rx="3" stroke="currentColor" strokeOpacity=".5" strokeWidth="1" />
      <rect x="2.5" y="2.5" width="17" height="8" rx="1.5" fill="currentColor" />
      <rect x="23.5" y="4" width="1.8" height="5" rx=".9" fill="currentColor" fillOpacity=".5" />
    </svg>
  );
}
