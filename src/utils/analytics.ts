import type {
  ComparisonEntry,
  Currency,
  RouteRecord
} from "../types/logistics";
import { convertCost, operatorLabel, transportLabel } from "./format";

function avg(values: number[]) {
  if (!values.length) {
    return 0;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function byDisplayCost(currency: Currency) {
  return (record: RouteRecord) => convertCost(record.cost, record.currency, currency);
}

export function getRouteComparisons(records: RouteRecord[], currency: Currency) {
  const displayCost = byDisplayCost(currency);
  const groups = new Map<string, RouteRecord[]>();

  for (const record of records) {
    const key = record.route_name.trim() || `${record.origin_city} → ${record.destination_city}`;
    groups.set(key, [...(groups.get(key) ?? []), record]);
  }

  const entries = new Map<string, ComparisonEntry>();

  for (const group of groups.values()) {
    const ranked = [...group].sort((a, b) => displayCost(a) - displayCost(b));
    const bestCost = displayCost(ranked[0]);
    const secondCost = ranked[1] ? displayCost(ranked[1]) : 0;

    ranked.forEach((record, index) => {
      const cost = displayCost(record);
      const delta = cost - bestCost;
      const deltaPercent = bestCost > 0 ? (delta / bestCost) * 100 : 0;
      const cheaperThanNextPercent =
        index === 0 && secondCost > 0 ? ((secondCost - bestCost) / secondCost) * 100 : 0;

      entries.set(record.id, {
        record,
        displayCost: cost,
        rank: index + 1,
        deltaToBest: delta,
        deltaPercentToBest: deltaPercent,
        cheaperThanNextPercent,
        isBestForRoute: index === 0
      });
    });
  }

  return entries;
}

export function getKpis(records: RouteRecord[], currency: Currency) {
  const displayCost = byDisplayCost(currency);
  const sorted = [...records].sort((a, b) => displayCost(a) - displayCost(b));
  const cheapest = sorted[0];
  const averageCost = avg(records.map(displayCost));

  const rail = records.filter((record) => record.transport_type === "rail_direct");
  const domesticRail = records.filter((record) => record.transport_type === "rail_domestic");
  const sea = records.filter((record) => record.transport_type === "sea");
  const railAvg = avg(rail.map(displayCost));
  const seaAvg = avg(sea.map(displayCost));
  const railSeaDelta = seaAvg && railAvg ? seaAvg - railAvg : 0;
  const railSeaPercent = railAvg ? (railSeaDelta / railAvg) * 100 : 0;

  const byTransport = [rail, domesticRail, sea]
    .filter((group) => group.length)
    .map((group) => ({
      label: transportLabel(group[0].transport_type),
      average: avg(group.map(displayCost))
    }))
    .sort((a, b) => a.average - b.average);

  const seaLineMap = new Map<string, RouteRecord[]>();
  for (const record of sea) {
    const key = record.shipping_line || "Без линии";
    seaLineMap.set(key, [...(seaLineMap.get(key) ?? []), record]);
  }

  const bestLine = [...seaLineMap.entries()]
    .map(([line, rows]) => ({ line, average: avg(rows.map(displayCost)), count: rows.length }))
    .sort((a, b) => a.average - b.average)[0];

  return {
    cheapest,
    cheapestCost: cheapest ? displayCost(cheapest) : 0,
    cheapestTransport: byTransport[0]?.label ?? "Нет данных",
    averageCost,
    railAvg,
    seaAvg,
    railSeaDelta,
    railSeaPercent,
    bestLine,
    count: records.length
  };
}

export function getCostChartData(records: RouteRecord[], currency: Currency) {
  const displayCost = byDisplayCost(currency);

  return [...records]
    .sort((a, b) => displayCost(a) - displayCost(b))
    .slice(0, 12)
    .map((record) => ({
      id: record.id,
      route: record.route_name,
      label: `${record.route_name} · ${operatorLabel(record.transport_type, record.shipping_line)}`,
      cost: Math.round(displayCost(record)),
      type: transportLabel(record.transport_type),
      operator: operatorLabel(record.transport_type, record.shipping_line)
    }));
}

export function getLeaderboard(records: RouteRecord[], currency: Currency) {
  const comparisons = getRouteComparisons(records, currency);

  return [...comparisons.values()]
    .sort((a, b) => a.displayCost - b.displayCost)
    .slice(0, 8)
    .map((entry) => ({
      id: entry.record.id,
      route: entry.record.route_name,
      operator: operatorLabel(entry.record.transport_type, entry.record.shipping_line),
      cost: Math.round(entry.displayCost),
      save: entry.cheaperThanNextPercent
    }));
}

export function getTransportSummary(records: RouteRecord[], currency: Currency) {
  const displayCost = byDisplayCost(currency);
  const groups = new Map<string, RouteRecord[]>();

  for (const record of records) {
    const label = operatorLabel(record.transport_type, record.shipping_line);
    groups.set(label, [...(groups.get(label) ?? []), record]);
  }

  const rows = [...groups.entries()].map(([label, group]) => {
    const costs = group.map(displayCost);
    return {
      label,
      avgCost: Math.round(avg(costs)),
      minCost: Math.round(Math.min(...costs)),
      maxCost: Math.round(Math.max(...costs)),
      count: group.length,
      transit: Math.round(avg(group.map((record) => record.transit_days)))
    };
  });

  const seaLineNames = records
    .filter((record) => record.transport_type === "sea")
    .map((record) => record.shipping_line)
    .filter(Boolean);

  const laneLabels = ["ЖД прямое", "Внутри России", ...Array.from(new Set(seaLineNames))];
  while (laneLabels.length < 4) {
    laneLabels.push(`Море — линия ${laneLabels.length}`);
  }

  return laneLabels.map((label) => {
    const found =
      rows.find(
        (row) =>
          row.label === label ||
          (label === "ЖД прямое" && row.label === "ЖД маршрут") ||
          (label === "Внутри России" && row.label === "Внутри России")
      ) ??
      null;
    return {
      label,
      avgCost: found?.avgCost ?? 0,
      minCost: found?.minCost ?? 0,
      maxCost: found?.maxCost ?? 0,
      count: found?.count ?? 0,
      transit: found?.transit ?? 0
    };
  });
}

export function getTrendData(records: RouteRecord[], currency: Currency) {
  const displayCost = byDisplayCost(currency);
  const months = new Map<string, { rail: number[]; sea: number[] }>();

  for (const record of records) {
    const month = record.updated_at.slice(0, 7);
    const bucket = months.get(month) ?? { rail: [], sea: [] };
    bucket[record.transport_type === "rail_direct" ? "rail" : "sea"].push(displayCost(record));
    months.set(month, bucket);
  }

  return [...months.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, bucket]) => ({
      month,
      rail: Math.round(avg(bucket.rail)),
      sea: Math.round(avg(bucket.sea))
    }));
}
