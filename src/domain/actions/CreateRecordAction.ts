import { Action, FieldSchema, RunResult, delay, randomLatency, maybeFail } from '../Action';

export class CreateRecordAction extends Action {
  static id = 'create_record';
  static label = 'Create record';
  static icon = '＋';
  static color = '#10b981';
  static description = 'Insert a new row into a collection';
  static fields: FieldSchema[] = [
    {
      key: 'collection',
      label: 'Collection',
      type: 'select',
      required: true,
      options: [
        { value: 'users', label: 'Users' },
        { value: 'orders', label: 'Orders' },
        { value: 'leads', label: 'Leads' },
        { value: 'tasks', label: 'Tasks' },
      ],
    },
    { key: 'name', label: 'Name', type: 'text', placeholder: 'Acme Inc.', required: true },
    { key: 'notes', label: 'Notes', type: 'textarea', placeholder: 'Optional notes' },
  ];

  async run(config: Record<string, any>): Promise<RunResult> {
    await delay(randomLatency());
    if (maybeFail()) {
      return { ok: false, message: `Could not create record in ${config.collection || '?'}` };
    }
    return { ok: true, message: `Created "${config.name || 'unnamed'}" in ${config.collection || '?'}` };
  }

  summary(config: Record<string, any>): string {
    if (!config.collection) return 'No collection chosen';
    return `in ${config.collection}` + (config.name ? `, "${config.name}"` : '');
  }
}
