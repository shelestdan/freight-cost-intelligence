import { motion } from "framer-motion";
import type { Currency, RouteRecord } from "../types/logistics";
import { formatMoney, formatPercent, operatorLabel } from "../utils/format";

type KpiStripProps = {
  kpis: {
    cheapest?: RouteRecord;
    cheapestCost: number;
    cheapestTransport: string;
    averageCost: number;
    railSeaDelta: number;
    railSeaPercent: number;
    bestLine?: { line: string; average: number; count: number };
    count: number;
  };
  currency: Currency;
};

export function KpiStrip({ kpis, currency }: KpiStripProps) {
  const cards = [
    {
      label: "Самый дешевый маршрут",
      value: kpis.cheapest?.route_name ?? "Нет данных",
      meta: kpis.cheapest ? formatMoney(kpis.cheapestCost, currency) : "Добавьте ставку"
    },
    {
      label: "Самый дешевый способ",
      value: kpis.cheapestTransport,
      meta: kpis.cheapest ? operatorLabel(kpis.cheapest.transport_type, kpis.cheapest.shipping_line) : "—"
    },
    {
      label: "ЖД vs море",
      value: kpis.railSeaDelta >= 0 ? `Море дороже ${formatPercent(kpis.railSeaPercent)}` : `Море дешевле ${formatPercent(Math.abs(kpis.railSeaPercent))}`,
      meta: kpis.railSeaDelta ? formatMoney(Math.abs(kpis.railSeaDelta), currency) : "Нужны оба типа"
    },
    {
      label: "Средняя стоимость",
      value: formatMoney(kpis.averageCost, currency),
      meta: "По текущей выборке"
    },
    {
      label: "Лучшая морская линия",
      value: kpis.bestLine?.line ?? "Нет моря",
      meta: kpis.bestLine ? `${formatMoney(kpis.bestLine.average, currency)} · ${kpis.bestLine.count} ставок` : "Добавьте морскую ставку"
    },
    {
      label: "Варианты",
      value: String(kpis.count),
      meta: "После фильтров"
    }
  ];

  return (
    <section className="kpi-grid" aria-label="KPI">
      {cards.map((card, index) => (
        <motion.div
          className="kpi-cell"
          key={card.label}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05, duration: 0.35 }}
        >
          <span>{card.label}</span>
          <strong>{card.value}</strong>
          <small>{card.meta}</small>
        </motion.div>
      ))}
    </section>
  );
}
