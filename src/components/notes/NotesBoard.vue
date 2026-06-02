<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faArrowsRotate, faNoteSticky } from '@fortawesome/free-solid-svg-icons'

import type { Note } from '../../types/note'
import NoteCard from './NoteCard.vue'
import type { NotesFormState } from './types'

defineProps<{
  isLoading: boolean
  isRefreshing: boolean
  hasNotes: boolean
  pinnedNotes: Note[]
  unpinnedNotes: Note[]
  editingNoteId: string
  editingForm: NotesFormState
  isBusy: boolean
  isUpdating: boolean
}>()

const emit = defineEmits<{
  (e: 'refresh'): void
  (e: 'begin-editing', note: Note): void
  (e: 'cancel-editing'): void
  (e: 'save'): void
  (e: 'toggle-pinned', note: Note): void
  (e: 'delete', noteId: string): void
}>()
</script>

<template>
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
        :aria-busy="isRefreshing"
        @click="emit('refresh')"
      >
        <FontAwesomeIcon :icon="faArrowsRotate" />
        <span>{{ isRefreshing ? 'Refreshing...' : 'Refresh' }}</span>
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
        class="notes-board__state notes-board__state--empty"
      >
        <span class="notes-board__state-icon">
          <FontAwesomeIcon :icon="faNoteSticky" />
        </span>
        <span class="notes-board__state-copy">
          <strong class="notes-board__state-title">No notes yet</strong>
          <span class="notes-board__state-text">
            Save your first thought from the create note section and it will appear here.
          </span>
        </span>
      </div>

      <template v-else>
        <section
          v-if="pinnedNotes.length"
          class="notes-board__group"
        >
          <p class="notes-board__group-label">Pinned</p>

          <NoteCard
            v-for="note in pinnedNotes"
            :key="note.id"
            :note="note"
            :is-editing="editingNoteId === note.id"
            :editing-form="editingForm"
            :is-busy="isBusy"
            :is-updating="isUpdating"
            pin-toggle-label="Unpin"
            @begin-editing="emit('begin-editing', $event)"
            @cancel-editing="emit('cancel-editing')"
            @save="emit('save')"
            @toggle-pinned="emit('toggle-pinned', $event)"
            @delete="emit('delete', $event)"
          />
        </section>

        <section class="notes-board__group">
          <p class="notes-board__group-label">All notes</p>

          <NoteCard
            v-for="note in unpinnedNotes"
            :key="note.id"
            :note="note"
            :is-editing="editingNoteId === note.id"
            :editing-form="editingForm"
            :is-busy="isBusy"
            :is-updating="isUpdating"
            pin-toggle-label="Pin"
            @begin-editing="emit('begin-editing', $event)"
            @cancel-editing="emit('cancel-editing')"
            @save="emit('save')"
            @toggle-pinned="emit('toggle-pinned', $event)"
            @delete="emit('delete', $event)"
          />
        </section>
      </template>
    </div>
  </section>
</template>

<style scoped lang="scss">
.notes-board {
  min-height: 0;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  overflow: hidden;
  gap: 20px;
}

.notes-board__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.notes-board__eyebrow {
  margin: 0 0 10px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.78rem;
  color: $color-accent;
}

.notes-board__title {
  margin: 0;
  font-family: $font-heading;
  font-size: 1.8rem;
  letter-spacing: -0.03em;
}

.notes-board__refresh {
  @include refresh-action-button;
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

.notes-board__state {
  padding: 24px;
  border: 1px solid $color-line;
  border-radius: $radius-md;
  background: $color-panel-strong;
}

.notes-board__state--empty {
  @include soft-empty-state(rgb(195, 123, 48));
}

.notes-board__state-icon {
  @include soft-empty-state-icon(rgb(195, 123, 48));
  color: #8a5621;
}

.notes-board__state-copy {
  min-width: 0;
  display: grid;
  gap: 6px;
}

.notes-board__state-title {
  font-family: $font-heading;
  font-size: 1.25rem;
  letter-spacing: -0.03em;
}

.notes-board__state-text {
  color: $color-muted;
  line-height: 1.55;
}

.notes-board__group {
  display: grid;
  gap: 14px;
}

.notes-board__group-label {
  margin: 0;
  font-size: 0.9rem;
  color: $color-muted;
}
</style>
