import { Action, ActionClass } from './Action';
import { SendEmailAction } from './actions/SendEmailAction';
import { CreateRecordAction } from './actions/CreateRecordAction';
import { UpdateRecordAction } from './actions/UpdateRecordAction';
import { DeleteRecordAction } from './actions/DeleteRecordAction';
import { SendSlackAction } from './actions/SendSlackAction';

export const ACTION_REGISTRY: ActionClass[] = [
  SendEmailAction as unknown as ActionClass,
  CreateRecordAction as unknown as ActionClass,
  UpdateRecordAction as unknown as ActionClass,
  DeleteRecordAction as unknown as ActionClass,
  SendSlackAction as unknown as ActionClass,
];

export function findActionClass(id: string): ActionClass | undefined {
  return ACTION_REGISTRY.find((cls) => cls.id === id);
}

export function instantiate(id: string): Action | undefined {
  const cls = findActionClass(id);
  if (!cls) return undefined;
  return new (cls as unknown as new () => Action)();
}
