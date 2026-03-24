export const TASK_STATUS_OPTIONS = [
  { value: "todo", label: "To Do" },
  { value: "inprogress", label: "In Progress" },
  { value: "inreview", label: "In Review" },
  { value: "done", label: "Done" },
];

export function normalizeStatusKey(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z]/g, "");
}

export function getSafeTaskStatus(value, fallback = "todo") {
  const normalized = normalizeStatusKey(value);
  const safeFallback = normalizeStatusKey(fallback) || "todo";
  return TASK_STATUS_OPTIONS.some((item) => item.value === normalized)
    ? normalized
    : safeFallback;
}

export function getTaskStatusLabel(value) {
  const safeStatus = getSafeTaskStatus(value);
  return (
    TASK_STATUS_OPTIONS.find((item) => item.value === safeStatus)?.label ||
    "To Do"
  );
}

export function getStatusFromColumnName(columnName, fallback = "") {
  const normalized = normalizeStatusKey(columnName);
  if (normalized === "todo" || normalized === "backlog") return "todo";
  if (normalized === "inprogress" || normalized === "doing") return "inprogress";
  if (normalized === "inreview" || normalized === "review") return "inreview";
  if (normalized === "done" || normalized === "completed") return "done";
  return getSafeTaskStatus(fallback);
}

export function findColumnByStatus(columns = [], status = "") {
  const target = getSafeTaskStatus(status);
  return (
    columns.find(
      (column) => getStatusFromColumnName(column?.name, "") === target,
    ) || null
  );
}
