import { computed, ref } from 'vue'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'

import type { Note, NoteInput } from '../types/note'
import { createNote, deleteNote, fetchNotes, updateNote } from '../lib/notes'

const NOTES_QUERY_KEY = ['notes']

export function useNotes() {
  const queryClient = useQueryClient()
  const mutationError = ref('')

  const notesQuery = useQuery({
    queryKey: NOTES_QUERY_KEY,
    queryFn: fetchNotes,
  })

  const createNoteMutation = useMutation({
    mutationFn: createNote,
    onMutate: () => {
      mutationError.value = ''
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: NOTES_QUERY_KEY })
    },
    onError: (error) => {
      mutationError.value = error instanceof Error ? error.message : 'Unable to create note.'
    },
  })

  const updateNoteMutation = useMutation({
    mutationFn: ({ noteId, input }: { noteId: string; input: Partial<NoteInput> }) =>
      updateNote(noteId, input),
    onMutate: () => {
      mutationError.value = ''
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: NOTES_QUERY_KEY })
    },
    onError: (error) => {
      mutationError.value = error instanceof Error ? error.message : 'Unable to update note.'
    },
  })

  const deleteNoteMutation = useMutation({
    mutationFn: deleteNote,
    onMutate: () => {
      mutationError.value = ''
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: NOTES_QUERY_KEY })
    },
    onError: (error) => {
      mutationError.value = error instanceof Error ? error.message : 'Unable to delete note.'
    },
  })

  const notes = computed(() => notesQuery.data.value ?? [])
  const pinnedNotes = computed(() => notes.value.filter((note) => note.is_pinned))
  const unpinnedNotes = computed(() => notes.value.filter((note) => !note.is_pinned))
  const notesCount = computed(() => notes.value.length)
  const queryError = computed(() =>
    notesQuery.error.value instanceof Error ? notesQuery.error.value.message : '',
  )

  async function saveNewNote(input: NoteInput) {
    await createNoteMutation.mutateAsync(input)
  }

  async function saveExistingNote(noteId: string, input: Partial<NoteInput>) {
    await updateNoteMutation.mutateAsync({ noteId, input })
  }

  async function removeNote(noteId: string) {
    await deleteNoteMutation.mutateAsync(noteId)
  }

  async function togglePinned(note: Note) {
    await saveExistingNote(note.id, { is_pinned: !note.is_pinned })
  }

  return {
    deleteNote: removeNote,
    isCreating: createNoteMutation.isPending,
    isDeleting: deleteNoteMutation.isPending,
    isLoading: notesQuery.isLoading,
    isRefreshing: notesQuery.isFetching,
    isUpdating: updateNoteMutation.isPending,
    mutationError,
    notes,
    notesCount,
    pinnedNotes,
    queryError,
    refetch: notesQuery.refetch,
    saveExistingNote,
    saveNewNote,
    togglePinned,
    unpinnedNotes,
  }
}
