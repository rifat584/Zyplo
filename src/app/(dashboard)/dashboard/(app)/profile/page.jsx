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
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border pb-4 dark:border-white/10">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Profile
          </h1>
          <p className="text-sm text-muted-foreground dark:text-muted-foreground">
            Update your personal information.
          </p>
        </div>
        <div className="min-w-40 rounded-lg border border-border bg-white p-2 dark:border-white/10 dark:bg-card">
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="font-medium text-muted-foreground">
              Profile completion
            </span>
            <span className="font-semibold text-primary dark:text-primary">
              {completion}%
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-muted dark:bg-slate-700">
            <div
              className="h-full rounded-full bg-primary/100 transition-all"
              style={{ width: `${Math.max(0, Math.min(completion, 100))}%` }}
            />
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSave}
        className="space-y-5 rounded-2xl border border-border bg-white p-5 dark:border-white/10 dark:bg-card"
      >
        <section className="rounded-xl border border-border p-3 dark:border-white/10">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Profile Image
          </p>
          <div className="mt-2 flex items-center gap-3">
            {form.avatarUrl ? (
              <img
                src={form.avatarUrl}
                alt="Profile preview"
                className="size-14 rounded-full border border-border object-cover dark:border-white/10"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="flex size-14 items-center justify-center rounded-full border border-border bg-muted text-xs text-muted-foreground dark:border-white/10 dark:bg-surface dark:text-muted-foreground text-center">
                No image
              </div>
            )}
            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                disabled={uploadingAvatar}
                onChange={handleAvatarFileChange}
                className="block w-full cursor-pointer rounded-lg border border-border bg-white px-3 py-2 text-sm text-foreground file:mr-3 file:rounded-md file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-primary hover:file:bg-primary/10 disabled:opacity-50 dark:border-white/10 dark:bg-surface dark:text-foreground dark:file:bg-primary/100/20 dark:file:text-primary"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                {uploadingAvatar
                  ? "Uploading image..."
                  : "Choose an image file to upload and set as avatar."}
              </p>
            </div>
          </div>
        </section>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Full Name
            </label>
            <input
              value={form.fullName}
              onChange={(event) => updateField("fullName", event.target.value)}
              className="h-10 w-full rounded-lg border border-border bg-white px-3 text-sm outline-none focus:border-primary/30 dark:border-white/10 dark:bg-surface dark:text-foreground"
              placeholder="Your full name"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Email
            </label>
            <input
              value={email}
              disabled
              className="h-10 w-full cursor-not-allowed rounded-lg border border-border bg-muted px-3 text-sm text-muted-foreground dark:border-white/10 dark:bg-surface/60 dark:text-muted-foreground"
              placeholder="Email"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Phone
            </label>
            <input
              value={form.phone}
              onChange={(event) => updateField("phone", event.target.value)}
              className="h-10 w-full rounded-lg border border-border bg-white px-3 text-sm outline-none focus:border-primary/30 dark:border-white/10 dark:bg-surface dark:text-foreground"
              placeholder="+880..."
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Role Title
            </label>
            <input
              value={form.roleTitle}
              onChange={(event) => updateField("roleTitle", event.target.value)}
              className="h-10 w-full rounded-lg border border-border bg-white px-3 text-sm outline-none focus:border-primary/30 dark:border-white/10 dark:bg-surface dark:text-foreground"
              placeholder="Product Manager"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Company
            </label>
            <input
              value={form.company}
              onChange={(event) => updateField("company", event.target.value)}
              className="h-10 w-full rounded-lg border border-border bg-white px-3 text-sm outline-none focus:border-primary/30 dark:border-white/10 dark:bg-surface dark:text-foreground"
              placeholder="Zyplo Inc."
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Location
            </label>
            <input
              value={form.location}
              onChange={(event) => updateField("location", event.target.value)}
              className="h-10 w-full rounded-lg border border-border bg-white px-3 text-sm outline-none focus:border-primary/30 dark:border-white/10 dark:bg-surface dark:text-foreground"
              placeholder="Dhaka, Bangladesh"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Website
            </label>
            <input
              value={form.website}
              onChange={(event) => updateField("website", event.target.value)}
              className="h-10 w-full rounded-lg border border-border bg-white px-3 text-sm outline-none focus:border-primary/30 dark:border-white/10 dark:bg-surface dark:text-foreground"
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Avatar URL
            </label>
            <input
              value={form.avatarUrl}
              onChange={(event) => updateField("avatarUrl", event.target.value)}
              className="h-10 w-full rounded-lg border border-border bg-white px-3 text-sm outline-none focus:border-primary/30 dark:border-white/10 dark:bg-surface dark:text-foreground"
              placeholder="https://image..."
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Bio
          </label>
          <textarea
            rows={5}
            value={form.bio}
            onChange={(event) => updateField("bio", event.target.value)}
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary/30 dark:border-white/10 dark:bg-surface dark:text-foreground"
            placeholder="Tell your team about yourself..."
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-primary/100 px-4 py-2 text-sm font-medium text-white hover:bg-primary disabled:opacity-50"
          >
            <Save className="size-4" />
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}
