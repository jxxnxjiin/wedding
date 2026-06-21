import { type CSSProperties } from "react";
import guides from "../../data/guides.json";
import { CheckIcon } from "../icons";

export function JourneyOverview({
  compact = false,
  onPhaseClick,
  checklistChecks = {},
  savedCount = 0
}: {
  compact?: boolean;
  onPhaseClick?: () => void;
  checklistChecks?: Record<string, boolean>;
  savedCount?: number;
}) {
  if (compact) {
    const activePhase = guides.phases.find((phase) => phase.state === "now") ?? guides.phases[0];
    const activeDone = countDoneTasks(activePhase.checklist, checklistChecks, savedCount);
    const activeProgress = Math.round((activeDone / activePhase.total) * 100);

    return (
      <button className="journey-line-card card" onClick={onPhaseClick}>
        <div className="journey-line-title">
          <span>{activePhase.name}</span>
          <b>{activeDone}/{activePhase.total}</b>
        </div>
        <div className="journey-line-track" style={{ "--line-progress": `${activeProgress}%` } as CSSProperties}>
          {guides.phases.map((phase) => {
            const now = phase.state === "now";
            const done = countDoneTasks(phase.checklist, checklistChecks, savedCount) >= phase.total;
            return (
              <span key={phase.id} className={`${now ? "now" : ""} ${done ? "done" : ""}`}>
                {done || now ? <CheckIcon /> : null}
              </span>
            );
          })}
        </div>
        <div className="journey-line-labels">
          {guides.phases.map((phase) => (
            <span key={phase.id} className={phase.state === "now" ? "active" : ""}>{phase.shortName}</span>
          ))}
        </div>
      </button>
    );
  }

  return (
    <div className="journey-overview hide-scrollbar">
      {guides.phases.map((phase) => {
        const now = phase.state === "now";
        const done = countDoneTasks(phase.checklist, checklistChecks, savedCount);
        const progress = Math.round((done / phase.total) * 100);
        return (
          <button key={phase.id} className={`journey-phase ${now ? "now" : ""}`} onClick={onPhaseClick}>
            <span>{phase.num}</span>
            <b>{phase.shortName}</b>
            <small>{progress}%</small>
            <i><em style={{ width: `${progress}%` }} /></i>
          </button>
        );
      })}
    </div>
  );
}

export function isTaskDone(
  task: { id: string; done: boolean },
  checklistChecks: Record<string, boolean>,
  savedCount: number
) {
  if (task.id === "hall-save" && savedCount >= 3) return true;
  return checklistChecks[task.id] ?? task.done;
}

export function countDoneTasks(
  tasks: Array<{ id: string; done: boolean }>,
  checklistChecks: Record<string, boolean>,
  savedCount: number
) {
  return tasks.filter((task) => isTaskDone(task, checklistChecks, savedCount)).length;
}
