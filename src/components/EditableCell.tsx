import { useEffect, useMemo, useState } from "react";

type EditableCellProps<T extends string | number> = {
  value: T;
  type?: "text" | "number" | "date" | "select";
  options?: readonly string[];
  ariaLabel: string;
  className?: string;
  onCommit: (value: T) => void;
};

export function EditableCell<T extends string | number>({
  value,
  type = "text",
  options = [],
  ariaLabel,
  className = "",
  onCommit
}: EditableCellProps<T>) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(value ?? ""));

  useEffect(() => {
    setDraft(String(value ?? ""));
  }, [value]);

  const displayValue = useMemo(() => {
    if (type === "number" && typeof value === "number") {
      return new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 }).format(value);
    }

    return String(value || "—");
  }, [type, value]);

  function commit(next = draft) {
    const nextValue = type === "number" ? Number(String(next).replace(/\s/g, "")) : next;
    onCommit(nextValue as T);
    setEditing(false);
  }

  function cancel() {
    setDraft(String(value ?? ""));
    setEditing(false);
  }

  if (editing) {
    if (type === "select") {
      return (
        <select
          className={`editable-input ${className}`}
          value={draft}
          aria-label={ariaLabel}
          autoFocus
          onChange={(event) => {
            setDraft(event.target.value);
            commit(event.target.value);
          }}
          onBlur={() => commit()}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option || "—"}
            </option>
          ))}
        </select>
      );
    }

    return (
      <input
        className={`editable-input ${className}`}
        value={draft}
        type={type}
        aria-label={ariaLabel}
        autoFocus
        onChange={(event) => setDraft(event.target.value)}
        onBlur={() => commit()}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            commit();
          }

          if (event.key === "Escape") {
            cancel();
          }
        }}
      />
    );
  }

  return (
    <button className={`editable-value ${className}`} type="button" onClick={() => setEditing(true)}>
      {displayValue}
    </button>
  );
}
