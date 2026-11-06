import type { TaskStatus } from '../types';
import { STATUS_LABELS } from '../utils/status';

export interface HistoryEntry {
  timestamp: string;
  actorName: string;
  from: TaskStatus;
  to: TaskStatus;
  comment?: string;
}

export function TaskHistory({ entries }: { entries: HistoryEntry[] }) {
  if (entries.length === 0) {
    return <p className="text-gray-400 italic">Пока нет записей в истории</p>;
  }

  return (
    <ul className="space-y-3 bg-white border rounded-xl p-6 shadow-sm">
      {entries.map((entry, idx) => (
        <li
          key={idx}
          className="flex items-start gap-4 border-b pb-3 last:border-b-0"
        >
          <div className="text-xs text-gray-500 shrink-0 w-40">
            {entry.timestamp}
          </div>
          <div>
            <p className="font-medium text-gray-800">
              {entry.actorName} перевёл задачу
            </p>
            <p className="text-sm text-gray-600">
              из{' '}
              <span className="font-mono text-gray-700 bg-gray-100 px-1 rounded">
                {STATUS_LABELS[entry.from]}
              </span>{' '}
              в{' '}
              <span className="font-mono font-bold text-blue-600 bg-blue-50 px-1 rounded">
                {STATUS_LABELS[entry.to]}
              </span>
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
