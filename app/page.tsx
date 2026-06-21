"use client";

import { useEffect, useMemo, useState } from "react";
import guidesData from "../data/guides.json";
import onboardingData from "../data/onboarding.json";
import reservationsData from "../data/reservations.json";
import venuesData from "../data/venues.json";
import { StatusBar, TabBar } from "../components/common";
import { HeartIcon } from "../components/icons";
import { ReservationsScreen, SavedVenuesScreen } from "../components/pages/reservations";
import {
  AiConsultScreen,
  AiComposer,
  AiSheet,
  CompareScreen,
  DetailScreen,
  DoneScreen,
  FindScreen,
  HomeScreen,
  MyScreen,
  OnboardingScreen,
  ReserveScreen,
  RoadmapScreen,
  VisitScreen
} from "../components/screens";
import type { AiMessage, HeroAction, Onboarding, Reservation, Screen, Venue } from "../lib/types";
import { STORAGE_KEY } from "../lib/types";

type PersistedState = Partial<{
  screen: Screen;
  onboarding: Onboarding;
  savedIds: string[];
  activeId: string;
  createdReservations: Reservation[];
  progress: "start" | "requested";
  visitChecks: Record<number, boolean>;
  checklistChecks: Record<string, boolean>;
  roadmapPhaseId: string;
  aiThread: AiMessage[];
}>;

export default function Home() {
  const [screen, setScreen] = useState<Screen>("onboard");
  const [onboarding, setOnboarding] = useState<Onboarding>(onboardingData.defaultOnboarding);
  const [savedIds, setSavedIds] = useState<string[]>(["v1", "v2"]);
  const [activeId, setActiveId] = useState("v1");
  const [reserveDates, setReserveDates] = useState<string[]>([]);
  const [reserveTimes, setReserveTimes] = useState<string[]>([]);
  const [createdReservations, setCreatedReservations] = useState<Reservation[]>([]);
  const [progress, setProgress] = useState<"start" | "requested">("start");
  const [visitChecks, setVisitChecks] = useState<Record<number, boolean>>({});
  const [checklistChecks, setChecklistChecks] = useState<Record<string, boolean>>({});
  const [roadmapPhaseId, setRoadmapPhaseId] = useState("phase-1");
  const [aiThread, setAiThread] = useState<AiMessage[]>([]);
  const [aiDraft, setAiDraft] = useState("");
  const [aiOpen, setAiOpen] = useState(false);

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as PersistedState;
      setScreen("onboard");
      setOnboarding(parsed.onboarding ?? onboardingData.defaultOnboarding);
      setSavedIds(parsed.savedIds ?? ["v1", "v2"]);
      setActiveId(parsed.activeId ?? "v1");
      setCreatedReservations(parsed.createdReservations ?? []);
      setProgress(parsed.progress ?? "start");
      setVisitChecks(parsed.visitChecks ?? {});
      setChecklistChecks(parsed.checklistChecks ?? {});
      setRoadmapPhaseId(parsed.roadmapPhaseId ?? "phase-1");
      setAiThread(parsed.aiThread ?? []);
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ screen, onboarding, savedIds, activeId, createdReservations, progress, visitChecks, checklistChecks, roadmapPhaseId, aiThread })
    );
  }, [screen, onboarding, savedIds, activeId, createdReservations, progress, visitChecks, checklistChecks, roadmapPhaseId, aiThread]);

  const activeVenue = findVenue(activeId);
  const seedReservations = reservationsData.seedReservations as Reservation[];
  const reservations = useMemo(() => [...createdReservations, ...seedReservations], [createdReservations, seedReservations]);
  const reservationCards = reservations.map((reservation) => {
    const venue = findVenue(reservation.venueId);
    const style = reservationsData.statusStyles[reservation.kind];
    return { ...reservation, venue, style };
  });
  const compareVenues = savedIds.map(findVenue).filter(Boolean).slice(0, 3) as Venue[];
  const savedVenues = savedIds.map(findVenue).filter(Boolean) as Venue[];
  const reserveReady = reserveDates.length > 0 && reserveTimes.length > 0;
  const visitDoneCount = Object.values(visitChecks).filter(Boolean).length;
  const hero = makeHero(progress, createdReservations, activeVenue, onboarding, go);

  function findVenue(id: string) {
    return venuesData.venues.find((venue) => venue.id === id) ?? venuesData.venues[0];
  }

  function go(nextScreen: Screen) {
    setAiOpen(false);
    setScreen(nextScreen);
  }

  function openDetail(id: string) {
    setActiveId(id);
    go("detail");
  }

  function toggleSave(id: string) {
    setSavedIds((current) => (current.includes(id) ? current.filter((savedId) => savedId !== id) : [...current, id]));
  }

  function toggleChecklistTask(id: string) {
    const defaultDone = guidesData.phases.flatMap((phase) => phase.checklist).find((task) => task.id === id)?.done ?? false;
    setChecklistChecks((current) => ({ ...current, [id]: !(current[id] ?? defaultDone) }));
  }

  function submitAiQuestion() {
    const question = aiDraft.trim();
    if (!question) return;

    setAiThread((current) => [
      ...current,
      {
        question,
        answer: "안녕하세요, 웨딩 플래너 AI입니다. 무엇을 도와드릴까요?"
      }
    ]);
    setAiDraft("");
  }

  function resetAiThread() {
    setAiThread([]);
    setAiDraft("");
  }

  function startReserve() {
    setReserveDates([]);
    setReserveTimes([]);
    go("reserve");
  }

  function startReserveFor(id: string) {
    setActiveId(id);
    setReserveDates([]);
    setReserveTimes([]);
    go("reserve");
  }

  function submitReserve() {
    if (!reserveReady) return;

    const newReservation: Reservation = {
      id: `r-${activeVenue.id}`,
      venueId: activeVenue.id,
      status: "요청됨",
      kind: "requested",
      slot: `희망: ${reserveDates.map((date) => date.split(" ")[0]).join(", ")}`,
      next: "전화 가능 시간을 확인해주세요",
      primary: "요청 수정",
      secondary: "질문지 보기"
    };

    setCreatedReservations((current) => [newReservation, ...current.filter((item) => item.id !== newReservation.id)]);
    setChecklistChecks((current) => ({ ...current, "hall-visit": true }));
    setProgress("requested");
    go("done");
  }

  return (
    <main className="page-shell">
      <section className="phone" aria-label="Easy Wedding mobile prototype">
        <div className="phone-screen">
          <div className="notch" />
          <StatusBar />

          <div className="content hide-scrollbar">
            {screen === "onboard" && <OnboardingScreen onboarding={onboarding} setOnboarding={setOnboarding} onStart={() => go("home")} />}
            {screen === "home" && (
              <HomeScreen
                hero={hero}
                reservations={reservationCards}
                savedCount={savedIds.length}
                onOpenAi={() => go("ai")}
                onProfile={() => go("my")}
                onRoadmap={() => go("roadmap")}
                checklistChecks={checklistChecks}
                onToggleChecklistTask={toggleChecklistTask}
                weddingDate={onboarding.weddingDate}
              />
            )}
            {screen === "find" && <FindScreen savedIds={savedIds} onToggleSave={toggleSave} onOpenDetail={openDetail} />}
            {screen === "compare" && <CompareScreen venues={compareVenues} onBack={() => go("find")} onReserve={openDetail} />}
            {screen === "detail" && (
              <DetailScreen
                venue={activeVenue}
                saved={savedIds.includes(activeVenue.id)}
                onBack={() => go("find")}
                onToggleSave={() => toggleSave(activeVenue.id)}
                onReserve={startReserve}
              />
            )}
            {screen === "reserve" && (
              <ReserveScreen
                venue={activeVenue}
                reserveDates={reserveDates}
                reserveTimes={reserveTimes}
                setReserveDates={setReserveDates}
                setReserveTimes={setReserveTimes}
                onBack={() => go("detail")}
              />
            )}
            {screen === "done" && (
              <DoneScreen
                venue={activeVenue}
                dates={reserveDates}
                times={reserveTimes}
                onReservations={() => go("reservations")}
                onHome={() => go("home")}
              />
            )}
            {screen === "reservations" && (
              <ReservationsScreen reservations={reservationCards} savedCount={savedVenues.length} onVisit={() => go("visit")} onSavedVenues={() => go("saved-venues")} />
            )}
            {screen === "saved-venues" && (
              <SavedVenuesScreen
                venues={savedVenues}
                onBack={() => go("reservations")}
                onOpenDetail={openDetail}
                onToggleSave={toggleSave}
                onReserve={startReserveFor}
              />
            )}
            {screen === "visit" && (
              <VisitScreen doneCount={visitDoneCount} checks={visitChecks} setChecks={setVisitChecks} onBack={() => go("reservations")} />
            )}
            {screen === "roadmap" && (
              <RoadmapScreen
                activePhaseId={roadmapPhaseId}
                savedCount={savedIds.length}
                checklistChecks={checklistChecks}
                onSelectPhase={setRoadmapPhaseId}
                onToggleChecklistTask={toggleChecklistTask}
                weddingDate={onboarding.weddingDate}
              />
            )}
            {screen === "ai" && (
              <AiConsultScreen
                thread={aiThread}
                onAsk={(message) => setAiThread((current) => [...current, message])}
                onReset={resetAiThread}
              />
            )}
            {screen === "my" && <MyScreen onboarding={onboarding} onBack={() => go("home")} />}
          </div>

          {screen === "find" && savedIds.length >= 2 && (
            <div className="sticky-cta" style={{ bottom: 76 }}>
              <button className="compare-floating" onClick={() => go("compare")}>
                저장한 {savedIds.length}곳 비교하기 <span>→</span>
              </button>
            </div>
          )}

          {screen === "reserve" && (
            <div className="sticky-cta">
              <button
                className="primary-button"
                disabled={!reserveReady}
                onClick={submitReserve}
                style={{
                  background: reserveReady ? "var(--accent)" : "#D9C7BD",
                  cursor: reserveReady ? "pointer" : "default"
                }}
              >
                {reserveReady ? "예약 요청 보내기" : "날짜와 시간을 선택하세요"}
              </button>
            </div>
          )}

          {screen === "detail" && (
            <div className="sticky-cta detail-cta">
              <button className="save-square" onClick={() => toggleSave(activeVenue.id)} aria-label="후보 저장">
                <HeartIcon filled={savedIds.includes(activeVenue.id)} />
              </button>
              <button className="primary-button" onClick={startReserve}>
                투어 희망 일정 보내기
              </button>
            </div>
          )}

          {screen === "visit" && (
            <div className="sticky-cta">
              <button className="calendar-button">캘린더에 방문 일정 추가</button>
            </div>
          )}

          {screen === "ai" && (
            <AiComposer draft={aiDraft} setDraft={setAiDraft} onSubmit={submitAiQuestion} />
          )}

          {["home", "find", "reservations", "saved-venues", "roadmap", "ai"].includes(screen) && <TabBar screen={screen} onGo={go} />}

          {aiOpen && (
            <AiSheet
              thread={aiThread}
              onAsk={(message) => setAiThread((current) => [...current, message])}
              onReset={resetAiThread}
              onClose={() => setAiOpen(false)}
            />
          )}

          <div className="home-bar" />
        </div>
      </section>
    </main>
  );
}

function makeHero(
  progress: "start" | "requested",
  createdReservations: Reservation[],
  activeVenue: Venue,
  onboarding: Onboarding,
  go: (screen: Screen) => void
): HeroAction {
  if (progress === "requested") {
    const venueName = createdReservations[0]?.venueId ? findVenueName(createdReservations[0].venueId) : activeVenue.name;
    return {
      title: `${venueName} 답변을 기다리는 중이에요`,
      desc: "보통 1~2일 안에 가능 시간 연락이 와요. 방문 전 확인 질문을 미리 살펴보세요.",
      cta: "방문 전 확인 질문 보기",
      action: () => go("visit")
    };
  }

  return {
    title: "웨딩홀 후보 3곳을 먼저 골라볼까요?",
    desc: `${onboarding.region} · 하객 ${onboarding.guests.replace("~", "-")} 조건에 맞는 홀을 추천해 드려요.`,
    cta: "후보 보러 가기",
    action: () => go("find")
  };
}

function findVenueName(id: string) {
  return venuesData.venues.find((venue) => venue.id === id)?.name ?? venuesData.venues[0].name;
}
