"use client";

import { useEffect, useMemo, useState } from "react";
import { adminApi } from "@/lib/api";

export type CmsField = {
  name: string;
  label: string;
  type: "text" | "textarea" | "number" | "checkbox" | "json" | "date" | "media";
  placeholder?: string;
  uploadFolder?: string;
};

type CmsCollectionManagerProps<T extends Record<string, any>> = {
  title: string;
  description: string;
  adminPath: string;
  resourcePath: string;
  token: string;
  primaryField: keyof T & string;
  fields: CmsField[];
  createDefaults: Record<string, unknown>;
};

export function CmsCollectionManager<T extends Record<string, any>>({
  title,
  description,
  adminPath,
  resourcePath,
  token,
  primaryField,
  fields,
  createDefaults,
}: CmsCollectionManagerProps<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<Record<string, unknown>>(createDefaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const selectedItem = useMemo(
    () => items.find((item) => item._id === selectedId),
    [items, selectedId],
  );

  async function loadItems() {
    setLoading(true);
    setError("");
    try {
      const data = await adminApi.list<T[]>(adminPath, token);
      setItems(data);
      if (!selectedId && data[0]?._id) {
        setSelectedId(data[0]._id);
      }
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load items.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadItems();
  }, [adminPath, token]);

  useEffect(() => {
    if (selectedItem) {
      setFormValues(selectedItem);
      setNotice("");
      setError("");
    } else {
      setFormValues(createDefaults);
    }
  }, [selectedItem, createDefaults]);

  function updateField(name: string, value: unknown) {
    setFormValues((current) => ({ ...current, [name]: value }));
  }

  function buildPayload() {
    const payload: Record<string, unknown> = {};

    fields.forEach((field) => {
      const raw = formValues[field.name];

      if (field.type === "json") {
        if (typeof raw === "string") {
          payload[field.name] = raw.trim()
            ? JSON.parse(raw)
            : createDefaults[field.name] ?? {};
        } else {
          payload[field.name] = raw ?? createDefaults[field.name] ?? {};
        }
        return;
      }

      if (field.type === "number") {
        payload[field.name] = raw === "" || raw === undefined ? 0 : Number(raw);
        return;
      }

      if (field.type === "checkbox") {
        payload[field.name] = Boolean(raw);
        return;
      }

      payload[field.name] = raw ?? "";
    });

    return payload;
  }

  async function saveItem() {
    setSaving(true);
    setError("");
    setNotice("");

    try {
      const payload = buildPayload();

      if (selectedItem?._id) {
        await adminApi.update(`${resourcePath}/${selectedItem._id}`, token, payload);
        setNotice(`${title} item updated.`);
      } else {
        await adminApi.create(resourcePath, token, payload);
        setNotice(`${title} item created.`);
      }

      await loadItems();
    } catch (saveError) {
      setError(
        saveError instanceof Error ? saveError.message : "We could not save this item.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteItem() {
    if (!selectedItem?._id) return;

    const confirmed = window.confirm("Delete this item?");
    if (!confirmed) return;

    setSaving(true);
    setError("");
    setNotice("");

    try {
      await adminApi.remove(`${resourcePath}/${selectedItem._id}`, token);
      setSelectedId(null);
      setFormValues(createDefaults);
      setNotice(`${title} item deleted.`);
      await loadItems();
    } catch (deleteError) {
      setError(
        deleteError instanceof Error ? deleteError.message : "We could not delete this item.",
      );
    } finally {
      setSaving(false);
    }
  }

  function startNew() {
    setSelectedId(null);
    setFormValues(createDefaults);
    setNotice("");
    setError("");
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
      <aside className="rounded-3xl border bg-white p-5 shadow-sm">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-slate-950">{title}</h2>
          <p className="mt-2 text-sm text-slate-500">{description}</p>
        </div>
        <button onClick={startNew} className="btn-primary w-full justify-center">
          New Item
        </button>
        <div className="mt-5 space-y-2">
          {loading ? (
            <p className="text-sm text-slate-500">Loading...</p>
          ) : (
            items.map((item) => (
              <button
                key={item._id}
                onClick={() => setSelectedId(item._id)}
                className={`w-full rounded-2xl border px-4 py-3 text-left text-sm transition ${
                  selectedId === item._id
                    ? "border-orange-200 bg-orange-50 text-slate-900"
                    : "border-slate-200 bg-white text-slate-600"
                }`}
              >
                {String(item[primaryField] || "Untitled")}
              </button>
            ))
          )}
        </div>
      </aside>

      <section className="rounded-3xl border bg-white p-6 shadow-sm">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-2xl font-bold text-slate-950">
              {selectedItem ? "Edit Item" : "Create Item"}
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              JSON fields expect valid JSON arrays or objects.
            </p>
          </div>
          <div className="flex gap-3">
            {selectedItem ? (
              <button
                onClick={deleteItem}
                disabled={saving}
                className="rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-600"
              >
                Delete
              </button>
            ) : null}
            <button onClick={saveItem} disabled={saving} className="btn-primary">
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>

        {error ? <p className="mb-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}
        {notice ? <p className="mb-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{notice}</p> : null}

        <div className="grid gap-4 md:grid-cols-2">
          {fields.map((field) => (
            <label
              key={field.name}
              className={`space-y-2 text-sm font-medium text-slate-700 ${
                field.type === "textarea" || field.type === "json" ? "md:col-span-2" : ""
              }`}
            >
              <span>{field.label}</span>
              <FieldInput
                field={field}
                value={formValues[field.name]}
                token={token}
                onChange={(value) => updateField(field.name, value)}
              />
            </label>
          ))}
        </div>
      </section>
    </div>
  );
}

function FieldInput({
  field,
  value,
  token,
  onChange,
}: {
  field: CmsField;
  value: unknown;
  token: string;
  onChange: (value: unknown) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  async function handleUpload(file: File | null) {
    if (!file) return;

    setUploading(true);
    setUploadError("");

    try {
      const uploaded = await adminApi.uploadMedia(token, file, {
        folder: field.uploadFolder,
      });
      onChange(uploaded.secureUrl);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  if (field.type === "textarea" || field.type === "json") {
    return (
      <>
        <textarea
          value={
            field.type === "json"
              ? typeof value === "string"
                ? value
                : JSON.stringify(value ?? (field.name.endsWith("s") ? [] : {}), null, 2)
              : String(value ?? "")
          }
          rows={field.type === "json" ? 10 : 6}
          placeholder={field.placeholder}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-orange-300"
        />
      </>
    );
  }

  if (field.type === "checkbox") {
    return (
      <input
        type="checkbox"
        checked={Boolean(value)}
        onChange={(event) => onChange(event.target.checked)}
        className="h-5 w-5 rounded border-slate-300"
      />
    );
  }

  if (field.type === "media") {
    const currentValue = String(value ?? "");

    return (
      <div className="space-y-3">
        <input
          type="text"
          value={currentValue}
          placeholder={field.placeholder || "https://..."}
          onChange={(event) => onChange(event.target.value)}
          className="h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none focus:border-orange-300"
        />
        <div className="flex flex-wrap items-center gap-3">
          <label className="inline-flex cursor-pointer items-center rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-orange-200 hover:text-orange-700">
            {uploading ? "Uploading..." : "Upload to Cloudinary"}
            <input
              type="file"
              className="hidden"
              accept="image/*,video/*"
              onChange={(event) => void handleUpload(event.target.files?.[0] || null)}
              disabled={uploading}
            />
          </label>
          {currentValue ? (
            <a
              href={currentValue}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium text-[var(--brand-700)] underline-offset-4 hover:underline"
            >
              Open media
            </a>
          ) : null}
        </div>
        {currentValue ? (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-2">
            <img
              src={currentValue}
              alt={field.label}
              className="h-40 w-full rounded-xl object-cover"
            />
          </div>
        ) : null}
        {uploadError ? (
          <p className="text-sm text-rose-600">{uploadError}</p>
        ) : null}
      </div>
    );
  }

  return (
    <input
      type={field.type}
      value={field.type === "number" ? Number(value ?? 0) : String(value ?? "")}
      placeholder={field.placeholder}
      onChange={(event) => onChange(event.target.value)}
      className="h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none focus:border-orange-300"
    />
  );
}
