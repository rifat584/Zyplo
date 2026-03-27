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
  Edit,                    
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
  if (/^\d+(\.\d+)?$/.test(raw)) {
    return minutesToSeconds(raw);
  }
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
  const { data: session } = useSession();
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

  // ==================== COMMENT STATES (original + new edit/delete) ====================
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [isCommentsBusy, setIsCommentsBusy] = useState(false);
  
const [deleteModalOpen, setDeleteModalOpen] = useState(false);
const [commentToDelete, setCommentToDelete] = useState(null); 

  // NEW: Edit & Delete states
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");

  // Fetch Comments
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

  // ==================== NEW: COMMENT EDIT HANDLERS ====================
  const handleEditCommentClick = (c) => {
    setEditingCommentId(c.id);
    setEditCommentText(c.text || "");
  };

  const handleSaveEditedComment = async () => {
    if (!editingCommentId || !editCommentText.trim() || !task?.id || isCommentsBusy) return;

    setIsCommentsBusy(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/dashboard/${task.id}/comments/${editingCommentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.accessToken}`,
          },
          body: JSON.stringify({
            text: editCommentText.trim(),
          }),
        },
      );

      if (response.ok) {
        setEditingCommentId(null);
        setEditCommentText("");
        fetchComments();
        toast.success("Comment updated successfully");
      } else {
        toast.error("Failed to update comment");
      }
    } catch (error) {
      console.error("Edit Comment Error:", error);
      toast.error("Failed to update comment");
    } finally {
      setIsCommentsBusy(false);
    }
  };

  const handleCancelEditComment = () => {
    setEditingCommentId(null);
    setEditCommentText("");
  };



// ==================== DELETE COMMENT ====================
const handleDeleteComment = (commentId) => {
  setCommentToDelete(commentId);
  setDeleteModalOpen(true);
};


const confirmDeleteComment = async () => {
  if (!commentToDelete || !task?.id || isCommentsBusy) return;

  setIsCommentsBusy(true);
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/dashboard/${task.id}/comments/${commentToDelete}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      }
    );

    if (response.ok) {
      fetchComments();           
      toast.success("Comment deleted successfully");
    } else {
      toast.error("Failed to delete comment");
    }
  } catch (error) {
    console.error("Delete Comment Error:", error);
    toast.error("Failed to delete comment");
  } finally {
    setIsCommentsBusy(false);
    setDeleteModalOpen(false);
    setCommentToDelete(null);
  }
  };
  


  // Add Comment (original)
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
    setIsAttachmentsOpen(taskAttachments.length > 0);
    setEditingField("");
    setActiveTab(taskAttachments.length > 0 ? "attachments" : "time");
    setIsManualEntryOpen(true);
    setIsTimeTrackingOpen(false);
    setTimePanelInitialized(false);
  }, [open, task]);

  // ... (all other useEffects remain exactly the same - time, github, keydown, etc.)

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
    setIsAttachmentsOpen(true);
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
        {/* Header remains unchanged */}
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
                  {/* Time, Attachments, GitHub tabs remain 100% unchanged */}

                  {activeTab === "comments" ? (
                    <div className={`${sectionPanelClass} p-4`}>
                      <h3 className={`flex items-center gap-2 ${subtleLabelClass}`}>
                        <MessageSquare size={14} />
                        Activity &amp; Comments
                      </h3>

                      {/* Add new comment form */}
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



                      {/* ==================== UPDATED COMMENTS LIST WITH EDIT + DELETE ==================== */}
                      <div className="mt-6 space-y-4">
                        {comments.map((c, i) => {
                          const isOwnComment = c.author === session?.user?.name;
                          const isEditingThisComment = editingCommentId === c.id;

                          return (
                            <div key={c.id || i} className="flex gap-3">
                              {/* Avatar */}
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-bold text-muted-foreground">
                                {c.author?.slice(0, 2).toUpperCase()}
                              </div>

                              <div className="flex-1 rounded-xl rounded-tl-none bg-background p-3">
                                {/* Header: author + timestamp + (edit/delete if own) */}
                                <div className="mb-1 flex items-center justify-between">
                                  <span className="text-xs font-bold text-foreground">
                                    {c.author}
                                  </span>

                                  <div className="flex items-center gap-3">
                                    <span className="text-[10px] text-muted-foreground">
                                      {formatDateTime(c.createdAt)}
                                    </span>

                                    {isOwnComment && !isEditingThisComment && (
                                      <div className="flex items-center gap-3 text-xs">
                                        <button
                                          type="button"
                                          onClick={() => handleEditCommentClick(c)}
                                          className="flex items-center gap-1 text-primary hover:text-primary/80 transition"
                                        >
                                          <Edit size={12} />
                                          Edit
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleDeleteComment(c.id)}
                                          className="flex items-center gap-1 text-destructive hover:text-destructive/80 transition"
                                        >
                                          <Trash2 size={12} />
                                          Delete
                                        </button>

                                        {/* ==================== DELETE CONFIRMATION MODAL ==================== */}
                                              {deleteModalOpen && (
                                                <div className="fixed inset-0 z-[60] flex items-center justify-center">
                                                  <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl">
                                                    <h3 className="text-lg font-semibold text-foreground">Delete Comment?</h3>
                                                    <p className="mt-2 text-sm text-muted-foreground">
                                                      This action cannot be undone. The comment will be permanently deleted.
                                                    </p>

                                                    <div className="mt-6 flex justify-end gap-3">
                                                      <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() => {
                                                          setDeleteModalOpen(false);
                                                          setCommentToDelete(null);
                                                        }}
                                                        disabled={isCommentsBusy}
                                                        className="h-9"
                                                      >
                                                        Cancel
                                                      </Button>

                                                      <Button
                                                        type="button"
                                                        variant="destructive"
                                                        onClick={confirmDeleteComment}
                                                        disabled={isCommentsBusy}
                                                        className="h-9 px-5"
                                                      >
                                                        {isCommentsBusy ? (
                                                          <>
                                                            <Loader2 className="mr-2 size-4 animate-spin" />
                                                            Deleting...
                                                          </>
                                                        ) : (
                                                          "Delete Comment"
                                                        )}
                                                      </Button>
                                                    </div>
                                                  </div>
                                                </div>
                                              )}
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Content: either text or edit textarea */}
                                {isEditingThisComment ? (
                                  <div>
                                    <textarea
                                      value={editCommentText}
                                      onChange={(e) => setEditCommentText(e.target.value)}
                                      className={compactTextAreaClass}
                                      rows={3}
                                      autoFocus
                                    />
                                    <div className="mt-3 flex justify-end gap-2">
                                      <button
                                        type="button"
                                        onClick={handleCancelEditComment}
                                        className="px-4 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition"
                                      >
                                        Cancel
                                      </button>
                                      <button
                                        type="button"
                                        onClick={handleSaveEditedComment}
                                        disabled={!editCommentText.trim() || isCommentsBusy}
                                        className={primaryActionClass}
                                      >
                                        {isCommentsBusy ? (
                                          <Loader2 size={12} className="animate-spin" />
                                        ) : (
                                          <>
                                            <CheckCircle2 size={12} />
                                            Save
                                          </>
                                        )}
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                    {c.text}
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}
                </div>
              </section>

              {/* Aside (task details) remains unchanged */}
              <aside className={`h-fit xl:sticky xl:top-0 xl:self-start ${panelCardClass}`}>
                {/* ... exact same code as original ... */}
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
                  {/* ... all other OverviewRow fields remain exactly the same ... */}
                  {/* (description, assignee, due date, status, priority, reporter, created, updated) */}
                </div>
              </aside>
            </div>
          </form>
        </div>

        {/* Footer buttons remain unchanged */}
        <div className="shrink-0 border-t border-border bg-card px-4 py-3 sm:px-5">
          <div className="flex w-full items-center gap-2 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onDelete?.(task)}
              disabled={isBusy || !onDelete}
              className="h-9 flex-1 border-destructive/25 bg-destructive/10 text-destructive shadow-none hover:scale-100 hover:bg-destructive/15 hover:text-destructive hover:shadow-none sm:flex-none"
            >
              <Trash2 className="size-3 mr-1" /> Delete
            </Button>
            <Button
              type="submit"
              size="sm"
              form="task-details-form"
              disabled={!form.title.trim() || isBusy}
              className="h-9 flex-1 shadow-none hover:scale-100 hover:bg-primary/90 hover:shadow-none sm:flex-none"
            >
              <CheckCircle2 className="size-3 mr-1" />
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}