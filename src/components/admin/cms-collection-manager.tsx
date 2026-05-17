"use client";

import { useEffect, useMemo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  Loader2,
  MoreHorizontal,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import { adminApi } from "@/lib/api";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type CmsField = {
  name: string;
  label: string;
  type:
    | "text"
    | "textarea"
    | "richtext"
    | "number"
    | "checkbox"
    | "json"
    | "date"
    | "media"
    | "select"
    | "media-array";
  placeholder?: string;
  uploadFolder?: string;
  options?: { label: string; value: string }[];
  condition?: (values: Record<string, unknown>) => boolean;
  maxItems?: number;
};

type CmsCollectionManagerProps<T extends { _id: string } & Record<string, unknown>> = {
  title: string;
  description: string;
  adminPath: string;
  resourcePath: string;
  token: string;
  primaryField: keyof T & string;
  fields: CmsField[];
  createDefaults: Record<string, unknown>;
  /** Optional extra columns to show on the list table (besides the primary field). */
  columns?: Array<{
    key: keyof T & string;
    label: string;
    width?: string;
    render?: (row: T) => React.ReactNode;
  }>;
};

/* ─── MediaPreview ────────────────────────────────────────────
   Guaranteed display area for image previews. Renders a 200px-tall
   container with a dark checker-pattern backdrop so transparent PNGs
   and broken URLs both stay visually anchored. On load failure shows
   an explicit "preview failed" panel instead of the broken-icon strip
   browsers default to. */
function MediaPreview({
  src,
  alt,
  height = 200,
  fit = "contain",
  bare = false,
}: {
  src: string;
  alt: string;
  height?: number;
  fit?: "contain" | "cover";
  bare?: boolean;
}) {
  const [state, setState] = useState<"loading" | "ok" | "error">("loading");
  useEffect(() => {
    setState("loading");
  }, [src]);

  return (
    <div
      className="relative overflow-hidden"
      style={{
        height,
        background:
          "repeating-conic-gradient(rgba(255,255,255,0.04) 0% 25%, transparent 0% 50%) 0 0 / 16px 16px, var(--admin-bg, #0A0A0A)",
        border: bare ? "none" : "1px solid var(--admin-border, #262626)",
        borderRadius: bare ? 0 : "var(--radius-sm, 3px)",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        onLoad={() => setState("ok")}
        onError={() => setState("error")}
        className="block w-full h-full"
        style={{
          objectFit: fit,
          opacity: state === "ok" ? 1 : 0,
          transition: "opacity 160ms ease",
        }}
      />
      {state !== "ok" ? (
        <div className="absolute inset-0 grid place-items-center text-center px-4 pointer-events-none">
          {state === "loading" ? (
            <p
              className="admin-mono"
              style={{
                fontSize: 10.5,
                letterSpacing: "0.16em",
                color: "var(--admin-fg-dim, #6B6B6B)",
                textTransform: "uppercase",
              }}
            >
              Loading preview…
            </p>
          ) : (
            <div className="space-y-1.5">
              <p
                className="admin-mono"
                style={{
                  fontSize: 10.5,
                  letterSpacing: "0.16em",
                  color: "var(--admin-danger, #E5484D)",
                  textTransform: "uppercase",
                }}
              >
                Preview failed
              </p>
              <p
                style={{
                  fontSize: 11.5,
                  color: "var(--admin-fg-mute, #A1A1A1)",
                  maxWidth: 360,
                  wordBreak: "break-all",
                  fontFamily: "var(--admin-font-mono, ui-monospace, monospace)",
                }}
              >
                {src}
              </p>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

export function CmsCollectionManager<T extends { _id: string } & Record<string, unknown>>({
  title,
  description,
  adminPath,
  resourcePath,
  token,
  primaryField,
  fields,
  createDefaults,
  columns,
}: CmsCollectionManagerProps<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);

  const [editing, setEditing] = useState<T | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<T | null>(null);
  const [saving, setSaving] = useState(false);

  async function loadItems(showLoading = true) {
    if (showLoading) setLoading(true);
    try {
      const data = await adminApi.list<T[]>(adminPath, token);
      setItems(data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to load items.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadItems(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminPath, token]);

  // Build columns once
  const tableColumns = useMemo<ColumnDef<T>[]>(() => {
    const cols: ColumnDef<T>[] = [
      {
        id: "index",
        header: "#",
        size: 56,
        cell: ({ row }) => (
          <span className="admin-mono text-[11px] text-[var(--admin-fg-dim)]">
            {String(row.index + 1).padStart(2, "0")}
          </span>
        ),
      },
      {
        accessorKey: primaryField,
        header: ({ column }) => (
          <button
            type="button"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="inline-flex items-center gap-1.5 admin-eyebrow hover:text-[var(--admin-fg)]"
          >
            {primaryField}
            <ArrowUpDown className="h-3 w-3 opacity-50" />
          </button>
        ),
        cell: ({ row }) => (
          <span className="text-[13.5px] text-[var(--admin-fg)] font-medium truncate block max-w-[420px]">
            {String(row.original[primaryField] || "Untitled")}
          </span>
        ),
      },
    ];

    (columns || []).forEach((extra) => {
      cols.push({
        accessorKey: extra.key as string,
        header: extra.label,
        size: extra.width ? Number(String(extra.width).replace("px", "")) : undefined,
        cell: ({ row }) =>
          extra.render ? (
            extra.render(row.original)
          ) : (
            <span className="text-[13px] text-[var(--admin-fg-mute)] truncate block">
              {String(row.original[extra.key] ?? "—")}
            </span>
          ),
      });
    });

    cols.push({
      id: "status",
      header: "Status",
      size: 110,
      cell: ({ row }) => {
        const data = row.original as Record<string, unknown>;
        const isActive = data.isActive ?? data.isPublished ?? true;
        const featured = Boolean(data.isFeatured || data.featured);
        return (
          <div className="flex items-center gap-1.5">
            <span className="admin-pill" data-tone={isActive ? "success" : undefined}>
              {isActive ? "Live" : "Draft"}
            </span>
            {featured ? (
              <span className="admin-pill" data-tone="accent">★</span>
            ) : null}
          </div>
        );
      },
    });

    cols.push({
      id: "id",
      header: "ID",
      size: 130,
      cell: ({ row }) => (
        <span className="admin-mono text-[11px] text-[var(--admin-fg-dim)]">
          {String(row.original._id).slice(-10)}
        </span>
      ),
    });

    cols.push({
      id: "actions",
      header: "",
      size: 48,
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            className="grid place-items-center h-7 w-7 text-[var(--admin-fg-dim)] hover:text-[var(--admin-fg)] hover:bg-[var(--admin-surface-hover)]"
            style={{ borderRadius: "var(--radius-sm)" }}
          >
            <MoreHorizontal className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem onClick={() => setEditing(row.original)}>
              <Pencil className="h-3.5 w-3.5 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => setDeleting(row.original)}
              className="text-[var(--admin-danger)] focus:text-[var(--admin-danger)]"
            >
              <Trash2 className="h-3.5 w-3.5 mr-2" />
              Delete…
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    });

    return cols;
  }, [primaryField, columns]);

  const table = useReactTable({
    data: items,
    columns: tableColumns,
    state: { sorting, globalFilter: filter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: (row, _id, value) => {
      const v = String(value).toLowerCase();
      const fields = Object.values(row.original);
      return fields.some((f) =>
        typeof f === "string" ? f.toLowerCase().includes(v) : false
      );
    },
  });

  async function saveItem(values: Record<string, unknown>, existing: T | null) {
    setSaving(true);
    try {
      const payload = buildPayload(values, fields, createDefaults);
      if (existing?._id) {
        await adminApi.update(`${resourcePath}/${existing._id}`, token, payload);
        toast.success(`${title} updated.`);
      } else {
        await adminApi.create(resourcePath, token, payload);
        toast.success(`${title} created.`);
      }
      await loadItems(false);
      setEditing(null);
      setCreating(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleting?._id) return;
    setSaving(true);
    try {
      await adminApi.remove(`${resourcePath}/${deleting._id}`, token);
      toast.success(`${title} deleted.`);
      setDeleting(null);
      await loadItems(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Delete failed.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <header className="flex flex-col gap-1.5">
        <p className="admin-eyebrow">{adminPath.toUpperCase()}</p>
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h1
              className="text-[28px] leading-none font-semibold tracking-[-0.02em]"
              style={{ fontFamily: "var(--admin-font-display)" }}
            >
              {title}
            </h1>
            <p className="mt-2 text-[13px] text-[var(--admin-fg-mute)] max-w-[68ch] leading-[1.55]">
              {description}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => void loadItems()}
              disabled={loading}
              className="inline-flex items-center gap-2 h-9 px-3 text-[12.5px] text-[var(--admin-fg-mute)] hover:text-[var(--admin-fg)] hover:bg-[var(--admin-surface-hover)] transition-colors disabled:opacity-50"
              style={{ borderRadius: "var(--radius-sm)", border: "1px solid var(--admin-border)" }}
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <button
              type="button"
              onClick={() => setCreating(true)}
              className="inline-flex items-center gap-2 h-9 px-3.5 text-[12.5px] font-medium"
              style={{
                background: "var(--admin-accent)",
                color: "var(--admin-bg)",
                borderRadius: "var(--radius-sm)",
                boxShadow: "0 0 0 1px rgba(255,102,0,0.4)",
              }}
            >
              <Plus className="h-3.5 w-3.5" />
              New {title.toLowerCase()}
            </button>
          </div>
        </div>
      </header>

      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <div
          className="relative flex-1 max-w-[400px]"
          style={{ borderRadius: "var(--radius-sm)" }}
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--admin-fg-dim)]" />
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter records…"
            className="w-full h-9 pl-9 pr-3 text-[13px]"
          />
        </div>
        <div className="flex items-center gap-2 admin-mono text-[11px] text-[var(--admin-fg-dim)]" style={{ letterSpacing: "0.08em" }}>
          <span>{filter ? `${table.getRowModel().rows.length}/${items.length}` : `${items.length}`}</span>
          <span>RECORDS</span>
        </div>
      </div>

      {/* Table */}
      <div
        className="relative overflow-hidden"
        style={{
          background: "var(--admin-surface)",
          border: "1px solid var(--admin-border)",
          borderRadius: "var(--radius-sm)",
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left" style={{ borderCollapse: "collapse" }}>
            <thead>
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id} style={{ borderBottom: "1px solid var(--admin-border)" }}>
                  {hg.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-2.5 admin-eyebrow text-left"
                      style={{ width: header.getSize() || undefined }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={tableColumns.length} className="py-12">
                    <div className="flex items-center justify-center gap-2 text-[var(--admin-fg-dim)] text-[12.5px]">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Loading {title.toLowerCase()}…
                    </div>
                  </td>
                </tr>
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={tableColumns.length} className="py-16 text-center">
                    <p className="admin-eyebrow mb-3">empty</p>
                    <p className="text-[13.5px] text-[var(--admin-fg-mute)]">
                      {filter ? "No records match the current filter." : `No ${title.toLowerCase()} yet.`}
                    </p>
                    {!filter ? (
                      <button
                        type="button"
                        onClick={() => setCreating(true)}
                        className="mt-4 inline-flex items-center gap-1.5 text-[12.5px] text-[var(--admin-accent)] hover:underline underline-offset-4"
                      >
                        <Plus className="h-3 w-3" />
                        Create the first one
                      </button>
                    ) : null}
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => setEditing(row.original)}
                    className="cursor-pointer transition-colors hover:bg-[var(--admin-surface-hover)] group"
                    style={{ borderBottom: "1px solid var(--admin-border)" }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3 align-middle">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create dialog */}
      <Dialog open={creating} onOpenChange={(o) => !o && setCreating(false)}>
        <DialogContent
          className="!max-w-[640px] !w-[640px]"
          style={{
            background: "var(--admin-surface)",
            border: "1px solid var(--admin-border-strong)",
            borderRadius: "var(--radius-md)",
          }}
        >
          <DialogHeader>
            <p className="admin-eyebrow">{adminPath} · create</p>
            <DialogTitle
              className="text-[20px] font-semibold tracking-[-0.015em]"
              style={{ fontFamily: "var(--admin-font-display)" }}
            >
              New {title.toLowerCase()}
            </DialogTitle>
            <DialogDescription className="text-[12.5px] text-[var(--admin-fg-mute)]">
              The fastest fields to fill — the rest can be edited from the right-side sheet after create.
            </DialogDescription>
          </DialogHeader>

          <RecordForm
            mode="create"
            fields={fields.filter((f) => isQuickCreateField(f))}
            defaults={createDefaults}
            token={token}
            saving={saving}
            onSubmit={(values) => void saveItem(values, null)}
            onCancel={() => setCreating(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit sheet — half-screen on desktops, capped on giant displays. */}
      <Sheet open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <SheetContent
          side="right"
          className="!w-[50vw] !min-w-[480px] !max-w-[860px] !sm:max-w-[860px] p-0 overflow-hidden flex flex-col"
          style={{
            background: "var(--admin-surface)",
            border: 0,
            borderLeft: "1px solid var(--admin-border-strong)",
            borderRadius: 0,
          }}
        >
          <SheetHeader
            className="px-6 pt-5 pb-4"
            style={{ borderBottom: "1px solid var(--admin-border)" }}
          >
            <p className="admin-eyebrow">{adminPath} · edit</p>
            <SheetTitle
              className="text-[20px] font-semibold tracking-[-0.015em] mt-1"
              style={{ fontFamily: "var(--admin-font-display)" }}
            >
              {editing ? String(editing[primaryField] || "Untitled") : ""}
            </SheetTitle>
            <SheetDescription className="text-[12px] text-[var(--admin-fg-mute)] admin-mono" style={{ letterSpacing: "0.04em" }}>
              ID · {editing?._id}
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto">
            {editing ? (
              <RecordForm
                key={editing._id}
                mode="edit"
                fields={fields}
                defaults={editing as Record<string, unknown>}
                token={token}
                saving={saving}
                onSubmit={(values) => void saveItem(values, editing)}
                onDelete={() => {
                  setEditing(null);
                  setDeleting(editing);
                }}
                onCancel={() => setEditing(null)}
              />
            ) : null}
          </div>
        </SheetContent>
      </Sheet>

      {/* Delete confirm */}
      <AlertDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent
          style={{
            background: "var(--admin-surface)",
            border: "1px solid var(--admin-border-strong)",
            borderRadius: "var(--radius-md)",
          }}
        >
          <AlertDialogHeader>
            <p className="admin-eyebrow text-[var(--admin-danger)]">danger zone</p>
            <AlertDialogTitle
              className="text-[18px] font-semibold tracking-[-0.015em]"
              style={{ fontFamily: "var(--admin-font-display)" }}
            >
              Delete this {title.toLowerCase().replace(/s$/, "")}?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[12.5px] text-[var(--admin-fg-mute)] leading-[1.6]">
              <span className="admin-mono text-[var(--admin-fg)]">
                {deleting ? String(deleting[primaryField] || "Untitled") : ""}
              </span>{" "}
              will be permanently removed from the database. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={saving}
              className="bg-[var(--admin-danger)] text-white hover:bg-[var(--admin-danger)] hover:brightness-110"
            >
              {saving ? "Deleting…" : "Delete permanently"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

/* Quick-create whitelist — text/select/checkbox + the primary field. */
function isQuickCreateField(field: CmsField) {
  return ["text", "number", "checkbox", "select", "date"].includes(field.type);
}

function buildPayload(
  values: Record<string, unknown>,
  fields: CmsField[],
  defaults: Record<string, unknown>,
): Record<string, unknown> {
  const payload: Record<string, unknown> = {};

  fields.forEach((field) => {
    const raw = values[field.name];

    if (field.type === "json") {
      if (typeof raw === "string") {
        payload[field.name] = raw.trim() ? JSON.parse(raw) : defaults[field.name] ?? {};
      } else {
        payload[field.name] = raw ?? defaults[field.name] ?? {};
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

  // Pass-through any defaults the form didn't render (e.g., quick-create skipped these)
  Object.keys(defaults).forEach((key) => {
    if (!(key in payload)) {
      payload[key] = (values[key] !== undefined ? values[key] : defaults[key]);
    }
  });

  return payload;
}

/* ─── RecordForm ──────────────────────────────────────────────
   The inner form shown both in the Create Dialog (compact mode)
   and the Edit Sheet (full mode). */
function RecordForm({
  mode,
  fields,
  defaults,
  token,
  saving,
  onSubmit,
  onDelete,
  onCancel,
}: {
  mode: "create" | "edit";
  fields: CmsField[];
  defaults: Record<string, unknown>;
  token: string;
  saving: boolean;
  onSubmit: (values: Record<string, unknown>) => void;
  onDelete?: () => void;
  onCancel: () => void;
}) {
  const [values, setValues] = useState<Record<string, unknown>>(() => ({ ...defaults }));

  useEffect(() => {
    setValues({ ...defaults });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaults._id]);

  function update(name: string, v: unknown) {
    setValues((prev) => ({ ...prev, [name]: v }));
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(values);
      }}
      className="flex flex-col h-full"
    >
      <div
        className={`flex-1 ${mode === "edit" ? "px-6 py-5" : "px-1 py-2"} space-y-5`}
      >
        {fields.map((field) => {
          if (field.condition && !field.condition(values)) return null;
          const wide = ["textarea", "richtext", "json", "media-array"].includes(field.type);
          return (
            <div key={field.name} className={wide ? "" : "max-w-[480px]"}>
              <div className="flex items-center justify-between mb-1.5">
                <label className="admin-eyebrow">{field.label}</label>
                <span className="admin-mono text-[10px] text-[var(--admin-fg-dim)]">
                  {field.type.toUpperCase().replace("-", "·")}
                </span>
              </div>
              <FieldInput
                field={field}
                value={values[field.name]}
                token={token}
                onChange={(v) => update(field.name, v)}
              />
            </div>
          );
        })}
      </div>

      <footer
        className={`flex items-center justify-between gap-3 ${mode === "edit" ? "px-6 py-4" : "pt-4 pb-1"}`}
        style={mode === "edit" ? { borderTop: "1px solid var(--admin-border)" } : undefined}
      >
        <div>
          {onDelete ? (
            <button
              type="button"
              onClick={onDelete}
              className="inline-flex items-center gap-1.5 h-9 px-3 text-[12.5px] text-[var(--admin-danger)] hover:bg-[rgba(229,72,77,0.08)] transition-colors"
              style={{ borderRadius: "var(--radius-sm)" }}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete record
            </button>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center h-9 px-3 text-[12.5px] text-[var(--admin-fg-mute)] hover:text-[var(--admin-fg)] hover:bg-[var(--admin-surface-hover)] transition-colors"
            style={{ borderRadius: "var(--radius-sm)" }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-1.5 h-9 px-3.5 text-[12.5px] font-medium disabled:opacity-50"
            style={{
              background: "var(--admin-accent)",
              color: "var(--admin-bg)",
              borderRadius: "var(--radius-sm)",
              boxShadow: "0 0 0 1px rgba(255,102,0,0.4)",
            }}
          >
            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
            {saving ? "Saving…" : mode === "edit" ? "Save changes" : "Create"}
          </button>
        </div>
      </footer>
    </form>
  );
}

/* ─── Field input renderers ───────────────────────────────────
   Every type accepted by the existing CmsField contract — re-skinned
   for the dark, sharp aesthetic. */
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
      const uploaded = await adminApi.uploadMedia(token, file, { folder: field.uploadFolder });
      onChange(uploaded.secureUrl);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  if (field.type === "textarea") {
    return (
      <textarea
        value={String(value ?? "")}
        rows={5}
        placeholder={field.placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2.5 text-[13.5px] leading-[1.55] resize-y"
      />
    );
  }

  if (field.type === "richtext") {
    return (
      <RichTextEditor
        value={String(value ?? "")}
        onChange={onChange}
        placeholder={field.placeholder ?? "Write something compelling…"}
        token={token}
        minHeight={220}
      />
    );
  }

  if (field.type === "json") {
    return <JsonVisualEditor value={value} onChange={onChange} name={field.name} />;
  }

  if (field.type === "checkbox") {
    const checked = Boolean(value);
    return (
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className="inline-flex items-center gap-2.5 h-8 px-3 text-[12.5px] transition-colors hover:bg-[var(--admin-surface-hover)]"
        style={{
          background: checked ? "rgba(255,102,0,0.08)" : "var(--admin-bg)",
          border: `1px solid ${checked ? "var(--admin-accent)" : "var(--admin-border)"}`,
          color: checked ? "var(--admin-accent)" : "var(--admin-fg-mute)",
          borderRadius: "var(--radius-sm)",
        }}
      >
        <span
          className="grid place-items-center h-3.5 w-3.5"
          style={{
            background: checked ? "var(--admin-accent)" : "transparent",
            border: `1px solid ${checked ? "var(--admin-accent)" : "var(--admin-border-strong)"}`,
            borderRadius: "2px",
            color: "var(--admin-bg)",
          }}
        >
          {checked ? (
            <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
              <path d="M1.5 4.5L3.5 6.5L7.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : null}
        </span>
        {checked ? "Enabled" : "Disabled"}
      </button>
    );
  }

  if (field.type === "media") {
    const currentValue = String(value ?? "");
    return (
      <div className="space-y-2">
        <input
          type="text"
          value={currentValue}
          placeholder={field.placeholder || "https://…"}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-9 px-3 text-[13px]"
        />
        <div className="flex items-center gap-2">
          <label
            className="inline-flex items-center gap-1.5 h-8 px-3 text-[12px] cursor-pointer text-[var(--admin-fg-mute)] hover:text-[var(--admin-fg)] hover:bg-[var(--admin-surface-hover)] transition-colors"
            style={{ border: "1px solid var(--admin-border)", borderRadius: "var(--radius-sm)" }}
          >
            <Upload className="h-3 w-3" />
            {uploading ? "Uploading…" : "Upload to Cloudinary"}
            <input
              type="file"
              className="hidden"
              accept="image/*,video/*"
              onChange={(e) => void handleUpload(e.target.files?.[0] || null)}
              disabled={uploading}
            />
          </label>
          {currentValue ? (
            <a
              href={currentValue}
              target="_blank"
              rel="noreferrer"
              className="admin-mono text-[11px] text-[var(--admin-accent)] hover:underline underline-offset-4"
            >
              Open ↗
            </a>
          ) : null}
        </div>
        {currentValue ? <MediaPreview src={currentValue} alt={field.label} /> : null}
        {uploadError ? (
          <p className="text-[12px] text-[var(--admin-danger)]">{uploadError}</p>
        ) : null}
      </div>
    );
  }

  if (field.type === "media-array") {
    const list: string[] = Array.isArray(value) ? (value as string[]).filter(Boolean) : [];
    const maxItems = field.maxItems || Infinity;
    return (
      <div className="space-y-3">
        {list.length === 0 ? (
          <p className="text-[12px] text-[var(--admin-fg-dim)] italic">No items yet.</p>
        ) : null}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {list.map((url, idx) => (
            <div
              key={idx}
              className="relative group"
              style={{ border: "1px solid var(--admin-border)", borderRadius: "var(--radius-sm)" }}
            >
              <MediaPreview src={String(url)} alt={`Media ${idx + 1}`} height={96} fit="cover" bare />
              <button
                type="button"
                onClick={() => {
                  const next = [...list];
                  next.splice(idx, 1);
                  onChange(next);
                }}
                className="absolute top-1.5 right-1.5 grid place-items-center h-6 w-6 bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ borderRadius: "var(--radius-sm)" }}
              >
                <Trash2 className="h-3 w-3" />
              </button>
              <span className="absolute bottom-1.5 left-1.5 admin-mono text-[9.5px] text-white bg-black/60 px-1.5 py-0.5">
                {String(idx + 1).padStart(2, "0")}
              </span>
            </div>
          ))}
        </div>
        {list.length < maxItems ? (
          <label
            className="inline-flex items-center gap-1.5 h-8 px-3 text-[12px] cursor-pointer text-[var(--admin-fg-mute)] hover:text-[var(--admin-fg)] hover:bg-[var(--admin-surface-hover)] transition-colors"
            style={{ border: "1px solid var(--admin-border)", borderRadius: "var(--radius-sm)" }}
          >
            <Upload className="h-3 w-3" />
            {uploading ? "Uploading…" : `Upload image ${list.length + 1}`}
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setUploading(true);
                setUploadError("");
                adminApi
                  .uploadMedia(token, file, { folder: field.uploadFolder })
                  .then((res) => onChange([...list, res.secureUrl]))
                  .catch((err) => setUploadError(err.message))
                  .finally(() => setUploading(false));
              }}
              disabled={uploading}
            />
          </label>
        ) : null}
        {uploadError ? (
          <p className="text-[12px] text-[var(--admin-danger)]">{uploadError}</p>
        ) : null}
      </div>
    );
  }

  if (field.type === "select") {
    return (
      <select
        value={String(value ?? "")}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-9 px-3 text-[13px]"
      >
        <option value="">{field.placeholder || "Select…"}</option>
        {field.options?.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    );
  }

  return (
    <input
      type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
      value={field.type === "number" ? Number(value ?? 0) : String(value ?? "")}
      placeholder={field.placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-full h-9 px-3 text-[13px]"
    />
  );
}

/* ─── JSON visual editor — kept from the original implementation,
       re-skinned. Recursion handles arrays + objects + primitives. */
const PREDEFINED_SCHEMAS: Record<string, unknown> = {
  seo: { title: "", description: "", canonical: "", ogImage: "" },
  seoDefaults: { title: "", description: "", canonical: "", ogImage: "" },
  social: { facebook: "", instagram: "", linkedin: "", twitter: "", youtube: "", whatsapp: "" },
  address: { line1: "", line2: "", city: "", state: "", pincode: "", country: "", full: "", mapsUrl: "" },
  hero: { eyebrow: "", title: "", highlight: "", description: "", primaryCtaLabel: "", primaryCtaHref: "", secondaryCtaLabel: "", secondaryCtaHref: "" },
  stats: [{ label: "", value: "" }],
  aboutStory: [""],
  whyChooseUs: [""],
  values: [{ title: "", description: "" }],
  footerLinks: { company: [{ label: "", href: "" }], services: [{ label: "", href: "" }], legal: [{ label: "", href: "" }] },
  sectionToggles: { showClients: true, showServices: true, showCaseStudies: true, showTestimonials: true, showBlogs: true, showFaqs: true },

  services: [""],
  challenges: [""],
  solutions: [""],
  results: [""],
  points: [""],
  metrics: [{ label: "", value: "" }],
  gallery: [""],
  testimonial: { text: "", author: "", role: "" },

  tags: [""],
  features: [""],
  process: [{ step: "", desc: "" }],
  outcomes: [""],
  faqs: [{ question: "", answer: "" }],
  detailContent: { heroEyebrow: "", overviewTitle: "", partnerTitle: "", partnerDescription: "", bestFitTitle: "", bestFitDescription: "", capabilitiesTitle: "", processTitle: "", faqTitle: "", deliveryLabel: "", deliveryDescription: "" },
  skills: [""],
};

function getEmptySchema(name: string): unknown {
  const schema = PREDEFINED_SCHEMAS[name];
  if (!schema) return name.endsWith("s") ? [] : {};
  return JSON.parse(JSON.stringify(schema));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function SchemaNode({ template, value, onChange, label, name }: { template: any; value: any; onChange: (v: any) => void; label?: string; name: string }) {
  if (Array.isArray(template)) {
    const isStringArray = typeof template[0] === "string";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const actualArray: any[] = Array.isArray(value) ? value : [];
    return (
      <div
        className="space-y-2 p-3"
        style={{
          background: "var(--admin-bg)",
          border: "1px solid var(--admin-border)",
          borderRadius: "var(--radius-sm)",
        }}
      >
        {label && (
          <p className="admin-eyebrow capitalize">{label.replace(/([A-Z])/g, " $1").trim()}</p>
        )}
        {actualArray.map((item, idx) => (
          <div
            key={idx}
            className="relative p-3 pr-9 space-y-2"
            style={{
              background: "var(--admin-surface)",
              border: "1px solid var(--admin-border)",
              borderRadius: "var(--radius-sm)",
            }}
          >
            <p className="admin-mono text-[10px] text-[var(--admin-fg-dim)]" style={{ letterSpacing: "0.1em" }}>
              ITEM {String(idx + 1).padStart(2, "0")}
            </p>
            {isStringArray ? (
              <textarea
                rows={2}
                value={String(item || "")}
                onChange={(e) => {
                  const next = [...actualArray];
                  next[idx] = e.target.value;
                  onChange(next);
                }}
                className="w-full px-2.5 py-2 text-[13px] resize-y"
              />
            ) : (
              <div className="grid gap-2.5">
                {Object.keys(template[0]).map((key) => {
                  const childVal = typeof item === "object" && item !== null ? item[key] : "";
                  return (
                    <SchemaNode
                      key={key}
                      name={key}
                      label={key}
                      template={template[0][key]}
                      value={childVal}
                      onChange={(newVal) => {
                        const next = [...actualArray];
                        next[idx] = { ...(next[idx] || {}), [key]: newVal };
                        onChange(next);
                      }}
                    />
                  );
                })}
              </div>
            )}
            <button
              type="button"
              onClick={() => {
                const next = [...actualArray];
                next.splice(idx, 1);
                onChange(next);
              }}
              className="absolute top-2 right-2 grid place-items-center h-6 w-6 text-[var(--admin-fg-dim)] hover:text-[var(--admin-danger)] hover:bg-[var(--admin-surface-hover)] transition-colors"
              style={{ borderRadius: "var(--radius-sm)" }}
              title="Remove"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...actualArray, isStringArray ? "" : JSON.parse(JSON.stringify(template[0]))])}
          className="inline-flex items-center gap-1.5 h-7 px-2.5 text-[11.5px] text-[var(--admin-fg-mute)] hover:text-[var(--admin-accent)] hover:bg-[var(--admin-surface-hover)] transition-colors"
          style={{ border: "1px dashed var(--admin-border-strong)", borderRadius: "var(--radius-sm)" }}
        >
          <Plus className="h-3 w-3" />
          Add item
        </button>
      </div>
    );
  }

  if (typeof template === "object" && template !== null) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const actualObject: Record<string, any> = typeof value === "object" && value !== null && !Array.isArray(value) ? value : {};
    return (
      <div
        className="p-3 space-y-2.5"
        style={{
          background: "var(--admin-bg)",
          border: "1px solid var(--admin-border)",
          borderRadius: "var(--radius-sm)",
        }}
      >
        {label && (
          <p className="admin-eyebrow capitalize">{label.replace(/([A-Z])/g, " $1").trim()}</p>
        )}
        {Object.keys(template).map((key) => {
          const val = actualObject[key];
          return (
            <SchemaNode
              key={key}
              name={key}
              label={key}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              template={(template as any)[key]}
              value={val}
              onChange={(newVal) => onChange({ ...actualObject, [key]: newVal })}
            />
          );
        })}
      </div>
    );
  }

  const defaultType = typeof template;
  const lines = typeof value === "string" && (value.length > 50 || name.toLowerCase().includes("description") || name.toLowerCase().includes("story")) ? 3 : 1;

  return (
    <label className="block space-y-1.5">
      {label ? (
        <span className="admin-eyebrow capitalize" style={{ display: "block" }}>
          {label.replace(/([A-Z])/g, " $1").trim()}
        </span>
      ) : null}
      {lines > 1 ? (
        <textarea
          rows={lines}
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-2.5 py-2 text-[13px] resize-y"
        />
      ) : (
        <input
          type={defaultType === "boolean" ? "checkbox" : "text"}
          checked={defaultType === "boolean" ? Boolean(value) : undefined}
          value={defaultType !== "boolean" ? String(value ?? "") : undefined}
          onChange={(e) => {
            const newValue = defaultType === "boolean" ? e.target.checked : e.target.value;
            onChange(newValue);
          }}
          className={
            defaultType === "boolean"
              ? "h-4 w-4 accent-[var(--admin-accent)]"
              : "w-full h-8 px-2.5 text-[13px]"
          }
        />
      )}
    </label>
  );
}

export function JsonVisualEditor({ value, onChange, name }: { value: unknown; onChange: (v: unknown) => void; name: string }) {
  let parsed = value;
  if (typeof value === "string") {
    try {
      parsed = value.trim() === "" ? getEmptySchema(name) : JSON.parse(value);
    } catch {
      parsed = getEmptySchema(name);
    }
  }
  if (parsed === null || parsed === undefined) {
    parsed = getEmptySchema(name);
  }

  const template = PREDEFINED_SCHEMAS[name] || (Array.isArray(parsed) ? [{}] : {});
  return <SchemaNode name={name} template={template} value={parsed} onChange={onChange} />;
}
