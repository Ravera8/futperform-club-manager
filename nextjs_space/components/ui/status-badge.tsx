
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: 'Disponível' | 'Em campo' | 'De folga';
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const statusClasses = {
    'Disponível': 'status-disponivel',
    'Em campo': 'status-em-campo',
    'De folga': 'status-de-folga'
  };

  return (
    <span className={cn(
      'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
      statusClasses[status],
      className
    )}>
      <span className={cn(
        'mr-1 h-1.5 w-1.5 rounded-full',
        {
          'bg-green-600': status === 'Disponível',
          'bg-yellow-600': status === 'Em campo', 
          'bg-gray-600': status === 'De folga'
        }
      )} />
      {status}
    </span>
  );
}
