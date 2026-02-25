/*
  Reusable task helpers.
*/
export function isOverdue(dueDate) {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date();
}

export function getDueStatus(dueDate) {
  if (!dueDate) return "none";
  if (isOverdue(dueDate)) return "overdue";

  const today = new Date();
  const dayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const due = new Date(dueDate);
  const dueStart = new Date(due.getFullYear(), due.getMonth(), due.getDate()).getTime();

  if (dueStart === dayStart) return "today";
  return "upcoming";
}
