import type { Currency, RouteFilters, RouteRecord, SortState } from "../types/logistics";
import { convertCost } from "./format";

export const emptyFilters: RouteFilters = {
  origin_country: "",
  origin_city: "",
  destination_country: "",
  destination_city: "",
  transport_type: "all",
  shipping_line: "",
  currency: "all",
  minCost: "",
  maxCost: ""
};

export function uniqueValues(records: RouteRecord[], key: keyof RouteRecord) {
  return Array.from(new Set(records.map((record) => String(record[key] ?? "")).filter(Boolean))).sort(
    (a, b) => a.localeCompare(b, "ru")
  );
}

export function applyFilters(records: RouteRecord[], filters: RouteFilters, displayCurrency: Currency) {
  const min = Number(filters.minCost);
  const max = Number(filters.maxCost);

  return records.filter((record) => {
    const displayCost = convertCost(record.cost, record.currency, displayCurrency);
    return (
      (!filters.origin_country || record.origin_country === filters.origin_country) &&
      (!filters.origin_city || record.origin_city === filters.origin_city) &&
      (!filters.destination_country || record.destination_country === filters.destination_country) &&
      (!filters.destination_city || record.destination_city === filters.destination_city) &&
      (filters.transport_type === "all" || record.transport_type === filters.transport_type) &&
      (!filters.shipping_line || record.shipping_line === filters.shipping_line) &&
      (filters.currency === "all" || record.currency === filters.currency) &&
      (!filters.minCost || displayCost >= min) &&
      (!filters.maxCost || displayCost <= max)
    );
  });
}

export function sortRecords(records: RouteRecord[], sort: SortState) {
  return [...records].sort((a, b) => {
    const left = a[sort.key];
    const right = b[sort.key];
    const direction = sort.direction === "asc" ? 1 : -1;

    if (typeof left === "number" && typeof right === "number") {
      return (left - right) * direction;
    }

    return String(left).localeCompare(String(right), "ru", { numeric: true }) * direction;
  });
}
