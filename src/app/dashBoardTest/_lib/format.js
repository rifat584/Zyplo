export function formatDate(dateString) {
  if (!dateString) return "No date";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function formatDateTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function fromNow(dateString) {
  const ms = Date.now() - new Date(dateString).getTime();
  const hour = 60 * 60 * 1000;
  const day = 24 * hour;

  if (ms < hour) return `${Math.max(1, Math.floor(ms / (60 * 1000)))}m ago`;
  if (ms < day) return `${Math.floor(ms / hour)}h ago`;
  return `${Math.floor(ms / day)}d ago`;
}
