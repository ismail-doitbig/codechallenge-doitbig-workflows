export default function FieldRenderer({ field, value, onChange, readOnly }) {
  const common =
    'w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 read-only:bg-slate-50 disabled:bg-slate-50'

  return (
    <label className="block">
      <span className="block text-xs font-semibold text-slate-500 mb-1.5">
        {field.label}
        {field.required && <span className="text-rose-500 ml-0.5">*</span>}
      </span>
      {renderInput(field, value, onChange, readOnly, common)}
      {field.help && <span className="block text-xs text-slate-400 mt-1">{field.help}</span>}
    </label>
  )
}

function renderInput(field, value, onChange, readOnly, common) {
  const v = value ?? ''
  switch (field.type) {
    case 'textarea':
      return (
        <textarea
          value={v}
          placeholder={field.placeholder}
          readOnly={readOnly}
          rows={3}
          onChange={(e) => onChange(e.target.value)}
          className={common + ' resize-none'}
        />
      )
    case 'select':
      return (
        <select
          value={v}
          disabled={readOnly}
          onChange={(e) => onChange(e.target.value)}
          className={common}
        >
          <option value="" disabled>Choose...</option>
          {(field.options || []).map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      )
    case 'number':
      return (
        <input
          type="number"
          value={v}
          placeholder={field.placeholder}
          readOnly={readOnly}
          onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
          className={common}
        />
      )
    case 'text':
    default:
      return (
        <input
          type="text"
          value={v}
          placeholder={field.placeholder}
          readOnly={readOnly}
          onChange={(e) => onChange(e.target.value)}
          className={common}
        />
      )
  }
}
