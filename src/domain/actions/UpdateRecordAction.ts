import { Action, FieldSchema, RunResult } from '../Action';
import { api, ApiError } from '../../lib/api';

const COLLECTIONS = [
  { value: 'users', label: 'Users' },
  { value: 'orders', label: 'Orders' },
  { value: 'leads', label: 'Leads' },
  { value: 'tasks', label: 'Tasks' },
];

export class UpdateRecordAction extends Action {
  static id = 'update_record';
  static label = 'Update record';
  static icon = '✎';
  static color = '#0ea5e9';
  static description = 'Modify fields on an existing record';
  static fields: FieldSchema[] = [
    { key: 'collection', label: 'Collection', type: 'select', required: true, options: COLLECTIONS },
    { key: 'recordId', label: 'Record ID', type: 'text', placeholder: '1', required: true, help: 'Numeric id from the chosen collection' },
    { key: 'field', label: 'Field to update', type: 'text', placeholder: 'status', required: true },
    { key: 'value', label: 'New value', type: 'text', placeholder: 'archived' },
  ];

  async run(config: Record<string, any>): Promise<RunResult> {
    if (!config.collection) return { ok: false, message: 'No collection chosen' };
    if (!config.recordId) return { ok: false, message: 'Record ID is required' };
    if (!config.field) return { ok: false, message: 'Field is required' };
    try {
      await api(`/${config.collection}/${config.recordId}`, {
        method: 'PATCH',
        body: JSON.stringify({ [config.field]: config.value ?? '' }),
      });
      return { ok: true, message: `Updated ${config.recordId}.${config.field}` };
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : String(e);
      return { ok: false, message: msg };
    }
  }

  summary(config: Record<string, any>): string {
    if (!config.recordId) return 'No record ID set';
    if (!config.field) return `${config.recordId} (no field)`;
    return `${config.recordId}.${config.field}`;
  }
}
