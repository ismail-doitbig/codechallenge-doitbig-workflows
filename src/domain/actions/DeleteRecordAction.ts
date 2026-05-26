import { Action, FieldSchema, RunResult, delay, randomLatency, maybeFail } from '../Action';

export class DeleteRecordAction extends Action {
  static id = 'delete_record';
  static label = 'Delete record';
  static icon = '🗑';
  static color = '#ef4444';
  static description = 'Permanently remove a record from a collection';
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
  ];

  async run(config: Record<string, any>): Promise<RunResult> {
    await delay(randomLatency());
    if (maybeFail()) {
      return { ok: false, message: `Delete blocked, ${config.recordId || '?'} has dependencies` };
    }
    return { ok: true, message: `Deleted ${config.recordId || '?'} from ${config.collection || '?'}` };
  }

  summary(config: Record<string, any>): string {
    if (!config.recordId) return 'No record ID set';
    return `${config.recordId} from ${config.collection || '?'}`;
  }
}
