import { Suspense, lazy, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FilterBar } from "../../components/FilterBar";
import { KpiStrip } from "../../components/KpiStrip";
import { RouteTable } from "../../components/RouteTable";
import { Toolbar } from "../../components/Toolbar";
import { usePersistentRoutes } from "../../hooks/usePersistentRoutes";
import type { Currency, RouteFilters, RouteRecord } from "../../types/logistics";
import { getKpis, getRouteComparisons } from "../../utils/analytics";
import { downloadText, toCSV } from "../../utils/export";
import { applyFilters, emptyFilters } from "../../utils/filters";
import { todayISO } from "../../utils/format";

const Charts = lazy(() => import("../../components/Charts").then((module) => ({ default: module.Charts })));

function createBlankRecord(): RouteRecord {
  const id = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now());

  return {
    id,
    origin_country: "Россия",
    origin_city: "",
    origin_port_or_station: "",
    destination_country: "",
    destination_city: "",
    destination_port_or_station: "",
    transport_type: "sea",
    shipping_line: "Новая линия",
    route_name: "Новый маршрут",
    cost: 0,
    currency: "RUB",
    transit_days: 0,
    updated_at: todayISO(),
    comment: "",
    additional_expenses: ""
  };
}

export function Dashboard() {
  const { records, updateRecord, addRecord, deleteRecord, resetDemo, clearAll } = usePersistentRoutes();
  const [displayCurrency, setDisplayCurrency] = useState<Currency>("RUB");
  const [filters, setFilters] = useState<RouteFilters>(emptyFilters);

  const filteredRecords = useMemo(
    () => applyFilters(records, filters, displayCurrency),
    [records, filters, displayCurrency]
  );
  const comparisons = useMemo(
    () => getRouteComparisons(filteredRecords, displayCurrency),
    [filteredRecords, displayCurrency]
  );
  const kpis = useMemo(() => getKpis(filteredRecords, displayCurrency), [filteredRecords, displayCurrency]);

  return (
    <main className="dashboard-shell">
      <div className="route-field" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>

      <Toolbar
        currency={displayCurrency}
        setCurrency={setDisplayCurrency}
        onAdd={() => addRecord(createBlankRecord())}
        onReset={resetDemo}
        onClear={clearAll}
        onExportCSV={() => downloadText("freight-routes.csv", toCSV(records), "text/csv;charset=utf-8")}
        onExportJSON={() => downloadText("freight-routes.json", JSON.stringify(records, null, 2), "application/json")}
      />

      <motion.section
        className="overview-band"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <div>
          <p className="section-kicker">Концепция</p>
          <h2>Операционный экран ставок без сервера</h2>
        </div>
        <ol>
          <li>Главный сценарий: правка ставки в таблице → мгновенный пересчет KPI, графиков, рейтинга.</li>
          <li>Данные живут в браузере: demo seed при первом запуске, затем localStorage.</li>
          <li>Сравнение идет по одинаковому `route_name`: ЖД, море, линии, разница в деньгах и процентах.</li>
          <li>Морские линии динамические: одна линия сейчас, 2–3+ появятся без переделки UI.</li>
          <li>Валюта переключается локально по фиксированным коэффициентам, без API.</li>
          <li>GitHub Pages совместим: Vite static build, относительный base в Actions, без backend.</li>
        </ol>
      </motion.section>

      <KpiStrip kpis={kpis} currency={displayCurrency} />

      <FilterBar
        records={records}
        filters={filters}
        setFilters={setFilters}
        displayCurrency={displayCurrency}
      />

      <Suspense
        fallback={
          <section className="empty-state">
            <h2>Диаграммы загружаются</h2>
            <p>Рабочая таблица уже доступна.</p>
          </section>
        }
      >
        <Charts records={filteredRecords} currency={displayCurrency} />
      </Suspense>

      <RouteTable
        records={filteredRecords}
        displayCurrency={displayCurrency}
        comparisons={comparisons}
        onUpdate={updateRecord}
        onDelete={deleteRecord}
      />
    </main>
  );
}
