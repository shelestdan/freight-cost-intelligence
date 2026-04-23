import { useMemo, useState } from "react";
import type { ComparisonEntry, Currency, RouteRecord, SortKey, SortState } from "../types/logistics";
import { sortRecords } from "../utils/filters";
import { convertCost, formatMoney, formatPercent, operatorLabel, transportLabel } from "../utils/format";

type RouteTableProps = {
  records: RouteRecord[];
  activeRecordId: string | null;
  displayCurrency: Currency;
  comparisons: Map<string, ComparisonEntry>;
  onEdit: (record: RouteRecord) => void;
  onDelete: (id: string) => void;
};

const columns: { key: SortKey; label: string }[] = [
  { key: "route_name", label: "Маршрут" },
  { key: "transport_type", label: "Тип" },
  { key: "cost", label: "Стоимость" },
  { key: "transit_days", label: "Срок" },
  { key: "updated_at", label: "Дата" }
];

export function RouteTable({
  records,
  activeRecordId,
  displayCurrency,
  comparisons,
  onEdit,
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

  function deleteRecord(id: string) {
    const confirmed = window.confirm("Удалить эту ставку? Изменение сразу сохранится в браузере.");

    if (confirmed) {
      onDelete(id);
    }
  }

  if (!records.length) {
    return (
      <section className="empty-state">
        <h2>Нет строк в текущем срезе</h2>
        <p>Сбросьте фильтры или создайте новую ставку через форму. Таблица обновится сразу после сохранения.</p>
      </section>
    );
  }

  return (
    <section className="table-panel" aria-label="Список маршрутов">
      <div className="panel-head table-head">
        <div>
          <h2>Ставки и маршруты</h2>
          <p>Таблица теперь работает как список и сравнение. Для ввода нажмите строку или кнопку «Изменить».</p>
        </div>
        <span>{records.length} строк</span>
      </div>

      <div className="table-scroll">
        <table className="route-table">
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
              <th>Условия</th>
              <th>Срез</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {sorted.map((record) => {
              const comparison = comparisons.get(record.id);
              const converted = convertCost(record.cost, record.currency, displayCurrency);
              const isBest = comparison?.isBestForRoute;
              const isActive = activeRecordId === record.id;

              return (
                <tr key={record.id} className={`${isBest ? "best-row" : ""} ${isActive ? "active-row" : ""}`}>
                  <td>
                    <span className="rank-pill">{comparison?.rank ?? "—"}</span>
                  </td>
                  <td>
                    <button type="button" className="row-open" onClick={() => onEdit(record)}>
                      <strong>{record.route_name || "Без названия"}</strong>
                      <small>
                        {record.origin_city || record.origin_port_or_station || "Отправление не указано"} →{" "}
                        {record.destination_city || record.destination_port_or_station || "Назначение не указано"}
                      </small>
                    </button>
                  </td>
                  <td>
                    <span className="type-stack">
                      <strong>{transportLabel(record.transport_type)}</strong>
                      <small>{operatorLabel(record.transport_type, record.shipping_line)}</small>
                    </span>
                  </td>
                  <td>
                    <strong>{formatMoney(record.cost, record.currency)}</strong>
                    <small className="cell-hint">{formatMoney(converted, displayCurrency)}</small>
                  </td>
                  <td>
                    <strong>{record.transit_days || 0} дн.</strong>
                  </td>
                  <td>
                    <span>{record.updated_at || "—"}</span>
                  </td>
                  <td>
                    <span className="conditions-preview">
                      {record.additional_expenses || record.comment || "Условия не заполнены"}
                    </span>
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
                    <div className="row-actions">
                      <button className="ghost-button" type="button" onClick={() => onEdit(record)}>
                        Изменить
                      </button>
                      <button className="delete-row" type="button" onClick={() => deleteRecord(record.id)}>
                        Удалить
                      </button>
                    </div>
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
