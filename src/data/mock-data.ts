import type { Well } from '../types';

export const well: Well = {
  id: 'f-120',
  name: 'F-120',
  field: 'Fish',
  wellType: 'Gas Injection',
  country: 'Trinidad and Tobago',
  region: 'North Coast',
  location: 'Offshore Platform',
  monitoringFrequency: 'Monthly',
  streams: ['oil', 'gas'],
  barrierStatus: 'Degraded',
  production: { oilPotential: 2400, oilActual: 1650, gasPotential: 8200, gasActual: 6900 },
};

export const lossEvent = {
  startedAt: '2026-10-01',
  latestUpdateAt: '2026-10-12',
  calculatedThrough: '2026-10-13',
  phase: 'Reduced production',
  cause: 'Well integrity',
  cumulativeOilLoss: 18420,
  cumulativeGasLoss: 31400,
  grossRevenueLoss: 1620000,
};
