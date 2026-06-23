import { useState } from "react";
import valueReportData from "../../data/value-report.json";
import type { ValueAnswers, ValueReport } from "../../lib/schema";
import { getAnsweredCount, isValueTestComplete, valueTestQuestions } from "../../lib/value-test";
import { HeaderBar } from "../common";
import { CheckIcon } from "../icons";

const valueReport = valueReportData as ValueReport;

const AUTO_ADVANCE_MS = 220;

export function ValueTestScreen({
  takerName,
  answers,
  onAnswer,
  onBack,
  onSubmit
}: {
  takerName: string;
  answers: ValueAnswers;
  onAnswer: (questionKey: string, optionId: string) => void;
  onBack: () => void;
  onSubmit: () => void;
}) {
  const total = valueTestQuestions.length;
  const [step, setStep] = useState(0);
  const question = valueTestQuestions[step];
  const isLast = step === total - 1;
  const currentAnswer = answers[question.key];
  const answeredCount = getAnsweredCount(answers);
  const complete = isValueTestComplete(answers);

  const selectOption = (optionId: string) => {
    onAnswer(question.key, optionId);
    if (!isLast) {
      window.setTimeout(() => setStep((current) => Math.min(current + 1, total - 1)), AUTO_ADVANCE_MS);
    }
  };

  return (
    <div className="value-test">
      <HeaderBar title="가치관 체크" onBack={onBack} />

      <div className="value-progress">
        <div className="value-progress-head">
          <span className="value-taker">{takerName}님의 차례</span>
          <span className="value-step-count number-serif">
            {step + 1} / {total}
          </span>
        </div>
        <div className="value-progress-track">
          <span style={{ width: `${((step + 1) / total) * 100}%` }} />
        </div>
      </div>

      <div className="value-question-area">
        <div className="value-category">{question.category}</div>
        <h2 className="value-question serif">{question.label}</h2>

        <div className="value-option-list">
          {question.options.map((option) => {
            const selected = currentAnswer === option.id;
            return (
              <button
                key={option.id}
                type="button"
                className={`value-option ${selected ? "selected" : ""}`}
                onClick={() => selectOption(option.id)}
              >
                <span className="value-option-label">{option.label}</span>
                <span className={`value-option-mark ${selected ? "checked" : ""}`}>{selected && <CheckIcon />}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="value-footer">
        <button
          type="button"
          className="value-nav-button"
          disabled={step === 0}
          onClick={() => setStep((current) => Math.max(current - 1, 0))}
        >
          이전
        </button>
        {isLast ? (
          <button
            type="button"
            className="primary-button value-submit"
            disabled={!complete}
            onClick={onSubmit}
            style={complete ? undefined : { background: "#D9C7BD", cursor: "default" }}
          >
            {complete ? "결과 보기" : `아직 ${total - answeredCount}개 남았어요`}
          </button>
        ) : (
          <button
            type="button"
            className="value-nav-button next"
            disabled={!currentAnswer}
            onClick={() => setStep((current) => Math.min(current + 1, total - 1))}
          >
            다음
          </button>
        )}
      </div>
    </div>
  );
}

export function ValueResultScreen({
  brideName,
  groomName,
  brideInitial,
  groomInitial,
  onBack,
  onRetake
}: {
  brideName: string;
  groomName: string;
  brideInitial: string;
  groomInitial: string;
  onBack: () => void;
  onRetake: () => void;
}) {
  const report = valueReport;

  return (
    <div className="value-result">
      <HeaderBar title="가치관 리포트" onBack={onBack} />

      <section className="value-result-summary card">
        <div className="value-result-avatars">
          <span className="avatar">{brideInitial}</span>
          <span className="value-result-heart">♥</span>
          <span className="avatar">{groomInitial}</span>
        </div>
        <h2 className="serif">{report.headline.title}</h2>
        <p>{report.headline.copy}</p>
        <div className="value-count-row">
          <div className="value-count">
            <b className="number-serif">{report.counts.aligned}</b>
            <span>같아요</span>
          </div>
          <div className="value-count">
            <b className="number-serif">{report.counts.similar}</b>
            <span>비슷해요</span>
          </div>
          <div className="value-count discuss">
            <b className="number-serif">{report.counts.discuss}</b>
            <span>얘기 나눠요</span>
          </div>
        </div>
      </section>

      <section className="value-section">
        <div className="value-section-title">
          <b>완전히 같은 생각</b>
          <small>두 분의 답이 똑같았어요</small>
        </div>
        <div className="value-aligned-card card">
          {report.aligned.map((item) => (
            <div key={item.category} className="value-aligned-row">
              <div className="value-aligned-head">
                <span className="value-category">{item.category}</span>
                <span className="value-aligned-answer">{item.shared}</span>
              </div>
              <p>{item.note}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="value-section">
        <div className="value-section-title">
          <b>비슷한 결이에요</b>
          <small>선택은 달라도 마음은 통해요</small>
        </div>
        {report.similar.map((item) => (
          <article key={item.category} className="value-pair-card card similar">
            <span className="value-category">{item.category}</span>
            <p className="value-pair-question">{item.question}</p>
            <div className="value-highlight-box common">
              <span className="value-highlight-label">공통점</span>
              <p>{item.highlight}</p>
            </div>
            <div className="value-pair-answers">
              <div className="value-answer">
                <span className="value-answer-role bride">{brideName}</span>
                <b>{item.bride}</b>
              </div>
              <div className="value-answer">
                <span className="value-answer-role groom">{groomName}</span>
                <b>{item.groom}</b>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="value-section">
        <div className="value-section-title">
          <b>함께 이야기하면 좋아요</b>
          <small>미리 맞춰두면 갈등을 줄여요</small>
        </div>
        {report.discuss.map((item) => (
          <article key={item.category} className="value-pair-card card discuss">
            <span className="value-category">{item.category}</span>
            <p className="value-pair-question">{item.question}</p>
            <div className="value-pair-answers">
              <div className="value-answer">
                <span className="value-answer-role bride">{brideName}</span>
                <b>{item.bride}</b>
              </div>
              <div className="value-answer">
                <span className="value-answer-role groom">{groomName}</span>
                <b>{item.groom}</b>
              </div>
            </div>
            <div className="value-highlight-box tip">
              <span className="value-highlight-label">이렇게 조율해요</span>
              <p>{item.highlight}</p>
            </div>
          </article>
        ))}
      </section>

      <div className="value-result-cta">
        <button type="button" className="secondary-button value-retake" onClick={onRetake}>
          신부 답변 다시 하기
        </button>
      </div>
    </div>
  );
}
