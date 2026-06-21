import { NextResponse } from "next/server";
import checklistData from "../../../../data/checklist-tasks.json";
import type { ChecklistTask, ChecklistTaskUserUpdate } from "../../../../lib/schema";

const tasks = checklistData.tasks as ChecklistTask[];

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, { params }: Params) {
  const { id } = await params;
  const task = tasks.find((item) => item.id === id);

  if (!task) return NextResponse.json({ error: "Task not found" }, { status: 404 });
  return NextResponse.json({ task });
}

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;
  const task = tasks.find((item) => item.id === id);

  if (!task) return NextResponse.json({ error: "Task not found" }, { status: 404 });

  const body = (await request.json()) as ChecklistTaskUserUpdate;
  const update: ChecklistTaskUserUpdate = {};

  if (typeof body.title === "string") update.title = body.title;
  if (typeof body.memo === "string" || body.memo === undefined) update.memo = body.memo;
  if (body.owner) update.owner = body.owner;
  if (body.status) update.status = body.status;

  return NextResponse.json({ task: { ...task, ...update } });
}

export async function DELETE(_: Request, { params }: Params) {
  const { id } = await params;
  const task = tasks.find((item) => item.id === id);

  if (!task) return NextResponse.json({ error: "Task not found" }, { status: 404 });
  return NextResponse.json({ deleted: true, id });
}
