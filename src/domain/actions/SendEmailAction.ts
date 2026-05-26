import { Action, FieldSchema, RunResult } from '../Action';
import { api, ApiError } from '../../lib/api';

export class SendEmailAction extends Action {
  static id = 'send_email';
  static label = 'Send email';
  static icon = '✉';
  static color = '#6366f1';
  static description = 'Send a transactional email to a recipient';
  static fields: FieldSchema[] = [
    { key: 'to', label: 'To', type: 'text', placeholder: 'alice@example.com', required: true },
    { key: 'subject', label: 'Subject', type: 'text', placeholder: 'Hello there', required: true },
    { key: 'body', label: 'Body', type: 'textarea', placeholder: 'Write your message' },
  ];

  async run(config: Record<string, any>): Promise<RunResult> {
    if (!config.to) return { ok: false, message: 'No recipient set' };
    if (!config.subject) return { ok: false, message: 'No subject set' };
    try {
      await api('/emails', {
        method: 'POST',
        body: JSON.stringify({
          to: config.to,
          subject: config.subject,
          body: config.body || '',
          sentAt: new Date().toISOString(),
        }),
      });
      return { ok: true, message: `Sent email to ${config.to}` };
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : String(e);
      return { ok: false, message: msg };
    }
  }

  summary(config: Record<string, any>): string {
    if (!config.to) return 'No recipient set';
    return `to ${config.to}`;
  }
}
