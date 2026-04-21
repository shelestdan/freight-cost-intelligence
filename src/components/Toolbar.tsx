import type { Currency } from "../types/logistics";

const currencies: Currency[] = ["RUB", "USD", "CNY", "EUR"];

type ToolbarProps = {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  onAdd: () => void;
  onReset: () => void;
  onClear: () => void;
  onExportCSV: () => void;
  onExportJSON: () => void;
};

export function Toolbar({
  currency,
  setCurrency,
  onAdd,
  onReset,
  onClear,
  onExportCSV,
  onExportJSON
}: ToolbarProps) {
  return (
    <header className="topbar">
      <div className="brand-block">
        <span className="signal-dot" />
        <div>
          <p className="section-kicker">Static freight intelligence</p>
          <h1>Freight Cost Control</h1>
        </div>
      </div>

      <div className="topbar-actions">
        <label className="currency-switch">
          <span>Валюта</span>
          <select value={currency} onChange={(event) => setCurrency(event.target.value as Currency)}>
            {currencies.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <button type="button" onClick={onAdd}>
          Добавить строку
        </button>
        <button type="button" className="ghost-button" onClick={onExportCSV}>
          CSV
        </button>
        <button type="button" className="ghost-button" onClick={onExportJSON}>
          JSON
        </button>
        <button type="button" className="ghost-button" onClick={onReset}>
          Demo
        </button>
        <button type="button" className="danger-button" onClick={onClear}>
          Clear
        </button>
      </div>
    </header>
  );
}
