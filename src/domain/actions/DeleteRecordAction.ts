import { Action, FieldSchema, RunResult } from '../Action';
import { api, ApiError } from '../../lib/api';

const COLLECTIONS = [
  { value: 'users', label: 'Users' },
  { value: 'orders', label: 'Orders' },
  { value: 'leads', label: 'Leads' },
  { value: 'tasks', label: 'Tasks' },
];

export class DeleteRecordAction extends Action {
  static id = 'delete_record';
  static label = 'Delete record';
  static icon = '🗑';
  static color = '#ef4444';
  static description = 'Permanently remove a record from a collection';
  static fields: FieldSchema[] = [
    { key: 'collection', label: 'Collection', type: 'select', required: true, options: COLLECTIONS },
    { key: 'recordId', label: 'Record ID', type: 'text', placeholder: 'u_1', required: true },
  ];

  async run(config: Record<string, any>): Promise<RunResult> {
    if (!config.collection) return { ok: false, message: 'No collection chosen' };
    if (!config.recordId) return { ok: false, message: 'Record ID is required' };
    try {
      await api(`/${config.collection}/${config.recordId}`, { method: 'DELETE' });
      return { ok: true, message: `Deleted ${config.recordId} from ${config.collection}` };
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : String(e);
      return { ok: false, message: msg };
    }
  }

  summary(config: Record<string, any>): string {
    if (!config.recordId) return 'No record ID set';
    return `${config.recordId} from ${config.collection || '?'}`;
  }
}
