export type TransportType = "rail_direct" | "sea";

export type Currency = "RUB" | "USD" | "CNY" | "EUR";

export interface RouteRecord {
  id: string;
  origin_country: string;
  origin_city: string;
  origin_port_or_station: string;
  destination_country: string;
  destination_city: string;
  destination_port_or_station: string;
  transport_type: TransportType;
  shipping_line: string;
  route_name: string;
  cost: number;
  currency: Currency;
  transit_days: number;
  updated_at: string;
  comment: string;
}

export interface RouteFilters {
  origin_country: string;
  origin_city: string;
  destination_country: string;
  destination_city: string;
  transport_type: "all" | TransportType;
  shipping_line: string;
  currency: "all" | Currency;
  minCost: string;
  maxCost: string;
}

export type SortKey = keyof RouteRecord;

export interface SortState {
  key: SortKey;
  direction: "asc" | "desc";
}

export interface ComparisonEntry {
  record: RouteRecord;
  displayCost: number;
  rank: number;
  deltaToBest: number;
  deltaPercentToBest: number;
  cheaperThanNextPercent: number;
  isBestForRoute: boolean;
}
