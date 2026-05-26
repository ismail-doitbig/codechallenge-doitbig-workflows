export type FieldType = 'text' | 'textarea' | 'select' | 'number';

export interface FieldOption {
  value: string;
  label: string;
}

export interface FieldSchema {
  key: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  options?: FieldOption[];
  help?: string;
}

export interface RunResult {
  ok: boolean;
  message: string;
}

export type ActionConfig = Record<string, string | number>;

export abstract class Action {
  static id: string;
  static label: string;
  static icon: string;
  static color: string;
  static description: string;
  static fields: FieldSchema[] = [];

  abstract run(config: Record<string, any>): Promise<RunResult>;

  summary(_config: Record<string, any>): string {
    return 'Not configured yet';
  }
}

export type ActionClass = typeof Action & (new () => Action);
