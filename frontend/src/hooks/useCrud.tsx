import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '../components/ui';

interface CrudConfig<T, TCreate> {
  queryKey: string
  listFn:   (q: string) => Promise<T[]>
  createFn: (data: TCreate) => Promise<unknown>
  updateFn: (id: number, data: Partial<TCreate>) => Promise<unknown>
  deleteFn: (id: number) => Promise<unknown>
  idField:  keyof T
  searchFields: (keyof T)[]
}

export function useCrud<T extends Record<string, unknown>, TCreate>({
  queryKey, listFn, createFn, updateFn, deleteFn, idField, searchFields,
}: CrudConfig<T, TCreate>) {
  const qc = useQueryClient()
  const { toast } = useToast()

  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)

  // ── Data ──────────────────────────────────────────────
  const { data = [], isLoading, isError } = useQuery({
    queryKey: [queryKey],
    queryFn: () => listFn(''),
  })

  const filtered = useMemo(() => {
    if (!search.trim()) return data
    const q = search.toLowerCase()
    return data.filter(row =>
      searchFields.some(f => String(row[f] ?? '').toLowerCase().includes(q))
    )
  }, [data, search, searchFields])

  const editRecord = useMemo(
    () => editId !== null ? data.find(r => r[idField] === editId) : undefined,
    [data, editId, idField]
  )

  // ── Mutations ─────────────────────────────────────────
  const invalidate = () => qc.invalidateQueries({ queryKey: [queryKey] })

  const createMut = useMutation({
    mutationFn: (payload: TCreate) => createFn(payload),
    onSuccess: () => { toast('✓ Record created'); setModalOpen(false); invalidate() },
    onError:   (e: Error) => toast('Error: ' + e.message, 'error'),
  })

  const updateMut = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<TCreate> }) => updateFn(id, payload),
    onSuccess: () => { toast('✓ Record updated'); setModalOpen(false); invalidate() },
    onError:   (e: Error) => toast('Error: ' + e.message, 'error'),
  })

  const deleteMut = useMutation({
    mutationFn: (id: number) => deleteFn(id),
    onSuccess: () => { toast('🗑 Record deleted', 'error'); invalidate() },
    onError:   (e: Error) => toast('Error: ' + e.message, 'error'),
  })

  // ── Actions ───────────────────────────────────────────
  function openAdd() { setEditId(null); setModalOpen(true) }
  function openEdit(id: number) { setEditId(id); setModalOpen(true) }
  function closeModal() { setModalOpen(false); setEditId(null) }

  function save(payload: TCreate) {
    if (editId !== null) updateMut.mutate({ id: editId, payload })
    else createMut.mutate(payload)
  }

  function del(id: number) {
    if (!window.confirm(`Delete record #${id}? This cannot be undone.`)) return
    deleteMut.mutate(id)
  }

  const saving = createMut.isPending || updateMut.isPending

  return {
    data, filtered, isLoading, isError, editRecord,
    search, setSearch,
    modalOpen, openAdd, openEdit, closeModal,
    save, del, saving,
  }
}
