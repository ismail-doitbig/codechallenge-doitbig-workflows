import { Action, FieldSchema, RunResult, delay, randomLatency, maybeFail } from '../Action';

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
    await delay(randomLatency());
    if (maybeFail()) {
      return { ok: false, message: `Email to ${config.to || 'unknown'} bounced` };
    }
    return { ok: true, message: `Sent email to ${config.to || 'unknown'}` };
  }

  summary(config: Record<string, any>): string {
    if (!config.to) return 'No recipient set';
    return `to ${config.to}`;
  }
}
