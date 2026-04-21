import type { RouteRecord, TransportType } from "../types/logistics";

type SourceRoute = {
  sourceRow: number;
  originCity: string;
  originStation: string;
  destinationCountry: string;
  destinationCity: string;
  destinationPoint: string;
  transportType: TransportType;
  shippingLine: string;
  cost: number;
  unit: string;
  transitDays: number;
  comment: string;
};

const updatedAt = "2026-04-20";

const seaRows: SourceRoute[] = [
  sea(30, "Новосибирск", "CY Клещиха", "Китай", "Шанхай", 180000, "1х20 HC"),
  sea(31, "Новосибирск", "CY Клещиха", "Китай", "Шанхай", 197000, "1х40 HC"),
  sea(32, "Новосибирск", "CY Клещиха", "Китай", "Циндао / Тяньцзинь", 190000, "1х20 HC"),
  sea(33, "Новосибирск", "CY Клещиха", "Китай", "Циндао / Тяньцзинь", 233000, "1х40 HC"),
  sea(34, "Новосибирск", "CY Клещиха", "Ю. Корея", "Пусан", 196000, "1х20 HC"),
  sea(35, "Новосибирск", "CY Клещиха", "Ю. Корея", "Пусан", 188000, "1х40 HC"),
  sea(36, "Новосибирск", "CY Клещиха", "Вьетнам", "Хошимин", 241000, "1х20 HC"),
  sea(37, "Новосибирск", "CY Клещиха", "Вьетнам", "Хошимин", 365000, "1х40 HC"),
  sea(38, "Барнаул", "CY Барнаул", "Китай", "Шанхай", 194000, "1х20 HC"),
  sea(39, "Барнаул", "CY Барнаул", "Китай", "Шанхай", 202000, "1х40 HC"),
  sea(40, "Барнаул", "CY Барнаул", "Китай", "Циндао", 186000, "1х20 HC"),
  sea(41, "Барнаул", "CY Барнаул", "Китай", "Циндао", 237000, "1х40 HC"),
  sea(42, "Барнаул", "CY Барнаул", "Китай", "Тяньцзинь", 210000, "1х20 HC"),
  sea(43, "Барнаул", "CY Барнаул", "Китай", "Тяньцзинь", 256000, "1х40 HC"),
  sea(44, "Барнаул", "CY Барнаул", "Ю. Корея", "Пусан", 215000, "1х20 HC"),
  sea(45, "Барнаул", "CY Барнаул", "Ю. Корея", "Пусан", 202000, "1х40 HC"),
  sea(46, "Барнаул", "CY Барнаул", "Вьетнам", "Хошимин", 260000, "1х20 HC"),
  sea(47, "Барнаул", "CY Барнаул", "Вьетнам", "Хошимин", 370000, "1х40 HC"),
  sea(48, "Омск", "CY Омск-Восточный", "Китай", "Шанхай", 212000, "1х20 HC"),
  sea(49, "Омск", "CY Омск-Восточный", "Китай", "Шанхай", 223000, "1х40 HC"),
  sea(50, "Омск", "CY Омск-Восточный", "Китай", "Циндао", 222000, "1х20 HC"),
  sea(51, "Омск", "CY Омск-Восточный", "Китай", "Циндао", 258000, "1х40 HC"),
  sea(52, "Омск", "CY Омск-Восточный", "Китай", "Тяньцзинь", 232000, "1х20 HC"),
  sea(53, "Омск", "CY Омск-Восточный", "Китай", "Тяньцзинь", 278000, "1х40 HC"),
  sea(54, "Омск", "CY Омск-Восточный", "Ю. Корея", "Пусан", 240000, "1х20 HC"),
  sea(55, "Омск", "CY Омск-Восточный", "Ю. Корея", "Пусан", 246000, "1х40 HC"),
  sea(56, "Омск", "CY Омск-Восточный", "Вьетнам", "Хошимин", 283000, "1х20 HC"),
  sea(57, "Омск", "CY Омск-Восточный", "Вьетнам", "Хошимин", 400500, "1х40 HC"),
  sea(58, "Ужур", "ст. Ужур", "Китай", "Шанхай", 163508, "1х20 HC до 25т"),
  sea(59, "Ужур", "ст. Ужур", "Китай", "Шанхай", 185984, "1х20 HC свыше 25т"),
  sea(60, "Ужур", "ст. Ужур", "Китай", "Шанхай", 244097, "1х40 HC, контейнерный поезд"),
  sea(61, "Ужур", "ст. Ужур", "Китай", "Циндао", 188923, "1х20 HC до 25т"),
  sea(62, "Ужур", "ст. Ужур", "Китай", "Циндао", 212000, "1х20 HC свыше 25т"),
  sea(63, "Ужур", "ст. Ужур", "Китай", "Циндао", 279000, "1х40 HC, контейнерный поезд"),
  sea(64, "Ужур", "ст. Ужур", "Китай", "Тяньцзинь", 195000, "1х20 HC до 25т"),
  sea(65, "Ужур", "ст. Ужур", "Китай", "Тяньцзинь", 218000, "1х20 HC свыше 25т"),
  sea(66, "Ужур", "ст. Ужур", "Китай", "Тяньцзинь", 299000, "1х40 HC, контейнерный поезд"),
  sea(67, "Ужур", "ст. Ужур", "Ю. Корея", "Пусан", 199870, "1х20 HC до 25т"),
  sea(68, "Ужур", "ст. Ужур", "Ю. Корея", "Пусан", 222347, "1х20 HC свыше 25т"),
  sea(69, "Ужур", "ст. Ужур", "Ю. Корея", "Пусан", 244175, "1х40 HC, контейнерный поезд"),
  sea(70, "Ужур", "ст. Ужур", "Вьетнам", "Хайфон", 245000, "1х20 HC до 25т"),
  sea(71, "Ужур", "ст. Ужур", "Вьетнам", "Хайфон", 268000, "1х20 HC свыше 25т"),
  sea(72, "Ужур", "ст. Ужур", "Вьетнам", "Хайфон", 413000, "1х40 HC, контейнерный поезд")
];

const railRows: SourceRoute[] = [
  rail(87, "Новосибирск", "CY Клещиха", "Китай", "Шанхай", 137000, "1х20 HC"),
  rail(88, "Новосибирск", "CY Клещиха", "Китай", "Шанхай", 170000, "1х40 HC"),
  rail(89, "Новосибирск", "CY Клещиха", "Китай", "Циндао", 133000, "1х20 HC"),
  rail(90, "Новосибирск", "CY Клещиха", "Китай", "Циндао", 185000, "1х40 HC"),
  rail(91, "Барнаул", "CY Барнаул", "Китай", "Шанхай", 137000, "1х20 HC"),
  rail(92, "Барнаул", "CY Барнаул", "Китай", "Шанхай", 177000, "1х40 HC"),
  rail(93, "Барнаул", "CY Барнаул", "Китай", "Циндао", 134000, "1х20 HC"),
  rail(94, "Барнаул", "CY Барнаул", "Китай", "Циндао", 192000, "1х40 HC"),
  rail(95, "Омск", "CY Омск-Восточный", "Китай", "Шанхай", 160000, "1х20 HC"),
  rail(96, "Омск", "CY Омск-Восточный", "Китай", "Шанхай", 196000, "1х40 HC"),
  rail(97, "Омск", "CY Омск-Восточный", "Китай", "Циндао", 156000, "1х20 HC"),
  rail(98, "Омск", "CY Омск-Восточный", "Китай", "Циндао", 212000, "1х40 HC")
];

export const demoRoutes: RouteRecord[] = [...railRows, ...seaRows].map(toRouteRecord);

function sea(
  sourceRow: number,
  originCity: string,
  originStation: string,
  destinationCountry: string,
  destinationCity: string,
  cost: number,
  unit: string
): SourceRoute {
  return {
    sourceRow,
    originCity,
    originStation,
    destinationCountry,
    destinationCity,
    destinationPoint: `Порт ${destinationCity}`,
    transportType: "sea",
    shippingLine: "FESCO",
    cost,
    unit,
    transitDays: destinationCountry === "Китай" ? 28 : destinationCountry === "Ю. Корея" ? 24 : 36,
    comment: "Вариант 4: контейнеры через Находку/Восточный, LIFO; ставка из XLSX."
  };
}

function rail(
  sourceRow: number,
  originCity: string,
  originStation: string,
  destinationCountry: string,
  destinationCity: string,
  cost: number,
  unit: string
): SourceRoute {
  return {
    sourceRow,
    originCity,
    originStation,
    destinationCountry,
    destinationCity,
    destinationPoint: `FOR сдача порожнего в ${destinationCity}`,
    transportType: "rail_direct",
    shippingLine: "",
    cost,
    unit,
    transitDays: destinationCity === "Шанхай" ? 12 : 13,
    comment: "Прямое ЖД: ставка из XLSX, раздел «Прямое жд»."
  };
}

function toRouteRecord(row: SourceRoute): RouteRecord {
  return {
    id: `${row.transportType}-${row.sourceRow}`,
    origin_country: "Россия",
    origin_city: row.originCity,
    origin_port_or_station: row.originStation,
    destination_country: row.destinationCountry,
    destination_city: row.destinationCity,
    destination_port_or_station: row.destinationPoint,
    transport_type: row.transportType,
    shipping_line: row.shippingLine,
    route_name: `${row.originStation} → ${row.destinationCity} · ${row.unit}`,
    cost: row.cost,
    currency: "RUB",
    transit_days: row.transitDays,
    updated_at: updatedAt,
    comment: `XLSX строка ${row.sourceRow}. ${row.comment}`
  };
}
