import { useState } from "react";
import guides from "../../data/guides.json";
import {
  formatChecklistDueDate,
  getChecklistCategoryLabel,
  getChecklistOwnerLabel,
  getChecklistTasksByPhase
} from "../../lib/checklist";
import { getWeddingDday } from "../../lib/date";
import type { ChecklistTask, ChecklistTaskUserUpdate } from "../../lib/schema";
import { CheckIcon } from "../icons";
import { countDoneTasks, isTaskDone } from "./journey";

export function RoadmapScreen({
  activePhaseId,
  savedCount,
  checklistChecks,
  checklistTaskEdits,
  onSelectPhase,
  onToggleChecklistTask,
  onUpdateChecklistTask,
  weddingDate
}: {
  activePhaseId: string;
  savedCount: number;
  checklistChecks: Record<string, boolean>;
  checklistTaskEdits: Record<string, ChecklistTaskUserUpdate>;
  onSelectPhase: (id: string) => void;
  onToggleChecklistTask: (id: string) => void;
  onUpdateChecklistTask: (id: string, update: ChecklistTaskUserUpdate) => void;
  weddingDate: string;
}) {
  const [editingTask, setEditingTask] = useState<ChecklistTask | null>(null);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftMemo, setDraftMemo] = useState("");
  const activePhase = guides.phases.find((phase) => phase.id === activePhaseId) ?? guides.phases[0];
  const activeTasks = getChecklistTasksByPhase(activePhase.id, checklistTaskEdits);
  const activeDone = countDoneTasks(activeTasks, checklistChecks, savedCount);
  const activeTotal = activeTasks.length;
  const activeProgress = activeTotal ? Math.round((activeDone / activeTotal) * 100) : 0;
  const dday = getWeddingDday(weddingDate);

  return (
    <div className="roadmap-screen">
      <div className="roadmap-title-block">
        <h2 className="h2">준비 로드맵</h2>
        <p className="caption">{dday === null ? "D-?" : dday >= 0 ? `D-${dday}` : `D+${Math.abs(dday)}`} · 예식일에 맞춘 단계별 준비</p>
      </div>

      <div className="roadmap-stepper">
        <div className="roadmap-step-line" />
        <div className="roadmap-step-list">
          {guides.phases.map((phase) => {
            const phaseTasks = getChecklistTasksByPhase(phase.id, checklistTaskEdits);
            const done = countDoneTasks(phaseTasks, checklistChecks, savedCount);
            const isActive = phase.id === activePhase.id;
            const allDone = phaseTasks.length > 0 && done >= phaseTasks.length;
            return (
              <button key={phase.id} className={`roadmap-step ${isActive ? "active" : ""} ${allDone ? "complete" : ""}`} onClick={() => onSelectPhase(phase.id)}>
                <span>{allDone ? <CheckIcon /> : phase.num}</span>
                <b>{phase.shortName}</b>
                <small>{done}/{phaseTasks.length}</small>
              </button>
            );
          })}
        </div>
      </div>

      <section className="roadmap-active-panel">
        <div className="roadmap-active-head">
          <span className="serif">{activePhase.name}</span>
          <span className={activePhase.state === "now" ? "now" : ""}>{activePhase.tag}</span>
        </div>
        <div className="roadmap-active-action">{activePhase.action}</div>
        <div className="roadmap-active-progress">
          <i><em style={{ width: `${activeProgress}%` }} /></i>
          <strong>{activeDone}/{activeTotal}</strong>
        </div>
        <div className="roadmap-task-card card">
          {activeTasks.map((task) => {
            const done = isTaskDone(task, checklistChecks, savedCount);
            const ownerLabel = getChecklistOwnerLabel(task.owner);
            const categoryLabel = getChecklistCategoryLabel(task.category);
            return (
              <article key={task.id} className={`roadmap-task ${done ? "done" : ""}`}>
                <button className="roadmap-task-toggle" onClick={() => onToggleChecklistTask(task.id)} aria-label={`${task.title} 완료 상태 변경`}>
                  <span className={`check-box ${done ? "checked" : ""}`}>{done && <CheckIcon />}</span>
                </button>
                <span className="roadmap-task-body">
                  <b>{task.title}</b>
                  <span className="roadmap-task-meta">
                    <small className={`owner-${ownerLabel}`}>{ownerLabel}</small>
                    <small>마감 {formatChecklistDueDate(task.dueDate)}</small>
                    <small>{categoryLabel}</small>
                  </span>
                  {task.memo && <small className="roadmap-task-memo">{task.memo}</small>}
                </span>
                <button
                  className="roadmap-task-edit"
                  onClick={() => {
                    setEditingTask(task);
                    setDraftTitle(task.title);
                    setDraftMemo(task.memo ?? "");
                  }}
                >
                  수정
                </button>
              </article>
            );
          })}
        </div>
      </section>

      {editingTask && (
        <div className="task-edit-sheet" role="dialog" aria-modal="true" aria-label="체크리스트 수정">
          <div className="task-edit-card card">
            <header>
              <span className="serif">체크리스트 수정</span>
              <button onClick={() => setEditingTask(null)} aria-label="닫기">×</button>
            </header>
            <label>
              제목
              <input value={draftTitle} onChange={(event) => setDraftTitle(event.target.value)} />
            </label>
            <label>
              메모
              <textarea value={draftMemo} onChange={(event) => setDraftMemo(event.target.value)} placeholder="예: 상담 때 꼭 물어볼 내용" />
            </label>
            <div className="task-edit-system">
              <span>연결 카테고리</span>
              <b>{getChecklistCategoryLabel(editingTask.category)}</b>
              <span>마감일</span>
              <b>{formatChecklistDueDate(editingTask.dueDate)}</b>
            </div>
            <button
              className="primary-button"
              onClick={() => {
                onUpdateChecklistTask(editingTask.id, {
                  title: draftTitle.trim() || editingTask.title,
                  memo: draftMemo.trim() || undefined
                });
                setEditingTask(null);
              }}
            >
              저장하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
