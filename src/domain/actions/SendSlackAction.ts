import { Action, FieldSchema, RunResult, delay, randomLatency, maybeFail } from '../Action';

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
    await delay(randomLatency());
    if (maybeFail()) {
      return { ok: false, message: `Slack to ${config.channel || '?'} failed (rate limited)` };
    }
    return { ok: true, message: `Posted to ${config.channel || '?'}` };
  }

  summary(config: Record<string, any>): string {
    if (!config.channel) return 'No channel set';
    return `to ${config.channel}`;
  }
}
