import { formatCompactWeddingDate } from "../../lib/date";
import type { CoupleValueProfiles } from "../../lib/schema";
import type { CoupleProfile, Onboarding } from "../../lib/types";
import { getAnsweredCount, getOptionLabel } from "../../lib/value-test";
import { HeaderBar } from "../common";

export function MyScreen({
  onboarding,
  coupleProfiles,
  valueAnswers,
  onValueTest,
  onBack
}: {
  onboarding: Onboarding;
  coupleProfiles: CoupleProfile[];
  valueAnswers: CoupleValueProfiles;
  onValueTest: () => void;
  onBack: () => void;
}) {
  const rows = [
    ["예식 예정일", formatCompactWeddingDate(onboarding.weddingDate)],
    ["희망 지역", onboarding.region],
    ["예상 하객", onboarding.guests],
    ["예산 범위", `${onboarding.budget}만 원`],
    ["선호 시간", onboarding.time]
  ];

  const valueByRole = (role: string) => (role === "신랑" ? valueAnswers.groom : valueAnswers.bride);
  const brideAnswered = getAnsweredCount(valueAnswers.bride) > 0;

  return (
    <div className="my-screen">
      <HeaderBar title="커플 프로필" onBack={onBack} />
      <div className="screen-pad">
        <h2 className="h2">커플 프로필</h2>
        <p className="caption">선택된 조건은 두 사람이 합의한 값으로 관리돼요</p>
      </div>
      <div className="couple-profile-grid">
        {coupleProfiles.map((profile) => {
          const answers = valueByRole(profile.role);
          const coreValue = getOptionLabel("core_value", answers["core_value"]);
          return (
            <article key={profile.role} className="couple-profile-card card">
              <div className="avatar large">{profile.initial}</div>
              <span>{profile.role}</span>
              <b>{profile.name}</b>
              <p>{profile.summary}</p>
              <div className="couple-value-tag">
                {coreValue ? `핵심 가치 · ${coreValue}` : "가치관 미응답"}
              </div>
            </article>
          );
        })}
      </div>

      <button type="button" className="value-test-entry card" onClick={onValueTest}>
        <span className="value-test-entry-icon">💞</span>
        <span className="value-test-entry-body">
          <b>가치관 맞춰보기</b>
          <small>{brideAnswered ? "신부 답변 수정하고 비교 결과 보기" : "신부 답변을 입력하고 비교 결과 보기"}</small>
        </span>
        <span className="chevron">›</span>
      </button>

      <div className="my-card card">
        {rows.map(([label, value], index) => (
          <div key={label} style={{ borderTopColor: index === 0 ? "transparent" : "var(--line)" }}>
            <span>{label}</span>
            <b>{value}</b>
          </div>
        ))}
      </div>
    </div>
  );
}
