import appMeta from "../../data/app-meta.json";
import addOnServices from "../../data/add-on-services.json";
import guides from "../../data/guides.json";
import { formatShortWeddingDate, getWeddingDday } from "../../lib/date";
import type { HeroAction, ReservationCard } from "../../lib/types";
import { CheckIcon, SparkIcon } from "../icons";
import { isTaskDone, JourneyOverview } from "./journey";

export function HomeScreen({
  hero,
  reservations,
  savedCount,
  onOpenAi,
  onProfile,
  onRoadmap,
  checklistChecks,
  onToggleChecklistTask,
  weddingDate
}: {
  hero: HeroAction;
  reservations: ReservationCard[];
  savedCount: number;
  onOpenAi: () => void;
  onProfile: () => void;
  onRoadmap: () => void;
  checklistChecks: Record<string, boolean>;
  onToggleChecklistTask: (id: string) => void;
  weddingDate: string;
}) {
  const activePhase = guides.phases.find((phase) => phase.state === "now") ?? guides.phases[0];
  const dday = getWeddingDday(weddingDate);
  const roadmapWeekItems = activePhase.checklist.filter((item) => item.thisWeek).map((item) => ({
    ...item,
    source: "roadmap" as const,
    done: isTaskDone(item, checklistChecks, savedCount)
  }));
  const reservationWeekItems = reservations
    .filter((reservation) => reservation.kind === "confirmed" && isWithinAWeek(reservation.slot))
    .map((reservation) => ({
      id: `reservation-${reservation.id}`,
      title: `${reservation.venue.name} 방문 전 질문지 확인하기`,
      owner: "함께",
      source: "reservation" as const,
      done: checklistChecks[`reservation-${reservation.id}`] ?? false,
      meta: reservation.slot
    }));
  const weekItems = [...reservationWeekItems, ...roadmapWeekItems];

  return (
    <div className="home-screen">
      <div className="home-header">
        <div>
          <div className="tiny-label">예식까지</div>
          <div className="dday-row">
            <span className="number-serif dday">{dday === null ? "D-?" : dday >= 0 ? `D-${dday}` : `D+${Math.abs(dday)}`}</span>
            <span className="caption">{formatShortWeddingDate(weddingDate)}</span>
          </div>
        </div>
        <button className="profile-pair" onClick={onProfile} aria-label="커플 프로필 보기">
          {appMeta.coupleProfiles.map((profile) => (
            <span key={profile.role}>{profile.initial}</span>
          ))}
        </button>
      </div>

      <div className="phase-pill">
        <span />
        <b>1단계 · 웨딩홀과 날짜 확정</b>
      </div>

      <section className="hero-card">
        <div className="hero-orb" />
        <div className="hero-inner">
          <div className="hero-kicker">오늘의 할 일</div>
          <h2>{hero.title}</h2>
          <p>{hero.desc}</p>
          <button onClick={hero.action}>{hero.cta} →</button>
        </div>
      </section>
      
      <button className="ai-quick card" onClick={onOpenAi}>
        <span className="ai-icon">
          <SparkIcon />
        </span>
        <span>
          <b>AI에게 준비 질문하기</b>
          <small>"투어 전에 뭘 물어봐야 할까?"</small>
        </span>
        <span className="chevron">›</span>
      </button>

      <div className="section-title only-title">
        <span className="serif">이번 주 체크리스트</span>
      </div>
      <div className="check-card card">
        {weekItems.map((item, index) => (
          <button
            key={item.title}
            className="check-row task-button"
            style={{ borderTopColor: index === 0 ? "transparent" : "var(--line)" }}
            onClick={() => onToggleChecklistTask(item.id)}
          >
            <span className={`check-box ${item.done ? "checked" : ""}`}>{item.done && <CheckIcon />}</span>
            <span className={item.done ? "done-text" : ""}>
              {item.title}
              <small className="task-owner">{item.owner}</small>
              {item.source === "reservation" && <small className="task-meta">예약 확정 · {item.meta}</small>}
            </span>
          </button>
        ))}
      </div>

      <div className="section-title only-title service-title">
        <span className="serif">이런 서비스는 어때요?</span>
      </div>
      <div className="add-on-service-list">
        {addOnServices.services.map((service) => (
          <button key={service.title} className="add-on-service-card card" type="button">
            <span className="add-on-service-icon">{service.icon}</span>
            <span>
              <b>{service.title}</b>
              <small>{service.description}</small>
            </span>
            <em>준비중</em>
          </button>
        ))}
      </div>
    </div>
  );
}

function isWithinAWeek(slot: string) {
  const match = slot.match(/(\d{1,2})\/(\d{1,2})/);
  if (!match) return false;

  const today = new Date();
  const reservationDate = new Date(today.getFullYear(), Number(match[1]) - 1, Number(match[2]));
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const reservationStart = reservationDate.getTime();
  const diffDays = Math.ceil((reservationStart - todayStart) / 86_400_000);

  return diffDays >= 0 && diffDays <= 7;
}
