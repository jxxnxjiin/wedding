import guides from "../../data/guides.json";
import { Fragment, type ReactNode } from "react";
import type { AiMessage } from "../../lib/types";
import { SparkIcon } from "../icons";

type AiActionProps = {
  thread: AiMessage[];
  onAsk: (question: string) => void;
  onPresetAnswer: (question: string, answer: string) => void;
  onBudgetExample: () => void;
};

export function AiConsultScreen({
  thread,
  onAsk,
  onPresetAnswer,
  onBudgetExample,
  onReset
}: {
  thread: AiMessage[];
  onAsk: (question: string) => void;
  onPresetAnswer: (question: string, answer: string) => void;
  onBudgetExample: () => void;
  onReset: () => void;
}) {
  return (
    <div className="ai-tab-screen">
      <div className="screen-pad ai-tab-head">
        <h2 className="h2">AI에게 질문하기</h2>
        <button className="refresh-button" onClick={onReset} aria-label="AI 상담 새로고침">
          ↻
        </button>
        <p className="caption">예약, 방문 준비, 견적 비교를 내 상황에 맞게 물어보세요</p>
      </div>
      <div className="ai-tab-presets">
        <AiPresetButtons onPresetAnswer={onPresetAnswer} onBudgetExample={onBudgetExample} />
      </div>
      <AiMessageList className="ai-tab-thread" thread={thread} />
    </div>
  );
}

export function AiComposer({
  draft,
  setDraft,
  onSubmit
}: {
  draft: string;
  setDraft: (draft: string) => void;
  onSubmit: () => void;
}) {
  return (
    <form
      className="ai-input-form"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <input
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        placeholder="투어 예약 전 뭐부터 확인할까?"
      />
      <button type="submit">전송</button>
    </form>
  );
}

export function AiSheet({
  thread,
  onAsk,
  onPresetAnswer,
  onBudgetExample,
  onReset,
  onClose,
  draft,
  setDraft,
  onSubmit
}: {
  thread: AiMessage[];
  onAsk: (question: string) => void;
  onPresetAnswer: (question: string, answer: string) => void;
  onBudgetExample: () => void;
  onReset: () => void;
  onClose: () => void;
  draft: string;
  setDraft: (draft: string) => void;
  onSubmit: () => void;
}) {
  return (
    <>
      <button className="sheet-backdrop" onClick={onClose} aria-label="AI 닫기" />
      <section className="ai-sheet">
        <div className="grabber" />
        <header>
          <span className="ai-icon"><SparkIcon /></span>
          <div>
            <b>웨딩 AI</b>
            <small>예약과 방문 준비를 도와드려요</small>
          </div>
          <button className="refresh-button" onClick={onReset} aria-label="AI 상담 새로고침">↻</button>
          <button className="sheet-close-button" onClick={onClose}>✕</button>
        </header>
        <AiMessageList
          className="ai-thread hide-scrollbar"
          greeting="안녕하세요! 웨딩홀 비교나 투어 준비, 견적에서 궁금한 점을 물어보세요. 아래 질문을 눌러도 좋아요."
          thread={thread}
        />
        <footer className="ai-presets hide-scrollbar">
          <AiPresetButtons onPresetAnswer={onPresetAnswer} onBudgetExample={onBudgetExample} />
        </footer>
        <AiComposer draft={draft} setDraft={setDraft} onSubmit={onSubmit} />
      </section>
    </>
  );
}

function AiPresetButtons({ onPresetAnswer, onBudgetExample }: Pick<AiActionProps, "onPresetAnswer" | "onBudgetExample">) {
  return (
    <>
      <button className="ai-budget-preset" type="button" onClick={onBudgetExample}>
        스튜디오에 좀 더 쓰고 싶은데 아낄 곳이 있을까?
      </button>
      {guides.aiPresets.map((preset) => (
        <button key={preset.question} type="button" onClick={() => onPresetAnswer(preset.question, preset.answer)}>
          {preset.question}
        </button>
      ))}
    </>
  );
}

function AiMessageList({
  className,
  greeting,
  thread
}: {
  className: string;
  greeting?: string;
  thread: AiMessage[];
}) {
  return (
    <div className={className}>
      {greeting && (
        <div className="message-row assistant-row">
          <div className="assistant-msg">{greeting}</div>
        </div>
      )}
      {thread.map((message, index) => (
        <div className="message-pair" key={message.id ?? `${message.question}-${index}`}>
          <div className="message-row user-row">
            <div className="user-msg">{message.question}</div>
          </div>
          <div className="message-row assistant-row">
            {message.answerType === "budget-report" ? (
              <BudgetReportAnswer />
            ) : (
              <div className="assistant-msg" aria-busy={message.pending}>
                {message.pending ? message.answer : <MarkdownMessage text={message.answer} />}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function MarkdownMessage({ text }: { text: string }) {
  const blocks = text.trim().split(/\n{2,}/).filter(Boolean);

  return (
    <div className="assistant-markdown">
      {blocks.map((block, index) => (
        <MarkdownBlock key={`${block}-${index}`} block={block} />
      ))}
    </div>
  );
}

function MarkdownBlock({ block }: { block: string }) {
  const lines = block.split("\n").filter((line) => line.trim());
  const heading = block.match(/^#{1,3}\s+(.+)$/);
  const allListItems = lines.length > 0 && lines.every((line) => listItemMatch(line));

  if (heading) {
    return <h4>{renderInline(heading[1])}</h4>;
  }

  if (allListItems) {
    const ordered = lines.every((line) => /^\s*\d+[.)]\s+/.test(line));
    const items = lines.map((line) => line.replace(/^\s*(?:[-*·]|\d+[.)])\s+/, ""));
    const ListTag = ordered ? "ol" : "ul";

    return (
      <ListTag>
        {items.map((item) => (
          <li key={item}>{renderInline(item)}</li>
        ))}
      </ListTag>
    );
  }

  return (
    <p>
      {lines.map((line, index) => (
        <Fragment key={`${line}-${index}`}>
          {index > 0 && <br />}
          {renderInline(line)}
        </Fragment>
      ))}
    </p>
  );
}

function listItemMatch(line: string) {
  return /^\s*(?:[-*·]|\d+[.)])\s+/.test(line);
}

function renderInline(text: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);

  return parts.map((part, index) => {
    const bold = part.match(/^\*\*([^*]+)\*\*$/);
    if (bold) return <strong key={`${part}-${index}`}>{bold[1]}</strong>;
    return <Fragment key={`${part}-${index}`}>{part}</Fragment>;
  });
}

function BudgetReportAnswer() {
  const refs = [
    { label: "스드메 (사용/배정)", value: "350 / 700만", className: "used" },
    { label: "남은 여유", value: "+350만 원", className: "remain" }
  ];
  const prefs = [
    { who: "신랑", text: "예단·예물은 간소하게 하고 싶어요", className: "groom" },
    { who: "신부", text: "예단·예물 부담을 줄이는 데 동의해요", className: "bride" }
  ];
  const perks = ["추가 촬영 컨셉", "프리미엄 드레스", "메이크업 리허설", "원본·수정본 추가"];

  return (
    <article className="ai-budget-report">
      <header>
        <span className="ai-budget-spark">
          <SparkIcon />
        </span>
        <b>내 예산·우선순위 데이터를 참고했어요</b>
      </header>
      <div className="ai-budget-report-body">
        <p className="ai-budget-intro">
          지금 예산을 보면 스튜디오·드레스·메이크업(스드메)에 700만 원이 잡혀 있고, 그중 350만 원만 쓰고 있어 아직
          350만 원의 여유가 있어요. 더 늘리고 싶다면 가장 먼저 볼 항목은 예물·예단이에요.
        </p>

        <div className="ai-budget-ref-row">
          {refs.map((item) => (
            <div key={item.label} className={`ai-budget-ref ${item.className}`}>
              <span>{item.label}</span>
              <b>{item.value}</b>
            </div>
          ))}
        </div>

        <div className="ai-budget-section-label">두 분의 우선순위</div>
        <div className="ai-budget-pref-list">
          {prefs.map((item) => (
            <div key={item.who} className="ai-budget-pref">
              <span className={item.className}>{item.who}</span>
              <p>{item.text}</p>
            </div>
          ))}
        </div>

        <section className="ai-budget-scenario">
          <div className="ai-budget-scenario-head">
            <span>추천 시나리오</span>
            <b>예물·예단 줄여 스드메 강화</b>
          </div>
          <div className="ai-budget-scenario-body">
            <BudgetBar label="예물·예단" before="600만" after="300만" percent={30} />
            <BudgetBar label="스드메" before="700만" after="1,000만" percent={100} strong />

            <div className="ai-budget-move">
              <span>↑</span>
              <p>
                예물·예단에서 <b>300만 원</b>만 옮겨도 스튜디오 선택지가 크게 넓어져요.
              </p>
            </div>

            <div className="ai-budget-perks">
              {perks.map((perk) => (
                <span key={perk}>✓ {perk}</span>
              ))}
            </div>
          </div>
        </section>

        <div className="ai-budget-coach">
          <SparkIcon />
          <p>두 분 모두 예단·예물은 "간소하게" 쪽으로 공감대가 있어요. 이 예산에서 200~300만 원만 옮기면 만족도 대비 효율이 가장 좋습니다.</p>
        </div>
      </div>
    </article>
  );
}

function BudgetBar({
  label,
  before,
  after,
  percent,
  strong = false
}: {
  label: string;
  before: string;
  after: string;
  percent: number;
  strong?: boolean;
}) {
  return (
    <div className="ai-budget-bar-block">
      <div className="ai-budget-bar-head">
        <span>{label}</span>
        <small>
          {before} → <b>{after}</b>
        </small>
      </div>
      <div className="ai-budget-bar-track">
        <span className={strong ? "strong" : ""} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
