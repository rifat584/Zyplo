
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
  attachments: [],
};

// --- Helpers ---
const toDateInputValue = (value) => {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
};

const formatDateTime = (value) => {
  if (!value) return "Unknown";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

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
  deleting = false,
  onClose,
  onSubmit,
  onDelete,
}) {
  const { data: session } = useSession();
  const [isMounted, setIsMounted] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [isUploading, setIsUploading] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  const fileInputRef = useRef(null);
  const isBusy = submitting || deleting || isUploading;

  useEffect(() => { setIsMounted(true); }, []);

  // --- Fetch Comments ---
  const fetchComments = useCallback(async () => {
    if (!open || !task?.id) return;
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/dashboard/comments/${task.id}`
      );
      if (response.ok) {
        const res = await response.json();
        setComments(Array.isArray(res) ? res : []);
      }
    } catch (error) {
      console.error("Fetch Comments Error:", error);
    }
  }, [open, task?.id]);

  useEffect(() => { fetchComments(); }, [fetchComments]);

  // --- Initialize Form ---
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

  // --- Add Comment ---
  const handleAddComment = async (e) => {
    e.preventDefault();
    const trimmed = comment.trim();
    if (!trimmed || !task?.id) return;

    const commentPayload = {
      text: trimmed,
      author: session?.user?.name || "User",
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/dashboard/${task.id}/comments`,
        {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session?.accessToken}` // Prevent 401
          },
          body: JSON.stringify(commentPayload),
        }
      );

      if (response.ok) {
        setComment("");
        fetchComments(); // Refresh list
      }
    } catch (error) {
      console.error("Add Comment Error:", error);
    }
  };

  // --- File Upload ---
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
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
        <div className="border-b border-slate-200 bg-slate-50/70 px-5 py-4 dark:border-white/10 dark:bg-slate-800/30 flex justify-between items-center">
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-500">Task Details</p>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">{task.title || "Untitled"}</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-6 space-y-6 custom-scrollbar">
          <form id="task-form" className="space-y-4" onSubmit={(e) => { e.preventDefault(); onSubmit(form); }}>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Title</label>
              <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full rounded-xl border p-2.5 text-sm dark:bg-slate-800 dark:border-white/10" required />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Description</label>
              <textarea rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full rounded-xl border p-2.5 text-sm dark:bg-slate-800 dark:border-white/10 resize-none" />
            </div>

            {/* Attachments Section */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 dark:bg-slate-800/20">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-xs font-bold uppercase text-slate-500 flex items-center gap-2"><Paperclip size={14}/> Attachments</h4>
                <button type="button" onClick={() => fileInputRef.current.click()} className="text-xs font-bold text-indigo-600">
                  {isUploading ? <Loader2 className="animate-spin" size={14}/> : "+ Upload"}
                </button>
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                {form.attachments.map((file, i) => (
                  <div key={i} className="flex items-center justify-between bg-white p-2 rounded border dark:bg-slate-900 dark:border-white/5">
                    <div className="flex items-center gap-2 truncate text-xs">{getFileIcon(file.type)} {file.name}</div>
                    <button type="button" onClick={() => setForm({...form, attachments: form.attachments.filter((_, idx) => idx !== i)})}><X size={14}/></button>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500">Assignee</label>
                <select value={form.assigneeId} onChange={e => setForm({...form, assigneeId: e.target.value})} className="w-full rounded-xl border p-2 text-sm dark:bg-slate-800">
                  <option value="">Unassigned</option>
                  {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500">Status</label>
                <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full rounded-xl border p-2 text-sm dark:bg-slate-800">
                  {statusOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>
          </form>

          {/* Comments Section */}
          <div className="pt-6 border-t dark:border-white/5">
            <h3 className="text-xs font-bold uppercase text-slate-500 mb-4 flex items-center gap-2"><MessageSquare size={14}/> Activity</h3>
            <div className="flex gap-3 mb-6">
              <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold">{session?.user?.name?.slice(0,2)}</div>
              <div className="flex-1 space-y-2">
                <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Add a comment..." className="w-full rounded-xl border p-3 text-sm dark:bg-slate-800/50 min-h-[80px] resize-none" />
                <button onClick={handleAddComment} disabled={!comment.trim()} className="bg-indigo-500 text-white px-4 py-1.5 rounded-lg text-xs font-bold disabled:opacity-50 flex items-center gap-2"><Send size={12}/> Post</button>
              </div>
            </div>

            <div className="space-y-4">
              {comments.map((c, i) => (
                <div key={i} className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold">{c.author?.slice(0,2)}</div>
                  <div className="flex-1 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl rounded-tl-none">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold">{c.author}</span>
                      <span className="text-[10px] text-slate-400">{formatDateTime(c.createdAt)}</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300">{c.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 bg-slate-50 px-6 py-4 dark:border-white/10 dark:bg-slate-800/50 flex justify-between items-center">
          <button onClick={() => onDelete?.(task)} className="text-sm font-bold text-rose-500 disabled:opacity-50" disabled={isBusy}>Delete Task</button>
          <div className="flex gap-3">
            <button onClick={onClose} className="text-sm font-bold text-slate-500">Cancel</button>
            <button type="submit" form="task-form" className="bg-slate-900 text-white px-6 py-2 rounded-xl text-sm font-bold dark:bg-indigo-600 disabled:opacity-50" disabled={isBusy || !form.title.trim()}>
              {submitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}