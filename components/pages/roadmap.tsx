import guides from "../../data/guides.json";
import vendorsData from "../../data/vendors.json";
import {
  formatChecklistDueDate,
  getChecklistCategoryLabel,
  getChecklistOwnerLabel,
  getChecklistTasksByPhase
} from "../../lib/checklist";
import { getWeddingDday } from "../../lib/date";
import type { ChecklistTask, Vendor } from "../../lib/schema";
import { HeaderBar } from "../common";
import { CalendarIcon, CheckIcon, UserIcon } from "../icons";
import { countDoneTasks, isTaskDone } from "./journey";

const allVendors = vendorsData.vendors as Vendor[];

export function RoadmapScreen({
  activePhaseId,
  savedCount,
  checklistChecks,
  onSelectPhase,
  onToggleChecklistTask,
  onOpenTask,
  weddingDate
}: {
  activePhaseId: string;
  savedCount: number;
  checklistChecks: Record<string, boolean>;
  onSelectPhase: (id: string) => void;
  onToggleChecklistTask: (id: string) => void;
  onOpenTask: (id: string) => void;
  weddingDate: string;
}) {
  const activePhase = guides.phases.find((phase) => phase.id === activePhaseId) ?? guides.phases[0];
  const activeTasks = getChecklistTasksByPhase(activePhase.id);
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
            const phaseTasks = getChecklistTasksByPhase(phase.id);
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
            return (
              <div key={task.id} className={`roadmap-task ${done ? "done" : ""}`}>
                <button className="roadmap-task-toggle" onClick={() => onToggleChecklistTask(task.id)} aria-label={`${task.title} 완료 상태 변경`}>
                  <span className={`check-box ${done ? "checked" : ""}`}>{done && <CheckIcon />}</span>
                </button>
                <button className="roadmap-task-open" onClick={() => onOpenTask(task.id)}>
                  <span className="roadmap-task-name">{task.title}</span>
                  {task.thisWeek && <em>이번 주</em>}
                  <small className={`owner-${ownerLabel}`}>{ownerLabel}</small>
                  <span className="roadmap-task-chevron">›</span>
                </button>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

const STATUS_META: Record<ChecklistTask["status"], { label: string; className: string }> = {
  todo: { label: "할 일", className: "todo" },
  done: { label: "완료", className: "done" },
  skipped: { label: "건너뜀", className: "skipped" }
};

export function TaskDetailScreen({
  task,
  done,
  savedCount,
  onBack,
  onToggle,
  onNavigateVendors,
  onOpenVendor
}: {
  task: ChecklistTask;
  done: boolean;
  savedCount: number;
  onBack: () => void;
  onToggle: () => void;
  onNavigateVendors: () => void;
  onOpenVendor: (id: string) => void;
}) {
  const phase = guides.phases.find((item) => item.id === task.phaseId) ?? guides.phases[0];
  const ownerLabel = getChecklistOwnerLabel(task.owner);
  const categoryLabel = getChecklistCategoryLabel(task.category);
  const status = done ? STATUS_META.done : STATUS_META[task.status === "done" ? "todo" : task.status];
  const considerations = task.aiRecommendations ?? [];
  const exampleVendors = task.linkedVendorCategory
    ? allVendors.filter((vendor) => vendor.category === task.linkedVendorCategory).slice(0, 3)
    : [];

  return (
    <div className="task-detail-screen">
      <HeaderBar title="준비 태스크" onBack={onBack} />

      <div className="task-detail-body">
        <div className="task-detail-pills">
          <span className="task-pill category">{categoryLabel}</span>
          <span className={`task-pill status ${status.className}`}>{status.label}</span>
          {task.thisWeek && <span className="task-pill week">이번 주</span>}
        </div>
        <h2 className="serif task-detail-title">{task.title}</h2>
        <div className="task-detail-phase">{phase.num}단계 · {phase.name}</div>

        <div className="task-detail-meta">
          <div className="task-detail-meta-card">
            <div className="task-detail-meta-label"><CalendarIcon />마감일</div>
            <div className="task-detail-meta-value">{formatChecklistDueDate(task.dueDate)}</div>
          </div>
          <div className="task-detail-meta-card">
            <div className="task-detail-meta-label"><UserIcon />담당</div>
            <div><span className={`owner-pill owner-${ownerLabel}`}>{ownerLabel}</span></div>
          </div>
        </div>

        <button className={`task-detail-toggle ${done ? "is-done" : ""}`} onClick={onToggle}>
          {done ? "완료 취소" : "완료로 표시"}
        </button>

        {considerations.length > 0 && (
          <>
            <h3 className="serif task-detail-section-title">이렇게 준비하면 좋아요</h3>
            <p className="caption task-detail-section-desc">선택 시 함께 고려하면 좋은 가이드예요.</p>
            <div className="task-consideration-list">
              {considerations.map((item, index) => (
                <div key={item.id} className="task-consideration">
                  <span className="task-consideration-num">{index + 1}</span>
                  <div>
                    <b>{item.title}</b>
                    <p>{item.summary}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {exampleVendors.length > 0 && (
          <>
            <h3 className="serif task-detail-section-title">예시 업체</h3>
            <div className="task-vendor-list">
              {exampleVendors.map((vendor) => (
                <button key={vendor.id} className="task-vendor" onClick={() => onOpenVendor(vendor.id)}>
                  <span className="task-vendor-head">
                    <b className="task-vendor-name">{vendor.name}</b>
                    <span className="task-vendor-chevron">›</span>
                  </span>
                  <p className="task-vendor-desc">{vendor.matchReason ?? vendor.summary}</p>
                </button>
              ))}
            </div>
          </>
        )}

        {task.linkedVendorCategory && (
          <button className="task-detail-cta" onClick={onNavigateVendors}>
            추천 {categoryLabel} 보러 가기 <span>→</span>
          </button>
        )}
      </div>
    </div>
  );
}
