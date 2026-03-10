"use client";

import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import {
  CheckCircle2,
  Paperclip,
  Loader2,
  FileText,
  Image as ImageIcon,
  Film,
  X,
  MessageSquare,
  Send,
  Clock,
  ChevronDown,
} from "lucide-react";
import { useSession } from "next-auth/react";

// --- Constants ---
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

// --- Helpers ---
const toDateInputValue = (value) => {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
};

function safeJsonParse(text, fallback) {
  if (!text) return fallback;
  try {
    return JSON.parse(text);
  } catch {
    return fallback;
  }
}

function parseEstimateToSeconds(rawValue) {
  const raw = String(rawValue || "").trim().toLowerCase();
  if (!raw) return 0;
  if (/^\d+(\.\d+)?$/.test(raw)) return Math.floor(Number(raw) * 60);
  
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
  const [isMounted, setIsMounted] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [timerBusy, setTimerBusy] = useState(false);
  const [manualBusy, setManualBusy] = useState(false);
  const [timeSummary, setTimeSummary] = useState(null);
  const [timeLogs, setTimeLogs] = useState([]);
  const [activeTimer, setActiveTimer] = useState(null);
  const [manualForm, setManualForm] = useState({ startTime: "", endTime: "", description: "" });
  const [isManualEntryOpen, setIsManualEntryOpen] = useState(false);
  const [isTimeTrackingOpen, setIsTimeTrackingOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  const fileInputRef = useRef(null);
  const isBusy = submitting || deleting || isUploading || timerBusy || manualBusy;

  useEffect(() => { setIsMounted(true); }, []);

  // --- Initialize Form & Fetch Data ---
  useEffect(() => {
    if (!open || !task) return;
    
    setForm({
      title: String(task.title || ""),
      description: String(task.description || ""),
      assigneeId: String(task.assigneeId || ""),
      dueDate: toDateInputValue(task.dueDate),
      priority: String(task.priority || "P2").toUpperCase(),
      status: String(task.status || "todo"),
      estimatedTime: task.estimatedTime ? formatEstimateInput(task.estimatedTime) : "",
      attachments: Array.isArray(task.attachments) ? task.attachments : [],
    });

    fetchComments();
    fetchTimeData();
  }, [open, task]);

  const fetchComments = async () => {
    if (!task?.id) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/dashboard/comments/${task.id}`);
      if (res.ok) setComments(await res.json());
    } catch (err) { console.error(err); }
  };

  const fetchTimeData = async () => {
    if (!task?.id) return;
    try {
      const [summaryRes, activeRes] = await Promise.all([
        fetch(`/api/dashboard/tasks/${task.id}/time-summary`),
        fetch(`/api/dashboard/time/active`),
      ]);
      if (summaryRes.ok) setTimeSummary(await summaryRes.json());
      if (activeRes.ok) {
        const data = await activeRes.json();
        setActiveTimer(data?.activeTimer || null);
      }
    } catch (err) { console.error(err); }
  };

  // --- Handlers ---
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!comment.trim() || !task?.id) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/dashboard/${task.id}/comments`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.accessToken}` 
        },
        body: JSON.stringify({ text: comment, author: session?.user?.name || "User" }),
      });
      if (res.ok) {
        setComment("");
        fetchComments();
      }
    } catch (err) { console.error(err); }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Combined Validation
    const validTypes = ["image/", "video/", "application/pdf"];
    if (!validTypes.some(type => file.type.startsWith(type))) {
      alert("Invalid file type. Only images, videos, and PDFs are allowed.");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_PRESET);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`,
        { method: "POST", body: formData }
      );
      const data = await res.json();
      if (data.secure_url) {
        setForm(prev => ({
          ...prev,
          attachments: [...prev.attachments, { url: data.secure_url, name: file.name, type: file.type }],
        }));
      }
    } catch (err) {
      console.error("Upload Error:", err);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const statusOptions = useMemo(() => {
    const current = String(form.status || "");
    const exists = BASE_STATUS_OPTIONS.some((item) => item.value === current);
    return exists ? BASE_STATUS_OPTIONS : [...BASE_STATUS_OPTIONS, { value: current, label: current }];
  }, [form.status]);

  if (!isMounted || !open || !task) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/45 backdrop-blur-[2px]" onClick={() => !isBusy && onClose()} />
      <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-slate-900 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="border-b p-4 flex justify-between items-center dark:bg-slate-800/30">
          <h2 className="text-lg font-bold">{form.title || "Task Details"}</h2>
          <button onClick={onClose}><X size={20} /></button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-6 space-y-6">
          <form onSubmit={(e) => { e.preventDefault(); onSubmit({...form, estimatedTime: parseEstimateToSeconds(form.estimatedTime)}); }}>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Title</label>
                <input 
                  className="w-full border rounded-lg p-2 dark:bg-slate-800" 
                  value={form.title} 
                  onChange={e => setForm({...form, title: e.target.value})} 
                />
              </div>

              {/* Time Tracking Section */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border">
                <div className="flex justify-between items-center">
                   <div className="flex items-center gap-2">
                     <Clock size={16} className="text-indigo-500"/>
                     <span className="text-sm font-semibold">Time Tracking</span>
                   </div>
                   <span className="text-xs text-slate-500">
                     Spent: {timeSummary ? formatDurationHMS(timeSummary.spent) : "0h"}
                   </span>
                </div>
                
                <input 
                  placeholder="Estimate (e.g. 1h 30m)"
                  className="mt-2 w-full text-sm p-2 border rounded dark:bg-slate-900"
                  value={form.estimatedTime}
                  onChange={e => setForm({...form, estimatedTime: e.target.value})}
                />
              </div>

              {/* Attachments Section */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-xs font-bold text-slate-500 uppercase">Attachments</label>
                  <button 
                    type="button" 
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs text-indigo-500 flex items-center gap-1"
                  >
                    <Paperclip size={12}/> Add File
                  </button>
                  <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
                </div>
                <div className="flex flex-wrap gap-2">
                  {form.attachments.map((file, i) => (
                    <div key={i} className="text-xs p-2 bg-slate-100 dark:bg-slate-800 rounded flex items-center gap-2">
                      <FileText size={12}/> {file.name}
                    </div>
                  ))}
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isBusy}
                className="w-full bg-indigo-600 text-white p-3 rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50"
              >
                {submitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}