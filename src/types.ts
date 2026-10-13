export type ProductionStream = 'oil' | 'gas';

export interface ProductionRates {
  oilPotential: number;
  oilActual: number;
  gasPotential: number;
  gasActual: number;
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
