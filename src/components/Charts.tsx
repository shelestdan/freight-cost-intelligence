import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import type { Currency, RouteRecord } from "../types/logistics";
import {
  getCostChartData,
  getLeaderboard,
  getTransportSummary,
  getTrendData
} from "../utils/analytics";
import { formatMoney } from "../utils/format";

type ChartsProps = {
  records: RouteRecord[];
  currency: Currency;
};

export function Charts({ records, currency }: ChartsProps) {
  const costData = getCostChartData(records, currency);
  const leaderboard = getLeaderboard(records, currency);
  const transport = getTransportSummary(records, currency);
  const trend = getTrendData(records, currency);

  if (!records.length) {
    return <EmptyPanel title="Нет данных для диаграмм" text="Добавьте ставку в таблице, KPI и графики обновятся сразу." />;
  }

  return (
    <section className="chart-grid" aria-label="Диаграммы">
      <div className="chart-panel chart-panel-wide">
        <PanelHead title="Стоимость по маршрутам" text="Топ вариантов, отсортировано от дешевого к дорогому." />
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={costData} margin={{ top: 16, right: 8, left: 0, bottom: 48 }}>
            <CartesianGrid stroke="#d9e0dc" vertical={false} />
            <XAxis dataKey="route" tick={{ fill: "#58645f", fontSize: 11 }} interval={0} angle={-24} textAnchor="end" height={70} />
            <YAxis tick={{ fill: "#58645f", fontSize: 11 }} tickFormatter={(value) => `${Math.round(Number(value) / 1000)}k`} />
            <Tooltip formatter={(value) => formatMoney(Number(value), currency)} contentStyle={{ borderRadius: 8, borderColor: "#cfd8d4" }} />
            <Bar dataKey="cost" radius={[6, 6, 0, 0]}>
              {costData.map((item) => (
                <Cell key={item.id} fill={item.type === "Прямое ЖД" ? "#23c7a5" : "#2b7fff"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-panel">
        <PanelHead title="Leaderboard" text="Самые выгодные ставки внутри текущего среза." />
        <div className="leaderboard-list">
          {leaderboard.map((item, index) => (
            <div className="leader-row" key={item.id}>
              <span>{index + 1}</span>
              <div>
                <strong>{item.route}</strong>
                <small>{item.operator}</small>
              </div>
              <em>{formatMoney(item.cost, currency)}</em>
              {item.save > 0 ? <b>дешевле на {item.save.toFixed(1)}%</b> : null}
            </div>
          ))}
        </div>
      </div>

      <div className="chart-panel">
        <PanelHead title="ЖД vs море" text="Сравнение канала, оператора, минимума и транзита." />
        <div className="lane-stack">
          {transport.map((lane) => (
            <div className={`lane-row ${lane.count ? "" : "lane-row-empty"}`} key={lane.label}>
              <div>
                <strong>{lane.label}</strong>
                <small>{lane.count ? `${lane.count} ставок · ${lane.transit} дней` : "Готово для новой линии"}</small>
              </div>
              <span>{lane.count ? formatMoney(lane.avgCost, currency) : "—"}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="chart-panel">
        <PanelHead title="Динамика ставок" text="Готово к истории по датам, работает уже на обновлениях." />
        <ResponsiveContainer width="100%" height={270}>
          <LineChart data={trend} margin={{ top: 16, right: 16, left: 0, bottom: 8 }}>
            <CartesianGrid stroke="#d9e0dc" vertical={false} />
            <XAxis dataKey="month" tick={{ fill: "#58645f", fontSize: 11 }} />
            <YAxis tick={{ fill: "#58645f", fontSize: 11 }} tickFormatter={(value) => `${Math.round(Number(value) / 1000)}k`} />
            <Tooltip formatter={(value) => formatMoney(Number(value), currency)} contentStyle={{ borderRadius: 8, borderColor: "#cfd8d4" }} />
            <Line type="monotone" dataKey="rail" stroke="#23c7a5" strokeWidth={3} dot={{ r: 3 }} name="ЖД" />
            <Line type="monotone" dataKey="sea" stroke="#2b7fff" strokeWidth={3} dot={{ r: 3 }} name="Море" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-panel chart-panel-wide">
        <PanelHead title="Плотность ставок" text="Средняя стоимость по доступным каналам." />
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={transport.filter((lane) => lane.count)} margin={{ top: 16, right: 16, left: 0, bottom: 8 }}>
            <defs>
              <linearGradient id="costFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2b7fff" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#23c7a5" stopOpacity={0.03} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#d9e0dc" vertical={false} />
            <XAxis dataKey="label" tick={{ fill: "#58645f", fontSize: 11 }} />
            <YAxis tick={{ fill: "#58645f", fontSize: 11 }} tickFormatter={(value) => `${Math.round(Number(value) / 1000)}k`} />
            <Tooltip formatter={(value) => formatMoney(Number(value), currency)} contentStyle={{ borderRadius: 8, borderColor: "#cfd8d4" }} />
            <Area type="monotone" dataKey="avgCost" stroke="#2b7fff" strokeWidth={3} fill="url(#costFill)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

function PanelHead({ title, text }: { title: string; text: string }) {
  return (
    <div className="panel-head">
      <h2>{title}</h2>
      <p>{text}</p>
    </div>
  );
}

function EmptyPanel({ title, text }: { title: string; text: string }) {
  return (
    <section className="empty-state">
      <h2>{title}</h2>
      <p>{text}</p>
    </section>
  );
}
