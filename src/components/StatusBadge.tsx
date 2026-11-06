import type { TaskStatus } from '../types';
import { STATUS_LABELS, STATUS_COLORS } from '../utils/status';

export function StatusBadge({ status }: { status: TaskStatus }) {
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium border ${STATUS_COLORS[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
