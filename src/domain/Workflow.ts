import { v4 as uuid } from 'uuid';

export interface WorkflowStep {
  id: string;
  actionId: string;
  config: Record<string, any>;
}

export interface WorkflowJSON {
  id: string;
  steps: WorkflowStep[];
}

export class Workflow {
  id: string;
  steps: WorkflowStep[];

  constructor(id: string = uuid(), steps: WorkflowStep[] = []) {
    this.id = id;
    this.steps = steps;
  }

  addStep(actionId: string, config: Record<string, any> = {}): WorkflowStep {
    const step: WorkflowStep = { id: uuid(), actionId, config };
    this.steps.push(step);
    return step;
  }

  removeStep(stepId: string): void {
    this.steps = this.steps.filter((s) => s.id !== stepId);
  }

  reorder(fromIndex: number, toIndex: number): void {
    if (fromIndex === toIndex) return;
    const next = this.steps.slice();
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    this.steps = next;
  }

  updateConfig(stepId: string, patch: Record<string, any>): void {
    this.steps = this.steps.map((s) =>
      s.id === stepId ? { ...s, config: { ...s.config, ...patch } } : s,
    );
  }

  toJSON(): WorkflowJSON {
    return { id: this.id, steps: this.steps.map((s) => ({ ...s, config: { ...s.config } })) };
  }

  static fromJSON(data: WorkflowJSON | null | undefined): Workflow {
    if (!data) return new Workflow();
    return new Workflow(data.id, (data.steps || []).map((s) => ({ ...s, config: { ...s.config } })));
  }
}
