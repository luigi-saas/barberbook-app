import { cn } from '@repo/design-system/lib/utils';
import { CheckCircle2, XCircle } from 'lucide-react';

type StatusType = 'success' | 'error';

interface BBStatusIndicatorProps {
  type: StatusType;
  title: string;
  description?: string;
  className?: string;
}

const config: Record<StatusType, {
  iconBg: string;
  icon: typeof CheckCircle2;
  iconColor: string;
  label: string;
  labelColor: string;
}> = {
  success: {
    iconBg: 'bg-bb-success-container',
    icon: CheckCircle2,
    iconColor: 'text-bb-success',
    label: 'SUCCÈS',
    labelColor: 'text-bb-success',
  },
  error: {
    iconBg: 'bg-bb-error-container',
    icon: XCircle,
    iconColor: 'text-bb-error',
    label: 'ERREUR',
    labelColor: 'text-bb-error',
  },
};

export function BBStatusIndicator({ type, title, description, className }: BBStatusIndicatorProps) {
  const { iconBg, icon: Icon, iconColor, label, labelColor } = config[type];

  return (
    <div
      className={cn(
        'flex items-center justify-between rounded-bb-button bg-white p-4',
        className,
      )}
    >
      <div className="flex items-center gap-4">
        <div className={cn('flex size-10 items-center justify-center rounded-full shrink-0', iconBg)}>
          <Icon className={cn('size-5', iconColor)} />
        </div>
        <div>
          <p className="font-sans text-sm font-semibold text-bb-charcoal leading-5">{title}</p>
          {description && (
            <p className="font-sans text-xs text-bb-charcoal/60 leading-4">{description}</p>
          )}
        </div>
      </div>
      <span className={cn('font-sans text-xs font-semibold leading-4', labelColor)}>{label}</span>
    </div>
  );
}

interface BBStatusGroupProps {
  items: Array<Omit<BBStatusIndicatorProps, 'className'>>;
  className?: string;
}

export function BBStatusGroup({ items, className }: BBStatusGroupProps) {
  return (
    <div className={cn('flex flex-col gap-6 rounded-bb-card bg-bb-surface-elevated p-8', className)}>
      {items.map((item, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: static list
        <BBStatusIndicator key={i} {...item} />
      ))}
    </div>
  );
}
