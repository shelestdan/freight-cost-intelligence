import { useCallback, useEffect, useState } from "react";
import { demoRoutes, fescoExtraExpenseItems, fescoExtraExpenses } from "../data/demoRoutes";
import type { RouteRecord } from "../types/logistics";

const STORAGE_KEY = "freight-dashboard-routes";
const STORAGE_VERSION_KEY = "freight-dashboard-routes-schema-version";
const STORAGE_SCHEMA_VERSION = 4;
const LEGACY_STORAGE_KEYS = [
  "freight-dashboard-routes-v4",
  "freight-dashboard-routes-v3",
  "freight-dashboard-routes-v2",
  "freight-dashboard-routes-v1"
];
const LEGACY_FESCO_SUMMARY = "FESCO: возможны доп. расходы";
const REQUIRED_FESCO_MARKERS = [
  "Базовый тариф FOR",
  "Тарифы CY дополнительно включают терминальную обработку",
  "4400/5400",
  "фактические расходы контрагентов",
  "Охрана груза по ЖД",
  "усиленной охраны",
  "1900 руб. за 40-футовую",
  "2300 руб. за 60-футовую",
  "2700 руб. за 80-футовую",
  "на станции отправления включены 15 суток",
  "в порту включен 21 сутки"
];

function defaultAdditionalExpenses(record: RouteRecord) {
  if (record.transport_type === "sea") {
    return fescoExtraExpenses;
  }

  return "Дополнительные расходы уточнять отдельно по условиям перевозчика.";
}

function normalizeAdditionalExpenses(record: RouteRecord) {
  const current = record.additional_expenses?.trim() ?? "";

  if (record.transport_type !== "sea") {
    return current || defaultAdditionalExpenses(record);
  }

  if (!current || current.includes(LEGACY_FESCO_SUMMARY)) {
    return fescoExtraExpenses;
  }

  if (REQUIRED_FESCO_MARKERS.every((marker) => current.includes(marker))) {
    return current;
  }

  const missingItems = fescoExtraExpenseItems.filter((item) => !current.includes(item));

  return [current, ...missingItems].join(" ");
}

function normalizeRoutes(records: RouteRecord[]) {
  return records.map((record) => ({
    ...record,
    additional_expenses: normalizeAdditionalExpenses(record)
  }));
}

function parseStoredRoutes(stored: string) {
  const parsed = JSON.parse(stored) as unknown;

  return Array.isArray(parsed) ? normalizeRoutes(parsed as RouteRecord[]) : null;
}

function readInitialRoutes() {
  if (typeof window === "undefined") {
    return demoRoutes;
  }

  for (const key of [STORAGE_KEY, ...LEGACY_STORAGE_KEYS]) {
    const stored = window.localStorage.getItem(key);

    if (!stored) {
      continue;
    }

    try {
      const routes = parseStoredRoutes(stored);

      if (routes) {
        return routes;
      }
    } catch {
      continue;
    }
  }

  return demoRoutes;
}

export function usePersistentRoutes() {
  const [records, setRecords] = useState<RouteRecord[]>(readInitialRoutes);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    window.localStorage.setItem(STORAGE_VERSION_KEY, String(STORAGE_SCHEMA_VERSION));
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
