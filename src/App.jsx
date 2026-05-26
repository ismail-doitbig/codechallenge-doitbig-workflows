import { useBuilderStore } from './store/builderStore'

export default function App() {
  const mode = useBuilderStore((s) => s.mode)
  return (
    <div className="h-full w-full grid place-items-center text-slate-700">
      <div className="text-sm">Workflow Builder, mode: {mode}</div>
    </div>
  )
}
