"use client";

import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { flushSync } from "react-dom";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Avatar } from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";
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

const overviewLabelClass =
  "pt-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground";
const panelCardClass =
  "overflow-hidden rounded-2xl border border-border bg-card shadow-sm";
const panelHeaderClass =
  "border-b border-border bg-card px-4 py-4 sm:px-5";
const sectionPanelClass = "rounded-2xl border border-border bg-muted/35";
const fieldClass =
  "h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20";
const textAreaFieldClass =
  "w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20";
const compactFieldClass =
  "h-10 w-full rounded-lg border border-border bg-background px-3 text-xs text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20";
const compactTextAreaClass =
  "w-full rounded-xl border border-border bg-background p-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20";
const detailFieldClass =
  "h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20";
const detailSelectFieldClass =
  "h-10 min-w-0 w-full max-w-full rounded-lg border border-border bg-background px-3 pr-8 text-[13px] text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 sm:text-sm";
const detailTextAreaClass =
  "w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20";
const subtleLabelClass =
  "text-xs font-semibold uppercase tracking-wide text-muted-foreground";
const primaryActionClass =
  "inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground shadow-sm shadow-primary/15 transition hover:bg-primary/90 disabled:opacity-50";
const primaryActionWideClass =
  "inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground shadow-sm shadow-primary/15 transition hover:bg-primary/90 disabled:opacity-50";
const iconActionClass =
  "inline-flex size-9 items-center justify-center rounded-2xl border border-border bg-background text-muted-foreground transition hover:bg-accent hover:text-accent-foreground disabled:opacity-50";
const dangerActionClass =
  "inline-flex items-center justify-center gap-2 rounded-lg border border-destructive/25 bg-destructive/10 px-3 py-2 text-xs font-semibold text-destructive transition hover:bg-destructive/15 disabled:opacity-50";
const textActionClass =
  "flex items-center gap-1.5 text-xs font-medium text-primary transition hover:text-primary/80 disabled:opacity-50";
const headerRefButtonClass =
  "inline-flex h-9 max-w-[12rem] items-center rounded-full border border-border bg-background px-3 text-xs font-semibold text-muted-foreground transition hover:bg-accent hover:text-accent-foreground";
const accentIconClass =
  "mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-md bg-primary/12 text-primary";
const neutralIconClass =
  "inline-flex size-6 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground";

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
      className={`grid gap-1.5 py-2.5 sm:grid-cols-[104px_minmax(0,1fr)] lg:grid-cols-[118px_minmax(0,1fr)] ${
        alignTop ? "items-start" : "items-center"
      }`}
    >
      <div className={overviewLabelClass}>{label}</div>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

function TaskTabButton({ active, icon: Icon, label, onClick, badge }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex min-w-0 flex-1 basis-full items-center justify-between gap-2 rounded-xl border px-3 py-2 text-left text-xs font-semibold transition sm:basis-[calc(50%-0.25rem)] xl:basis-[calc(25%-0.375rem)] ${
        active
          ? "border-primary/25 bg-primary text-primary-foreground shadow-lg shadow-primary/20"
          : "border-border bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      }`}
      aria-pressed={active}
    >
      <span className="flex min-w-0 items-center gap-2">
        <Icon className="size-3 shrink-0" />
        <span className="truncate whitespace-nowrap">{label}</span>
      </span>
      {badge ? (
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] ${
            active
              ? "bg-primary-foreground/15 text-primary-foreground"
              : "bg-muted text-muted-foreground"
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
  const stableMinHeightClass = multiline ? "min-h-[5.5rem]" : "min-h-10";
  const contentAlignmentClass =
    multiline || secondaryText ? "items-start" : "items-center";
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group -mx-1.5 flex w-[calc(100%+0.75rem)] rounded-lg px-1.5 py-2 text-left transition hover:bg-accent/60 ${stableMinHeightClass}`}
    >
      <div className={`flex w-full justify-between gap-3 ${contentAlignmentClass}`}>
        <div className="min-w-0 flex-1">
          <div
            className={`${
              hasValue
                ? "text-sm font-medium text-foreground"
                : "text-sm text-muted-foreground"
            } ${multiline ? "whitespace-pre-wrap" : "break-words"}`}
          >
            {hasValue ? value : placeholder}
          </div>
          {secondaryText ? (
            <div className="mt-1 text-xs text-muted-foreground">
              {secondaryText}
            </div>
          ) : null}
        </div>
        <span className="mt-0.5 shrink-0 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/80 opacity-0 transition group-hover:opacity-100">
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
  const assigneeSelectRef = useRef(null);
  const prioritySelectRef = useRef(null);
  const statusSelectRef = useRef(null);
  const dueDateInputRef = useRef(null);
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
      toast.error(
        "Invalid file type. Only images, videos, and PDFs are allowed.",
      );
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
      toast.error(error?.message || "Failed to upload file");
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

  const openPickerField = (field) => {
    let pickerRef = null;

    flushSync(() => {
      setEditingField(field);
    });

    if (field === "assigneeId") pickerRef = assigneeSelectRef;
    if (field === "priority") pickerRef = prioritySelectRef;
    if (field === "status") pickerRef = statusSelectRef;
    if (field === "dueDate") pickerRef = dueDateInputRef;

    const node = pickerRef?.current;
    if (!node) return;

    node.focus();

    if (typeof node.showPicker === "function") {
      try {
        node.showPicker();
        return;
      } catch {}
    }

    if (typeof node.click === "function") {
      node.click();
    }
  };

  const handleCopyTaskRef = async () => {
    if (!task?.taskRef) return;

    try {
      if (
        typeof navigator !== "undefined" &&
        navigator.clipboard &&
        typeof navigator.clipboard.writeText === "function"
      ) {
        await navigator.clipboard.writeText(task.taskRef);
      } else if (typeof document !== "undefined") {
        const textarea = document.createElement("textarea");
        textarea.value = task.taskRef;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "absolute";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      } else {
        throw new Error("Clipboard is unavailable");
      }

      toast.success("Copied task reference");
    } catch (error) {
      console.error(error);
      toast.error("Couldn't copy task reference");
    }
  };

  if (!open || !task) return null;
  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        onClick={() => (isBusy ? null : onClose())}
        className="absolute inset-0 bg-background/80 backdrop-blur-[4px]"
        aria-label="Close task details modal"
      />

      <div className="absolute left-1/2 top-1/2 flex max-h-[92vh] w-[min(96vw,72rem)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-2xl">
        <div className="shrink-0 border-b border-border bg-card px-4 py-3.5 sm:px-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h2 className="truncate text-lg font-semibold tracking-tight text-foreground sm:text-xl">
                {form.title || task.title || "Untitled Task"}
              </h2>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              {task?.taskRef ? (
                <button
                  type="button"
                  onClick={handleCopyTaskRef}
                  className={headerRefButtonClass}
                  title="Copy task reference"
                  aria-label={`Copy task reference ${task.taskRef}`}
                >
                  <span className="truncate font-mono">{task.taskRef}</span>
                </button>
              ) : null}

              <button
                type="button"
                onClick={onClose}
                disabled={isBusy}
                className={iconActionClass}
                aria-label="Close task details modal"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-y-auto p-4 custom-scrollbar sm:p-5">
          <form
            id="task-details-form"
            className="space-y-4 sm:space-y-5"
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
            <div className="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.95fr)]">
              <section className={`min-w-0 overflow-hidden ${panelCardClass}`}>
                <div className="border-b border-border bg-card px-4 py-3 sm:px-5">
                  <div className="flex flex-wrap gap-2" aria-label="Task detail sections">
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

                <div className="space-y-5 p-5">
                  {activeTab === "time" ? (
                    <div className={`${sectionPanelClass} p-4`}>
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <button
                          type="button"
                          onClick={() => setIsTimeTrackingOpen((prev) => !prev)}
                          className="flex min-w-0 flex-1 items-start gap-2 text-left"
                        >
                          <span className={accentIconClass}>
                            <Clock size={12} />
                          </span>
                          <span className="min-w-0">
                            <span className={`block ${subtleLabelClass}`}>
                              Time Tracking
                            </span>
                            <span className="mt-1 block truncate text-xs text-muted-foreground">
                              {timeSummary
                                ? `Estimated ${formatDurationHMS(timeSummary.estimated)} | Spent ${formatDurationHMS(timeSummary.spent)} | Remaining ${formatDurationHMS(timeSummary.remaining)}`
                                : "No time tracked yet"}
                            </span>
                            {hasOtherActiveTimer ? (
                              <span className="mt-1 block text-xs text-warning">
                                Another task has an active timer. Stop it to
                                start this one.
                              </span>
                            ) : null}
                          </span>
                          <span className="mt-0.5 shrink-0 text-muted-foreground">
                            <ChevronDown
                              size={14}
                              className={`transition-transform duration-300 ${isTimeTrackingOpen ? "rotate-180" : "rotate-0"}`}
                            />
                          </span>
                        </button>

                        <div className="flex flex-wrap items-center gap-2">
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
                                  toast.error(
                                    error?.message || "Failed to stop timer",
                                  );
                                } finally {
                                  setTimerBusy(false);
                                }
                              }}
                              className={dangerActionClass}
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
                                  toast.error(
                                    error?.message || "Failed to start timer",
                                  );
                                } finally {
                                  setTimerBusy(false);
                                }
                              }}
                              className={primaryActionClass}
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
                              className={subtleLabelClass}
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
                                className={`${fieldClass} h-10 min-w-[360px] whitespace-nowrap`}
                              />
                            </div>
                            <p className="text-[11px] text-muted-foreground">
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
                              className="flex w-full items-start justify-between gap-2 rounded-lg border border-transparent px-1 py-0.5 text-left transition hover:border-border hover:bg-accent/60"
                            >
                              <span>
                                <span className={subtleLabelClass}>
                                  Manual Time Entry
                                </span>
                                <span className="mt-0.5 block text-[11px] text-muted-foreground">
                                  Add a past work session by selecting the start
                                  and end time.
                                </span>
                              </span>
                              <span className="mt-1 text-muted-foreground">
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
                              <div className="rounded-xl border border-border bg-card p-3">
                                <div className="grid gap-3 sm:grid-cols-2">
                                  <div className="space-y-1">
                                    <label
                                      htmlFor="task-details-manual-start-time"
                                      className="text-[11px] font-medium text-muted-foreground"
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
                                      className={compactFieldClass}
                                    />
                                  </div>

                                  <div className="space-y-1">
                                    <label
                                      htmlFor="task-details-manual-end-time"
                                      className="text-[11px] font-medium text-muted-foreground"
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
                                      className={compactFieldClass}
                                    />
                                  </div>
                                </div>

                                <div className="mt-3 flex flex-col gap-2 lg:flex-row">
                                  <div className="flex-1 space-y-1">
                                    <label
                                      htmlFor="task-details-manual-note"
                                      className="text-[11px] font-medium text-muted-foreground"
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
                                      className={compactFieldClass}
                                    />
                                  </div>

                                  <div className="lg:mt-[18px]">
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
                                          toast.error(
                                            error?.message ||
                                              "Failed to save manual time",
                                          );
                                        } finally {
                                          setManualBusy(false);
                                        }
                                      }}
                                      className={primaryActionClass}
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
                            <p className={subtleLabelClass}>
                              Recent Logs
                            </p>
                            <div className="space-y-2 text-xs text-muted-foreground">
                              {timeLogs.slice(0, 5).map((log) => (
                                <div
                                  key={log.id}
                                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-background px-3 py-2"
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
                                    <span className="w-full text-[11px] text-muted-foreground">
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
                    <div className={`${sectionPanelClass} p-4`}>
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <button
                          type="button"
                          onClick={() =>
                            setIsAttachmentsOpen(!isAttachmentsOpen)
                          }
                          className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground transition-colors hover:text-primary"
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
                          className={textActionClass}
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
                              className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                            >
                              {/* Preview Area */}
                              <div className="relative h-28 w-full border-b border-border bg-muted">
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
                                      className="text-muted-foreground"
                                    />
                                  </div>
                                )}

                                {/* Hover Overlay with Delete */}
                                <div className="absolute inset-0 flex items-center justify-center bg-background/80 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                                  <button
                                    type="button"
                                    onClick={() => removeAttachment(idx)}
                                    className="rounded-full bg-destructive p-2 text-destructive-foreground shadow-lg transition-transform hover:scale-110 hover:bg-destructive/90"
                                    title="Remove attachment"
                                  >
                                    <X size={16} />
                                  </button>
                                </div>
                              </div>

                              {/* File Info Footer */}
                              <div className="flex items-center justify-between p-2.5">
                                <div className="flex flex-1 items-center gap-2 truncate pr-2">
                                  <span className="text-muted-foreground">
                                    {getFileIcon(file.type)}
                                  </span>
                                  <span
                                    className="truncate text-xs font-medium text-foreground"
                                    title={file.name}
                                  >
                                    {file.name}
                                  </span>
                                </div>
                                <a
                                  href={getDownloadUrl(file.url)}
                                  download={file.name}
                                  className="flex shrink-0 items-center justify-center rounded bg-background p-1.5 text-muted-foreground transition hover:bg-accent hover:text-accent-foreground"
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
                    <div className={`${sectionPanelClass} p-4`}>
                      <button
                        type="button"
                        onClick={() => setIsGithubOpen((prev) => !prev)}
                        className="flex w-full items-center justify-between gap-2 text-left"
                      >
                        <div className="flex items-center gap-2">
                          <span className={neutralIconClass}>
                            <svg
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="size-3.5"
                            >
                              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12" />
                            </svg>
                          </span>
                          <span className={subtleLabelClass}>
                            GitHub Activity
                            {githubActivities.length > 0 && (
                              <span className="ml-1.5 rounded-full bg-muted px-1.5 py-0.5 text-[10px]">
                                {githubActivities.length}
                              </span>
                            )}
                          </span>
                        </div>
                        <ChevronDown
                          size={14}
                          className={`text-muted-foreground transition-transform duration-300 ${isGithubOpen ? "rotate-180" : "rotate-0"}`}
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
                          <p className="mt-4 text-xs text-muted-foreground">
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
                                    <span className="font-mono font-semibold text-foreground">
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
                                className="flex items-start gap-3 rounded-lg border border-border bg-background p-3"
                              >
                                {/* icon: commit vs PR */}
                                <span className="mt-0.5 shrink-0 text-muted-foreground">
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
                                  <p className="text-xs text-foreground">
                                    {activity.text}
                                  </p>
                                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                                    {activity.meta?.pullRequestUrl && (
                                      <a
                                        href={activity.meta.pullRequestUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[11px] font-medium text-primary transition hover:text-primary/80 hover:underline"
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
                                        className="font-mono text-[11px] font-medium text-primary transition hover:text-primary/80 hover:underline"
                                      >
                                        {activity.meta.commitShort}
                                      </a>
                                    )}
                                    <span className="text-[11px] text-muted-foreground">
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
                                    className="size-6 shrink-0 rounded-full border border-border"
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
                    <div className={`${sectionPanelClass} p-4`}>
                      <h3 className={`flex items-center gap-2 ${subtleLabelClass}`}>
                        <MessageSquare size={14} />
                        Activity & Comments
                      </h3>

                      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                        <Avatar
                          name={session?.user?.name || "User"}
                          src={session?.user?.image || ""}
                          className="h-9 w-9 shrink-0 text-[10px]"
                        />
                        <div className="flex-1 space-y-2">
                          <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Write a comment..."
                            className={compactTextAreaClass}
                            rows={2}
                          />
                          <button
                            type="button"
                            onClick={handleAddComment}
                            disabled={!comment.trim() || isCommentsBusy}
                            className={primaryActionWideClass}
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
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-bold text-muted-foreground">
                              {c.author?.slice(0, 2).toUpperCase()}
                            </div>
                            <div className="flex-1 rounded-xl rounded-tl-none bg-background p-3">
                              <div className="mb-1 flex items-center justify-between">
                                <span className="text-xs font-bold text-foreground">
                                  {c.author}
                                </span>
                                <span className="text-[10px] text-muted-foreground">
                                  {formatDateTime(c.createdAt)}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground">
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

              <aside className={`h-fit xl:sticky xl:top-0 xl:self-start ${panelCardClass}`}>
                <div className={`${panelHeaderClass} flex items-center justify-between gap-3`}>
                  <h3 className="text-base font-semibold text-foreground">
                    Task details
                  </h3>
                </div>

                <div className="px-4 py-1 sm:px-5">
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
                        className={detailFieldClass}
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
                        rows={3}
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
                        className={`${detailTextAreaClass} min-h-[5.5rem]`}
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
                        ref={assigneeSelectRef}
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
                        className={detailFieldClass}
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
                        onClick={() => openPickerField("assigneeId")}
                      />
                    )}
                  </OverviewRow>

                  <OverviewRow label="Due Date">
                    {editingField === "dueDate" ? (
                      <input
                        ref={dueDateInputRef}
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
                        className={detailFieldClass}
                      />
                    ) : (
                      <EditableValueButton
                        value={dueDateLabel}
                        placeholder="No due date"
                        onClick={() => openPickerField("dueDate")}
                      />
                    )}
                  </OverviewRow>

                  <OverviewRow label="Status">
                    {editingField === "status" ? (
                      <select
                        ref={statusSelectRef}
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
                        className={detailSelectFieldClass}
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
                        onClick={() => openPickerField("status")}
                      />
                    )}
                  </OverviewRow>

                  <OverviewRow label="Priority">
                    {editingField === "priority" ? (
                      <select
                        ref={prioritySelectRef}
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
                        className={detailSelectFieldClass}
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
                        onClick={() => openPickerField("priority")}
                      />
                    )}
                  </OverviewRow>

                  <OverviewRow label="Reporter" alignTop>
                    <div className="space-y-0.5 py-1">
                      <div className="text-sm font-medium text-foreground">
                        {reporterDisplayName}
                      </div>
                      {reporterSecondary ? (
                        <div className="text-xs text-muted-foreground">
                          {reporterSecondary}
                        </div>
                      ) : null}
                    </div>
                  </OverviewRow>

                  <OverviewRow label="Created">
                    <div className="py-1 text-sm text-muted-foreground">
                      {formatDateTime(task.createdAt)}
                    </div>
                  </OverviewRow>

                  <OverviewRow label="Updated">
                    <div className="py-1 text-sm text-muted-foreground">
                      {formatDateTime(updatedAtValue)}
                    </div>
                  </OverviewRow>
                </div>
              </aside>
            </div>
          </form>
        </div>

        <div className="shrink-0 border-t border-border bg-card px-4 py-3 sm:px-5">
          <div className="flex w-full items-center gap-2 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onDelete?.(task)}
              disabled={isBusy || !onDelete}
              title={deleting ? "Deleting..." : "Delete Task"}
              aria-label={deleting ? "Deleting task" : "Delete task"}
              className="h-9 flex-1 border-destructive/25 bg-destructive/10 text-destructive shadow-none hover:scale-100 hover:bg-destructive/15 hover:text-destructive hover:shadow-none sm:flex-none"
            >
              {/* {deleting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Trash2 className="size-4" /> 
              )} */}
              <Trash2 className="size-3 mr-1" /> Delete
            </Button>

            <Button
              type="submit"
              size="sm"
              form="task-details-form"
              disabled={!form.title.trim() || isBusy}
              title={submitting ? "Saving..." : "Save Changes"}
              aria-label={submitting ? "Saving changes" : "Save changes"}
              className="h-9 flex-1 shadow-none hover:scale-100 hover:bg-primary/90 hover:shadow-none sm:flex-none"
            >
              {/* {submitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <CheckCircle2 className="size-4" />
              )} */}
              <CheckCircle2 className="size-3 mr-1" />
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
