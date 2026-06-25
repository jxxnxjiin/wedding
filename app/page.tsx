"use client";

import { type ReactNode, useEffect, useMemo, useState } from "react";
import appMeta from "../data/app-meta.json";
import onboardingData from "../data/onboarding.json";
import reservationsData from "../data/reservations.json";
import vendorsData from "../data/vendors.json";
import comparisonReportsData from "../data/comparison-reports.json";
import { StatusBar, TabBar } from "../components/common";
import { HeartIcon } from "../components/icons";
import { ReservationsScreen } from "../components/pages/reservations";
import {
  AiConsultScreen,
  AiComposer,
  AiSheet,
  BudgetScreen,
  CompareScreen,
  DetailScreen,
  DressRecommendationScreen,
  DoneScreen,
  HomeScreen,
  MyScreen,
  OnboardingScreen,
  ReserveScreen,
  RoadmapScreen,
  TaskDetailScreen,
  ValueResultScreen,
  ValueTestScreen,
  VendorExploreScreen,
  VisitScreen
} from "../components/screens";
import { getChecklistTask, isChecklistTaskDone } from "../lib/checklist";
import { brideValueAnswers, groomValueAnswers } from "../lib/value-test";
import type { ChecklistTaskUserUpdate, ComparisonReport, CoupleValueProfiles, Vendor } from "../lib/schema";
import type { AddOnServiceRoute, AiMessage, CoupleProfile, HeroAction, Onboarding, Reservation, Screen, VendorTab } from "../lib/types";
import { STORAGE_KEY } from "../lib/types";

const vendors = vendorsData.vendors as Vendor[];
const baseSavedReports = (comparisonReportsData.reports as ComparisonReport[]).filter((report) => report.status === "saved");
const baseCoupleProfiles = appMeta.coupleProfiles as CoupleProfile[];
const baseValueAnswers: CoupleValueProfiles = { bride: brideValueAnswers, groom: groomValueAnswers };
const AI_FALLBACK_ANSWER = "안녕하세요, 웨딩 플래너 AI입니다. 무엇을 도와드릴까요?";
const AI_BUDGET_EXAMPLE_QUESTION = "스튜디오에 좀 더 쓰고 싶은데 아낄 곳이 있을까?";
const AI_DEMO_RESPONSE_DELAY_MS = 1500;
const ADD_ON_SERVICE_ROUTES: AddOnServiceRoute[] = [
  { action: "value-test", screen: "value-test" },
  { action: "dress-recommendation", screen: "dress-recommendation" },
];

type PersistedState = Partial<{
  screen: Screen;
  onboarding: Onboarding;
  savedIds: string[];
  activeId: string;
  createdReservations: Reservation[];
  progress: "start" | "requested";
  visitChecks: Record<number, boolean>;
  checklistChecks: Record<string, boolean>;
  checklistTaskEdits: Record<string, ChecklistTaskUserUpdate>;
  roadmapPhaseId: string;
  vendorTab: VendorTab;
  aiThread: AiMessage[];
  savedReports: ComparisonReport[];
  coupleProfiles: CoupleProfile[];
  valueAnswers: CoupleValueProfiles;
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
  const [checklistTaskEdits, setChecklistTaskEdits] = useState<Record<string, ChecklistTaskUserUpdate>>({});
  const [roadmapPhaseId, setRoadmapPhaseId] = useState("phase-1");
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [savedReports, setSavedReports] = useState<ComparisonReport[]>(baseSavedReports);
  const [vendorTab, setVendorTab] = useState<VendorTab>("recommendations");
  const [aiThread, setAiThread] = useState<AiMessage[]>([]);
  const [aiDraft, setAiDraft] = useState("");
  const [aiOpen, setAiOpen] = useState(false);
  const [coupleProfiles, setCoupleProfiles] = useState<CoupleProfile[]>(baseCoupleProfiles);
  const [valueAnswers, setValueAnswers] = useState<CoupleValueProfiles>(baseValueAnswers);

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
      setChecklistTaskEdits(parsed.checklistTaskEdits ?? {});
      setRoadmapPhaseId(parsed.roadmapPhaseId ?? "phase-1");
      setVendorTab(parsed.vendorTab ?? "recommendations");
      setAiThread(parsed.aiThread ?? []);
      setSavedReports(parsed.savedReports ?? baseSavedReports);
      setCoupleProfiles(parsed.coupleProfiles ?? baseCoupleProfiles);
      const storedBride = parsed.valueAnswers?.bride;
      setValueAnswers({
        bride: storedBride && Object.keys(storedBride).length > 0 ? storedBride : brideValueAnswers,
        groom: parsed.valueAnswers?.groom ?? groomValueAnswers
      });
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ screen, onboarding, savedIds, activeId, createdReservations, progress, visitChecks, checklistChecks, checklistTaskEdits, roadmapPhaseId, vendorTab, aiThread, savedReports, coupleProfiles, valueAnswers })
    );
  }, [screen, onboarding, savedIds, activeId, createdReservations, progress, visitChecks, checklistChecks, checklistTaskEdits, roadmapPhaseId, vendorTab, aiThread, savedReports, coupleProfiles, valueAnswers]);

  const activeVendor = findVendor(activeId);
  const activeTask = activeTaskId ? getChecklistTask(activeTaskId, checklistTaskEdits) ?? null : null;
  const seedReservations = reservationsData.seedReservations as Reservation[];
  const reservations = useMemo(() => [...createdReservations, ...seedReservations], [createdReservations, seedReservations]);
  const reservationCards = reservations.map((reservation) => {
    const vendor = findVendor(reservation.vendorId);
    const style = reservationsData.statusStyles[reservation.kind];
    return { ...reservation, vendor, style };
  });
  const compareVendors = savedIds.map(findVendor).filter(Boolean).slice(0, 3) as Vendor[];
  const savedVendors = savedIds.map(findVendor).filter(Boolean) as Vendor[];
  const reserveReady = reserveDates.length > 0 && reserveTimes.length > 0;
  const visitDoneCount = Object.values(visitChecks).filter(Boolean).length;
  const hero = makeHero(progress, createdReservations, activeVendor, onboarding, go);
  const brideProfile = coupleProfiles.find((profile) => profile.role === "신부") ?? coupleProfiles[0];
  const groomProfile = coupleProfiles.find((profile) => profile.role === "신랑") ?? coupleProfiles[coupleProfiles.length - 1];

  function findVendor(id: string) {
    return vendors.find((vendor) => vendor.id === id) ?? vendors[0];
  }

  function go(nextScreen: Screen) {
    setAiOpen(false);
    setScreen(nextScreen);
  }

  function openDetail(id: string) {
    setActiveId(id);
    go("vendor-detail");
  }

  function openTaskDetail(id: string) {
    setActiveTaskId(id);
    go("task-detail");
  }

  function saveComparisonReport() {
    if (compareVendors.length === 0) return;

    const ids = compareVendors.map((vendor) => vendor.id);
    const reportId = `report-${ids.join("-")}`;
    const questions = Array.from(new Set(compareVendors.flatMap((vendor) => vendor.questions ?? [])));
    const title =
      compareVendors.length > 1
        ? `${compareVendors[0].name} 외 ${compareVendors.length - 1}곳 비교`
        : `${compareVendors[0].name} 비교`;

    const newReport: ComparisonReport = {
      id: reportId,
      title,
      category: compareVendors[0].category,
      vendorIds: ids,
      status: "saved",
      createdAt: new Date().toISOString(),
      criteria: [],
      metrics: [],
      rows: [],
      vendorSummaries: [],
      suggestedQuestions: questions.map((text, index) => ({
        id: `${reportId}-q${index}`,
        text,
        category: "cost"
      }))
    };

    setSavedReports((current) => [newReport, ...current.filter((report) => report.id !== reportId)]);
    setVendorTab("saved");
    go("vendors");
  }

  function toggleSave(id: string) {
    setSavedIds((current) => (current.includes(id) ? current.filter((savedId) => savedId !== id) : [...current, id]));
  }

  function toggleChecklistTask(id: string) {
    const defaultDone = getChecklistTask(id, checklistTaskEdits)?.status === "done";
    setChecklistChecks((current) => ({ ...current, [id]: !(current[id] ?? defaultDone) }));
  }

  function answerValue(role: "bride" | "groom", questionKey: string, optionId: string) {
    setValueAnswers((current) => ({
      ...current,
      [role]: { ...current[role], [questionKey]: optionId }
    }));
  }

  async function askAi(questionText: string) {
    const question = questionText.trim();
    if (!question) return;

    const messageId = `ai-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const pendingMessage: AiMessage = {
      id: messageId,
      question,
      answer: "답변을 작성 중입니다...",
      pending: true
    };

    setAiThread((current) => [...current, pendingMessage]);
    setAiDraft("");

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          question,
          thread: aiThread
        })
      });

      const data = (await response.json()) as { answer?: string };
      const answer = response.ok && data.answer ? data.answer : AI_FALLBACK_ANSWER;

      setAiThread((current) =>
        current.map((message) => (message.id === messageId ? { ...message, answer, pending: false } : message))
      );
    } catch {
      setAiThread((current) =>
        current.map((message) => (message.id === messageId ? { ...message, answer: AI_FALLBACK_ANSWER, pending: false } : message))
      );
    }
  }

  function submitAiQuestion() {
    void askAi(aiDraft);
  }

  function showPresetAnswer(question: string, answer: string) {
    const messageId = `ai-preset-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const message: AiMessage = {
      id: messageId,
      question,
      answer: "답변을 작성 중입니다...",
      pending: true
    };

    setAiThread((current) => [...current, message]);
    setAiDraft("");

    window.setTimeout(() => {
      setAiThread((current) =>
        current.map((item) => (item.id === messageId ? { ...item, answer, pending: false } : item))
      );
    }, AI_DEMO_RESPONSE_DELAY_MS);
  }

  function showBudgetExampleAnswer() {
    const messageId = `ai-budget-example-${Date.now()}`;
    const message: AiMessage = {
      id: messageId,
      question: AI_BUDGET_EXAMPLE_QUESTION,
      answer: "답변을 작성 중입니다...",
      pending: true
    };

    setAiThread((current) => [...current, message]);
    setAiDraft("");

    window.setTimeout(() => {
      setAiThread((current) =>
        current.map((item) =>
          item.id === messageId ? { ...item, answer: "예산 리포트", answerType: "budget-report", pending: false } : item
        )
      );
    }, AI_DEMO_RESPONSE_DELAY_MS);
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
      id: `r-${activeVendor.id}`,
      vendorId: activeVendor.id,
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
    go("reservation-done");
  }

  const screenEntries: Array<{ screen: Screen; element: ReactNode }> = [
    {
      screen: "onboard",
      element: <OnboardingScreen onboarding={onboarding} setOnboarding={setOnboarding} onStart={() => go("home")} />
    },
    {
      screen: "home",
      element: (
        <HomeScreen
          hero={hero}
          reservations={reservationCards}
          savedCount={savedIds.length}
          onOpenAi={() => setAiOpen(true)}
          onProfile={() => go("profile")}
          onRoadmap={() => go("roadmap")}
          checklistChecks={checklistChecks}
          checklistTaskEdits={checklistTaskEdits}
          onToggleChecklistTask={toggleChecklistTask}
          serviceRoutes={ADD_ON_SERVICE_ROUTES}
          onOpenService={go}
          weddingDate={onboarding.weddingDate}
        />
      )
    },
    {
      screen: "vendors",
      element: (
        <VendorExploreScreen
          vendorTab={vendorTab}
          savedIds={savedIds}
          savedVendors={savedVendors}
          onToggleSave={toggleSave}
          onOpenDetail={openDetail}
          onReserve={startReserveFor}
          onSelectVendorTab={setVendorTab}
          onCompare={() => go("vendor-compare")}
          savedReports={savedReports}
        />
      )
    },
    {
      screen: "vendor-compare",
      element: <CompareScreen vendors={compareVendors} onBack={() => go("vendors")} onReserve={openDetail} onSaveReport={saveComparisonReport} />
    },
    {
      screen: "vendor-detail",
      element: (
        <DetailScreen
          vendor={activeVendor}
          saved={savedIds.includes(activeVendor.id)}
          onBack={() => go("vendors")}
          onToggleSave={() => toggleSave(activeVendor.id)}
          onReserve={startReserve}
        />
      )
    },
    {
      screen: "reserve",
      element: (
        <ReserveScreen
          vendor={activeVendor}
          reserveDates={reserveDates}
          reserveTimes={reserveTimes}
          setReserveDates={setReserveDates}
          setReserveTimes={setReserveTimes}
          onBack={() => go("vendor-detail")}
        />
      )
    },
    {
      screen: "reservation-done",
      element: (
        <DoneScreen
          vendor={activeVendor}
          dates={reserveDates}
          times={reserveTimes}
          onReservations={() => go("reservations")}
          onHome={() => go("home")}
        />
      )
    },
    {
      screen: "reservations",
      element: (
        <ReservationsScreen
          reservations={reservationCards}
          onVisit={() => go("visit")}
          onEditRequest={startReserveFor}
          onOpenDetail={openDetail}
        />
      )
    },
    {
      screen: "visit",
      element: <VisitScreen doneCount={visitDoneCount} checks={visitChecks} setChecks={setVisitChecks} onBack={() => go("reservations")} />
    },
    {
      screen: "roadmap",
      element: (
        <RoadmapScreen
          activePhaseId={roadmapPhaseId}
          savedCount={savedIds.length}
          checklistChecks={checklistChecks}
          onSelectPhase={setRoadmapPhaseId}
          onToggleChecklistTask={toggleChecklistTask}
          onOpenTask={openTaskDetail}
          weddingDate={onboarding.weddingDate}
        />
      )
    },
    {
      screen: "task-detail",
      element: activeTask ? (
        <TaskDetailScreen
          task={activeTask}
          done={isChecklistTaskDone(activeTask, checklistChecks, savedIds.length)}
          savedCount={savedIds.length}
          onBack={() => go("roadmap")}
          onToggle={() => toggleChecklistTask(activeTask.id)}
          onNavigateVendors={() => go("vendors")}
          onOpenVendor={openDetail}
        />
      ) : null
    },
    {
      screen: "ai",
      element: (
        <AiConsultScreen
          thread={aiThread}
          onAsk={askAi}
          onPresetAnswer={showPresetAnswer}
          onBudgetExample={showBudgetExampleAnswer}
          onReset={resetAiThread}
        />
      )
    },
    {
      screen: "budget",
      element: <BudgetScreen onOpenAi={() => setAiOpen(true)} />
    },
    {
      screen: "profile",
      element: (
        <MyScreen
          onboarding={onboarding}
          coupleProfiles={coupleProfiles}
          valueAnswers={valueAnswers}
          onValueTest={() => go("value-test")}
          onBack={() => go("home")}
        />
      )
    },
    {
      screen: "value-test",
      element: (
        <ValueTestScreen
          takerName={brideProfile.name}
          answers={valueAnswers.bride}
          onAnswer={(questionKey, optionId) => answerValue("bride", questionKey, optionId)}
          onBack={() => go("home")}
          onSubmit={() => go("value-result")}
        />
      )
    },
    {
      screen: "value-result",
      element: (
        <ValueResultScreen
          brideName={brideProfile.name}
          groomName={groomProfile.name}
          brideInitial={brideProfile.initial}
          groomInitial={groomProfile.initial}
          onBack={() => go("home")}
          onRetake={() => go("value-test")}
        />
      )
    },
    {
      screen: "dress-recommendation",
      element: <DressRecommendationScreen onBack={() => go("home")} />
    }
  ];
  const activeScreenElement = screenEntries.find((entry) => entry.screen === screen)?.element;

  return (
    <main className="page-shell">
      <section className="phone" aria-label="Easy Wedding mobile prototype">
        <div className="phone-screen">
          <div className="notch" />
          <StatusBar />

          <div className="content hide-scrollbar">{activeScreenElement}</div>

          {screen === "vendors" && vendorTab === "recommendations" && savedIds.length >= 2 && (
            <div className="sticky-cta" style={{ bottom: 76 }}>
              <button className="compare-floating" onClick={() => go("vendor-compare")}>
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

          {screen === "vendor-detail" && (
            <div className="sticky-cta detail-cta">
              <button className="save-square" onClick={() => toggleSave(activeVendor.id)} aria-label="후보 저장">
                <HeartIcon filled={savedIds.includes(activeVendor.id)} />
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

          {["home", "vendors", "reservations", "roadmap", "budget"].includes(screen) && <TabBar screen={screen} onGo={go} />}

          {aiOpen && (
            <AiSheet
              thread={aiThread}
              onAsk={askAi}
              onPresetAnswer={showPresetAnswer}
              onBudgetExample={showBudgetExampleAnswer}
              onReset={resetAiThread}
              onClose={() => setAiOpen(false)}
              draft={aiDraft}
              setDraft={setAiDraft}
              onSubmit={submitAiQuestion}
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
  activeVendor: Vendor,
  onboarding: Onboarding,
  go: (screen: Screen) => void
): HeroAction {
  if (progress === "requested") {
    const vendorName = createdReservations[0]?.vendorId ? findVendorName(createdReservations[0].vendorId) : activeVendor.name;
    return {
      title: `${vendorName} 답변을 기다리는 중이에요`,
      desc: "보통 1~2일 안에 가능 시간 연락이 와요. 방문 전 확인 질문을 미리 살펴보세요.",
      cta: "방문 전 확인 질문 보기",
      action: () => go("visit")
    };
  }

  return {
    title: "웨딩홀 후보 3곳을 먼저 골라볼까요?",
    desc: `${onboarding.region} · 하객 ${onboarding.guests.replace("~", "-")} 조건에 맞는 홀을 추천해 드려요.`,
    cta: "후보 보러 가기",
    action: () => go("vendors")
  };
}

function findVendorName(id: string) {
  return vendors.find((vendor) => vendor.id === id)?.name ?? vendors[0].name;
}
