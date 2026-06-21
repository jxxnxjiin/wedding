import { type CSSProperties } from "react";
import guides from "../../data/guides.json";
import {
  countDoneChecklistTasks,
  getChecklistTasksByPhase,
  isChecklistTaskDone
} from "../../lib/checklist";
import type { ChecklistTask } from "../../lib/schema";
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
    const activeTasks = getChecklistTasksByPhase(activePhase.id);
    const activeDone = countDoneTasks(activeTasks, checklistChecks, savedCount);
    const activeTotal = activeTasks.length;
    const activeProgress = activeTotal ? Math.round((activeDone / activeTotal) * 100) : 0;

    return (
      <button className="journey-line-card card" onClick={onPhaseClick}>
        <div className="journey-line-title">
          <span>{activePhase.name}</span>
          <b>{activeDone}/{activeTotal}</b>
        </div>
        <div className="journey-line-track" style={{ "--line-progress": `${activeProgress}%` } as CSSProperties}>
          {guides.phases.map((phase) => {
            const now = phase.state === "now";
            const phaseTasks = getChecklistTasksByPhase(phase.id);
            const done = phaseTasks.length > 0 && countDoneTasks(phaseTasks, checklistChecks, savedCount) >= phaseTasks.length;
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
        const phaseTasks = getChecklistTasksByPhase(phase.id);
        const done = countDoneTasks(phaseTasks, checklistChecks, savedCount);
        const progress = phaseTasks.length ? Math.round((done / phaseTasks.length) * 100) : 0;
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
  task: Pick<ChecklistTask, "id" | "status">,
  checklistChecks: Record<string, boolean>,
  savedCount: number
) {
  return isChecklistTaskDone(task, checklistChecks, savedCount);
}

export function countDoneTasks(
  tasks: Array<Pick<ChecklistTask, "id" | "status">>,
  checklistChecks: Record<string, boolean>,
  savedCount: number
) {
  return countDoneChecklistTasks(tasks, checklistChecks, savedCount);
}
