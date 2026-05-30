<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'

import NotesBoard from '../components/notes/NotesBoard.vue'
import NotesCreateEditor from '../components/notes/NotesCreateEditor.vue'
import NotesHero from '../components/notes/NotesHero.vue'
import type { NotesFormState } from '../components/notes/types'
import { useNotes } from '../composables/useNotes'
import type { Note } from '../types/note'

const {
  deleteNote,
  isCreating,
  isDeleting,
  isLoading,
  isRefreshing,
  isUpdating,
  mutationError,
  notesCount,
  pinnedNotes,
  queryError,
  refetch,
  saveExistingNote,
  saveNewNote,
  togglePinned,
  unpinnedNotes,
} = useNotes()

const createForm = reactive<NotesFormState>({
  title: '',
  content: '',
  is_pinned: false,
})

const editingNoteId = ref('')
const editingForm = reactive<NotesFormState>({
  title: '',
  content: '',
  is_pinned: false,
})

const isBusy = computed(() => isCreating.value || isUpdating.value || isDeleting.value)
const hasNotes = computed(() => notesCount.value > 0)
const notesError = computed(() => queryError.value || mutationError.value)

watch(
  () => editingNoteId.value,
  (noteId) => {
    if (!noteId) {
      editingForm.title = ''
      editingForm.content = ''
      editingForm.is_pinned = false
    }
  },
)

async function handleCreateNote() {
  await saveNewNote({
    title: createForm.title.trim() || 'Untitled note',
    content: createForm.content.trim(),
    is_pinned: createForm.is_pinned,
  })

  createForm.title = ''
  createForm.content = ''
  createForm.is_pinned = false
}

function beginEditing(note: Note) {
  editingNoteId.value = note.id
  editingForm.title = note.title
  editingForm.content = note.content
  editingForm.is_pinned = note.is_pinned
}

function cancelEditing() {
  editingNoteId.value = ''
}

async function handleUpdateNote() {
  if (!editingNoteId.value) {
    return
  }

  await saveExistingNote(editingNoteId.value, {
    title: editingForm.title.trim() || 'Untitled note',
    content: editingForm.content.trim(),
    is_pinned: editingForm.is_pinned,
  })

  cancelEditing()
}

async function handleDeleteNote(noteId: string) {
  if (editingNoteId.value === noteId) {
    cancelEditing()
  }

  await deleteNote(noteId)
}
</script>

<template>
  <section class="notes-page">
    <NotesHero
      :notes-count="notesCount"
      :has-notes="hasNotes"
    />

    <section class="notes-page__layout">
      <NotesCreateEditor
        :create-form="createForm"
        :is-busy="isBusy"
        :is-creating="isCreating"
        :is-refreshing="isRefreshing"
        :notes-error="notesError"
        @submit="handleCreateNote"
      />

      <NotesBoard
        :is-loading="isLoading"
        :is-refreshing="isRefreshing"
        :has-notes="hasNotes"
        :pinned-notes="pinnedNotes"
        :unpinned-notes="unpinnedNotes"
        :editing-note-id="editingNoteId"
        :editing-form="editingForm"
        :is-busy="isBusy"
        :is-updating="isUpdating"
        @refresh="refetch()"
        @begin-editing="beginEditing"
        @cancel-editing="cancelEditing"
        @save="handleUpdateNote"
        @toggle-pinned="togglePinned"
        @delete="handleDeleteNote"
      />
    </section>
  </section>
</template>

<style scoped lang="scss">
.notes-page {
  height: 100%;
  min-height: 0;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  gap: 24px;
}

.notes-page__layout {
  min-height: 0;
  display: grid;
  grid-template-columns: minmax(320px, 0.9fr) minmax(0, 1.4fr);
  gap: 20px;

  @include down('lg') {
    grid-template-columns: 1fr;
  }
}
</style>
