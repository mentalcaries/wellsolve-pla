import type { ProductionInterval, ProductionReading, Well } from '../types';

export const well: Well = {
  id: 'f-120',
  name: 'F-120',
  field: 'Fish',
  wellType: 'Gas Injection',
  country: 'Trinidad and Tobago',
  region: 'North Coast',
  location: 'Offshore Platform',
  monitoringFrequency: 'Monthly',
  streams: ['oil', 'condensate', 'gas'],
  barrierStatus: 'Degraded',
  production: {
    oilPotential: 2400,
    oilActual: 1650,
    condensatePotential: 300,
    condensateActual: 180,
    gasPotential: 8200000,
    gasActual: 6900000,
  },
};

export const lossEvent = {
  startedAt: '2026-10-01',
  latestUpdateAt: '2026-10-12',
  calculatedThrough: '2026-10-13',
  phase: 'Reduced Rates',
  cause: 'Well integrity',
  cumulativeOilLoss: 14700,
  cumulativeCondensateLoss: 2100,
  cumulativeGasLoss: 37600000,
  grossRevenueLoss: 1119700,
};

export const productionIntervals: ProductionInterval[] = [
  { id: 'baseline', startDate: '2026-09-28', endDate: '2026-09-30', status: 'Normal Production', oil: 2400, condensate: 300, gas: 8200000, oilPotential: 2400, condensatePotential: 300, gasPotential: 8200000, source: 'CSV import' },
  { id: 'reduced-1', startDate: '2026-10-01', endDate: '2026-10-06', status: 'Reduced Rates', oil: 1650, condensate: 180, gas: 6900000, oilPotential: 2400, condensatePotential: 300, gasPotential: 8200000, source: 'CSV import' },
  { id: 'intervention', startDate: '2026-10-07', endDate: '2026-10-09', status: 'Intervention', oil: 0, condensate: 0, gas: 0, oilPotential: 2400, condensatePotential: 300, gasPotential: 8200000, source: 'Manual' },
  { id: 'reduced-2', startDate: '2026-10-10', endDate: '2026-10-13', status: 'Reduced Rates', oil: 1650, condensate: 180, gas: 6900000, oilPotential: 2400, condensatePotential: 300, gasPotential: 8200000, source: 'Manual' },
];

export const productionReadings: ProductionReading[] = [
  { id: 'r-13-16', recordedAt: '2026-10-13T16:00:00', status: 'Reduced Rates', oil: 1650, condensate: 180, gas: 6900000, source: 'Manual', author: 'Don Joe' },
  { id: 'r-13-08', recordedAt: '2026-10-13T08:00:00', status: 'Reduced Rates', oil: 1620, condensate: 176, gas: 6850000, source: 'Manual', author: 'Don Joe' },
  { id: 'r-12', recordedAt: '2026-10-12T08:00:00', status: 'Reduced Rates', oil: 1650, condensate: 180, gas: 6900000, source: 'CSV import' },
  { id: 'r-11', recordedAt: '2026-10-11T08:00:00', status: 'Reduced Rates', oil: 1650, condensate: 180, gas: 6900000, source: 'Manual', author: 'Don Joe' },
  { id: 'r-10', recordedAt: '2026-10-10T08:00:00', status: 'Reduced Rates', oil: 1650, condensate: 180, gas: 6900000, source: 'Manual', author: 'Don Joe' },
  { id: 'r-09', recordedAt: '2026-10-09T08:00:00', status: 'Intervention', oil: 0, condensate: 0, gas: 0, source: 'Manual', author: 'Don Joe' },
  { id: 'r-07', recordedAt: '2026-10-07T08:00:00', status: 'Intervention', oil: 0, condensate: 0, gas: 0, source: 'Manual', author: 'Don Joe' },
  { id: 'r-06', recordedAt: '2026-10-06T08:00:00', status: 'Reduced Rates', oil: 1650, condensate: 180, gas: 6900000, source: 'CSV import' },
  { id: 'r-01', recordedAt: '2026-10-01T08:00:00', status: 'Reduced Rates', oil: 1650, condensate: 180, gas: 6900000, source: 'CSV import' },
  { id: 'r-30', recordedAt: '2026-09-30T08:00:00', status: 'Normal Production', oil: 2400, condensate: 300, gas: 8200000, source: 'CSV import' },
];
