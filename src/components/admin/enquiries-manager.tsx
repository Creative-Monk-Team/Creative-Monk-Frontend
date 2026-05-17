"use client";

import { useEffect, useMemo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { Loader2, Mail, MessageSquareMore, MoreHorizontal, Phone, RefreshCw, Search } from "lucide-react";
import { toast } from "sonner";
import { adminApi } from "@/lib/api";
import type { Enquiry } from "@/lib/types";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const STATUS_TONES: Record<Enquiry["status"], string> = {
  new: "accent",
  "in-progress": "warning",
  responded: "success",
  archived: "info",
};

const STATUS_LABELS: Record<Enquiry["status"], string> = {
  new: "New",
  "in-progress": "In progress",
  responded: "Responded",
  archived: "Archived",
};

export function EnquiriesManager({ token }: { token: string }) {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [editing, setEditing] = useState<Enquiry | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | Enquiry["status"]>("all");

  async function loadEnquiries(showLoading = true) {
    if (showLoading) setLoading(true);
    try {
      const data = await adminApi.list<Enquiry[]>("enquiries", token);
      setEnquiries(data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unable to load enquiries.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadEnquiries(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function updateEnquiry(id: string, updates: Partial<Enquiry>) {
    try {
      await adminApi.update(`enquiries/${id}`, token, updates, "PATCH");
      toast.success("Enquiry updated.");
      await loadEnquiries(false);
      // refresh editing state with latest copy
      setEditing((prev) => prev ? { ...prev, ...updates } : prev);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed.");
    }
  }

  const filtered = useMemo(() => {
    return enquiries.filter((e) =>
      statusFilter === "all" ? true : e.status === statusFilter
    );
  }, [enquiries, statusFilter]);

  const counts = useMemo(() => {
    const c: Record<Enquiry["status"], number> = {
      new: 0,
      "in-progress": 0,
      responded: 0,
      archived: 0,
    };
    enquiries.forEach((e) => {
      c[e.status] = (c[e.status] || 0) + 1;
    });
    return c;
  }, [enquiries]);

  const columns = useMemo<ColumnDef<Enquiry>[]>(
    () => [
      {
        id: "index",
        header: "#",
        size: 48,
        cell: ({ row }) => (
          <span className="admin-mono text-[11px] text-[var(--admin-fg-dim)]">
            {String(row.index + 1).padStart(2, "0")}
          </span>
        ),
      },
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
          <div>
            <p className="text-[13.5px] font-medium text-[var(--admin-fg)] truncate">
              {row.original.name}
            </p>
            <p className="admin-mono text-[11px] text-[var(--admin-fg-dim)] truncate" style={{ letterSpacing: "0.02em" }}>
              {row.original.email}
            </p>
          </div>
        ),
      },
      {
        accessorKey: "service",
        header: "Service",
        cell: ({ row }) => (
          <span className="text-[12.5px] text-[var(--admin-fg-mute)]">
            {row.original.service || "—"}
          </span>
        ),
      },
      {
        id: "message",
        header: "Message",
        cell: ({ row }) => (
          <p className="text-[12.5px] text-[var(--admin-fg-mute)] line-clamp-1 max-w-[360px]">
            {row.original.message}
          </p>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        size: 130,
        cell: ({ row }) => (
          <span
            className="admin-pill"
            data-tone={STATUS_TONES[row.original.status]}
          >
            {STATUS_LABELS[row.original.status]}
          </span>
        ),
      },
      {
        id: "created",
        header: "Created",
        size: 110,
        cell: ({ row }) => (
          <span className="admin-mono text-[11px] text-[var(--admin-fg-dim)]">
            {row.original.createdAt
              ? new Date(row.original.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })
              : "—"}
          </span>
        ),
      },
      {
        id: "actions",
        header: "",
        size: 44,
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
                <MessageSquareMore className="h-3.5 w-3.5 mr-2" />
                Open
              </DropdownMenuItem>
              {(["new", "in-progress", "responded", "archived"] as const).map((s) =>
                row.original.status !== s ? (
                  <DropdownMenuItem
                    key={s}
                    onClick={() => void updateEnquiry(row.original._id, { status: s })}
                  >
                    Mark · {STATUS_LABELS[s]}
                  </DropdownMenuItem>
                ) : null
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const table = useReactTable({
    data: filtered,
    columns,
    state: { globalFilter: filter },
    onGlobalFilterChange: setFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: (row, _id, value) => {
      const v = String(value).toLowerCase();
      const fields = [row.original.name, row.original.email, row.original.message, row.original.service]
        .filter(Boolean)
        .map(String);
      return fields.some((f) => f.toLowerCase().includes(v));
    },
  });

  return (
    <div className="space-y-5">
      {/* Status tabs */}
      <div
        className="grid grid-cols-2 md:grid-cols-4"
        style={{ background: "var(--admin-border)", gap: 1 }}
      >
        {(["all", "new", "in-progress", "responded", "archived"] as const)
          .filter((s, idx) => idx === 0 || counts[s as Enquiry["status"]] !== undefined)
          .map((s) => {
            const active = statusFilter === s;
            const value = s === "all" ? enquiries.length : counts[s as Enquiry["status"]] || 0;
            const label = s === "all" ? "All" : STATUS_LABELS[s as Enquiry["status"]];
            return (
              <button
                key={s}
                type="button"
                onClick={() => setStatusFilter(s)}
                className="p-4 text-left transition-colors hover:bg-[var(--admin-surface-hover)] group"
                style={{ background: "var(--admin-surface)" }}
              >
                <div className="flex items-center justify-between">
                  <p className="admin-eyebrow" style={{ color: active ? "var(--admin-accent)" : undefined }}>
                    {label}
                  </p>
                  {active ? <span className="admin-pill" data-tone="accent">filter</span> : null}
                </div>
                <p
                  className="mt-3 text-[28px] leading-none font-semibold admin-tnum"
                  style={{
                    fontFamily: "var(--admin-font-display)",
                    color: active ? "var(--admin-accent)" : "var(--admin-fg)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {value}
                </p>
              </button>
            );
          })}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-[400px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--admin-fg-dim)]" />
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter by name, email, message…"
            className="w-full h-9 pl-9 pr-3 text-[13px]"
          />
        </div>
        <button
          type="button"
          onClick={() => void loadEnquiries()}
          disabled={loading}
          className="inline-flex items-center gap-2 h-9 px-3 text-[12.5px] text-[var(--admin-fg-mute)] hover:text-[var(--admin-fg)] hover:bg-[var(--admin-surface-hover)] transition-colors disabled:opacity-50"
          style={{ borderRadius: "var(--radius-sm)", border: "1px solid var(--admin-border)" }}
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Table */}
      <div
        className="overflow-hidden"
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
                      className="px-4 py-2.5 admin-eyebrow"
                      style={{ width: header.getSize() || undefined }}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={columns.length} className="py-12">
                    <div className="flex items-center justify-center gap-2 text-[var(--admin-fg-dim)] text-[12.5px]">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Loading enquiries…
                    </div>
                  </td>
                </tr>
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="py-16 text-center">
                    <p className="admin-eyebrow mb-3">empty</p>
                    <p className="text-[13.5px] text-[var(--admin-fg-mute)]">
                      {filter ? "No records match the current filter." : "No enquiries yet."}
                    </p>
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => setEditing(row.original)}
                    className="cursor-pointer transition-colors hover:bg-[var(--admin-surface-hover)]"
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

      {/* Detail sheet */}
      <Sheet open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <SheetContent
          side="right"
          className="!w-[50vw] !min-w-[480px] !max-w-[760px] !sm:max-w-[760px] p-0 overflow-hidden flex flex-col"
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
            <p className="admin-eyebrow">enquiry · detail</p>
            <SheetTitle
              className="text-[22px] font-semibold tracking-[-0.015em] mt-1"
              style={{ fontFamily: "var(--admin-font-display)" }}
            >
              {editing?.name || ""}
            </SheetTitle>
            <SheetDescription className="text-[12px] text-[var(--admin-fg-mute)] admin-mono" style={{ letterSpacing: "0.04em" }}>
              ID · {editing?._id}
            </SheetDescription>
          </SheetHeader>

          {editing ? (
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              {/* Contact bar */}
              <div className="space-y-2">
                <p className="admin-eyebrow">contact</p>
                <div className="grid gap-px" style={{ background: "var(--admin-border)" }}>
                  <ContactRow
                    icon={<Mail className="h-3.5 w-3.5" />}
                    label="email"
                    value={editing.email}
                    href={`mailto:${editing.email}`}
                  />
                  {editing.phone ? (
                    <ContactRow
                      icon={<Phone className="h-3.5 w-3.5" />}
                      label="phone"
                      value={editing.phone}
                      href={`tel:${editing.phone}`}
                    />
                  ) : null}
                  {editing.service ? (
                    <ContactRow
                      icon={<MessageSquareMore className="h-3.5 w-3.5" />}
                      label="service"
                      value={editing.service}
                    />
                  ) : null}
                </div>
              </div>

              {/* Message */}
              <div className="space-y-2">
                <p className="admin-eyebrow">message</p>
                <div
                  className="p-4 text-[13.5px] leading-[1.65] text-[var(--admin-fg)]"
                  style={{
                    background: "var(--admin-bg)",
                    border: "1px solid var(--admin-border)",
                    borderRadius: "var(--radius-sm)",
                  }}
                >
                  {editing.message}
                </div>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <p className="admin-eyebrow">status</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(["new", "in-progress", "responded", "archived"] as const).map((s) => {
                    const active = editing.status === s;
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => void updateEnquiry(editing._id, { status: s })}
                        className="h-9 px-3 text-[12.5px] transition-colors text-left"
                        style={{
                          background: active ? "rgba(255,102,0,0.08)" : "var(--admin-bg)",
                          color: active ? "var(--admin-accent)" : "var(--admin-fg-mute)",
                          border: `1px solid ${active ? "var(--admin-accent)" : "var(--admin-border)"}`,
                          borderRadius: "var(--radius-sm)",
                        }}
                      >
                        {STATUS_LABELS[s]}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <p className="admin-eyebrow">internal notes</p>
                <textarea
                  rows={4}
                  defaultValue={editing.notes || ""}
                  placeholder="Add a note about this enquiry — sales team can see them too."
                  className="w-full px-3 py-2.5 text-[13px] leading-[1.55] resize-y"
                  onBlur={(e) => void updateEnquiry(editing._id, { notes: e.target.value })}
                />
                <p className="admin-mono text-[10.5px] text-[var(--admin-fg-dim)]" style={{ letterSpacing: "0.04em" }}>
                  Notes save automatically on blur.
                </p>
              </div>

              {/* Meta */}
              <div className="space-y-2">
                <p className="admin-eyebrow">meta</p>
                <div className="space-y-1.5 text-[12px] admin-mono text-[var(--admin-fg-mute)]" style={{ letterSpacing: "0.04em" }}>
                  <div className="flex justify-between">
                    <span>SOURCE PAGE</span>
                    <span className="text-[var(--admin-fg)]">{editing.sourcePage || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>CREATED</span>
                    <span className="text-[var(--admin-fg)]">
                      {editing.createdAt ? new Date(editing.createdAt).toLocaleString("en-IN") : "—"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function ContactRow({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  const Wrap = ({ children }: { children: React.ReactNode }) =>
    href ? (
      <a
        href={href}
        className="hover:text-[var(--admin-accent)] transition-colors"
        style={{ display: "contents" }}
      >
        {children}
      </a>
    ) : (
      <>{children}</>
    );

  return (
    <Wrap>
      <div
        className="flex items-center gap-3 px-4 py-2.5"
        style={{ background: "var(--admin-surface)" }}
      >
        <span className="text-[var(--admin-fg-dim)]">{icon}</span>
        <span className="admin-eyebrow w-16 shrink-0">{label}</span>
        <span className="text-[13px] text-[var(--admin-fg)] admin-mono truncate" style={{ letterSpacing: "0.02em" }}>
          {value}
        </span>
      </div>
    </Wrap>
  );
}
