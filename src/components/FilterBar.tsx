import type { Currency, RouteFilters, RouteRecord, TransportType } from "../types/logistics";
import { emptyFilters, uniqueValues } from "../utils/filters";

type FilterBarProps = {
  records: RouteRecord[];
  filters: RouteFilters;
  setFilters: (filters: RouteFilters) => void;
  displayCurrency: Currency;
};

const currencies: Currency[] = ["RUB", "USD", "CNY", "EUR"];
const transportOptions: { value: "all" | TransportType; label: string }[] = [
  { value: "all", label: "Все типы" },
  { value: "rail_direct", label: "Прямое ЖД" },
  { value: "rail_domestic", label: "ЖД внутри России" },
  { value: "sea", label: "Море" }
];

export function FilterBar({ records, filters, setFilters, displayCurrency }: FilterBarProps) {
  function patch(next: Partial<RouteFilters>) {
    setFilters({ ...filters, ...next });
  }

  return (
    <section className="filter-panel" aria-label="Фильтры">
      <div>
        <p className="section-kicker">Фильтры</p>
        <h2>Срез ставок</h2>
      </div>

      <div className="filter-grid">
        <Select label="Страна отправления" value={filters.origin_country} options={uniqueValues(records, "origin_country")} onChange={(value) => patch({ origin_country: value })} />
        <Select label="Город отправления" value={filters.origin_city} options={uniqueValues(records, "origin_city")} onChange={(value) => patch({ origin_city: value })} />
        <Select label="Страна назначения" value={filters.destination_country} options={uniqueValues(records, "destination_country")} onChange={(value) => patch({ destination_country: value })} />
        <Select label="Город назначения" value={filters.destination_city} options={uniqueValues(records, "destination_city")} onChange={(value) => patch({ destination_city: value })} />
        <label className="field">
          <span>Тип доставки</span>
          <select value={filters.transport_type} onChange={(event) => patch({ transport_type: event.target.value as RouteFilters["transport_type"] })}>
            {transportOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <Select label="Морская линия" value={filters.shipping_line} options={uniqueValues(records, "shipping_line")} onChange={(value) => patch({ shipping_line: value })} />
        <label className="field">
          <span>Валюта записи</span>
          <select value={filters.currency} onChange={(event) => patch({ currency: event.target.value as RouteFilters["currency"] })}>
            <option value="all">Все валюты</option>
            {currencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Цена от, {displayCurrency}</span>
          <input value={filters.minCost} inputMode="numeric" onChange={(event) => patch({ minCost: event.target.value })} />
        </label>
        <label className="field">
          <span>Цена до, {displayCurrency}</span>
          <input value={filters.maxCost} inputMode="numeric" onChange={(event) => patch({ maxCost: event.target.value })} />
        </label>
      </div>

      <button className="ghost-button" type="button" onClick={() => setFilters(emptyFilters)}>
        Сбросить фильтры
      </button>
    </section>
  );
}

function Select({
  label,
  value,
  options,
  onChange
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="">Все</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
