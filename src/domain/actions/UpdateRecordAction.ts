import { Action, FieldSchema, RunResult, delay, randomLatency, maybeFail } from '../Action';

export class UpdateRecordAction extends Action {
  static id = 'update_record';
  static label = 'Update record';
  static icon = '✎';
  static color = '#0ea5e9';
  static description = 'Modify fields on an existing record';
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
    { key: 'recordId', label: 'Record ID', type: 'text', placeholder: 'rec_abc123', required: true },
    { key: 'field', label: 'Field to update', type: 'text', placeholder: 'status' },
    { key: 'value', label: 'New value', type: 'text', placeholder: 'archived' },
  ];

  async run(config: Record<string, any>): Promise<RunResult> {
    await delay(randomLatency());
    if (maybeFail()) {
      return { ok: false, message: `Update on ${config.recordId || '?'} rejected by server` };
    }
    return {
      ok: true,
      message: `Updated ${config.recordId || '?'} (${config.field || 'field'} = ${config.value ?? '""'})`,
    };
  }

  summary(config: Record<string, any>): string {
    if (!config.recordId) return 'No record ID set';
    if (!config.field) return `${config.recordId} (no field)`;
    return `${config.recordId}.${config.field}`;
  }
}
