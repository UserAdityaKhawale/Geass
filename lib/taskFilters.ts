import { Task } from "@/store/useGeassStore";

export function getTodaysTasks(tasks: Task[], workspaceId: string | null): Task[] {
  if (!workspaceId) return [];
  const todayStr = new Date().toISOString().split("T")[0];
  return tasks.filter(
    (t) =>
      t.workspaceId === workspaceId &&
      (t.dueDate?.startsWith(todayStr) || !t.dueDate) &&
      t.status !== "done"
  );
}

export function getWorkspaceTasks(tasks: Task[], workspaceId: string | null): Task[] {
  if (!workspaceId) return [];
  return tasks.filter((t) => t.workspaceId === workspaceId);
}
