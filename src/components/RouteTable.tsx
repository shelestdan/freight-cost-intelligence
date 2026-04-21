import { useMemo, useState } from "react";
import { EditableCell } from "./EditableCell";
import type {
  ComparisonEntry,
  Currency,
  RouteRecord,
  SortKey,
  SortState,
  TransportType
} from "../types/logistics";
import { sortRecords } from "../utils/filters";
import { convertCost, formatMoney, formatPercent, transportLabel } from "../utils/format";

type RouteTableProps = {
  records: RouteRecord[];
  displayCurrency: Currency;
  comparisons: Map<string, ComparisonEntry>;
  onUpdate: (id: string, patch: Partial<RouteRecord>) => void;
  onDelete: (id: string) => void;
};

const currencies: Currency[] = ["RUB", "USD", "CNY", "EUR"];
const transportTypes: TransportType[] = ["rail_direct", "sea"];

const columns: { key: SortKey; label: string }[] = [
  { key: "route_name", label: "Маршрут" },
  { key: "origin_country", label: "Отпр. страна" },
  { key: "origin_city", label: "Отпр. город" },
  { key: "origin_port_or_station", label: "Станция / порт отпр." },
  { key: "destination_country", label: "Назн. страна" },
  { key: "destination_city", label: "Назн. город" },
  { key: "destination_port_or_station", label: "Станция / порт назн." },
  { key: "transport_type", label: "Тип" },
  { key: "shipping_line", label: "Линия" },
  { key: "cost", label: "Стоимость" },
  { key: "currency", label: "Валюта" },
  { key: "transit_days", label: "Дни" },
  { key: "updated_at", label: "Дата" },
  { key: "comment", label: "Комментарий" }
];

export function RouteTable({
  records,
  displayCurrency,
  comparisons,
  onUpdate,
  onDelete
}: RouteTableProps) {
  const [sort, setSort] = useState<SortState>({ key: "cost", direction: "asc" });
  const sorted = useMemo(() => sortRecords(records, sort), [records, sort]);

  function toggleSort(key: SortKey) {
    setSort((current) => ({
      key,
      direction: current.key === key && current.direction === "asc" ? "desc" : "asc"
    }));
  }

  if (!records.length) {
    return (
      <section className="empty-state">
        <h2>Нет строк в текущем срезе</h2>
        <p>Сбросьте фильтры или добавьте новую ставку. Таблица начнет пересчет сразу после ввода.</p>
      </section>
    );
  }

  return (
    <section className="table-panel" aria-label="Интерактивная таблица маршрутов">
      <div className="panel-head table-head">
        <div>
          <h2>Рабочая таблица ставок</h2>
          <p>Клик по ячейке → ввод → Enter или blur. Сохранение сразу в localStorage.</p>
        </div>
        <span>{records.length} строк</span>
      </div>

      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Ранг</th>
              {columns.map((column) => (
                <th key={column.key}>
                  <button type="button" onClick={() => toggleSort(column.key)}>
                    {column.label}
                    {sort.key === column.key ? <span>{sort.direction === "asc" ? "↑" : "↓"}</span> : null}
                  </button>
                </th>
              ))}
              <th>Срез</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {sorted.map((record) => {
              const comparison = comparisons.get(record.id);
              const converted = convertCost(record.cost, record.currency, displayCurrency);
              const isBest = comparison?.isBestForRoute;

              return (
                <tr key={record.id} className={isBest ? "best-row" : ""}>
                  <td>
                    <span className="rank-pill">{comparison?.rank ?? "—"}</span>
                  </td>
                  <td>
                    <EditableCell value={record.route_name} ariaLabel="route_name" onCommit={(value) => onUpdate(record.id, { route_name: value })} />
                  </td>
                  <td>
                    <EditableCell value={record.origin_country} ariaLabel="origin_country" onCommit={(value) => onUpdate(record.id, { origin_country: value })} />
                  </td>
                  <td>
                    <EditableCell value={record.origin_city} ariaLabel="origin_city" onCommit={(value) => onUpdate(record.id, { origin_city: value })} />
                  </td>
                  <td>
                    <EditableCell value={record.origin_port_or_station} ariaLabel="origin_port_or_station" onCommit={(value) => onUpdate(record.id, { origin_port_or_station: value })} />
                  </td>
                  <td>
                    <EditableCell value={record.destination_country} ariaLabel="destination_country" onCommit={(value) => onUpdate(record.id, { destination_country: value })} />
                  </td>
                  <td>
                    <EditableCell value={record.destination_city} ariaLabel="destination_city" onCommit={(value) => onUpdate(record.id, { destination_city: value })} />
                  </td>
                  <td>
                    <EditableCell value={record.destination_port_or_station} ariaLabel="destination_port_or_station" onCommit={(value) => onUpdate(record.id, { destination_port_or_station: value })} />
                  </td>
                  <td>
                    <EditableCell
                      value={record.transport_type}
                      type="select"
                      options={transportTypes}
                      ariaLabel="transport_type"
                      onCommit={(value) => onUpdate(record.id, { transport_type: value as TransportType })}
                    />
                    <small className="cell-hint">{transportLabel(record.transport_type)}</small>
                  </td>
                  <td>
                    <EditableCell value={record.shipping_line} ariaLabel="shipping_line" onCommit={(value) => onUpdate(record.id, { shipping_line: value })} />
                  </td>
                  <td>
                    <EditableCell value={record.cost} type="number" ariaLabel="cost" onCommit={(value) => onUpdate(record.id, { cost: Number(value) || 0 })} />
                    <small className="cell-hint">{formatMoney(converted, displayCurrency)}</small>
                  </td>
                  <td>
                    <EditableCell
                      value={record.currency}
                      type="select"
                      options={currencies}
                      ariaLabel="currency"
                      onCommit={(value) => onUpdate(record.id, { currency: value as Currency })}
                    />
                  </td>
                  <td>
                    <EditableCell value={record.transit_days} type="number" ariaLabel="transit_days" onCommit={(value) => onUpdate(record.id, { transit_days: Number(value) || 0 })} />
                  </td>
                  <td>
                    <EditableCell value={record.updated_at} type="date" ariaLabel="updated_at" onCommit={(value) => onUpdate(record.id, { updated_at: value })} />
                  </td>
                  <td>
                    <EditableCell value={record.comment} ariaLabel="comment" onCommit={(value) => onUpdate(record.id, { comment: value })} />
                  </td>
                  <td>
                    {isBest && comparison?.cheaperThanNextPercent ? (
                      <span className="save-badge">дешевле на {comparison.cheaperThanNextPercent.toFixed(1)}%</span>
                    ) : comparison && comparison.deltaPercentToBest > 0 ? (
                      <span className="delta-badge">{formatPercent(comparison.deltaPercentToBest)}</span>
                    ) : (
                      <span className="quiet-badge">единств.</span>
                    )}
                  </td>
                  <td>
                    <button className="delete-row" type="button" onClick={() => onDelete(record.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
