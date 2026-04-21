import type { Currency, TransportType } from "../types/logistics";

export const currencyRatesToRub: Record<Currency, number> = {
  RUB: 1,
  USD: 92,
  CNY: 12.7,
  EUR: 100
};

export const currencySymbols: Record<Currency, string> = {
  RUB: "₽",
  USD: "$",
  CNY: "¥",
  EUR: "€"
};

export function convertCost(cost: number, from: Currency, to: Currency) {
  if (!Number.isFinite(cost)) {
    return 0;
  }

  return (cost * currencyRatesToRub[from]) / currencyRatesToRub[to];
}

export function formatMoney(value: number, currency: Currency) {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "RUB" ? 0 : 1
  }).format(value);
}

export function formatPercent(value: number) {
  if (!Number.isFinite(value)) {
    return "0%";
  }

  return `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;
}

export function transportLabel(type: TransportType) {
  if (type === "rail_direct") {
    return "Прямое ЖД";
  }

  if (type === "rail_domestic") {
    return "ЖД внутри России";
  }

  return "Море";
}

export function operatorLabel(type: TransportType, shippingLine: string) {
  if (type === "rail_direct") {
    return "ЖД маршрут";
  }

  if (type === "rail_domestic") {
    return "Внутри России";
  }

  return shippingLine || "Морская линия";
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}
