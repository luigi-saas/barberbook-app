'use client';

import { cn } from '@repo/design-system/lib/utils';

interface BBBookingChipProps {
  dayLabel: string;
  date: number | string;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export function BBBookingChip({
  dayLabel,
  date,
  active = false,
  disabled = false,
  onClick,
}: BBBookingChipProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'flex min-w-[80px] flex-col items-center rounded-bb-button px-4 py-4 transition',
        'font-sans font-semibold',
        active
          ? 'bg-bb-gold text-white shadow-[var(--bb-shadow-button)]'
          : 'bg-bb-surface-elevated text-bb-charcoal hover:bg-bb-outline/40',
        disabled && 'pointer-events-none opacity-40',
      )}
    >
      <span
        className={cn(
          'text-xs uppercase leading-4',
          active ? 'text-white/70' : 'text-bb-charcoal/50',
        )}
      >
        {dayLabel}
      </span>
      <span className="text-2xl leading-8">{date}</span>
    </button>
  );
}

interface BBBookingChipsProps {
  chips: Array<Omit<BBBookingChipProps, 'onClick'> & { id: string }>;
  activeId?: string;
  onSelect?: (id: string) => void;
  className?: string;
}

export function BBBookingChips({ chips, activeId, onSelect, className }: BBBookingChipsProps) {
  return (
    <div className={cn('flex flex-wrap gap-3', className)}>
      {chips.map((chip) => (
        <BBBookingChip
          key={chip.id}
          dayLabel={chip.dayLabel}
          date={chip.date}
          active={chip.id === activeId}
          disabled={chip.disabled}
          onClick={() => onSelect?.(chip.id)}
        />
      ))}
    </div>
  );
}
