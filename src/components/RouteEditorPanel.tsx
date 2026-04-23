import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import type { Currency, RouteRecord, TransportType } from "../types/logistics";
import { convertCost, formatMoney, transportLabel } from "../utils/format";

type RouteEditorPanelProps = {
  record: RouteRecord | null;
  existing: boolean;
  displayCurrency: Currency;
  onClose: () => void;
  onSave: (record: RouteRecord) => void;
  onDelete: (id: string) => void;
};

const currencies: Currency[] = ["RUB", "USD", "CNY", "EUR"];
const transportTypes: { value: TransportType; label: string }[] = [
  { value: "rail_direct", label: "Прямое ЖД" },
  { value: "rail_domestic", label: "ЖД внутри России" },
  { value: "sea", label: "Море" }
];

export function RouteEditorPanel({
  record,
  existing,
  displayCurrency,
  onClose,
  onSave,
  onDelete
}: RouteEditorPanelProps) {
  const [draft, setDraft] = useState<RouteRecord | null>(record);

  useEffect(() => {
    setDraft(record);
  }, [record]);

  const convertedCost = useMemo(() => {
    if (!draft) {
      return null;
    }

    return formatMoney(convertCost(draft.cost, draft.currency, displayCurrency), displayCurrency);
  }, [displayCurrency, draft]);

  function updateField<K extends keyof RouteRecord>(key: K, value: RouteRecord[K]) {
    setDraft((current) => (current ? { ...current, [key]: value } : current));
  }

  function saveDraft() {
    if (!draft) {
      return;
    }

    onSave({
      ...draft,
      route_name: draft.route_name.trim() || "Новый маршрут",
      origin_country: draft.origin_country.trim() || "Россия",
      destination_country: draft.destination_country.trim(),
      cost: Number(draft.cost) || 0,
      transit_days: Number(draft.transit_days) || 0
    });
  }

  function deleteDraft() {
    if (!draft || !existing) {
      return;
    }

    const confirmed = window.confirm("Удалить эту ставку? Действие сохранится в браузере сразу.");

    if (confirmed) {
      onDelete(draft.id);
    }
  }

  return (
    <AnimatePresence>
      {draft ? (
        <>
          <motion.button
            type="button"
            className="editor-backdrop"
            aria-label="Закрыть редактор"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.aside
            className="route-editor"
            role="dialog"
            aria-modal="true"
            aria-label={existing ? "Редактирование ставки" : "Новая ставка"}
            initial={{ opacity: 0, x: 42 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 42 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <div className="editor-head">
              <div>
                <p className="section-kicker">{existing ? "Редактирование" : "Новая ставка"}</p>
                <h2>{draft.route_name || "Новый маршрут"}</h2>
                <p>Форма сохраняет строку в браузере. Таблица ниже нужна для контроля и сравнения.</p>
              </div>
              <button type="button" className="ghost-button icon-button" onClick={onClose} aria-label="Закрыть">
                ×
              </button>
            </div>

            <div className="editor-summary">
              <div>
                <span>Стоимость</span>
                <strong>{convertedCost}</strong>
              </div>
              <div>
                <span>Тип</span>
                <strong>{transportLabel(draft.transport_type)}</strong>
              </div>
              <div>
                <span>Срок</span>
                <strong>{draft.transit_days || 0} дн.</strong>
              </div>
            </div>

            <form
              className="editor-form"
              onSubmit={(event) => {
                event.preventDefault();
                saveDraft();
              }}
            >
              <section className="form-section">
                <div>
                  <h3>Маршрут</h3>
                  <p>Название, точки отправления и назначения.</p>
                </div>

                <label className="field field-wide">
                  Название маршрута
                  <input value={draft.route_name} onChange={(event) => updateField("route_name", event.target.value)} />
                </label>

                <div className="form-grid">
                  <label className="field">
                    Страна отправления
                    <input
                      value={draft.origin_country}
                      onChange={(event) => updateField("origin_country", event.target.value)}
                    />
                  </label>
                  <label className="field">
                    Город отправления
                    <input value={draft.origin_city} onChange={(event) => updateField("origin_city", event.target.value)} />
                  </label>
                  <label className="field field-wide">
                    Станция / порт отправления
                    <input
                      value={draft.origin_port_or_station}
                      onChange={(event) => updateField("origin_port_or_station", event.target.value)}
                    />
                  </label>
                  <label className="field">
                    Страна назначения
                    <input
                      value={draft.destination_country}
                      onChange={(event) => updateField("destination_country", event.target.value)}
                    />
                  </label>
                  <label className="field">
                    Город назначения
                    <input
                      value={draft.destination_city}
                      onChange={(event) => updateField("destination_city", event.target.value)}
                    />
                  </label>
                  <label className="field field-wide">
                    Станция / порт назначения
                    <input
                      value={draft.destination_port_or_station}
                      onChange={(event) => updateField("destination_port_or_station", event.target.value)}
                    />
                  </label>
                </div>
              </section>

              <section className="form-section">
                <div>
                  <h3>Тариф</h3>
                  <p>Тип перевозки, линия, стоимость и срок.</p>
                </div>

                <div className="form-grid">
                  <label className="field">
                    Тип перевозки
                    <select
                      value={draft.transport_type}
                      onChange={(event) => updateField("transport_type", event.target.value as TransportType)}
                    >
                      {transportTypes.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="field">
                    Линия / перевозчик
                    <input
                      value={draft.shipping_line}
                      onChange={(event) => updateField("shipping_line", event.target.value)}
                    />
                  </label>
                  <label className="field">
                    Стоимость
                    <input
                      value={draft.cost}
                      type="number"
                      min="0"
                      onChange={(event) => updateField("cost", Number(event.target.value))}
                    />
                  </label>
                  <label className="field">
                    Валюта
                    <select value={draft.currency} onChange={(event) => updateField("currency", event.target.value as Currency)}>
                      {currencies.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="field">
                    Срок, дней
                    <input
                      value={draft.transit_days}
                      type="number"
                      min="0"
                      onChange={(event) => updateField("transit_days", Number(event.target.value))}
                    />
                  </label>
                  <label className="field">
                    Дата обновления
                    <input value={draft.updated_at} type="date" onChange={(event) => updateField("updated_at", event.target.value)} />
                  </label>
                </div>
              </section>

              <section className="form-section">
                <div>
                  <h3>Условия</h3>
                  <p>Комментарий и доп. расходы. Большой текст редактируется здесь, не в таблице.</p>
                </div>

                <label className="field field-wide">
                  Комментарий
                  <textarea value={draft.comment} rows={3} onChange={(event) => updateField("comment", event.target.value)} />
                </label>
                <label className="field field-wide">
                  Дополнительные расходы
                  <textarea
                    value={draft.additional_expenses}
                    rows={7}
                    onChange={(event) => updateField("additional_expenses", event.target.value)}
                  />
                </label>
              </section>

              <div className="editor-actions">
                {existing ? (
                  <button type="button" className="danger-button" onClick={deleteDraft}>
                    Удалить
                  </button>
                ) : (
                  <span />
                )}
                <div>
                  <button type="button" className="ghost-button" onClick={onClose}>
                    Отмена
                  </button>
                  <button type="submit">Сохранить ставку</button>
                </div>
              </div>
            </form>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
