import { useCallback, useEffect, useState } from "react";
import { demoRoutes, fescoExtraExpenses } from "../data/demoRoutes";
import type { RouteRecord } from "../types/logistics";

const STORAGE_KEY = "freight-dashboard-routes-v4";
const LEGACY_STORAGE_KEYS = [
  "freight-dashboard-routes-v3",
  "freight-dashboard-routes-v2",
  "freight-dashboard-routes-v1"
];

function defaultAdditionalExpenses(record: RouteRecord) {
  if (record.transport_type === "sea") {
    return fescoExtraExpenses;
  }

  return "Дополнительные расходы уточнять отдельно по условиям перевозчика.";
}

function normalizeAdditionalExpenses(record: RouteRecord) {
  const current = record.additional_expenses ?? "";

  if (record.transport_type !== "sea") {
    return current || defaultAdditionalExpenses(record);
  }

  if (!current || current.includes("FESCO: возможны доп. расходы")) {
    return fescoExtraExpenses;
  }

  if (current.includes("Базовый тариф FOR") && current.includes("1900 руб. за 40-футовую")) {
    return current;
  }

  return `${current} ${fescoExtraExpenses}`;
}

function normalizeRoutes(records: RouteRecord[]) {
  return records.map((record) => ({
    ...record,
    additional_expenses: normalizeAdditionalExpenses(record)
  }));
}

function readInitialRoutes() {
  if (typeof window === "undefined") {
    return demoRoutes;
  }

  const stored =
    window.localStorage.getItem(STORAGE_KEY) ??
    LEGACY_STORAGE_KEYS.map((key) => window.localStorage.getItem(key)).find(Boolean);
  if (!stored) {
    return demoRoutes;
  }

  try {
    const parsed = JSON.parse(stored) as RouteRecord[];
    return Array.isArray(parsed) ? normalizeRoutes(parsed) : demoRoutes;
  } catch {
    return demoRoutes;
  }
}

export function usePersistentRoutes() {
  const [records, setRecords] = useState<RouteRecord[]>(readInitialRoutes);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  }, [records]);

  const updateRecord = useCallback((id: string, patch: Partial<RouteRecord>) => {
    setRecords((current) =>
      current.map((record) => (record.id === id ? { ...record, ...patch } : record))
    );
  }, []);

  const addRecord = useCallback((record: RouteRecord) => {
    setRecords((current) => [record, ...current]);
  }, []);

  const deleteRecord = useCallback((id: string) => {
    setRecords((current) => current.filter((record) => record.id !== id));
  }, []);

  const resetDemo = useCallback(() => {
    setRecords(demoRoutes);
  }, []);

  const clearAll = useCallback(() => {
    setRecords([]);
  }, []);

  return {
    records,
    setRecords,
    updateRecord,
    addRecord,
    deleteRecord,
    resetDemo,
    clearAll
  };
}
