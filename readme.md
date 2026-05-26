# Workflow Builder

A small no-code tool for the take-home challenge "Designing Workflows for a No-Code Builder" (v1, May 2026).

A non-technical user lands on a canvas with one button. In **Design mode** they configure what happens when the button is pressed: a sequence of backend actions (send email, create/update/delete a record, post to Slack). In **Preview mode** (or in the separate end-user view) they press the button and the workflow runs against a real mock backend, with per-step feedback.

## The challenge in one sentence

> "When I click this button, do X." Design a flexible, simple way for a non-technical user to express that, with backend-only side effects.

Grading weight (from the brief): product thinking 5, ease of use 3, code quality 2.

## What was built

- One canvas, one button. Two modes (Design / Preview) selected from a pill toggle in the top bar.
- A right sidebar that, in Design mode, lets you edit the button label, add steps from a typed registry, reorder them by drag-and-drop, configure each step inline, and delete them.
- A bottom run log that streams events from an RxJS observable while the workflow runs.
- Five concrete actions: Send email, Create record, Update record, Delete record, Send Slack message.
- A real-ish backend via `json-server`. Actions hit real HTTP. Failures come from real responses (e.g. updating a missing record returns 404 and stops the run).
- The workflow itself is persisted server-side (`/workflows/main`) so the builder and the user view always agree on what the button does.
- A separate end-user view at `?view=user` that hides every editor and shows only the button. Same workflow, same engine.
- Per-step indicators under the button: a wrapping row of action-icon chips that flash through their colors as each step runs, then mark success or failure briefly before resetting.
- Visual feedback on the button itself: a green pulse on full success, a red shake on any failure. If the workflow short-circuits on a failed step, the unreached chips simply never light up.

## Two ways to "see" the button

| URL | What it shows |
| --- | --- |
| `/` | The full builder: top bar, blueprint canvas, configuration sidebar, run log. |
| `/?view=user` | Just the button on a clean page. What a real end user would see. |

The TopBar has an "↗ Open user view" link that opens the second one in a new tab.

## How to run

```bash
npm install
npm run dev:all   # starts vite (5173) AND json-server (3001) together
```

`dev:all` uses `concurrently`. You can also run them separately with `npm run dev` and `npm run server`.

The json-server seed (`db.json`) contains a workflow at id `main`, plus collections for `users`, `orders`, `leads`, `tasks`, and append-only collections `emails` and `slack_messages` where the send actions write.

## Two distinct visual modes

Design mode has a deep-blue **blueprint background** with a faint white grid, like architect paper, and the canvas button has a dashed white border. Preview mode has a plain light canvas and a solid indigo button. The visual switch alone tells you the mode without reading the toggle.

## Architecture

```
+-----------------------------+
| TopBar (mode toggle)        |
+----------------+------------+
| Canvas         | Sidebar    |
| (button +      | (step list |
|  indicators)   |  + picker) |
+----------------+------------+
| RunLog                      |
+-----------------------------+
```

```
src/
  domain/                 (TypeScript)
    Action.ts             abstract base + field/result types
    Workflow.ts           serializable class with steps + reorder/edit
    registry.ts           single array of action classes
    actions/
      SendEmailAction.ts
      CreateRecordAction.ts
      UpdateRecordAction.ts
      DeleteRecordAction.ts
      SendSlackAction.ts
  store/                  (JS, Zustand)
    builderStore.js       UI state + delegates to Workflow; debounced save to server
    logStore.js           append-only log entries for the bottom panel
  engine/                 (JS, RxJS)
    runner.js             Observable that runs steps sequentially, stops on first failure
    useWorkflowRunner.js  React hook around runner; exposes { run, running, flash, progress }
  lib/
    api.js                fetch wrapper, ApiError, BASE = http://localhost:3001
    workflowApi.js        load/save the button workflow
  components/             (JS, Tailwind)
    TopBar.jsx
    Canvas.jsx
    Sidebar.jsx
    StepList.jsx
    StepCard.jsx
    FieldRenderer.jsx     switches on text / textarea / select / number
    ActionPicker.jsx      popover from "+ Add step"
    StepIndicators.jsx    icon chips under the button
    RunLog.jsx
  App.jsx                 builder
  UserApp.jsx             end-user-only view
  main.jsx                picks App or UserApp based on ?view=user
  index.css               Tailwind + blueprint-bg + animations (shake, pulse, step flash)
db.json                   json-server seed (workflow + collections)
```

## Why these libraries

- **Zustand** keeps the store tiny and decoupled from React internals. The mutations all delegate to a `Workflow` instance from the domain layer, then re-serialize to JSON for the next render.
- **RxJS** is the right shape for "sequential async work that streams events to subscribers." `from(steps).pipe(concatMap(...))` gives sequential execution for free; `EMPTY` short-circuits remaining steps once one fails; the same observable feeds both the run log and the per-step UI feedback.
- **Tailwind** for layout-as-classnames so each component stays small.

## Domain layer: extensibility story

Every action is a class extending an abstract base. The base declares static metadata (`id, label, icon, color, description, fields: FieldSchema[]`) plus an `async run(config)` method and an optional `summary(config)` for the one-line preview on a step card.

```ts
export class SendEmailAction extends Action {
  static id = 'send_email'
  static label = 'Send email'
  static icon = '✉'
  static color = '#6366f1'
  static description = 'Send a transactional email to a recipient'
  static fields: FieldSchema[] = [
    { key: 'to', label: 'To', type: 'text', required: true },
    { key: 'subject', label: 'Subject', type: 'text', required: true },
    { key: 'body', label: 'Body', type: 'textarea' },
  ]
  async run(config) { /* hit /emails, return { ok, message } */ }
  summary(config) { return config.to ? `to ${config.to}` : 'No recipient set' }
}
```

### How to add a new action

1. Create one file under `src/domain/actions/`, extend `Action`, fill in the five static metadata fields, declare `fields` for the form, implement `run()` returning `{ ok, message }`, override `summary()`.
2. Add the class to `ACTION_REGISTRY` in `src/domain/registry.ts`.

That is the entire change. The picker, the form, the step card, the run log, the indicator chip color, the persistence layer, all read from the registry and the schema, so no UI code needs to be touched.

## Engine details

`src/engine/runner.js` returns a cold Observable that emits:

- `workflow_started { total }`
- `step_started { stepId, index, actionId }`
- `step_succeeded { stepId, index, message }` or `step_failed { stepId, index, message }`
- `workflow_completed { ok, message? }`

The runner now stops on the first failed step. An `aborted` flag flips on inside the `concatMap`, and remaining steps return `EMPTY`. The completion event carries `ok: false` and `"Stopped at step #N"` so the log explains the abort.

`useWorkflowRunner` wraps this for React. It owns:

- `running` (button is disabled while true),
- `flash` (`'success' | 'error' | null`, drives the button's green pulse / red shake for 500ms),
- `progress` (`{ runningIndex, results }`, drives the step indicator chips).

After the 500ms post-run flash, both `flash` and `progress` reset in the same timer, so the button and the chips always return to idle together.

## Backend (json-server)

- Workflow:    `GET / PUT /workflows/main`
- Collections: `users`, `orders`, `leads`, `tasks` with numeric incremental ids (json-server auto-increments because the seed ids are numbers).
- Outboxes:    `emails`, `slack_messages` (append-only via POST).

The store debounces writes (300ms) so rapid edits don't flood the server.

## Visual / UX choices

- Friendly but not childish: `rounded-xl` cards, `rounded-lg` inputs, slate neutrals with an indigo accent, soft shadows.
- Each action carries its own color, which surfaces in three places: the step card's left border, the icon chip in the picker, and the indicator chip under the button. So you scan a workflow by color, not by reading labels.
- Drag-and-drop reordering uses native HTML5 events (no library, ~30 lines), with an indigo ring on the drop target.
- Run feedback is two-layered: the button gives a yes/no (green pulse or red shake), the chips give the play-by-play (which step ran, which failed). The bottom log is for the detail-oriented user.

## What was intentionally not built

Conditionals, variable references between steps, multiple buttons on the canvas, a real backend, undo, automated tests. The point was to nail the mental model and the extensibility story, not the feature count.

## Tradeoffs

- **Same port for builder and user view** (via `?view=user`) instead of a second dev server. Cleaner for a Vite project; if a literal second port is needed, json-server can serve a built bundle as a static directory.
- **Server is source of truth for the workflow**, not localStorage. This is what makes the user view consistent with the builder. The cost is a hard dependency on the json-server process; a red banner appears if it's unreachable.
- **Fail-fast over continue-on-error**. Stops on the first failed step so the user knows immediately, and never silently runs a destructive step after an unrelated one failed. The original spec preferred continuing past failures; the current code does the opposite by intent.
- **No real validation library**. Required fields are checked in each `run()` and produce a clean error message via the same path as HTTP errors.

## File counts

22 source files, every component under ~100 lines, no commented-out code, no `any` outside `config: Record<string, any>` in the domain layer.

## Original challenge text

Kept for reference at the top of this commit history. The deliverable was a working prototype plus a Loom walkthrough.
