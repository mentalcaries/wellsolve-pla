export function formatNumber(value: string) { const number = Number.parseFloat(value.replace(/,/g, '')); return Number.isNaN(number) ? '' : number.toLocaleString('en-US'); }
export function formatCurrency(amount: number) { return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount); }
export function calculatePercentage(cost: number, totalCost: number) { return totalCost === 0 ? '0.0%' : `${((cost / totalCost) * 100).toFixed(1)}%`; }
export const parseNum = (value: string | number) => Number.parseFloat(String(value).replaceAll(',', '')) || 0;
