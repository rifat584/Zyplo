"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { Save } from "lucide-react";
import { toast } from "sonner";
import {
  loadDashboard,
  updateProfile,
  useMockStore,
} from "@/components/dashboard/mockStore";
import { Button } from "@/components/ui/button";

const PROFILE_COMPLETION_FIELDS = [
  "fullName",
  "phone",
  "roleTitle",
  "company",
  "location",
  "website",
  "avatarUrl",
  "bio",
];

const labelClass = "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground";
const inputClass =
  "h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-primary/40 dark:border-white/10 dark:bg-surface";
const textareaClass =
  "w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary/40 dark:border-white/10 dark:bg-surface";
const fileInputClass =
  "block w-full cursor-pointer rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground file:mr-3 file:rounded-lg file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-primary hover:file:bg-primary/15 disabled:opacity-50 dark:border-white/10 dark:bg-surface";

export default function DashboardProfilePage() {
  const { data: session } = useSession();
  const { currentUser, loaded } = useMockStore((state) => ({
    currentUser: state.currentUser || null,
    loaded: Boolean(state.loaded),
  }));
  const email = currentUser?.email || session?.user?.email || "";

  const defaultValues = useMemo(
    () => ({
      fullName: currentUser?.name || session?.user?.name || "",
      phone: currentUser?.phone || "",
      roleTitle: currentUser?.roleTitle || "",
      company: currentUser?.company || "",
      location: currentUser?.location || "",
      website: currentUser?.website || "",
      avatarUrl: currentUser?.avatarUrl || "",
      bio: currentUser?.bio || "",
    }),
    [
      currentUser?.name,
      currentUser?.phone,
      currentUser?.roleTitle,
      currentUser?.company,
      currentUser?.location,
      currentUser?.website,
      currentUser?.avatarUrl,
      currentUser?.bio,
      session?.user?.name,
    ],
  );

  const [form, setForm] = useState(defaultValues);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const completion = Math.round(
    (PROFILE_COMPLETION_FIELDS.filter((key) => String(form?.[key] || "").trim())
      .length /
      PROFILE_COMPLETION_FIELDS.length) *
      100,
  );
  const profileInitials = useMemo(() => {
    const source = String(form.fullName || email || "User").trim();
    if (!source) return "U";
    return source
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("");
  }, [email, form.fullName]);

  useEffect(() => {
    if (!loaded) {
      loadDashboard({ force: true, silent: true }).catch(() => {});
    }
  }, [loaded]);

  useEffect(() => {
    setForm(defaultValues);
  }, [defaultValues]);

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave(event) {
    event.preventDefault();
    try {
      setSaving(true);
      await updateProfile({
        name: form.fullName,
        phone: form.phone,
        roleTitle: form.roleTitle,
        company: form.company,
        location: form.location,
        website: form.website,
        avatarUrl: form.avatarUrl,
        bio: form.bio,
      });
      toast.success("Profile updated");
    } catch (error) {
      toast.error(error?.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  }

  async function handleAvatarFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploadingAvatar(true);
      const payload = new FormData();
      payload.append("image", file);

      const response = await fetch("/api/upload/image", {
        method: "POST",
        body: payload,
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error || "Failed to upload image");
      }

      updateField("avatarUrl", data?.url || "");
      toast.success("Image uploaded");
    } catch (error) {
      toast.error(error?.message || "Failed to upload image");
    } finally {
      event.target.value = "";
      setUploadingAvatar(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl pt-3 sm:pt-4 md:pt-6">
      <form
        onSubmit={handleSave}
        className="space-y-5 rounded-2xl border border-border bg-card p-4 shadow-sm dark:border-white/10 sm:p-5"
      >
        <div className="flex flex-col gap-3 border-b border-border pb-4 dark:border-white/10 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Profile</h1>
            <p className="text-sm text-muted-foreground">
              Manage the personal details your workspace sees.
            </p>
          </div>

          <div className="w-full sm:max-w-52">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="font-medium text-muted-foreground">Completion</span>
              <span className="font-semibold text-primary">{completion}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${Math.max(0, Math.min(completion, 100))}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-b border-border py-4 dark:border-white/10 md:flex-row md:items-start">
          <div className="flex items-center gap-3 md:w-64 md:shrink-0">
            {form.avatarUrl ? (
              <img
                src={form.avatarUrl}
                alt="Profile preview"
                className="size-14 rounded-2xl border border-border object-cover dark:border-white/10"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="flex size-14 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-sm font-semibold text-primary dark:border-primary/20">
                {profileInitials}
              </div>
            )}

            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">
                {form.fullName || "Your profile"}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {email || "No email available"}
              </p>
            </div>
          </div>

          <div className="grid flex-1 gap-4 md:grid-cols-2">
            <div>
              <label className={labelClass}>Upload image</label>
              <div>
                <input
                  type="file"
                  accept="image/*"
                  disabled={uploadingAvatar}
                  onChange={handleAvatarFileChange}
                  className={fileInputClass}
                />
                <p className="mt-2 text-xs text-muted-foreground">
                  {uploadingAvatar
                    ? "Uploading image..."
                    : "Choose an image file to upload and set as avatar."}
                </p>
              </div>
            </div>

            <div>
              <label className={labelClass}>Avatar URL</label>
              <input
                value={form.avatarUrl}
                onChange={(event) => updateField("avatarUrl", event.target.value)}
                className={inputClass}
                placeholder="https://image..."
              />
            </div>
          </div>
        </div>

        <div className="grid gap-4 py-4 md:grid-cols-2">
          <div>
            <label className={labelClass}>Full Name</label>
            <input
              value={form.fullName}
              onChange={(event) => updateField("fullName", event.target.value)}
              className={inputClass}
              placeholder="Your full name"
            />
          </div>

          <div>
            <label className={labelClass}>Email</label>
            <input
              value={email}
              disabled
              className="h-10 w-full cursor-not-allowed rounded-xl border border-border bg-muted/70 px-3 text-sm text-muted-foreground dark:border-white/10 dark:bg-surface/60"
              placeholder="Email"
            />
          </div>

          <div>
            <label className={labelClass}>Phone</label>
            <input
              value={form.phone}
              onChange={(event) => updateField("phone", event.target.value)}
              className={inputClass}
              placeholder="+880..."
            />
          </div>

          <div>
            <label className={labelClass}>Location</label>
            <input
              value={form.location}
              onChange={(event) => updateField("location", event.target.value)}
              className={inputClass}
              placeholder="Dhaka, Bangladesh"
            />
          </div>

          <div>
            <label className={labelClass}>Role Title</label>
            <input
              value={form.roleTitle}
              onChange={(event) => updateField("roleTitle", event.target.value)}
              className={inputClass}
              placeholder="Product Manager"
            />
          </div>

          <div>
            <label className={labelClass}>Company</label>
            <input
              value={form.company}
              onChange={(event) => updateField("company", event.target.value)}
              className={inputClass}
              placeholder="Zyplo Inc."
            />
          </div>

          <div>
            <label className={labelClass}>Website</label>
            <input
              value={form.website}
              onChange={(event) => updateField("website", event.target.value)}
              className={inputClass}
              placeholder="https://..."
            />
          </div>

          <div className="md:col-span-2">
            <label className={labelClass}>Bio</label>
            <textarea
              rows={5}
              value={form.bio}
              onChange={(event) => updateField("bio", event.target.value)}
              className={textareaClass}
              placeholder="Tell your team about yourself..."
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-border pt-4 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            Changes update your workspace profile details.
          </p>

          <Button type="submit" disabled={saving} className="w-full sm:w-auto">
            <Save className="size-4" />
            {saving ? "Saving..." : "Save Profile"}
          </Button>
        </div>
      </form>
    </div>
  );
}
