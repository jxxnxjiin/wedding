import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Easy Wedding MVP",
  description: "Reservation-centered Easy Wedding MVP prototype"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
