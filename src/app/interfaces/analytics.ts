// src/app/interfaces/analytics.ts

export interface OrderStat {
  value: number;
  count: number;
}

export interface ByStatus {
  paid: OrderStat;
  refund: OrderStat;
  expired: OrderStat;
}

export interface Bucket {
  label: string;
  byStatus: {
    All: ByStatus;
  };
}

export interface Kpis {
  paid_orders: number;
  paid_value: number;
  payment_rate: number;
}

export interface AnalyticsResponse {
  currency: string;
  timezone: string;
  range: string;
  kpis: Kpis;
  buckets: Bucket[];
}
