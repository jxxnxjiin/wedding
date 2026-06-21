import type { ReactNode } from "react";
import type { Screen } from "../lib/types";
import { BatteryIcon, CalendarIcon, HomeIcon, ListIcon, SearchIcon, SignalIcon, SparkIcon, WifiIcon } from "./icons";

export function StatusBar() {
  return (
    <div className="status-bar">
      <span>9:41</span>
      <span className="status-icons" aria-hidden="true">
        <SignalIcon />
        <WifiIcon />
        <BatteryIcon />
      </span>
    </div>
  );
}

export function TabBar({ screen, onGo }: { screen: Screen; onGo: (screen: Screen) => void }) {
  const activeScreen = screen === "saved-venues" ? "reservations" : screen;
  const tabs: Array<{ screen: Screen; label: string; icon: ReactNode }> = [
    { screen: "home", label: "홈", icon: <HomeIcon /> },
    { screen: "roadmap", label: "로드맵", icon: <ListIcon /> },
    { screen: "find", label: "찾기", icon: <SearchIcon /> },
    { screen: "reservations", label: "예약", icon: <CalendarIcon /> },
    { screen: "ai", label: "AI", icon: <SparkIcon /> }
  ];

  return (
    <nav className="bottom-tab" aria-label="하단 내비게이션">
      {tabs.map((tab) => (
        <button key={tab.screen} className={`tab-button ${activeScreen === tab.screen ? "active" : ""}`} onClick={() => onGo(tab.screen)}>
          {tab.icon}
          <span>{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}

export function HeaderBar({ title, onBack, close = false }: { title: string; onBack: () => void; close?: boolean }) {
  return (
    <header className="header-bar">
      <button onClick={onBack}>{close ? "✕" : "‹"}</button>
      <span className="serif">{title}</span>
    </header>
  );
}

export function ChoiceSection({
  title,
  note,
  helper,
  children
}: {
  title: string;
  note?: string;
  helper?: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h3 className="reserve-title">
        {title} {note && <span>{note}</span>}
      </h3>
      {helper && <p className="choice-helper">{helper}</p>}
      <div className="choice-row">{children}</div>
    </section>
  );
}

export function Spec({ label, value, muted = false }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="spec">
      <span>{label}</span>
      <b className={muted ? "muted" : ""}>{value}</b>
    </div>
  );
}

export function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="stat card">
      <span>{label}</span>
      <b>{value}</b>
    </div>
  );
}
