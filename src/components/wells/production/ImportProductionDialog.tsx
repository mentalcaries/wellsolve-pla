import { FileSpreadsheet, Upload } from 'lucide-react';
import { useRef, useState } from 'react';
import type { ProductionReading, ProductionStatus } from '../../../types';
import { Button, Modal } from '../../ui';

const statuses: ProductionStatus[] = ['Normal Production', 'Reduced Rates', 'Shut-in / No Production', 'Intervention', 'Recovery / Ramp-up', 'Permanently Ceased / Abandoned'];

export function ImportProductionDialog({ onClose, onImport }: { onClose: () => void; onImport: (readings: ProductionReading[]) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [preview, setPreview] = useState<ProductionReading[]>([]);

  const parseFile = async (file?: File) => {
    if (!file) return;
    setFileName(file.name);
    const lines = (await file.text()).trim().split(/\r?\n/).filter(Boolean);
    const headers = lines[0]?.split(',').map(value => value.trim()) ?? [];
    const required = ['recordedAt', 'status', 'oil', 'condensate', 'gas'];
    const missing = required.filter(header => !headers.includes(header));
    if (missing.length) {
      setPreview([]);
      setErrors([`Missing columns: ${missing.join(', ')}`]);
      return;
    }
    const issues: string[] = [];
    const rows = lines.slice(1).map((line, index) => {
      const values = line.split(',').map(value => value.trim());
      const cell = (name: string) => values[headers.indexOf(name)] ?? '';
      const status = cell('status') as ProductionStatus;
      const oil = Number(cell('oil'));
      const condensate = Number(cell('condensate'));
      const gas = Number(cell('gas'));
      if (Number.isNaN(Date.parse(cell('recordedAt')))) issues.push(`Row ${index + 2}: invalid recordedAt`);
      if (!statuses.includes(status)) issues.push(`Row ${index + 2}: invalid production status`);
      if ([oil, condensate, gas].some(value => !Number.isFinite(value) || value < 0)) issues.push(`Row ${index + 2}: rates must be non-negative numbers`);
      return { id: `import-${Date.now()}-${index}`, recordedAt: cell('recordedAt'), status, oil, condensate, gas, source: 'CSV import' as const };
    });
    setErrors(issues);
    setPreview(issues.length ? [] : rows);
  };

  return (
    <Modal title='Import production data' description='F-120 · Upload timestamped production readings' onClose={onClose} size='large'>
      <div className='import-steps' aria-label='Import workflow'><strong>1 Upload CSV</strong><span className={preview.length ? 'complete' : ''}>2 Validate columns & units</span><span>3 Review readings</span><span>4 Confirm import</span></div>
      <input ref={inputRef} className='sr-only' type='file' accept='.csv,text/csv' onChange={event => void parseFile(event.target.files?.[0])}/>
      <button type='button' className='production-dropzone' onClick={() => inputRef.current?.click()}><Upload size={22}/><strong>{fileName || 'Choose a CSV file'}</strong><span>{fileName ? 'Choose another file' : 'recordedAt, status, oil, condensate, gas'}</span></button>
      {errors.length > 0 && <div className='import-errors'><strong>Resolve these issues before importing:</strong>{errors.map(error => <span key={error}>{error}</span>)}</div>}
      {preview.length > 0 && <div className='import-preview'><strong>{preview.length} readings ready to import</strong><div><span>Recorded</span><span>Status</span><span>Oil</span><span>Condensate</span><span>Gas</span>{preview.slice(0, 3).flatMap(reading => [<span key={`${reading.id}-date`}>{reading.recordedAt}</span>,<span key={`${reading.id}-status`}>{reading.status}</span>,<span key={`${reading.id}-oil`}>{reading.oil}</span>,<span key={`${reading.id}-condensate`}>{reading.condensate}</span>,<span key={`${reading.id}-gas`}>{reading.gas}</span>])}</div>{preview.length > 3 && <small>Showing 3 of {preview.length} readings</small>}</div>}
      <div className='info-neutral import-format-note'><FileSpreadsheet size={16}/><div><strong>Expected stream units</strong><span>Oil and condensate: bbl/day · Natural gas: Scf/day. ISO timestamps are retained for audit history.</span></div></div>
      <footer className='modal-actions'><Button variant='secondary' onClick={onClose}>Cancel</Button><Button disabled={!preview.length || errors.length > 0} onClick={() => onImport(preview)}>Confirm import</Button></footer>
    </Modal>
  );
}
