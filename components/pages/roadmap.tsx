import guides from "../../data/guides.json";
import { getWeddingDday } from "../../lib/date";
import { CheckIcon } from "../icons";
import { countDoneTasks, isTaskDone } from "./journey";

export function RoadmapScreen({
  activePhaseId,
  savedCount,
  checklistChecks,
  onSelectPhase,
  onToggleChecklistTask,
  weddingDate
}: {
  activePhaseId: string;
  savedCount: number;
  checklistChecks: Record<string, boolean>;
  onSelectPhase: (id: string) => void;
  onToggleChecklistTask: (id: string) => void;
  weddingDate: string;
}) {
  const activePhase = guides.phases.find((phase) => phase.id === activePhaseId) ?? guides.phases[0];
  const activeDone = countDoneTasks(activePhase.checklist, checklistChecks, savedCount);
  const activeProgress = Math.round((activeDone / activePhase.total) * 100);
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
            const done = countDoneTasks(phase.checklist, checklistChecks, savedCount);
            const isActive = phase.id === activePhase.id;
            const allDone = done >= phase.total;
            return (
              <button key={phase.id} className={`roadmap-step ${isActive ? "active" : ""} ${allDone ? "complete" : ""}`} onClick={() => onSelectPhase(phase.id)}>
                <span>{allDone ? <CheckIcon /> : phase.num}</span>
                <b>{phase.shortName}</b>
                <small>{done}/{phase.total}</small>
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
          <strong>{activeDone}/{activePhase.total}</strong>
        </div>
        <div className="roadmap-task-card card">
          {activePhase.checklist.map((task) => {
            const done = isTaskDone(task, checklistChecks, savedCount);
            return (
              <button key={task.id} className={`roadmap-task ${done ? "done" : ""}`} onClick={() => onToggleChecklistTask(task.id)}>
                <span className={`check-box ${done ? "checked" : ""}`}>{done && <CheckIcon />}</span>
                <b>{task.title}</b>
                {task.thisWeek && !done && <em>이번 주</em>}
                <small className={`owner-${task.owner}`}>{task.owner}</small>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
