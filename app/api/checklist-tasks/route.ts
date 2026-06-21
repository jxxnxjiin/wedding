import { NextResponse } from "next/server";
import checklistData from "../../../data/checklist-tasks.json";
import type { ChecklistTask, ChecklistTaskUserUpdate } from "../../../lib/schema";

const tasks = checklistData.tasks as ChecklistTask[];

export function GET() {
  return NextResponse.json({ tasks });
}

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<ChecklistTask>;

  if (!body.title || !body.phaseId || !body.category) {
    return NextResponse.json({ error: "title, phaseId, category are required" }, { status: 400 });
  }

  const task: ChecklistTask = {
    id: body.id ?? `task-${Date.now()}`,
    phaseId: body.phaseId,
    category: body.category,
    sourceType: body.sourceType ?? "roadmap",
    sourceId: body.sourceId,
    linkedVendorCategory: body.linkedVendorCategory,
    linkedVendorId: body.linkedVendorId,
    linkedReservation: body.linkedReservation,
    dueDate: body.dueDate,
    scheduledAt: body.scheduledAt,
    priority: body.priority ?? "medium",
    thisWeek: body.thisWeek ?? false,
    title: body.title,
    memo: body.memo,
    owner: body.owner ?? "couple",
    status: body.status ?? "todo",
    aiRecommendations: body.aiRecommendations
  };

  return NextResponse.json({ task }, { status: 201 });
}

export type ChecklistTaskPatchBody = ChecklistTaskUserUpdate;
