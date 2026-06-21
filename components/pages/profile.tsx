import appMeta from "../../data/app-meta.json";
import { formatCompactWeddingDate } from "../../lib/date";
import type { Onboarding } from "../../lib/types";
import { HeaderBar } from "../common";

export function MyScreen({ onboarding, onBack }: { onboarding: Onboarding; onBack: () => void }) {
  const rows = [
    ["예식 예정일", formatCompactWeddingDate(onboarding.weddingDate)],
    ["희망 지역", onboarding.region],
    ["예상 하객", onboarding.guests],
    ["예산 범위", `${onboarding.budget}만 원`],
    ["선호 시간", onboarding.time]
  ];

  return (
    <div className="my-screen">
      <HeaderBar title="커플 프로필" onBack={onBack} />
      <div className="screen-pad">
        <h2 className="h2">커플 프로필</h2>
        <p className="caption">선택된 조건은 두 사람이 합의한 값으로 관리돼요</p>
      </div>
      <div className="couple-profile-grid">
        {appMeta.coupleProfiles.map((profile) => (
          <article key={profile.role} className="couple-profile-card card">
            <div className="avatar large">{profile.initial}</div>
            <span>{profile.role}</span>
            <b>{profile.name}</b>
            <p>{profile.summary}</p>
          </article>
        ))}
      </div>
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
