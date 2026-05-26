import { Action, FieldSchema, RunResult } from '../Action';
import { api, ApiError } from '../../lib/api';

const COLLECTIONS = [
  { value: 'users', label: 'Users' },
  { value: 'orders', label: 'Orders' },
  { value: 'leads', label: 'Leads' },
  { value: 'tasks', label: 'Tasks' },
];

export class CreateRecordAction extends Action {
  static id = 'create_record';
  static label = 'Create record';
  static icon = '＋';
  static color = '#10b981';
  static description = 'Insert a new row into a collection';
  static fields: FieldSchema[] = [
    { key: 'collection', label: 'Collection', type: 'select', required: true, options: COLLECTIONS },
    { key: 'name', label: 'Name', type: 'text', placeholder: 'Acme Inc.', required: true },
    { key: 'notes', label: 'Notes', type: 'textarea', placeholder: 'Optional notes' },
  ];

  async run(config: Record<string, any>): Promise<RunResult> {
    if (!config.collection) return { ok: false, message: 'No collection chosen' };
    if (!config.name) return { ok: false, message: 'Name is required' };
    try {
      const row = await api(`/${config.collection}`, {
        method: 'POST',
        body: JSON.stringify({ name: config.name, notes: config.notes || '' }),
      });
      return { ok: true, message: `Created ${row?.id || 'row'} in ${config.collection}` };
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : String(e);
      return { ok: false, message: msg };
    }
  }

  summary(config: Record<string, any>): string {
    if (!config.collection) return 'No collection chosen';
    return `in ${config.collection}` + (config.name ? `, "${config.name}"` : '');
  }
}
