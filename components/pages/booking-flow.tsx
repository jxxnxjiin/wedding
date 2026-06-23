import guides from "../../data/guides.json";
import reservationsData from "../../data/reservations.json";
import type { Vendor } from "../../lib/schema";
import { getVendorCategoryLabel, getVendorPhoto, getWeddingHallProfile } from "../../lib/vendor";
import { ChoiceSection, HeaderBar } from "../common";
import { CalendarIcon, CheckIcon, PhoneIcon, SparkIcon } from "../icons";

export function ReserveScreen({
  vendor,
  reserveDates,
  reserveTimes,
  setReserveDates,
  setReserveTimes,
  onBack
}: {
  vendor: Vendor;
  reserveDates: string[];
  reserveTimes: string[];
  setReserveDates: (dates: string[]) => void;
  setReserveTimes: (times: string[]) => void;
  onBack: () => void;
}) {
  const profile = getWeddingHallProfile(vendor);

  const toggleDate = (date: string) => {
    if (reserveDates.includes(date)) {
      setReserveDates(reserveDates.filter((item) => item !== date));
      return;
    }
    if (reserveDates.length < 3) setReserveDates([...reserveDates, date]);
  };

  const toggleTime = (time: string) => {
    setReserveTimes(reserveTimes.includes(time) ? reserveTimes.filter((item) => item !== time) : [...reserveTimes, time]);
  };

  return (
    <div className="reserve-screen">
      <HeaderBar title="투어 희망 일정 보내기" onBack={onBack} close />
      <div className="reserve-body">
        <div className="reserve-venue card">
          <div style={{ background: getVendorPhoto(vendor) }} />
          <span>
            <b>{vendor.name}</b>
            <small>{vendor.area} · {profile?.hallType ?? getVendorCategoryLabel(vendor.category)}</small>
          </span>
        </div>

        <ChoiceSection title="희망 날짜" note="(최대 3개, 순서대로 우선순위)" helper="선택한 순서가 1~3순위가 돼요.">
          {reservationsData.dateOptions.map((date) => {
            const selectedIndex = reserveDates.indexOf(date);
            return (
              <button key={date} className={`choice-chip ${selectedIndex >= 0 ? "active" : ""}`} onClick={() => toggleDate(date)}>
                {date}
                {selectedIndex >= 0 && <span>{selectedIndex + 1}</span>}
              </button>
            );
          })}
        </ChoiceSection>

        <ChoiceSection title="희망 시간대">
          {reservationsData.timeOptions.map((time) => (
            <button key={time} className={`choice-chip ${reserveTimes.includes(time) ? "active" : ""}`} onClick={() => toggleTime(time)}>
              {time}
            </button>
          ))}
        </ChoiceSection>

        <h3 className="reserve-title">함께 전달할 질문</h3>
        <div className="auto-question">
          <b>
            <SparkIcon /> AI가 자동 생성한 질문지
          </b>
          {guides.detailQuestions.map((question) => (
            <p key={question}>· {question}</p>
          ))}
        </div>

        <h3 className="reserve-title">전화 가능 시간</h3>
        <div className="call-time card">
          <PhoneIcon />
          <span>평일 저녁 7시 이후 · 주말 오후</span>
        </div>
      </div>
    </div>
  );
}

export function DoneScreen({
  vendor,
  dates,
  times,
  onReservations,
  onHome
}: {
  vendor: Vendor;
  dates: string[];
  times: string[];
  onReservations: () => void;
  onHome: () => void;
}) {
  return (
    <div className="done-screen">
      <div className="done-center">
        <div className="done-icon">
          <CheckIcon />
        </div>
        <h2 className="serif">예약 요청을 보냈어요</h2>
        <p>
          {vendor.name}에 투어 희망 일정을 전달했어요.
          <br />
          업체 확인 후 보통 1~2일 안에 연락이 와요.
        </p>
        <div className="done-card card">
          <b>희망 일정</b>
          {(dates.length ? dates : ["6/24 (수)"]).slice(0, 3).map((date, index) => (
            <div key={date}>
              <span>{index + 1}</span>
              <p>{date} · {times[0] ?? "오후 2시"}</p>
            </div>
          ))}
          <footer>
            <CalendarIcon />
            <span>내 일정과 방문 준비 카드가 자동 생성됐어요</span>
          </footer>
        </div>
      </div>
      <button className="primary-button" onClick={onReservations}>예약 내역 보기</button>
      <button className="text-button" onClick={onHome}>홈으로 돌아가기</button>
    </div>
  );
}

export function VisitScreen({
  doneCount,
  checks,
  setChecks,
  onBack
}: {
  doneCount: number;
  checks: Record<number, boolean>;
  setChecks: (checks: Record<number, boolean>) => void;
  onBack: () => void;
}) {
  return (
    <div className="visit-screen">
      <HeaderBar title="방문 질문지" onBack={onBack} />
      <div className="visit-body">
        <section className="visit-hero">
          <small>아벤티움 · 방문 D-3</small>
          <h2 className="serif">6월 24일 (수) 오후 2시 투어</h2>
          <p>방문 전에 아래 항목을 확인하면 비교가 훨씬 쉬워져요.</p>
        </section>
        <h3>
          확인할 질문 <span>{doneCount}/{guides.visitQuestions.length}</span>
        </h3>
        <div className="visit-list">
          {guides.visitQuestions.map((question, index) => {
            const done = checks[index];
            return (
              <button
                key={question.title}
                className={`visit-item card ${done ? "done" : ""}`}
                onClick={() => setChecks({ ...checks, [index]: !done })}
              >
                <span className={`check-box ${done ? "checked" : ""}`}>{done && <CheckIcon />}</span>
                <span>
                  <b>{question.title}</b>
                  <small>{question.subtitle}</small>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
