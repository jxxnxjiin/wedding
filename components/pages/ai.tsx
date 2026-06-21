import guides from "../../data/guides.json";
import type { AiMessage } from "../../lib/types";
import { SparkIcon } from "../icons";

type AiActionProps = {
  thread: AiMessage[];
  onAsk: (message: AiMessage) => void;
};

export function AiConsultScreen({
  thread,
  onAsk,
  onReset
}: {
  thread: AiMessage[];
  onAsk: (message: AiMessage) => void;
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
        <AiPresetButtons onAsk={onAsk} />
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
  onReset,
  onClose
}: {
  thread: AiMessage[];
  onAsk: (message: AiMessage) => void;
  onReset: () => void;
  onClose: () => void;
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
          <AiPresetButtons onAsk={onAsk} />
        </footer>
      </section>
    </>
  );
}

function AiPresetButtons({ onAsk }: Pick<AiActionProps, "onAsk">) {
  return (
    <>
      {guides.aiPresets.map((preset) => (
        <button key={preset.question} onClick={() => onAsk({ question: preset.question, answer: preset.answer })}>
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
      {greeting && <div className="assistant-msg">{greeting}</div>}
      {thread.map((message, index) => (
        <div key={`${message.question}-${index}`}>
          <div className="user-msg">{message.question}</div>
          <div className="assistant-msg">{message.answer}</div>
        </div>
      ))}
    </div>
  );
}
