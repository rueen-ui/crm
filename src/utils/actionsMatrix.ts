import type { TaskStatus, Role } from '../types';

export type ActionType = 'TAKE' | 'SUBMIT' | 'ACCEPT' | 'REWORK' | 'EDIT';

type ButtonVariant = 'primary' | 'success' | 'danger' | 'outline';

interface ActionConfig {
  label: string;
  variant: ButtonVariant;
}

const actionsMap: Record<ActionType, ActionConfig> = {
  TAKE: { label: 'Взять в работу', variant: 'primary' },
  SUBMIT: { label: 'Отправить на проверку', variant: 'primary' },
  ACCEPT: { label: 'Принять', variant: 'success' },
  REWORK: { label: 'На доработку', variant: 'danger' },
  EDIT: { label: 'Редактировать', variant: 'outline' },
};

export function getAvailableActions(
  role: Role,
  status: TaskStatus,
  executorId: string | null,
  currentUserId: string
): ActionType[] {
  const isMyTask = executorId === currentUserId;
  const actions: ActionType[] = [];

  if (role === 'executor' && isMyTask) {
    if (status === 'new') {
      actions.push('TAKE');
    }
    if (status === 'in_progress' || status === 'rework') {
      actions.push('SUBMIT');
    }
  }

  if (role === 'manager') {
    actions.push('EDIT');

    if (status === 'review') {
      actions.push('ACCEPT');
      actions.push('REWORK');
    }
  }

  return actions;
}

export function getActionLabel(action: ActionType): string {
  return actionsMap[action].label;
}

export function getActionStyle(action: ActionType): string {
  switch (actionsMap[action].variant) {
    case 'primary':
      return 'bg-blue-600 text-white hover:bg-blue-700';
    case 'success':
      return 'bg-green-600 text-white hover:bg-green-700';
    case 'danger':
      return 'bg-red-600 text-white hover:bg-red-700';
    case 'outline':
      return 'border border-gray-300 text-gray-700 hover:bg-gray-50';
  }
}


