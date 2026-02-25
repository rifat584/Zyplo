/*
  Reusable date helpers.
*/
export function formatRelativeTime(dateValue) {
  const date = new Date(dateValue);
  const ms = Date.now() - date.getTime();
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (ms < hour) return `${Math.max(1, Math.floor(ms / minute))}m ago`;
  if (ms < day) return `${Math.floor(ms / hour)}h ago`;
  return `${Math.floor(ms / day)}d ago`;
}
