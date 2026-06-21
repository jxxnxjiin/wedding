import { useRef } from "react";
import appMeta from "../../data/app-meta.json";
import onboardingData from "../../data/onboarding.json";
import { formatWeddingDate } from "../../lib/date";
import type { Onboarding } from "../../lib/types";
import { CalendarIcon } from "../icons";

export function OnboardingScreen({
  onboarding,
  setOnboarding,
  onStart
}: {
  onboarding: Onboarding;
  setOnboarding: (next: Onboarding) => void;
  onStart: () => void;
}) {
  const weddingDate = onboarding.weddingDate ?? "";
  const dateInputRef = useRef<HTMLInputElement>(null);

  const openDatePicker = () => {
    const input = dateInputRef.current;
    if (!input) return;

    input.focus();
    if (typeof input.showPicker === "function") {
      input.showPicker();
      return;
    }
    input.click();
  };

  return (
    <div className="onboarding">
      <div className="brand">{appMeta.brandName}</div>
      <h1 className="h1">
        결혼 준비,
        <br />
        어디까지 오셨어요?
      </h1>
      <p className="onboarding-copy">
        딱 필요한 것만 여쭤볼게요. 답변에 맞춰
        <br />
        웨딩홀 추천과 준비 로드맵을 만들어 드려요.
      </p>

      {onboardingData.groups.map((group) => (
        <div key={group.key} className="onboard-group">
          <div className="group-label">{group.label}</div>
          <div className="chip-row">
            {group.options.map((option) => (
              <button
                key={option}
                className={`chip ${onboarding[group.key] === option ? "chip-active" : ""}`}
                onClick={() => setOnboarding({ ...onboarding, [group.key]: option })}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ))}

      <div className="date-picker">
        <button className="date-card card" type="button" onClick={openDatePicker}>
          <span className="date-icon">
            <CalendarIcon />
          </span>
          <div>
            <div className="tiny-label">예식 예정일</div>
            <div className="date-title serif">{formatWeddingDate(weddingDate)}</div>
          </div>
          <span className="change-label">변경</span>
        </button>
        <input
          ref={dateInputRef}
          className="date-input"
          type="date"
          value={weddingDate}
          onChange={(event) => setOnboarding({ ...onboarding, weddingDate: event.target.value })}
          aria-label="예식 예정일"
        />
      </div>

      <button className="primary-button" onClick={onStart}>
        내 결혼 준비 시작하기
      </button>
      <p className="under-note">3분이면 충분해요 · 언제든 수정 가능</p>
    </div>
  );
}
