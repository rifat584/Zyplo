"use client";

import { useEffect, useMemo, useState, useRef } from "react";
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
  attachments: [], // New field for attachments
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

// Helper to pick the right icon for the file type
const getFileIcon = (type) => {
  if (type.startsWith("image/")) return <ImageIcon size={14} />;
  if (type.startsWith("video/")) return <Film size={14} />;
  return <FileText size={14} />;
};

export default function TaskDetailsModal({
  open,
  task,
  members = [],
  submitting = false,
  onClose,
  onSubmit,
}) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!open || !task) return;
    setForm({
      title: String(task.title || ""),
      description: String(task.description || ""),
      assigneeId: String(task.assigneeId || ""),
      dueDate: toDateInputValue(task.dueDate),
      priority: String(task.priority || "P2").toUpperCase(),
      status: String(task.status || "todo"),
      attachments: Array.isArray(task.attachments) ? task.attachments : [],
    });
  }, [open, task]);

  useEffect(() => {
    if (!open) return undefined;

    function onKeyDown(event) {
      if (event.key === "Escape" && !submitting && !isUploading) onClose();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, open, submitting, isUploading]);

  const statusOptions = useMemo(() => {
    const current = String(form.status || "");
    if (!current) return BASE_STATUS_OPTIONS;
    const exists = BASE_STATUS_OPTIONS.some((item) => item.value === current);
    if (exists) return BASE_STATUS_OPTIONS;
    return [...BASE_STATUS_OPTIONS, { value: current, label: current }];
  }, [form.status]);
  
  const updatedAtValue = task?.updatedAt || task?.createdAt;

  // --- CLOUDINARY UPLOAD HANDLER ---
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // 1. Strict File Type Validation
    const validTypes = ["image/", "video/", "application/pdf"];
    const isValid = validTypes.some((type) => file.type.startsWith(type));

    if (!isValid) {
      alert("Invalid file type. Only images, videos, and PDFs are allowed.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    
    // REPLACE THESE WITH YOUR CLOUDINARY CREDENTIALS
    // Create an "Unsigned" preset in Cloudinary Settings -> Upload
    const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET || "YOUR_UNSIGNED_PRESET_NAME"; 
    const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "YOUR_CLOUD_NAME";
    
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`, {
        method: "POST",
        body: formData,
      });
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
        onClick={() => (submitting || isUploading ? null : onClose())}
        className="absolute inset-0 bg-slate-950/45 backdrop-blur-[2px]"
        aria-label="Close task details modal"
      />

      <div className="absolute left-1/2 top-1/2 w-[95vw] max-w-3xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-slate-900 flex flex-col max-h-[90vh]">
        <div className="border-b border-slate-200 bg-slate-50/70 px-5 py-4 dark:border-white/10 dark:bg-slate-800/30 shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Task Overview
              </p>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {task.title || "Untitled Task"}
              </h2>
            </div>
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 dark:border-white/10 dark:bg-slate-900 dark:text-slate-300">
              {task.projectName || "Unknown Project"}
            </span>
          </div>
          <div className="mt-3 grid gap-2 text-xs text-slate-500 dark:text-slate-400 sm:grid-cols-2">
            <p>Created: {formatDateTime(task.createdAt)}</p>
            <p>Updated: {formatDateTime(updatedAtValue)}</p>
          </div>
        </div>

        <div className="overflow-y-auto p-5 custom-scrollbar">
          <form
            id="task-details-form"
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              if (!form.title.trim() || submitting || isUploading) return;
              onSubmit({
                title: form.title.trim(),
                description: form.description.trim(),
                assigneeId: form.assigneeId,
                dueDate: form.dueDate,
                priority: form.priority,
                status: form.status,
                attachments: form.attachments, // Sending attachments to backend
              });
            }}
          >
            <div className="space-y-1.5">
              <label
                htmlFor="task-details-title"
                className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300"
              >
                Task Title
              </label>
              <input
                id="task-details-title"
                value={form.title}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, title: event.target.value }))
                }
                placeholder="Enter a clear task title"
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/10 dark:bg-slate-800 dark:text-slate-100"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="task-details-description"
                className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300"
              >
                Description
              </label>
              <textarea
                id="task-details-description"
                rows={5}
                value={form.description}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, description: event.target.value }))
                }
                placeholder="Add details, acceptance criteria, or important context"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/10 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>

            {/* --- ATTACHMENTS SECTION --- */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
                  Attachments
                </label>
                
                {/* Hidden input */}
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
                  {isUploading ? <Loader2 size={14} className="animate-spin" /> : <Paperclip size={14} />}
                  {isUploading ? "Uploading..." : "Add File"}
                </button>
              </div>

              {form.attachments.length > 0 && (
                <div className="grid gap-2 sm:grid-cols-2 mt-2">
                  {form.attachments.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 bg-slate-50 p-2 dark:border-white/10 dark:bg-slate-800/50">
                      <a href={file.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 truncate hover:underline text-sm text-slate-700 dark:text-slate-300">
                        {getFileIcon(file.type)}
                        <span className="truncate">{file.name}</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => removeAttachment(idx)}
                        className="text-slate-400 hover:text-rose-500 shrink-0"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid gap-3 sm:grid-cols-2 pt-2">
              <div className="space-y-1.5">
                <label
                  htmlFor="task-details-assignee"
                  className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300"
                >
                  Assignee
                </label>
                <select
                  id="task-details-assignee"
                  value={form.assigneeId}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, assigneeId: event.target.value }))
                  }
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/10 dark:bg-slate-800 dark:text-slate-100"
                >
                  <option value="">Unassigned</option>
                  {members.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="task-details-due-date"
                  className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300"
                >
                  Due Date
                </label>
                <input
                  id="task-details-due-date"
                  type="date"
                  value={form.dueDate}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, dueDate: event.target.value }))
                  }
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/10 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="task-details-priority"
                  className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300"
                >
                  Priority
                </label>
                <select
                  id="task-details-priority"
                  value={form.priority}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, priority: event.target.value }))
                  }
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/10 dark:bg-slate-800 dark:text-slate-100"
                >
                  {PRIORITY_OPTIONS.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="task-details-status"
                  className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300"
                >
                  Status
                </label>
                <select
                  id="task-details-status"
                  value={form.status}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, status: event.target.value }))
                  }
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/10 dark:bg-slate-800 dark:text-slate-100"
                >
                  {statusOptions.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </form>
        </div>

        <div className="border-t border-slate-200 bg-slate-50 px-5 py-4 dark:border-white/10 dark:bg-slate-800/30 shrink-0">
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting || isUploading}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:opacity-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="task-details-form"
              disabled={!form.title.trim() || submitting || isUploading}
              className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-600 disabled:opacity-50"
            >
              {submitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}