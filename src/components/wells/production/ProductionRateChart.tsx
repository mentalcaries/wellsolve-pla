import type { CSSProperties } from 'react';
import type { ChartStatusBand } from '../../../lib/production';

const bandColors = {
  baseline: 'var(--chart-baseline)',
  reduced: 'var(--chart-reduced-band)',
  intervention: 'var(--chart-intervention-band)',
  recovery: 'var(--chart-recovery-band)',
};

const formatNumber = (value: number) => new Intl.NumberFormat('en-US').format(value);

function steppedPath(values: number[], max: number, width: number, height: number) {
  const innerHeight = height - 20;
  const denominator = Math.max(1, values.length - 1);
  const y = (value: number) => 10 + innerHeight * (1 - value / max);
  let path = `M 0 ${y(values[0])}`;
  values.slice(1).forEach((value, index) => {
    const x = ((index + 1) / denominator) * width;
    path += ` H ${x} V ${y(value)}`;
  });
  return path;
}

function lossAreaPath(values: number[], max: number, width: number, height: number) {
  const innerHeight = height - 20;
  const denominator = Math.max(1, values.length - 1);
  const actualY = (value: number) => 10 + innerHeight * (1 - value / max);
  const potentialY = 10;
  let path = `M 0 ${potentialY} L ${width} ${potentialY} L ${width} ${actualY(values.at(-1) ?? 0)}`;
  for (let index = values.length - 2; index >= 0; index -= 1) {
    const nextX = ((index + 1) / denominator) * width;
    const x = (index / denominator) * width;
    path += ` H ${nextX} V ${actualY(values[index])} H ${x}`;
  }
  return `${path} Z`;
}

export function ProductionRateChart({
  name,
  unit,
  potential,
  latest,
  values,
  color,
  bands,
}: {
  name: string;
  unit: string;
  potential: number;
  latest: number;
  values: number[];
  color: string;
  bands: ChartStatusBand[];
}) {
  const width = 1000;
  const height = 150;
  const denominator = Math.max(1, values.length - 1);
  const totalDays = bands.reduce((total, band) => total + band.days, 0);
  return (
    <section className='production-chart' style={{ '--stream-color': color } as CSSProperties}>
      <header>
        <div><strong>{name}</strong><span> · {unit}</span></div>
        <p>Potential {formatNumber(potential)} · Latest actual {formatNumber(latest)}</p>
      </header>
      <div className='chart-layout'>
        <div className='chart-y-axis' aria-hidden='true'><span>{formatNumber(potential)}</span><span>{formatNumber(potential / 2)}</span><span>0</span></div>
        <div className='chart-plot'>
          <svg viewBox={`0 0 ${width} ${height}`} role='img' aria-label={`${name} actual production compared with potential from 28 September to 13 October 2026`} preserveAspectRatio='none'>
            {bands.map((band, index) => {
              const elapsedDays = bands.slice(0, index).reduce((total, item) => total + item.days, 0);
              const x = elapsedDays / totalDays * width;
              const bandWidth = band.days / totalDays * width;
              return <rect key={band.label} x={x} y='0' width={bandWidth} height={height} fill={bandColors[band.tone]} />;
            })}
            {[10, height / 2, height - 10].map(y => <line key={y} x1='0' x2={width} y1={y} y2={y} className='chart-grid-line' />)}
            {bands.slice(0, -1).map((_, index) => {
              const days = bands.slice(0, index + 1).reduce((total, band) => total + band.days, 0);
              return <line key={days} x1={days / totalDays * width} x2={days / totalDays * width} y1='0' y2={height} className='chart-boundary-line' />;
            })}
            <path d={lossAreaPath(values, potential, width, height)} className='chart-loss-area' />
            <line x1='0' x2={width} y1='10' y2='10' className='chart-potential-line' />
            <path d={steppedPath(values, potential, width, height)} className='chart-actual-line' />
            {values.map((value, index) => <circle key={`${name}-${index}`} cx={index / denominator * width} cy={10 + (height - 20) * (1 - value / potential)} r='3.5' className='chart-reading-point' />)}
          </svg>
        </div>
      </div>
      <div className='chart-status-layout'>
        <span aria-hidden='true' />
        <div className='chart-status-lane'>{bands.map(band => <div key={band.label} className={`chart-status ${band.tone}`} style={{ flex: band.days }} title={band.label}><span className='status-full'>{band.label}</span><span className='status-short'>{band.shortLabel}</span></div>)}</div>
      </div>
    </section>
  );
}
