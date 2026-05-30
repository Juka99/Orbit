<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'

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

const createForm = reactive({
  title: '',
  content: '',
  is_pinned: false,
})

const editingNoteId = ref('')
const editingForm = reactive({
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

function formatTimestamp(timestamp: string) {
  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(timestamp))
}
</script>

<template>
  <section class="notes-page">
    <header class="notes-page__header">
      <div class="notes-page__header-copy">
        <p class="notes-page__eyebrow">First real module</p>
        <h1 class="notes-page__title">Notes</h1>
        <p class="notes-page__lede">
          Capture ideas, scratch notes, and personal reminders in one place.
        </p>
      </div>

      <div class="notes-page__header-card">
        <p class="notes-page__header-label">Your note space</p>
        <strong class="notes-page__header-value">{{ notesCount }}</strong>
        <p class="notes-page__header-text">
          {{ hasNotes ? 'Notes loaded from Supabase.' : 'Create your first note to get started.' }}
        </p>
      </div>
    </header>

    <section class="notes-page__layout">
      <article class="notes-editor notes-editor--create">
        <div class="notes-editor__topline">
          <p class="notes-editor__eyebrow">Create note</p>
          <span
            v-if="isRefreshing"
            class="notes-editor__status"
          >
            Syncing...
          </span>
        </div>

        <form
          class="notes-editor__form"
          @submit.prevent="handleCreateNote"
        >
          <label class="notes-editor__field">
            <span class="notes-editor__label">Title</span>
            <input
              v-model="createForm.title"
              class="notes-editor__input"
              type="text"
              placeholder="Weekly review thoughts"
            />
          </label>

          <label class="notes-editor__field">
            <span class="notes-editor__label">Content</span>
            <textarea
              v-model="createForm.content"
              class="notes-editor__textarea"
              placeholder="Write whatever you want to keep track of..."
              rows="8"
            />
          </label>

          <label class="notes-editor__toggle">
            <input
              v-model="createForm.is_pinned"
              type="checkbox"
            />
            <span>Pin this note</span>
          </label>

          <button
            class="notes-editor__submit"
            type="submit"
            :disabled="isBusy"
          >
            {{ isCreating ? 'Saving note...' : 'Save note' }}
          </button>
        </form>

        <p
          v-if="notesError"
          class="notes-editor__feedback notes-editor__feedback--error"
        >
          {{ notesError }}
        </p>
      </article>

      <section class="notes-board">
        <div class="notes-board__header">
          <div>
            <p class="notes-board__eyebrow">Library</p>
            <h2 class="notes-board__title">Your notes</h2>
          </div>

          <button
            class="notes-board__refresh"
            type="button"
            :disabled="isLoading || isRefreshing"
            @click="refetch()"
          >
            {{ isRefreshing ? 'Refreshing...' : 'Refresh' }}
          </button>
        </div>

        <div class="notes-board__content">
          <div
            v-if="isLoading"
            class="notes-board__state"
          >
            Loading notes...
          </div>

          <div
            v-else-if="!hasNotes"
            class="notes-board__state"
          >
            No notes yet. Your first saved note will appear here.
          </div>

          <template v-else>
            <section
              v-if="pinnedNotes.length"
              class="notes-board__group"
            >
              <p class="notes-board__group-label">Pinned</p>

              <article
                v-for="note in pinnedNotes"
                :key="note.id"
                class="note-card"
              >
                <div class="note-card__topline">
                  <p class="note-card__meta">Updated {{ formatTimestamp(note.updated_at) }}</p>
                  <span class="note-card__pin">Pinned</span>
                </div>

                <template v-if="editingNoteId === note.id">
                  <form
                    class="note-card__edit-form"
                    @submit.prevent="handleUpdateNote"
                  >
                    <input
                      v-model="editingForm.title"
                      class="note-card__input"
                      type="text"
                    />
                    <textarea
                      v-model="editingForm.content"
                      class="note-card__textarea"
                      rows="7"
                    />
                    <label class="note-card__toggle">
                      <input
                        v-model="editingForm.is_pinned"
                        type="checkbox"
                      />
                      <span>Keep pinned</span>
                    </label>
                    <div class="note-card__actions">
                      <button
                        class="note-card__action note-card__action--primary"
                        type="submit"
                        :disabled="isBusy"
                      >
                        {{ isUpdating ? 'Saving...' : 'Save changes' }}
                      </button>
                      <button
                        class="note-card__action note-card__action--secondary"
                        type="button"
                        :disabled="isBusy"
                        @click="cancelEditing"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </template>

                <template v-else>
                  <h3 class="note-card__title">{{ note.title }}</h3>
                  <p class="note-card__content">{{ note.content || 'No content yet.' }}</p>
                  <div class="note-card__actions">
                    <button
                      class="note-card__action note-card__action--primary"
                      type="button"
                      :disabled="isBusy"
                      @click="beginEditing(note)"
                    >
                      Edit
                    </button>
                    <button
                      class="note-card__action note-card__action--secondary"
                      type="button"
                      :disabled="isBusy"
                      @click="togglePinned(note)"
                    >
                      Unpin
                    </button>
                    <button
                      class="note-card__action note-card__action--danger"
                      type="button"
                      :disabled="isBusy"
                      @click="handleDeleteNote(note.id)"
                    >
                      Delete
                    </button>
                  </div>
                </template>
              </article>
            </section>

            <section class="notes-board__group">
              <p class="notes-board__group-label">All notes</p>

              <article
                v-for="note in unpinnedNotes"
                :key="note.id"
                class="note-card"
              >
                <div class="note-card__topline">
                  <p class="note-card__meta">Updated {{ formatTimestamp(note.updated_at) }}</p>
                </div>

                <template v-if="editingNoteId === note.id">
                  <form
                    class="note-card__edit-form"
                    @submit.prevent="handleUpdateNote"
                  >
                    <input
                      v-model="editingForm.title"
                      class="note-card__input"
                      type="text"
                    />
                    <textarea
                      v-model="editingForm.content"
                      class="note-card__textarea"
                      rows="7"
                    />
                    <label class="note-card__toggle">
                      <input
                        v-model="editingForm.is_pinned"
                        type="checkbox"
                      />
                      <span>Pin this note</span>
                    </label>
                    <div class="note-card__actions">
                      <button
                        class="note-card__action note-card__action--primary"
                        type="submit"
                        :disabled="isBusy"
                      >
                        {{ isUpdating ? 'Saving...' : 'Save changes' }}
                      </button>
                      <button
                        class="note-card__action note-card__action--secondary"
                        type="button"
                        :disabled="isBusy"
                        @click="cancelEditing"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </template>

                <template v-else>
                  <h3 class="note-card__title">{{ note.title }}</h3>
                  <p class="note-card__content">{{ note.content || 'No content yet.' }}</p>
                  <div class="note-card__actions">
                    <button
                      class="note-card__action note-card__action--primary"
                      type="button"
                      :disabled="isBusy"
                      @click="beginEditing(note)"
                    >
                      Edit
                    </button>
                    <button
                      class="note-card__action note-card__action--secondary"
                      type="button"
                      :disabled="isBusy"
                      @click="togglePinned(note)"
                    >
                      Pin
                    </button>
                    <button
                      class="note-card__action note-card__action--danger"
                      type="button"
                      :disabled="isBusy"
                      @click="handleDeleteNote(note.id)"
                    >
                      Delete
                    </button>
                  </div>
                </template>
              </article>
            </section>
          </template>
        </div>
      </section>
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

.notes-page__header {
  display: grid;
  grid-template-columns: minmax(0, 1.7fr) minmax(220px, 0.8fr);
  gap: 18px;

  @include down('lg') {
    grid-template-columns: 1fr;
  }
}

.notes-page__header-card,
.notes-editor,
.note-card,
.notes-board__state {
  border: 1px solid $color-line;
  border-radius: $radius-md;
  background: $color-panel-strong;
}

.notes-page__eyebrow,
.notes-editor__eyebrow,
.notes-board__eyebrow {
  margin: 0 0 10px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.78rem;
  color: $color-accent;
}

.notes-page__title,
.notes-board__title {
  margin: 0;
  font-family: $font-heading;
  letter-spacing: -0.03em;
}

.notes-page__title {
  font-size: clamp(2.3rem, 4vw, 4rem);
}

.notes-page__lede,
.notes-page__header-text,
.notes-editor__label,
.notes-board__group-label,
.note-card__meta,
.note-card__content,
.notes-editor__status {
  color: $color-muted;
}

.notes-page__header-card {
  padding: 22px;
}

.notes-page__header-label {
  margin: 0;
  font-size: 0.9rem;
  color: $color-muted;
}

.notes-page__header-value {
  display: block;
  margin: 12px 0 10px;
  font-family: $font-heading;
  font-size: 3rem;
  line-height: 1;
}

.notes-page__header-text {
  margin: 0;
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

.notes-editor,
.notes-board {
  min-height: 0;
  display: grid;
  align-content: start;
  gap: 18px;
}

.notes-editor {
  @include subtle-scrollbar;
  overflow: auto;
  padding: 22px;
}

.notes-editor__topline,
.notes-board__header,
.note-card__topline {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.notes-editor__form,
.note-card__edit-form {
  display: grid;
  gap: 16px;
}

.notes-editor__field {
  display: grid;
  gap: 8px;
}

.notes-editor__input,
.notes-editor__textarea,
.note-card__input,
.note-card__textarea {
  width: 100%;
  padding: 14px 16px;
  border: 1px solid $color-line;
  border-radius: $radius-sm;
  background: rgba(255, 255, 255, 0.76);
  color: $color-text;
  resize: vertical;

  &:focus {
    outline: 2px solid rgba(13, 122, 102, 0.18);
    border-color: $color-accent;
  }
}

.notes-editor__toggle,
.note-card__toggle {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: $color-muted;
}

.notes-editor__submit,
.notes-board__refresh,
.note-card__action {
  width: fit-content;
  padding: 12px 16px;
  border-radius: 999px;
  border: 0;
}

.notes-editor__submit,
.note-card__action--primary {
  background: linear-gradient(135deg, $color-accent 0%, $color-accent-strong 100%);
  color: $color-white;
}

.notes-board__refresh,
.note-card__action--secondary {
  background: rgba(52, 37, 21, 0.08);
  color: $color-text;
}

.note-card__action--danger {
  background: rgba(163, 53, 53, 0.1);
  color: #8f2f2f;
}

.notes-editor__submit,
.notes-board__refresh,
.note-card__action {
  cursor: pointer;

  &:disabled {
    opacity: 0.65;
    cursor: wait;
  }
}

.notes-editor__feedback {
  margin: 0;
  padding: 14px 16px;
  border-radius: $radius-sm;
}

.notes-editor__feedback--error {
  border: 1px solid rgba(163, 53, 53, 0.25);
  background: rgba(163, 53, 53, 0.08);
  color: #8f2f2f;
}

.notes-board {
  grid-template-rows: auto minmax(0, 1fr);
  overflow: hidden;
  gap: 20px;
}

.notes-board__title {
  font-size: 1.8rem;
}

.notes-board__state {
  padding: 24px;
}

.notes-board__content {
  @include subtle-scrollbar;
  min-height: 0;
  overflow: auto;
  display: grid;
  align-content: start;
  gap: 18px;
  padding-right: 8px;
}

.notes-board__group {
  display: grid;
  gap: 14px;
}

.notes-board__group-label {
  margin: 0;
  font-size: 0.9rem;
}

.note-card {
  padding: 20px;
  display: grid;
  gap: 16px;
}

.note-card__meta,
.note-card__pin {
  margin: 0;
  font-size: 0.9rem;
}

.note-card__pin {
  padding: 6px 10px;
  border-radius: 999px;
  background: $color-accent-soft;
  color: $color-accent;
}

.note-card__title {
  margin: 0;
  font-family: $font-heading;
  font-size: 1.5rem;
  letter-spacing: -0.03em;
}

.note-card__content {
  margin: 0;
  white-space: pre-wrap;
}

.note-card__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
</style>
