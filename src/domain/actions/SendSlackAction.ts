import { Action, FieldSchema, RunResult } from '../Action';
import { api, ApiError } from '../../lib/api';

export class SendSlackAction extends Action {
  static id = 'send_slack';
  static label = 'Send Slack message';
  static icon = '#';
  static color = '#a855f7';
  static description = 'Post a message to a Slack channel';
  static fields: FieldSchema[] = [
    { key: 'channel', label: 'Channel', type: 'text', placeholder: '#general', required: true },
    { key: 'message', label: 'Message', type: 'textarea', placeholder: 'Hello team', required: true },
  ];

  async run(config: Record<string, any>): Promise<RunResult> {
    if (!config.channel) return { ok: false, message: 'No channel set' };
    if (!config.message) return { ok: false, message: 'Message is required' };
    try {
      await api('/slack_messages', {
        method: 'POST',
        body: JSON.stringify({
          channel: config.channel,
          message: config.message,
          postedAt: new Date().toISOString(),
        }),
      });
      return { ok: true, message: `Posted to ${config.channel}` };
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : String(e);
      return { ok: false, message: msg };
    }
  }

  summary(config: Record<string, any>): string {
    if (!config.channel) return 'No channel set';
    return `to ${config.channel}`;
  }
}
