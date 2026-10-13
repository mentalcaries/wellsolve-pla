export const ESTIMATE_UNITS = ['Each', 'Days', 'Hours', 'Personnel', 'Service', 'Rental', 'Lump Sum'];

export interface EstimateItem { id: string; description: string; unit: string; amount: string; days: string; unitCost: string; isCustom?: boolean }
export interface EstimateCategory { name: string; items: EstimateItem[] }
export interface ContingencyItem { id: string; description: string; probability: number; costImpact: number; mitigations: string }
export interface EstimatesFormValues { estimates: EstimateCategory[]; costContingency: ContingencyItem[] }

const item = (id: string, description: string, unit = '', amount = '', days = '', unitCost = ''): EstimateItem => ({ id, description, unit, amount, days, unitCost });
export const estimatesDefaultValues: EstimatesFormValues = {
  estimates: [
    { name: 'Well Intervention/Rig Repair', items: [item('1','Rig/Intervention type','Service','1','3','30,000'),item('2','Logging/Diagnosis','Service','1','1','25,000'),item('3','Mud/Control Fluid/Chemicals'),item('4','Cementing Cost'),item('5','Bits'),item('6','Perforation'),item('7','Mechanical Plugs')] },
    { name: 'Tree and Downhole Requirements', items: [item('8','Tree Valve Maintenance','Each','1','1','20,000'),item('9','Valves/Valve Internals/Cross block'),item('10','Small Fittings'),item('11','Test Pump/SCSSV Pump rental'),item('12','SCSSV/SCSSV control line'),item('13','Wellhead'),item('14','Flowline and Surface equipment'),item('15','Casing and Downhole equipment')] },
    { name: 'Logistics', items: [item('21','Ground Transportation','Lump Sum','1','1','15,000'),item('22','Machine Shop'),item('23','Equipment Rental'),item('24','Communications'),item('25','Power and Fuel'),item('26','Supervision')] },
  ],
  costContingency: [{ id: 'risk-1', description: 'Extended rig time', probability: 25, costImpact: 100000, mitigations: 'Pre-mobilisation contracting' }],
};
