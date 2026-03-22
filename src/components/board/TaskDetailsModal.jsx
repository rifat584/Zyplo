"use client";

import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import {
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
  ArrowUp,
  ArrowRight,
  ArrowDown,
  Calendar,
  Eye,
  Paperclip,
  Loader2,
  FileText,
  Image as ImageIcon,
  Film,
  X,
  Download,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Send,
  LayoutGrid,
  TimerReset,
  GitBranch,
  Trash2,
} from "lucide-react";

const PRIORITY_OPTIONS = [
  { value: "P0", label: "P0 (Critical)" },
  { value: "P1", label: "P1 (High)" },
  { value: "P2", label: "P2 (Medium)" },
  { value: "P3", label: "P3 (Low)" },
];

const BASE_STATUS_OPTIONS = [
  { value: "todo", label: "To Do" },
  { value: "inprogress", label: "In Progress" },
  { value: "inreview", label: "In Review" },
  { value: "done", label: "Done" },
];

const EMPTY_FORM = {
  title: "",
  description: "",
  assigneeId: "",
  dueDate: "",
  priority: "P2",
  status: "todo",
  estimatedTime: "",
  attachments: [],
};

function toDateInputValue(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

function formatDateTime(value) {
  if (!value) return "Unknown";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

function safeJsonParse(text, fallback) {
  if (!text) return fallback;
  try {
    return JSON.parse(text);
  } catch {
    return fallback;
  }
}

function minutesToSeconds(value) {
  const minutes = Number(value);
  if (!Number.isFinite(minutes) || minutes < 0) return 0;
  return Math.floor(minutes * 60);
}

function parseEstimateToSeconds(rawValue) {
  const raw = String(rawValue || "")
    .trim()
    .toLowerCase();
  if (!raw) return 0;

  // Backward-compatible: plain number means minutes.
  if (/^\d+(\.\d+)?$/.test(raw)) {
    return minutesToSeconds(raw);
  }

  // Supports hh:mm:ss or mm:ss.
  if (/^\d+:\d{1,2}(:\d{1,2})?$/.test(raw)) {
    const parts = raw.split(":").map((part) => Number(part));
    if (parts.some((part) => Number.isNaN(part) || part < 0)) return 0;
    if (parts.length === 2) {
      const [minutes, seconds] = parts;
      return Math.floor(minutes * 60 + seconds);
    }
    const [hours, minutes, seconds] = parts;
    return Math.floor(hours * 3600 + minutes * 60 + seconds);
  }

  // Supports "1h 30m 20s", "90m", "5400s", and compact variants like "1h30m".
  const unitRegex = /(\d+(?:\.\d+)?)\s*([hms])/g;
  let total = 0;
  let matched = false;
  let token = unitRegex.exec(raw);
  while (token) {
    matched = true;
    const amount = Number(token[1]);
    const unit = token[2];
    if (unit === "h") total += amount * 3600;
    if (unit === "m") total += amount * 60;
    if (unit === "s") total += amount;
    token = unitRegex.exec(raw);
  }

  return matched ? Math.floor(total) : 0;
}

function formatEstimateInput(secondsValue) {
  const seconds = Math.max(0, Math.floor(Number(secondsValue) || 0));
  if (!seconds) return "";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const parts = [];
  if (h) parts.push(`${h}h`);
  if (m) parts.push(`${m}m`);
  if (s || !parts.length) parts.push(`${s}s`);
  return parts.join(" ");
}

function formatDurationHMS(value) {
  const totalSeconds = Math.max(0, Math.floor(Number(value) || 0));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours}h ${minutes}m ${seconds}s`;
}

function formatDateOnly(value) {
  if (!value) return "No date";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString();
}

function getPriorityLabel(value) {
  return (
    PRIORITY_OPTIONS.find(
      (item) => item.value === String(value || "").toUpperCase(),
    )?.label || String(value || "Unknown")
  );
}

function getStatusLabel(options, value) {
  return (
    options.find((item) => item.value === String(value || ""))?.label ||
    String(value || "Unknown")
  );
}

function OverviewRow({ label, children, alignTop = false }) {
  return (
    <div
      className={`grid gap-2 border-b border-slate-300/80 py-4 last:border-b-0 dark:border-white/10 sm:grid-cols-[112px_minmax(0,1fr)] lg:grid-cols-[128px_minmax(0,1fr)] ${
        alignTop ? "items-start" : "items-center"
      }`}
    >
      <div className="pt-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
        {label}
      </div>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

function TaskTabButton({ active, icon: Icon, label, onClick, badge }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1.5 text-xs font-semibold transition ${
        active
          ? "border-slate-900 bg-slate-900 text-white shadow-lg shadow-slate-900/10 dark:border-white dark:bg-white dark:text-slate-900"
          : "border-slate-300 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:border-white/10 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-white/20 dark:hover:bg-slate-800"
      }`}
      aria-pressed={active}
    >
      <span className="flex min-w-0 items-center gap-1">
        <Icon className="size-3 shrink-0" />
        <span className="truncate whitespace-nowrap">{label}</span>
      </span>
      {badge ? (
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] ${
            active
              ? "bg-white/20 text-white dark:bg-slate-900/10 dark:text-slate-900"
              : "bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-300"
          }`}
        >
          {badge}
        </span>
      ) : null}
    </button>
  );
}

function EditableValueButton({
  value,
  placeholder,
  secondaryText,
  onClick,
  multiline = false,
}) {
  const hasValue = Boolean(String(value || "").trim());
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group -mx-2 w-[calc(100%+1rem)] rounded-xl px-2 py-2 text-left transition hover:bg-slate-50 dark:hover:bg-slate-800/60 ${
        multiline ? "min-h-20" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div
            className={`${
              hasValue
                ? "text-sm font-medium text-slate-900 dark:text-slate-100"
                : "text-sm text-slate-400 dark:text-slate-500"
            } ${multiline ? "whitespace-pre-wrap" : "break-words"}`}
          >
            {hasValue ? value : placeholder}
          </div>
          {secondaryText ? (
            <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {secondaryText}
            </div>
          ) : null}
        </div>
        <span className="mt-0.5 shrink-0 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 opacity-0 transition group-hover:opacity-100 dark:text-slate-500">
          Edit
        </span>
      </div>
    </button>
  );
}

const getFileIcon = (type) => {
  if (type.startsWith("image/")) return <ImageIcon size={14} />;
  if (type.startsWith("video/")) return <Film size={14} />;
  return <FileText size={14} />;
};

// Helper to force Cloudinary to download the file instead of opening it in a new tab
const getDownloadUrl = (url) => {
  if (url && url.includes("cloudinary.com") && url.includes("/upload/")) {
    return url.replace("/upload/", "/upload/fl_attachment/");
  }
  return url;
};

export default function TaskDetailsModal({
  open,
  task,
  members = [],
  submitting = false,
  deleting = false,
  onClose,
  onSubmit,
  onDelete,
}) {
  const { data: session } = useSession(); // ADDED for Comments

  const [form, setForm] = useState(EMPTY_FORM);
  const [timerBusy, setTimerBusy] = useState(false);
  const [manualBusy, setManualBusy] = useState(false);
  const [timeSummary, setTimeSummary] = useState(null);
  const [timeLogs, setTimeLogs] = useState([]);
  const [activeTimer, setActiveTimer] = useState(null);
  const [manualForm, setManualForm] = useState({
    startTime: "",
    endTime: "",
    description: "",
  });
  const [isManualEntryOpen, setIsManualEntryOpen] = useState(true);
  const [isTimeTrackingOpen, setIsTimeTrackingOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("attachments");
  const [editingField, setEditingField] = useState("");
  const [timePanelInitialized, setTimePanelInitialized] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isAttachmentsOpen, setIsAttachmentsOpen] = useState(true);
  const [githubActivities, setGithubActivities] = useState([]);
  const [isGithubOpen, setIsGithubOpen] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);
  const [githubError, setGithubError] = useState("");
  const githubPanelInitRef = useRef(false);
  const fileInputRef = useRef(null);
  const isBusy =
    submitting || deleting || isUploading || timerBusy || manualBusy;

  // ADDED: Comment States
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [isCommentsBusy, setIsCommentsBusy] = useState(false);

  // ADDED: Fetch Comments
  const fetchComments = useCallback(async () => {
    if (!open || !task?.id) return;
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/dashboard/comments/${task.id}`,
      );
      if (response.ok) {
        const res = await response.json();
        setComments(Array.isArray(res) ? res : []);
      }
    } catch (error) {
      console.error("Fetch Comments Error:", error);
    }
  }, [open, task?.id]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  // ADDED: Add Comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    const trimmed = comment.trim();
    if (!trimmed || !task?.id || isCommentsBusy) return;

    setIsCommentsBusy(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/dashboard/${task.id}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.accessToken}`,
          },
          body: JSON.stringify({
            text: trimmed,
            author: session?.user?.name || "Anonymous",
          }),
        },
      );

      if (response.ok) {
        setComment("");
        fetchComments();
      }
    } catch (error) {
      console.error("Add Comment Error:", error);
    } finally {
      setIsCommentsBusy(false);
    }
  };

  useEffect(() => {
    if (!open || !task) return;
    const taskAttachments = Array.isArray(task.attachments)
      ? task.attachments
      : [];

    setForm({
      title: String(task.title || ""),
      description: String(task.description || ""),
      assigneeId: String(task.assigneeId || ""),
      dueDate: toDateInputValue(task.dueDate),
      priority: String(task.priority || "P2").toUpperCase(),
      status: String(task.status || "todo"),
      estimatedTime:
        task.estimatedTime !== undefined && task.estimatedTime !== null
          ? formatEstimateInput(task.estimatedTime)
          : "",
      attachments: taskAttachments,
    });

    // Auto-open attachments if there are any
    setIsAttachmentsOpen(taskAttachments.length > 0);
    setEditingField("");
    setActiveTab(taskAttachments.length > 0 ? "attachments" : "time");
    setIsManualEntryOpen(true);
    setIsTimeTrackingOpen(false);
    setTimePanelInitialized(false);
  }, [open, task]);

  useEffect(() => {
    if (!open || !task?.id) return;
    let alive = true;

    async function fetchTimeData() {
      try {
        const [summaryRes, logsRes, activeRes] = await Promise.all([
          fetch(`/api/dashboard/tasks/${task.id}/time-summary`, {
            cache: "no-store",
          }),
          fetch(`/api/dashboard/tasks/${task.id}/time`, { cache: "no-store" }),
          fetch(`/api/dashboard/time/active`, { cache: "no-store" }),
        ]);

        const summaryText = await summaryRes.text();
        const logsText = await logsRes.text();
        const activeText = await activeRes.text();

        const summaryData = safeJsonParse(summaryText, null);
        const logsData = safeJsonParse(logsText, []);
        const activeData = safeJsonParse(activeText, null);

        if (!alive) return;
        if (summaryRes.ok) setTimeSummary(summaryData);
        if (logsRes.ok) setTimeLogs(Array.isArray(logsData) ? logsData : []);
        if (activeRes.ok) setActiveTimer(activeData?.activeTimer || null);
        if (!timePanelInitialized) {
          const hasEstimate = Number(summaryData?.estimated || 0) > 0;
          const hasSpent = Number(summaryData?.spent || 0) > 0;
          const hasLogs = Array.isArray(logsData) && logsData.length > 0;
          const runningThisTask =
            String(activeData?.activeTimer?.taskId || "") ===
            String(task.id || "");
          setIsTimeTrackingOpen(
            hasEstimate || hasSpent || hasLogs || runningThisTask,
          );
          setTimePanelInitialized(true);
        }
      } catch {
        if (!alive) return;
      }
    }

    fetchTimeData();
    function onTimerUpdated() {
      fetchTimeData().catch(() => {});
    }
    window.addEventListener("zyplo-timer-updated", onTimerUpdated);
    return () => {
      alive = false;
      window.removeEventListener("zyplo-timer-updated", onTimerUpdated);
    };
  }, [open, task?.id, timePanelInitialized]);

  useEffect(() => {
    if (!open) return undefined;

    function onKeyDown(event) {
      if (event.key === "Escape" && !isBusy) onClose();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, open, isBusy]);

  // Fetch Github Activites
  useEffect(() => {
    if (!open || !task?.id) return;
    const controller = new AbortController();
    githubPanelInitRef.current = false;

    async function fetchGithubActivities() {
      try {
        setGithubLoading(true);
        setGithubError("");
        setGithubActivities([]);

        const res = await fetch(`/api/dashboard/tasks/${task.id}/activities`, {
          cache: "no-store",
          signal: controller.signal,
        });

        const text = await res.text();
        const data = safeJsonParse(text, null);

        if (!res.ok) {
          setGithubError(
            String(
              data?.message || data?.error || "Failed to load GitHub activity.",
            ),
          );
          return;
        }

        const list = Array.isArray(data) ? data : [];
        setGithubActivities(list);
        if (!githubPanelInitRef.current) {
          setIsGithubOpen(list.length > 0);
          githubPanelInitRef.current = true;
        }
      } catch (error) {
        if (error?.name === "AbortError") return;
        setGithubError("Could not load GitHub activity right now.");
      } finally {
        setGithubLoading(false);
      }
    }

    fetchGithubActivities();
    return () => {
      controller.abort();
    };
  }, [open, task?.id]);

  const statusOptions = useMemo(() => {
    const current = String(form.status || "");
    if (!current) return BASE_STATUS_OPTIONS;
    const exists = BASE_STATUS_OPTIONS.some((item) => item.value === current);
    if (exists) return BASE_STATUS_OPTIONS;
    return [...BASE_STATUS_OPTIONS, { value: current, label: current }];
  }, [form.status]);

  const memberNameMap = useMemo(() => {
    return new Map(
      members.map((member) => [
        String(member.id || ""),
        member.name || member.email || "Unknown",
      ]),
    );
  }, [members]);
  const reporterDisplayName =
    task?.reporterName || task?.reporterEmail || "Unknown";
  const reporterSecondary =
    task?.reporterEmail && task.reporterEmail !== reporterDisplayName
      ? task.reporterEmail
      : "";
  const assigneeDisplayName =
    memberNameMap.get(String(form.assigneeId || "")) ||
    task?.assigneeName ||
    "Unassigned";
  const priorityLabel = getPriorityLabel(form.priority);
  const statusLabel = getStatusLabel(statusOptions, form.status);
  const dueDateLabel = form.dueDate
    ? formatDateOnly(`${form.dueDate}T00:00:00`)
    : "No due date";

  const updatedAtValue = task?.updatedAt || task?.createdAt;
  const hasOtherActiveTimer =
    activeTimer &&
    String(activeTimer.taskId || "") &&
    String(activeTimer.taskId) !== String(task?.id || "");

  // --- CLOUDINARY UPLOAD HANDLER ---
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const validTypes = ["image/", "video/", "application/pdf"];
    const isValid = validTypes.some((type) => file.type.startsWith(type));

    if (!isValid) {
      alert("Invalid file type. Only images, videos, and PDFs are allowed.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setIsUploading(true);
    setIsAttachmentsOpen(true); // Open panel when uploading
    const formData = new FormData();
    formData.append("file", file);

    const UPLOAD_PRESET =
      process.env.NEXT_PUBLIC_CLOUDINARY_PRESET || "YOUR_UNSIGNED_PRESET_NAME";
    const CLOUD_NAME =
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "YOUR_CLOUD_NAME";

    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,
        {
          method: "POST",
          body: formData,
        },
      );
      const data = await response.json();

      if (data.secure_url) {
        setForm((prev) => ({
          ...prev,
          attachments: [
            ...prev.attachments,
            { url: data.secure_url, name: file.name, type: file.type },
          ],
        }));
      } else {
        throw new Error(data.error?.message || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload file. Check console for details.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeAttachment = (indexToRemove) => {
    setForm((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  if (!open || !task) return null;
  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        onClick={() => (isBusy ? null : onClose())}
        className="absolute inset-0 bg-slate-950/45 backdrop-blur-[2px]"
        aria-label="Close task details modal"
      />

      <div className="absolute left-1/2 top-1/2 w-[96vw] max-w-6xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-2xl dark:border-white/10 dark:bg-slate-900 flex max-h-[90vh] flex-col">
        <div className="border-b border-slate-300 px-5 py-3.5 dark:border-white/10 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 space-y-2.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-slate-900 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-white dark:bg-white dark:text-slate-900">
                  {task.projectName || "Unknown Project"}
                </span>
                {task?.taskRef ? (
                  <span className="rounded-full border border-slate-300 bg-white px-3 py-1 font-mono text-[11px] font-semibold text-slate-600 dark:border-white/10 dark:bg-slate-900 dark:text-slate-300">
                    {task.taskRef}
                  </span>
                ) : null}
                <span className="rounded-full border border-slate-300 bg-white px-3 py-1 text-[11px] font-medium text-slate-500 dark:border-white/10 dark:bg-slate-900 dark:text-slate-400">
                  Reporter: {reporterDisplayName}
                </span>
              </div>
              <div className="space-y-1">
                <h2 className="truncate text-xl font-semibold tracking-tight text-slate-950 dark:text-slate-50">
                  {form.title || task.title || "Untitled Task"}
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={isBusy}
              className="inline-flex size-9 items-center justify-center rounded-2xl border border-slate-300 bg-white text-slate-500 transition hover:border-slate-300 hover:text-slate-700 disabled:opacity-50 dark:border-white/10 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-white/20 dark:hover:text-slate-100"
              aria-label="Close task details modal"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto p-5 custom-scrollbar">
          <form
            id="task-details-form"
            className="space-y-5"
            onSubmit={(event) => {
              event.preventDefault();
              if (!form.title.trim() || isBusy) return;
              onSubmit({
                title: form.title.trim(),
                description: form.description.trim(),
                assigneeId: form.assigneeId,
                dueDate: form.dueDate,
                priority: form.priority,
                status: form.status,
                estimatedTime: parseEstimateToSeconds(form.estimatedTime),
                attachments: form.attachments,
              });
            }}
          >
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.95fr)]">
              <section className="min-w-0 overflow-hidden rounded-[28px] border border-slate-300 bg-white shadow-sm dark:border-white/10 dark:bg-slate-900">
                <div className="border-b border-slate-300 bg-gradient-to-br from-slate-50 via-white to-slate-100 px-5 py-5 dark:border-white/10 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
                  <div className="flex flex-col gap-4">
                    <div className="space-y-1">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                        Sections
                      </p>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                        Task Workspace
                      </h3>
                    </div>

                    <div
                      className="flex gap-2 "
                      aria-label="Task detail sections"
                    >
                      <TaskTabButton
                        active={activeTab === "attachments"}
                        icon={Paperclip}
                        label="Attachments"
                        badge={
                          form.attachments.length > 0
                            ? form.attachments.length
                            : null
                        }
                        onClick={() => setActiveTab("attachments")}
                      />
                      <TaskTabButton
                        active={activeTab === "time"}
                        icon={TimerReset}
                        label="Time Tracking"
                        onClick={() => setActiveTab("time")}
                      />
                      <TaskTabButton
                        active={activeTab === "comments"}
                        icon={MessageSquare}
                        label="Comments"
                        badge={comments.length > 0 ? comments.length : null}
                        onClick={() => setActiveTab("comments")}
                      />
                      <TaskTabButton
                        active={activeTab === "github"}
                        icon={GitBranch}
                        label="GitHub Integration"
                        badge={
                          githubActivities.length > 0
                            ? githubActivities.length
                            : null
                        }
                        onClick={() => setActiveTab("github")}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-5 p-5">
                  {activeTab === "time" ? (
                    <div className="rounded-xl border border-slate-300 bg-slate-50/50 p-4 dark:border-white/10 dark:bg-slate-800/30">
                      <div className="flex items-start justify-between gap-3">
                        <button
                          type="button"
                          onClick={() => setIsTimeTrackingOpen((prev) => !prev)}
                          className="flex min-w-0 flex-1 items-start gap-2 text-left"
                        >
                          <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-md bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
                            <Clock size={12} />
                          </span>
                          <span className="min-w-0">
                            <span className="block text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
                              Time Tracking
                            </span>
                            <span className="mt-1 block truncate text-xs text-slate-500 dark:text-slate-400">
                              {timeSummary
                                ? `Estimated ${formatDurationHMS(timeSummary.estimated)} | Spent ${formatDurationHMS(timeSummary.spent)} | Remaining ${formatDurationHMS(timeSummary.remaining)}`
                                : "No time tracked yet"}
                            </span>
                            {hasOtherActiveTimer ? (
                              <span className="mt-1 block text-xs text-amber-600 dark:text-amber-400">
                                Another task has an active timer. Stop it to
                                start this one.
                              </span>
                            ) : null}
                          </span>
                          <span className="mt-0.5 shrink-0 text-slate-500 dark:text-slate-300">
                            <ChevronDown
                              size={14}
                              className={`transition-transform duration-300 ${isTimeTrackingOpen ? "rotate-180" : "rotate-0"}`}
                            />
                          </span>
                        </button>

                        <div className="flex items-center gap-2">
                          {activeTimer &&
                          activeTimer.taskId === String(task.id) ? (
                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={async () => {
                                if (!activeTimer?.id) return;
                                setTimerBusy(true);
                                try {
                                  const response = await fetch(
                                    `/api/dashboard/time/${activeTimer.id}/stop`,
                                    {
                                      method: "POST",
                                      headers: {
                                        "Content-Type": "application/json",
                                      },
                                      body: JSON.stringify({}),
                                    },
                                  );
                                  if (!response.ok) {
                                    const text = await response.text();
                                    const data = safeJsonParse(text, null);
                                    throw new Error(
                                      data?.error ||
                                        data?.message ||
                                        "Failed to stop timer",
                                    );
                                  }
                                  const summaryRes = await fetch(
                                    `/api/dashboard/tasks/${task.id}/time-summary`,
                                    { cache: "no-store" },
                                  );
                                  const logsRes = await fetch(
                                    `/api/dashboard/tasks/${task.id}/time`,
                                    { cache: "no-store" },
                                  );
                                  const activeRes = await fetch(
                                    `/api/dashboard/time/active`,
                                    {
                                      cache: "no-store",
                                    },
                                  );
                                  const summaryText = await summaryRes.text();
                                  const logsText = await logsRes.text();
                                  const activeText = await activeRes.text();
                                  if (summaryRes.ok) {
                                    setTimeSummary(
                                      safeJsonParse(summaryText, null),
                                    );
                                  }
                                  if (logsRes.ok) {
                                    const data = safeJsonParse(logsText, []);
                                    setTimeLogs(
                                      Array.isArray(data) ? data : [],
                                    );
                                  }
                                  if (activeRes.ok) {
                                    const data = safeJsonParse(
                                      activeText,
                                      null,
                                    );
                                    setActiveTimer(data?.activeTimer || null);
                                  }
                                  if (typeof window !== "undefined") {
                                    window.dispatchEvent(
                                      new CustomEvent("zyplo-timer-updated"),
                                    );
                                  }
                                } catch (error) {
                                  console.error(error);
                                  alert(
                                    error?.message || "Failed to stop timer",
                                  );
                                } finally {
                                  setTimerBusy(false);
                                }
                              }}
                              className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100 disabled:opacity-50 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300"
                            >
                              Stop timer
                            </button>
                          ) : (
                            <button
                              type="button"
                              disabled={isBusy || hasOtherActiveTimer}
                              onClick={async () => {
                                setTimerBusy(true);
                                try {
                                  const response = await fetch(
                                    `/api/dashboard/tasks/${task.id}/time/start`,
                                    {
                                      method: "POST",
                                      headers: {
                                        "Content-Type": "application/json",
                                      },
                                      body: JSON.stringify({}),
                                    },
                                  );
                                  if (!response.ok) {
                                    const text = await response.text();
                                    const data = safeJsonParse(text, null);
                                    throw new Error(
                                      data?.error ||
                                        data?.message ||
                                        "Failed to start timer",
                                    );
                                  }
                                  const activeRes = await fetch(
                                    `/api/dashboard/time/active`,
                                    {
                                      cache: "no-store",
                                    },
                                  );
                                  const activeText = await activeRes.text();
                                  if (activeRes.ok) {
                                    const data = safeJsonParse(
                                      activeText,
                                      null,
                                    );
                                    setActiveTimer(data?.activeTimer || null);
                                  }
                                  if (typeof window !== "undefined") {
                                    window.dispatchEvent(
                                      new CustomEvent("zyplo-timer-updated"),
                                    );
                                  }
                                } catch (error) {
                                  console.error(error);
                                  alert(
                                    error?.message || "Failed to start timer",
                                  );
                                } finally {
                                  setTimerBusy(false);
                                }
                              }}
                              className="rounded-lg bg-indigo-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-indigo-600 disabled:opacity-50"
                            >
                              Start timer
                            </button>
                          )}
                        </div>
                      </div>

                      <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                          isTimeTrackingOpen
                            ? "max-h-[800px] opacity-100"
                            : "max-h-0 opacity-0"
                        }`}
                        aria-hidden={!isTimeTrackingOpen}
                      >
                        <div className="mt-4 grid gap-3 sm:grid-cols-3">
                          <div className="space-y-1.5">
                            <label
                              htmlFor="task-details-estimated-time"
                              className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300"
                            >
                              Estimate (h / m / s)
                            </label>
                            <div className="overflow-x-auto rounded-xl">
                              <input
                                id="task-details-estimated-time"
                                type="text"
                                value={form.estimatedTime}
                                onChange={(event) =>
                                  setForm((prev) => ({
                                    ...prev,
                                    estimatedTime: event.target.value,
                                  }))
                                }
                                placeholder="e.g. 1h 30m, 90m, 5400s, 01:30:00"
                                className="h-10 min-w-[360px] w-full whitespace-nowrap rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/10 dark:bg-slate-800 dark:text-slate-100"
                              />
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                              You can type `h/m/s` (example: `1h 20m 30s`) or
                              `hh:mm:ss`. If you enter only a number, it is
                              treated as minutes.
                            </p>
                          </div>

                          <div className="space-y-2 sm:col-span-2">
                            <button
                              type="button"
                              onClick={() =>
                                setIsManualEntryOpen((prev) => !prev)
                              }
                              className="flex w-full items-start justify-between gap-2 rounded-lg border border-transparent px-1 py-0.5 text-left hover:border-slate-300 hover:bg-slate-50 dark:hover:border-white/10 dark:hover:bg-slate-800/40"
                            >
                              <span>
                                <span className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
                                  Manual Time Entry
                                </span>
                                <span className="mt-0.5 block text-[11px] text-slate-500 dark:text-slate-400">
                                  Add a past work session by selecting the start
                                  and end time.
                                </span>
                              </span>
                              <span className="mt-1 text-slate-500 dark:text-slate-300">
                                <ChevronDown
                                  size={14}
                                  className={`transition-transform duration-300 ${isManualEntryOpen ? "rotate-180" : "rotate-0"}`}
                                />
                              </span>
                            </button>

                            <div
                              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                isManualEntryOpen
                                  ? "max-h-[420px] opacity-100"
                                  : "max-h-0 opacity-0"
                              }`}
                              aria-hidden={!isManualEntryOpen}
                            >
                              <div className="rounded-xl border border-slate-300 bg-white p-3 dark:border-white/10 dark:bg-slate-900">
                                <div className="grid gap-3 sm:grid-cols-2">
                                  <div className="space-y-1">
                                    <label
                                      htmlFor="task-details-manual-start-time"
                                      className="text-[11px] font-medium text-slate-600 dark:text-slate-300"
                                    >
                                      Start time
                                    </label>
                                    <input
                                      id="task-details-manual-start-time"
                                      type="datetime-local"
                                      value={manualForm.startTime}
                                      onChange={(event) =>
                                        setManualForm((prev) => ({
                                          ...prev,
                                          startTime: event.target.value,
                                        }))
                                      }
                                      className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-xs text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/10 dark:bg-slate-800 dark:text-slate-100"
                                    />
                                  </div>

                                  <div className="space-y-1">
                                    <label
                                      htmlFor="task-details-manual-end-time"
                                      className="text-[11px] font-medium text-slate-600 dark:text-slate-300"
                                    >
                                      End time
                                    </label>
                                    <input
                                      id="task-details-manual-end-time"
                                      type="datetime-local"
                                      value={manualForm.endTime}
                                      onChange={(event) =>
                                        setManualForm((prev) => ({
                                          ...prev,
                                          endTime: event.target.value,
                                        }))
                                      }
                                      className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-xs text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/10 dark:bg-slate-800 dark:text-slate-100"
                                    />
                                  </div>
                                </div>

                                <div className="mt-3 flex gap-2">
                                  <div className="flex-1 space-y-1">
                                    <label
                                      htmlFor="task-details-manual-note"
                                      className="text-[11px] font-medium text-slate-600 dark:text-slate-300"
                                    >
                                      Work note (optional)
                                    </label>
                                    <input
                                      id="task-details-manual-note"
                                      type="text"
                                      value={manualForm.description}
                                      onChange={(event) =>
                                        setManualForm((prev) => ({
                                          ...prev,
                                          description: event.target.value,
                                        }))
                                      }
                                      placeholder="What did you work on?"
                                      className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-xs text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/10 dark:bg-slate-800 dark:text-slate-100"
                                    />
                                  </div>

                                  <div className="mt-[18px]">
                                    <button
                                      type="button"
                                      disabled={
                                        isBusy ||
                                        !manualForm.startTime ||
                                        !manualForm.endTime
                                      }
                                      onClick={async () => {
                                        if (
                                          !manualForm.startTime ||
                                          !manualForm.endTime
                                        )
                                          return;
                                        setManualBusy(true);
                                        try {
                                          const response = await fetch(
                                            `/api/dashboard/tasks/${task.id}/time/manual`,
                                            {
                                              method: "POST",
                                              headers: {
                                                "Content-Type":
                                                  "application/json",
                                              },
                                              body: JSON.stringify({
                                                startTime: manualForm.startTime,
                                                endTime: manualForm.endTime,
                                                description:
                                                  manualForm.description,
                                              }),
                                            },
                                          );
                                          const text = await response.text();
                                          const data = safeJsonParse(
                                            text,
                                            null,
                                          );
                                          if (!response.ok) {
                                            throw new Error(
                                              data?.error ||
                                                data?.message ||
                                                "Failed to save manual time",
                                            );
                                          }
                                          setManualForm({
                                            startTime: "",
                                            endTime: "",
                                            description: "",
                                          });
                                          const summaryRes = await fetch(
                                            `/api/dashboard/tasks/${task.id}/time-summary`,
                                            { cache: "no-store" },
                                          );
                                          const logsRes = await fetch(
                                            `/api/dashboard/tasks/${task.id}/time`,
                                            { cache: "no-store" },
                                          );
                                          const summaryText =
                                            await summaryRes.text();
                                          const logsText = await logsRes.text();
                                          if (summaryRes.ok) {
                                            setTimeSummary(
                                              safeJsonParse(summaryText, null),
                                            );
                                          }
                                          if (logsRes.ok) {
                                            const logs = safeJsonParse(
                                              logsText,
                                              [],
                                            );
                                            setTimeLogs(
                                              Array.isArray(logs) ? logs : [],
                                            );
                                          }
                                          if (typeof window !== "undefined") {
                                            window.dispatchEvent(
                                              new CustomEvent(
                                                "zyplo-timer-updated",
                                              ),
                                            );
                                          }
                                        } catch (error) {
                                          console.error(error);
                                          alert(
                                            error?.message ||
                                              "Failed to save manual time",
                                          );
                                        } finally {
                                          setManualBusy(false);
                                        }
                                      }}
                                      className="h-10 rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50 dark:bg-white/10 dark:text-slate-100 dark:hover:bg-white/20"
                                    >
                                      Save log
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {timeLogs.length ? (
                          <div className="mt-4 space-y-2">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
                              Recent Logs
                            </p>
                            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                              {timeLogs.slice(0, 5).map((log) => (
                                <div
                                  key={log.id}
                                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-white/10 dark:bg-slate-900"
                                >
                                  <span>
                                    {log.startTime
                                      ? new Date(log.startTime).toLocaleString()
                                      : "Unknown"}{" "}
                                    -{" "}
                                    {log.endTime
                                      ? new Date(log.endTime).toLocaleString()
                                      : "Running"}
                                  </span>
                                  <span className="font-semibold">
                                    {formatDurationHMS(log.duration)}
                                  </span>
                                  {log.description ? (
                                    <span className="w-full text-[11px] text-slate-500 dark:text-slate-400">
                                      {log.description}
                                    </span>
                                  ) : null}
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  ) : null}

                  {activeTab === "attachments" ? (
                    <div className="rounded-xl border border-slate-300 bg-slate-50/50 p-4 dark:border-white/10 dark:bg-slate-800/30">
                      <div className="flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() =>
                            setIsAttachmentsOpen(!isAttachmentsOpen)
                          }
                          className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-600 transition-colors hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400"
                        >
                          <Paperclip size={14} />
                          Attachments{" "}
                          {form.attachments.length > 0 &&
                            `(${form.attachments.length})`}
                          {isAttachmentsOpen ? (
                            <ChevronUp size={14} />
                          ) : (
                            <ChevronDown size={14} />
                          )}
                        </button>

                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileUpload}
                          accept="image/*,video/*,application/pdf"
                          className="hidden"
                        />

                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isUploading}
                          className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-700 disabled:opacity-50 dark:text-indigo-400 dark:hover:text-indigo-300"
                        >
                          {isUploading ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <Paperclip size={14} />
                          )}
                          {isUploading ? "Uploading..." : "Add File"}
                        </button>
                      </div>

                      {isAttachmentsOpen && form.attachments.length > 0 && (
                        <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                          {form.attachments.map((file, idx) => (
                            <div
                              key={idx}
                              className="group relative flex flex-col overflow-hidden rounded-xl border border-slate-300 bg-white shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-slate-900"
                            >
                              {/* Preview Area */}
                              <div className="relative h-28 w-full bg-slate-100 dark:bg-slate-800 border-b border-slate-300 dark:border-white/10">
                                {file.type.startsWith("image/") ? (
                                  <img
                                    src={file.url}
                                    alt={file.name}
                                    className="h-full w-full object-cover"
                                  />
                                ) : file.type.startsWith("video/") ? (
                                  <video
                                    src={file.url}
                                    className="h-full w-full object-cover"
                                    muted
                                    preload="metadata"
                                  />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center">
                                    <FileText
                                      size={32}
                                      className="text-slate-400 dark:text-slate-500"
                                    />
                                  </div>
                                )}

                                {/* Hover Overlay with Delete */}
                                <div className="absolute inset-0 bg-slate-900/60 opacity-0 transition-opacity duration-200 group-hover:opacity-100 flex items-center justify-center">
                                  <button
                                    type="button"
                                    onClick={() => removeAttachment(idx)}
                                    className="rounded-full bg-rose-500 p-2 text-white shadow-lg transition-transform hover:scale-110 hover:bg-rose-600"
                                    title="Remove attachment"
                                  >
                                    <X size={16} />
                                  </button>
                                </div>
                              </div>

                              {/* File Info Footer */}
                              <div className="flex items-center justify-between p-2.5">
                                <div className="flex flex-1 items-center gap-2 truncate pr-2">
                                  <span className="text-slate-500">
                                    {getFileIcon(file.type)}
                                  </span>
                                  <span
                                    className="truncate text-xs font-medium text-slate-700 dark:text-slate-300"
                                    title={file.name}
                                  >
                                    {file.name}
                                  </span>
                                </div>
                                <a
                                  href={getDownloadUrl(file.url)}
                                  download={file.name}
                                  className="flex shrink-0 items-center justify-center rounded bg-slate-100 p-1.5 text-slate-500 transition hover:bg-indigo-50 hover:text-indigo-600 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-indigo-500/20 dark:hover:text-indigo-300"
                                  title="Download file"
                                >
                                  <Download size={14} />
                                </a>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : null}

                  {activeTab === "github" ? (
                    <div className="rounded-xl border border-slate-300 bg-slate-50/50 p-4 dark:border-white/10 dark:bg-slate-800/30">
                      <button
                        type="button"
                        onClick={() => setIsGithubOpen((prev) => !prev)}
                        className="flex w-full items-center justify-between gap-2 text-left"
                      >
                        <div className="flex items-center gap-2">
                          <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-md bg-slate-900 dark:bg-white/10">
                            <svg
                              viewBox="0 0 24 24"
                              fill="white"
                              className="size-3.5"
                            >
                              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12" />
                            </svg>
                          </span>
                          <span className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
                            GitHub Activity
                            {githubActivities.length > 0 && (
                              <span className="ml-1.5 rounded-full bg-slate-200 px-1.5 py-0.5 text-[10px] dark:bg-white/10">
                                {githubActivities.length}
                              </span>
                            )}
                          </span>
                        </div>
                        <ChevronDown
                          size={14}
                          className={`text-slate-500 transition-transform duration-300 ${isGithubOpen ? "rotate-180" : "rotate-0"}`}
                        />
                      </button>

                      <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                          isGithubOpen
                            ? "max-h-[600px] opacity-100"
                            : "max-h-0 opacity-0"
                        }`}
                      >
                        {githubActivities.length === 0 ? (
                          <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
                            {githubLoading ? (
                              <span className="inline-flex items-center gap-2">
                                <Loader2 className="size-3.5 animate-spin" />
                                Loading GitHub activity...
                              </span>
                            ) : githubError ? (
                              githubError
                            ) : (
                              <>
                                No GitHub activity yet.
                                {task?.taskRef ? (
                                  <>
                                    {" "}
                                    Mention{" "}
                                    <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">
                                      {task.taskRef}
                                    </span>{" "}
                                    in a PR title or commit message.
                                  </>
                                ) : null}
                              </>
                            )}
                          </p>
                        ) : (
                          <div className="mt-4 space-y-2">
                            {githubActivities.map((activity) => (
                              <div
                                key={activity._id}
                                className="flex items-start gap-3 rounded-lg border border-slate-300 bg-white p-3 dark:border-white/10 dark:bg-slate-900"
                              >
                                {/* icon: commit vs PR */}
                                <span className="mt-0.5 shrink-0 text-slate-400">
                                  {activity.action ===
                                  "github_commit_pushed" ? (
                                    <svg
                                      viewBox="0 0 24 24"
                                      fill="currentColor"
                                      className="size-4"
                                    >
                                      <path d="M17.718 8.004a6 6 0 0 0-11.436 0H2v2h4.282a6 6 0 0 0 11.436 0H22V8.004h-4.282zM12 14a4 4 0 1 1 0-8 4 4 0 0 1 0 8z" />
                                    </svg>
                                  ) : (
                                    <svg
                                      viewBox="0 0 24 24"
                                      fill="currentColor"
                                      className="size-4"
                                    >
                                      <path d="M7.177 3.073L9.573.677A.25.25 0 0 1 10 .854v4.792a.25.25 0 0 1-.427.177L7.177 3.427a.25.25 0 0 1 0-.354zM3.75 2.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5zm-2.25.75a2.25 2.25 0 1 1 3 2.122v5.256a2.251 2.251 0 1 1-1.5 0V5.372A2.25 2.25 0 0 1 1.5 3.25zM11 2.5h-1V4h1a1 1 0 0 1 1 1v5.628a2.251 2.251 0 1 0 1.5 0V5A2.5 2.5 0 0 0 11 2.5zm1 10.25a.75.75 0 1 1 1.5 0 .75.75 0 0 1-1.5 0z" />
                                    </svg>
                                  )}
                                </span>

                                <div className="min-w-0 flex-1">
                                  <p className="text-xs text-slate-700 dark:text-slate-300">
                                    {activity.text}
                                  </p>
                                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                                    {activity.meta?.pullRequestUrl && (
                                      <a
                                        href={activity.meta.pullRequestUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[11px] font-medium text-indigo-600 hover:underline dark:text-indigo-400"
                                      >
                                        View PR #
                                        {activity.meta.pullRequestNumber}
                                      </a>
                                    )}
                                    {activity.meta?.commitUrl && (
                                      <a
                                        href={activity.meta.commitUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="font-mono text-[11px] font-medium text-indigo-600 hover:underline dark:text-indigo-400"
                                      >
                                        {activity.meta.commitShort}
                                      </a>
                                    )}
                                    <span className="text-[11px] text-slate-400">
                                      {formatDateTime(activity.createdAt)}
                                    </span>
                                  </div>
                                </div>

                                {/* github avatar */}
                                {activity.meta?.githubAvatarUrl && (
                                  <img
                                    src={activity.meta.githubAvatarUrl}
                                    alt={activity.meta.githubUsername}
                                    title={`@${activity.meta.githubUsername}`}
                                    className="size-6 shrink-0 rounded-full border border-slate-300 dark:border-white/10"
                                  />
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : null}

                  {activeTab === "comments" ? (
                    <div className="rounded-xl border border-slate-300 bg-slate-50/50 p-4 dark:border-white/10 dark:bg-slate-800/30">
                      <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
                        <MessageSquare size={14} />
                        Activity & Comments
                      </h3>

                      <div className="mt-4 flex gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-500 text-[10px] font-bold text-white">
                          {session?.user?.name?.slice(0, 2).toUpperCase() ||
                            "U"}
                        </div>
                        <div className="flex-1 space-y-2">
                          <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Write a comment..."
                            className="w-full rounded-xl border border-slate-300 bg-slate-50/50 p-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/10 dark:bg-slate-800/50 dark:text-slate-100"
                            rows={2}
                          />
                          <button
                            type="button"
                            onClick={handleAddComment}
                            disabled={!comment.trim() || isCommentsBusy}
                            className="flex items-center gap-2 rounded-lg bg-indigo-500 px-4 py-1.5 text-xs font-bold text-white transition hover:bg-indigo-600 disabled:opacity-50"
                          >
                            {isCommentsBusy ? (
                              <Loader2 size={12} className="animate-spin" />
                            ) : (
                              <Send size={12} />
                            )}
                            Post Comment
                          </button>
                        </div>
                      </div>

                      <div className="mt-6 space-y-4">
                        {comments.map((c, i) => (
                          <div key={i} className="flex gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                              {c.author?.slice(0, 2).toUpperCase()}
                            </div>
                            <div className="flex-1 rounded-xl rounded-tl-none bg-slate-50 p-3 dark:bg-slate-800/40">
                              <div className="mb-1 flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                                  {c.author}
                                </span>
                                <span className="text-[10px] text-slate-400">
                                  {formatDateTime(c.createdAt)}
                                </span>
                              </div>
                              <p className="text-sm text-slate-600 dark:text-slate-300">
                                {c.text}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              </section>

              <aside className="h-fit rounded-[28px] border border-slate-300 bg-white shadow-sm xl:sticky xl:top-0 xl:self-start dark:border-white/10 dark:bg-slate-900">
                <div className="border-b rounded-t-[28px] border-slate-300 px-5 py-5 dark:border-white/10 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                        Overview
                      </p>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                        Task Information
                      </h3>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-500 dark:bg-white/10 dark:text-slate-400">
                      Click text to edit
                    </span>
                  </div>
                </div>

                <div className="px-5 py-2">
                  <OverviewRow label="Task Title">
                    {editingField === "title" ? (
                      <input
                        id="task-details-title"
                        value={form.title}
                        autoFocus
                        onChange={(event) =>
                          setForm((prev) => ({
                            ...prev,
                            title: event.target.value,
                          }))
                        }
                        onBlur={() => setEditingField("")}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") setEditingField("");
                          if (event.key === "Escape") setEditingField("");
                        }}
                        placeholder="Enter a clear task title"
                        className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 dark:border-white/10 dark:bg-slate-800 dark:text-slate-100"
                        required
                      />
                    ) : (
                      <EditableValueButton
                        value={form.title}
                        placeholder="Add a title"
                        onClick={() => setEditingField("title")}
                      />
                    )}
                  </OverviewRow>

                  <OverviewRow label="Description" alignTop>
                    {editingField === "description" ? (
                      <textarea
                        id="task-details-description"
                        rows={5}
                        value={form.description}
                        autoFocus
                        onChange={(event) =>
                          setForm((prev) => ({
                            ...prev,
                            description: event.target.value,
                          }))
                        }
                        onBlur={() => setEditingField("")}
                        placeholder="Add details, acceptance criteria, or important context"
                        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 dark:border-white/10 dark:bg-slate-800 dark:text-slate-100"
                      />
                    ) : (
                      <EditableValueButton
                        value={form.description}
                        placeholder="Add details, acceptance criteria, or important context"
                        onClick={() => setEditingField("description")}
                        multiline
                      />
                    )}
                  </OverviewRow>

                  <OverviewRow label="Assignee">
                    {editingField === "assigneeId" ? (
                      <select
                        id="task-details-assignee"
                        value={form.assigneeId}
                        autoFocus
                        onChange={(event) =>
                          setForm((prev) => ({
                            ...prev,
                            assigneeId: event.target.value,
                          }))
                        }
                        onBlur={() => setEditingField("")}
                        className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 dark:border-white/10 dark:bg-slate-800 dark:text-slate-100"
                      >
                        <option value="">Unassigned</option>
                        {members.map((member) => (
                          <option key={member.id} value={member.id}>
                            {member.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <EditableValueButton
                        value={assigneeDisplayName}
                        placeholder="Select an assignee"
                        onClick={() => setEditingField("assigneeId")}
                      />
                    )}
                  </OverviewRow>

                  <OverviewRow label="Reporter" alignTop>
                    <div className="space-y-1 py-2">
                      <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        {reporterDisplayName}
                      </div>
                      {reporterSecondary ? (
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {reporterSecondary}
                        </div>
                      ) : null}
                    </div>
                  </OverviewRow>

                  <OverviewRow label="Due Date">
                    {editingField === "dueDate" ? (
                      <input
                        id="task-details-due-date"
                        type="date"
                        value={form.dueDate}
                        autoFocus
                        onChange={(event) =>
                          setForm((prev) => ({
                            ...prev,
                            dueDate: event.target.value,
                          }))
                        }
                        onBlur={() => setEditingField("")}
                        className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 dark:border-white/10 dark:bg-slate-800 dark:text-slate-100"
                      />
                    ) : (
                      <EditableValueButton
                        value={dueDateLabel}
                        placeholder="No due date"
                        onClick={() => setEditingField("dueDate")}
                      />
                    )}
                  </OverviewRow>

                  <OverviewRow label="Priority">
                    {editingField === "priority" ? (
                      <select
                        id="task-details-priority"
                        value={form.priority}
                        autoFocus
                        onChange={(event) =>
                          setForm((prev) => ({
                            ...prev,
                            priority: event.target.value,
                          }))
                        }
                        onBlur={() => setEditingField("")}
                        className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 dark:border-white/10 dark:bg-slate-800 dark:text-slate-100"
                      >
                        {PRIORITY_OPTIONS.map((item) => (
                          <option key={item.value} value={item.value}>
                            {item.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <EditableValueButton
                        value={priorityLabel}
                        placeholder="Select priority"
                        onClick={() => setEditingField("priority")}
                      />
                    )}
                  </OverviewRow>

                  <OverviewRow label="Status">
                    {editingField === "status" ? (
                      <select
                        id="task-details-status"
                        value={form.status}
                        autoFocus
                        onChange={(event) =>
                          setForm((prev) => ({
                            ...prev,
                            status: event.target.value,
                          }))
                        }
                        onBlur={() => setEditingField("")}
                        className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 dark:border-white/10 dark:bg-slate-800 dark:text-slate-100"
                      >
                        {statusOptions.map((item) => (
                          <option key={item.value} value={item.value}>
                            {item.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <EditableValueButton
                        value={statusLabel}
                        placeholder="Select status"
                        onClick={() => setEditingField("status")}
                      />
                    )}
                  </OverviewRow>

                  <OverviewRow label="Project">
                    <div className="py-2 text-sm font-medium text-slate-900 dark:text-slate-100">
                      {task.projectName || "Unknown Project"}
                    </div>
                  </OverviewRow>

                  <OverviewRow label="Task Ref">
                    <div className="break-all py-2 font-mono text-sm text-slate-700 dark:text-slate-300">
                      {task.taskRef || "Not assigned"}
                    </div>
                  </OverviewRow>

                  <OverviewRow label="Created">
                    <div className="py-2 text-sm text-slate-700 dark:text-slate-300">
                      {formatDateTime(task.createdAt)}
                    </div>
                  </OverviewRow>

                  <OverviewRow label="Updated">
                    <div className="py-2 text-sm text-slate-700 dark:text-slate-300">
                      {formatDateTime(updatedAtValue)}
                    </div>
                  </OverviewRow>
                </div>
              </aside>
            </div>
          </form>
        </div>

        <div className="border-t border-slate-300 bg-slate-50 px-5 py-3 dark:border-white/10 dark:bg-slate-800/30 shrink-0">
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => onDelete?.(task)}
              disabled={isBusy || !onDelete}
              title={deleting ? "Deleting..." : "Delete Task"}
              aria-label={deleting ? "Deleting task" : "Delete task"}
              className="inline-flex items-center px-1.5 text-sm py-1 justify-center rounded-lg border border-rose-200 bg-rose-50 text-rose-700 transition hover:bg-rose-100 disabled:opacity-50 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300 dark:hover:bg-rose-500/20"
            >
              {/* {deleting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Trash2 className="size-4" /> 
              )} */}
              <Trash2 className="size-3 mr-1" /> Delete
            </button>

            <div className="flex items-center justify-end gap-2">
              <button
                type="submit"
                form="task-details-form"
                disabled={!form.title.trim() || isBusy}
                title={submitting ? "Saving..." : "Save Changes"}
                aria-label={submitting ? "Saving changes" : "Save changes"}
                className="inline-flex px-1.5 py-1 text-sm items-center justify-center rounded-lg bg-indigo-500 text-white transition hover:bg-indigo-600 disabled:opacity-50"
              >
                {/* {submitting ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="size-4" />
                )} */}
                <CheckCircle2 className="size-3 mr-1" />
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
