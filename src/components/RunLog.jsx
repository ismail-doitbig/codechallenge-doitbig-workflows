import { useEffect, useRef } from 'react'
import { useLogStore } from '../store/logStore'

const COLORS = {
  info: 'text-slate-300',
  success: 'text-emerald-300',
  error: 'text-rose-300',
}

export default function RunLog() {
  const entries = useLogStore((s) => s.entries)
  const running = useLogStore((s) => s.running)
  const clear = useLogStore((s) => s.clear)
  const scrollerRef = useRef(null)

  useEffect(() => {
    const el = scrollerRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [entries.length])

  return (
    <div className="h-[180px] shrink-0 bg-slate-900 text-slate-200 border-t border-slate-800 flex flex-col">
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800">
        <div className="flex items-center gap-2 text-xs">
          <span className={'w-2 h-2 rounded-full ' + (running ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600')} />
          <span className="font-semibold uppercase tracking-widest text-slate-400">Run log</span>
          {running && <span className="text-slate-500">running</span>}
        </div>
        <button
          type="button"
          onClick={clear}
          className="text-xs text-slate-400 hover:text-slate-200 px-2 py-1 rounded hover:bg-slate-800"
        >
          Clear
        </button>
      </div>
      <div ref={scrollerRef} className="flex-1 overflow-auto px-4 py-2 font-mono text-xs leading-6">
        {entries.length === 0 && (
          <div className="text-slate-500 italic">Nothing logged yet. Run the workflow to see events here.</div>
        )}
        {entries.map((e) => (
          <div key={e.id} className="flex gap-3">
            <span className="text-slate-500">{e.time}</span>
            <span className={COLORS[e.level] || 'text-slate-300'}>{e.text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
