export type ProductionStream = 'oil' | 'condensate' | 'gas';

export type ProductionStatus =
  | 'Normal Production'
  | 'Reduced Rates'
  | 'Shut-in / No Production'
  | 'Intervention'
  | 'Recovery / Ramp-up'
  | 'Permanently Ceased / Abandoned';

export interface ProductionRates {
  oilPotential: number;
  oilActual: number;
  condensatePotential: number;
  condensateActual: number;
  gasPotential: number;
  gasActual: number;
}

export interface ProductionReading {
  id: string;
  recordedAt: string;
  status: ProductionStatus;
  oil: number;
  condensate: number;
  gas: number;
  source: 'Manual' | 'CSV import';
  author?: string;
}

export interface ProductionInterval {
  id: string;
  startDate: string;
  endDate: string;
  status: ProductionStatus;
  oil: number;
  condensate: number;
  gas: number;
  oilPotential: number;
  condensatePotential: number;
  gasPotential: number;
  source: 'Manual' | 'CSV import';
  lossContext?: string;
}

export interface ProductionUpdate {
  rates: ProductionRates;
  startDate: string;
  endDate: string;
  status: ProductionStatus;
  lossContext: string;
}

export interface Well {
  id: string;
  name: string;
  field: string;
  wellType: string;
  country: string;
  region: string;
  location: string;
  monitoringFrequency: string;
  streams: ProductionStream[];
  barrierStatus: 'Healthy' | 'Degraded' | '1B Contained' | 'Critical';
  production: ProductionRates;
}
