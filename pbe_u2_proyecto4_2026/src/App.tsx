import { useCallback, useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { call, errorText, setLogger, type Log } from './api'

type Row = { id: number; [key: string]: string | number }
type Field = {
  name: string
  label: string
  type?: 'text' | 'email' | 'number'
  options?: { value: number; label: string }[]
}
type Column = { label: string; value: (row: Row) => ReactNode }

function Crud(props: {
  title: string
  path: string
  fields: Field[]
  columns: Column[]
  rows: Row[]
  deleteWarning: string
  reload: () => void
}) {
  const { title, path, fields, columns, rows, deleteWarning, reload } = props
  const blank = () => Object.fromEntries(fields.map((f) => [f.name, '']))
  const [form, setForm] = useState<Record<string, string>>(blank)
  const [editing, setEditing] = useState<Row | null>(null)
  const [error, setError] = useState('')

  const reset = () => {
    setForm(blank())
    setEditing(null)
    setError('')
  }

  const startEdit = (row: Row) => {
    setEditing(row)
    setError('')
    setForm(Object.fromEntries(fields.map((f) => [f.name, String(row[f.name])])))
  }

  const convert = (f: Field) =>
    f.type === 'number' || f.options ? Number(form[f.name]) : form[f.name]

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    let result
    if (editing) {
      // PATCH: solo se envían los campos que cambiaron.
      const changed = fields.filter((f) => form[f.name] !== String(editing[f.name]))
      if (changed.length === 0) return reset()
      const body = Object.fromEntries(changed.map((f) => [f.name, convert(f)]))
      result = await call('PATCH', `/${path}/modificar/${editing.id}`, body)
    } else {
      const body = Object.fromEntries(fields.map((f) => [f.name, convert(f)]))
      result = await call('POST', `/${path}/crear`, body)
    }
    if (!result.ok) return setError(errorText(result))
    reset()
    reload()
  }

  const remove = async (row: Row) => {
    if (!window.confirm(deleteWarning)) return
    const result = await call('DELETE', `/${path}/eliminar/${row.id}`)
    if (!result.ok) return setError(errorText(result))
    if (editing?.id === row.id) reset()
    reload()
  }

  return (
    <section className="card">
      <h2>{title}</h2>
      <form onSubmit={submit}>
        {fields.map((f) => (
          <label key={f.name}>
            {f.label}
            {f.options ? (
              <select
                required
                value={form[f.name]}
                onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
              >
                <option value="">Elegir</option>
                {f.options.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                required
                type={f.type ?? 'text'}
                value={form[f.name]}
                onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
              />
            )}
          </label>
        ))}
        <div className="actions">
          <button type="submit">{editing ? `Guardar #${editing.id}` : 'Crear'}</button>
          {editing && (
            <button type="button" className="ghost" onClick={reset}>
              Cancelar
            </button>
          )}
        </div>
        {error && <p className="error">{error}</p>}
      </form>

      <table>
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.label}>{c.label}</th>
            ))}
            <th />
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className={editing?.id === row.id ? 'active' : ''}>
              {columns.map((c) => (
                <td key={c.label}>{c.value(row)}</td>
              ))}
              <td className="row-actions">
                <button className="ghost" onClick={() => startEdit(row)}>
                  Editar
                </button>
                <button className="danger" onClick={() => remove(row)}>
                  Borrar
                </button>
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={columns.length + 1} className="empty">
                Sin datos
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  )
}

export default function App() {
  const [libros, setLibros] = useState<Row[]>([])
  const [logs, setLogs] = useState<Log[]>([])
  const [loadError, setLoadError] = useState('')

  const reload = useCallback(async () => {
    const r = await call('GET', '/libros')
    if (r.ok) setLibros(r.data as Row[])
    setLoadError(r.ok ? '' : errorText(r))
  }, [])

  useEffect(() => {
    setLogger((log) => setLogs((prev) => [log, ...prev].slice(0, 8)))
    reload()
  }, [reload])

  return (
    <main>
      <header>
        <h1>Biblioteca</h1>
        <p>CRUD de libros de la API Django</p>
      </header>

      {loadError && <p className="banner">{loadError}</p>}

      <Crud
        title="Libros"
        path="libro"
        rows={libros}
        reload={reload}
        deleteWarning="¿Borrar este libro?"
        fields={[
          { name: 'titulo', label: 'Título' },
          { name: 'isbn', label: 'ISBN' },
          { name: 'anio_publicacion', label: 'Año publicación', type: 'number' },
          { name: 'autor', label: 'ID autor', type: 'number' },
        ]}
        columns={[
          { label: 'ID', value: (l) => l.id },
          { label: 'Título', value: (l) => l.titulo },
          { label: 'ISBN', value: (l) => l.isbn },
          { label: 'Año', value: (l) => l.anio_publicacion },
          { label: 'Autor', value: (l) => `#${l.autor}` },
        ]}
      />

      <section className="card log">
        <h2>Últimas peticiones</h2>
        {logs.map((l, i) => (
          <div key={i} className="log-row">
            <span className={`method ${l.method}`}>{l.method}</span>
            <code>{l.url}</code>
            <span className={`status s${String(l.status)[0]}`}>{l.status || 'sin respuesta'}</span>
          </div>
        ))}
      </section>
    </main>
  )
}
