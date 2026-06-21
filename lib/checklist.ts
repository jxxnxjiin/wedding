import checklistData from "../data/checklist-tasks.json";
import type { ChecklistCategory, ChecklistOwner, ChecklistTask, ChecklistTaskUserUpdate } from "./schema";

export const checklistTasks = checklistData.tasks as ChecklistTask[];

export const CHECKLIST_OWNER_LABELS: Record<ChecklistOwner, string> = {
  couple: "함께",
  bride: "신부",
  groom: "신랑"
};

export const CHECKLIST_CATEGORY_LABELS: Record<ChecklistCategory, string> = {
  wedding_hall: "웨딩홀",
  studio: "스튜디오",
  dress: "드레스",
  makeup: "메이크업",
  snap: "스냅",
  wedding_plan: "일정",
  budget: "예산",
  guest: "하객",
  ceremony: "본식",
  home_living: "살림"
};

export function applyChecklistTaskEdits(
  task: ChecklistTask,
  edits: Record<string, ChecklistTaskUserUpdate> = {}
) {
  return { ...task, ...(edits[task.id] ?? {}) };
}

export function getChecklistTasks(edits: Record<string, ChecklistTaskUserUpdate> = {}) {
  return checklistTasks.map((task) => applyChecklistTaskEdits(task, edits));
}

export function getChecklistTasksByPhase(phaseId: string, edits: Record<string, ChecklistTaskUserUpdate> = {}) {
  return getChecklistTasks(edits).filter((task) => task.phaseId === phaseId);
}

export function getChecklistTask(id: string, edits: Record<string, ChecklistTaskUserUpdate> = {}) {
  const task = checklistTasks.find((item) => item.id === id);
  return task ? applyChecklistTaskEdits(task, edits) : undefined;
}

export function getChecklistOwnerLabel(owner: ChecklistOwner) {
  return CHECKLIST_OWNER_LABELS[owner];
}

export function getChecklistCategoryLabel(category: ChecklistCategory) {
  return CHECKLIST_CATEGORY_LABELS[category];
}

export function isChecklistTaskDone(
  task: Pick<ChecklistTask, "id" | "status">,
  checklistChecks: Record<string, boolean>,
  savedCount: number
) {
  if (task.id in checklistChecks) return checklistChecks[task.id];
  if (task.id === "hall-save" && savedCount >= 3) return true;
  return task.status === "done";
}

export function countDoneChecklistTasks(
  tasks: Array<Pick<ChecklistTask, "id" | "status">>,
  checklistChecks: Record<string, boolean>,
  savedCount: number
) {
  return tasks.filter((task) => isChecklistTaskDone(task, checklistChecks, savedCount)).length;
}

export function isChecklistTaskDueThisWeek(task: Pick<ChecklistTask, "dueDate">, referenceDate = new Date()) {
  if (!task.dueDate) return false;

  const dueDate = new Date(`${task.dueDate}T00:00:00`);
  const today = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate());
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  return dueDate >= startOfWeek && dueDate <= endOfWeek;
}

export function formatChecklistDueDate(dueDate?: string) {
  if (!dueDate) return "마감일 없음";

  const date = new Date(`${dueDate}T00:00:00`);
  return new Intl.DateTimeFormat("ko-KR", {
    month: "numeric",
    day: "numeric",
    weekday: "short"
  }).format(date);
}
