import type { RouteRecord } from "../types/logistics";

const csvFields: (keyof RouteRecord)[] = [
  "id",
  "origin_country",
  "origin_city",
  "origin_port_or_station",
  "destination_country",
  "destination_city",
  "destination_port_or_station",
  "transport_type",
  "shipping_line",
  "route_name",
  "cost",
  "currency",
  "transit_days",
  "updated_at",
  "comment"
];

function escapeCell(value: unknown) {
  const text = String(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
}

export function toCSV(records: RouteRecord[]) {
  return [csvFields.join(","), ...records.map((record) => csvFields.map((field) => escapeCell(record[field])).join(","))].join(
    "\n"
  );
}

export function downloadText(filename: string, text: string, type = "text/plain") {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
