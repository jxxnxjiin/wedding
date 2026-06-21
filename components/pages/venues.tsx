import guides from "../../data/guides.json";
import venuesData from "../../data/venues.json";
import type { Venue } from "../../lib/types";
import { HeaderBar, Spec, Stat } from "../common";
import { HeartIcon, InfoIcon, SparkIcon } from "../icons";

export function FindScreen({
  savedIds,
  onToggleSave,
  onOpenDetail
}: {
  savedIds: string[];
  onToggleSave: (id: string) => void;
  onOpenDetail: (id: string) => void;
}) {
  return (
    <div className="find-screen">
      <div className="screen-pad">
        <h2 className="h2">웨딩홀 찾기</h2>
        <p className="caption">서울 동부권 · 하객 150명 · 토요일 저녁 기준 추천</p>
      </div>
      <div className="filter-row hide-scrollbar">
        {venuesData.filters.map((filter) => (
          <span key={filter.label} className={filter.active ? "filter-chip active" : "filter-chip"}>
            {filter.label}
          </span>
        ))}
      </div>

      <div className="venue-list">
        {venuesData.venues.map((venue) => {
          const saved = savedIds.includes(venue.id);
          return (
            <article key={venue.id} className="venue-card card">
              <div
                className="venue-photo"
                style={{ background: venue.photo }}
                onClick={() => onOpenDetail(venue.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") onOpenDetail(venue.id);
                }}
              >
                <span>{venue.type}</span>
                <button
                  className="heart-button"
                  onClick={(event) => {
                    event.stopPropagation();
                    onToggleSave(venue.id);
                  }}
                  aria-label={`${venue.name} 저장`}
                >
                  <HeartIcon filled={saved} />
                </button>
              </div>
              <button className="venue-body" onClick={() => onOpenDetail(venue.id)}>
                <div className="venue-title-row">
                  <b className="serif">{venue.name}</b>
                  <span>{venue.area}</span>
                </div>
                <div className="venue-meta">
                  <span>식대 {venue.meal}</span>
                  <i />
                  <span>보증 {venue.minGuests}</span>
                  <i />
                  <span>{venue.parking}</span>
                </div>
                <div className="match-box">
                  <SparkIcon />
                  <span>{venue.match}</span>
                </div>
              </button>
            </article>
          );
        })}
      </div>
    </div>
  );
}

export function CompareScreen({
  venues,
  onBack,
  onReserve
}: {
  venues: Venue[];
  onBack: () => void;
  onReserve: (id: string) => void;
}) {
  return (
    <div className="compare-screen">
      <HeaderBar title="후보 비교" onBack={onBack} />
      <p className="compare-copy">저장한 {venues.length}곳을 나란히 비교하고, 마음에 드는 곳에 투어를 요청하세요.</p>
      <div className="compare-row hide-scrollbar">
        {venues.map((venue) => (
          <article key={venue.id} className="compare-card card">
            <div className="compare-photo" style={{ background: venue.photo }} />
            <div className="compare-body">
              <b className="serif">{venue.name}</b>
              <small>{venue.area}</small>
              <Spec label="예상 식대" value={venue.meal} />
              <Spec label="보증 인원" value={venue.minGuests} />
              <Spec label="예식 간격" value={venue.interval} />
              <Spec label="주차" value={venue.parking} />
              <Spec label="확인 질문" value={venue.confirmQ} muted />
              <button className="small-primary" onClick={() => onReserve(venue.id)}>
                투어 요청
              </button>
            </div>
          </article>
        ))}
      </div>
      <div className="ai-summary">
        <InfoIcon />
        <span>
          <b>AI 차이 요약</b> · 아벤티움은 채광·접근성이 강점, 라온제나는 주차와 식대가 합리적,
          소피아 가든은 야외 연출이 가능해요.
        </span>
      </div>
    </div>
  );
}

export function DetailScreen({
  venue,
  onBack
}: {
  venue: Venue;
  saved: boolean;
  onBack: () => void;
  onToggleSave: () => void;
  onReserve: () => void;
}) {
  return (
    <div className="detail-screen">
      <div className="detail-hero" style={{ background: venue.photo }}>
        <button className="circle-back" onClick={onBack} aria-label="뒤로가기">
          ‹
        </button>
        <span>{venue.type}</span>
      </div>
      <div className="detail-body">
        <h2 className="serif">{venue.name}</h2>
        <p>{venue.area} · {venue.type}</p>
        <div className="stat-row">
          <Stat label="예상 식대" value={venue.meal} />
          <Stat label="보증 인원" value={venue.minGuests} />
          <Stat label="예식 간격" value={venue.interval} />
        </div>
        <div className="match-box detail-match">
          <SparkIcon />
          <span>{venue.match}</span>
        </div>
        <h3 className="serif">방문 전 확인하면 좋아요</h3>
        <p className="caption">AI가 이 홀에 맞춰 정리한 질문이에요. 요청 시 함께 전달돼요.</p>
        <div className="question-card card">
          {guides.detailQuestions.map((question, index) => (
            <div key={question} style={{ borderTopColor: index === 0 ? "transparent" : "var(--line)" }}>
              <span />
              <p>{question}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
