import { Action, ActionClass } from './Action';
import { SendEmailAction } from './actions/SendEmailAction';

export const ACTION_REGISTRY: ActionClass[] = [
  SendEmailAction as unknown as ActionClass,
];

export function findActionClass(id: string): ActionClass | undefined {
  return ACTION_REGISTRY.find((cls) => cls.id === id);
}

export function instantiate(id: string): Action | undefined {
  const cls = findActionClass(id);
  if (!cls) return undefined;
  return new (cls as unknown as new () => Action)();
}
