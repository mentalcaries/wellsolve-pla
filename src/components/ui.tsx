import type { ButtonHTMLAttributes, PropsWithChildren, ReactNode } from 'react';
import { X } from 'lucide-react';

export function Button({ variant = 'primary', className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' | 'link' }) {
  return <button className={`button ${variant} ${className}`} {...props} />;
}

export function Badge({ children, tone = 'orange' }: PropsWithChildren<{ tone?: 'orange' | 'amber' | 'green' }>) {
  return <span className={`badge ${tone}`}>{children}</span>;
}

export function Card({ children, className = '' }: PropsWithChildren<{ className?: string }>) {
  return <section className={`card ${className}`}>{children}</section>;
}

export function Modal({ children, title, description, onClose, size = 'medium' }: PropsWithChildren<{ title: string; description?: string; onClose: () => void; size?: 'small' | 'medium' | 'large' }>) {
  return (
    <div className='modal-layer' role='presentation' onMouseDown={event => event.target === event.currentTarget && onClose()}>
      <section className={`modal ${size}`} role='dialog' aria-modal='true' aria-label={title}>
        <button className='modal-close' type='button' onClick={onClose} aria-label='Close dialog'><X size={17} /></button>
        <header className='modal-heading'><h2>{title}</h2>{description && <p>{description}</p>}</header>
        {children}
      </section>
    </div>
  );
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return <label className='field'><span>{label}</span>{children}{hint && <small>{hint}</small>}</label>;
}
