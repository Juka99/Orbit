<script setup lang="ts">
import {
  faCheck,
  faFloppyDisk,
  faPen,
  faThumbtack,
  faTrashCan,
  faXmark,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import type { Note } from '../../types/note'
import type { NotesFormState } from './types'

const props = defineProps<{
  note: Note
  isEditing: boolean
  editingForm: NotesFormState
  isBusy: boolean
  isUpdating: boolean
  pinToggleLabel: string
}>()

const emit = defineEmits<{
  (e: 'begin-editing', note: Note): void
  (e: 'cancel-editing'): void
  (e: 'save'): void
  (e: 'toggle-pinned', note: Note): void
  (e: 'delete', noteId: string): void
}>()

function formatTimestamp(timestamp: string) {
  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(timestamp))
}
</script>

<template>
  <article class="note-card">
    <div class="note-card__topline">
      <p class="note-card__meta">Updated {{ formatTimestamp(props.note.updated_at) }}</p>
      <span
        v-if="props.note.is_pinned"
        class="note-card__pin"
      >
        Pinned
      </span>
    </div>

    <template v-if="props.isEditing">
      <form
        class="note-card__edit-form"
        @submit.prevent="emit('save')"
      >
        <input
          v-model="props.editingForm.title"
          class="note-card__input"
          type="text"
        />
        <textarea
          v-model="props.editingForm.content"
          class="note-card__textarea"
          rows="7"
        />
        <label class="note-card__toggle">
          <input
            v-model="props.editingForm.is_pinned"
            class="note-card__checkbox"
            type="checkbox"
          />
          <span class="note-card__checkbox-shell">
            <FontAwesomeIcon
              class="note-card__checkbox-icon"
              :icon="faCheck"
            />
          </span>
          <span class="note-card__toggle-copy">
            {{ props.note.is_pinned ? 'Keep pinned' : 'Pin this note' }}
          </span>
        </label>
        <div class="note-card__actions">
          <button
            class="note-card__action note-card__action--primary"
            type="submit"
            :disabled="props.isBusy"
          >
            <FontAwesomeIcon
              class="note-card__action-icon"
              :icon="faFloppyDisk"
            />
            <span>{{ props.isUpdating ? 'Saving...' : 'Save changes' }}</span>
          </button>
          <button
            class="note-card__action note-card__action--secondary"
            type="button"
            :disabled="props.isBusy"
            @click="emit('cancel-editing')"
          >
            <FontAwesomeIcon
              class="note-card__action-icon"
              :icon="faXmark"
            />
            <span>Cancel</span>
          </button>
        </div>
      </form>
    </template>

    <template v-else>
      <h3 class="note-card__title">{{ props.note.title }}</h3>
      <p class="note-card__content">{{ props.note.content || 'No content yet.' }}</p>
      <div class="note-card__actions">
        <button
          class="note-card__action note-card__action--primary"
          type="button"
          :disabled="props.isBusy"
          @click="emit('begin-editing', props.note)"
        >
          <FontAwesomeIcon
            class="note-card__action-icon"
            :icon="faPen"
          />
          <span>Edit</span>
        </button>
        <button
          class="note-card__action note-card__action--pin"
          type="button"
          :disabled="props.isBusy"
          @click="emit('toggle-pinned', props.note)"
        >
          <FontAwesomeIcon
            class="note-card__action-icon"
            :icon="faThumbtack"
          />
          <span>{{ props.pinToggleLabel }}</span>
        </button>
        <button
          class="note-card__action note-card__action--danger"
          type="button"
          :disabled="props.isBusy"
          @click="emit('delete', props.note.id)"
        >
          <FontAwesomeIcon
            class="note-card__action-icon"
            :icon="faTrashCan"
          />
          <span>Delete</span>
        </button>
      </div>
    </template>
  </article>
</template>

<style scoped lang="scss">
.note-card {
  display: grid;
  gap: 16px;
  padding: 20px;
  border: 1px solid $color-line;
  border-radius: $radius-md;
  background: $color-panel-strong;
}

.note-card__topline {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.note-card__edit-form {
  display: grid;
  gap: 16px;
}

.note-card__meta,
.note-card__content {
  margin: 0;
  color: $color-muted;
}

.note-card__meta,
.note-card__pin {
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
  white-space: pre-wrap;
}

.note-card__input,
.note-card__textarea {
  @include soft-form-control;
}

.note-card__textarea {
  @include soft-textarea;
}

.note-card__toggle {
  @include soft-checkbox-toggle;
}

.note-card__checkbox {
  @include soft-checkbox-input;
}

.note-card__checkbox-shell {
  @include soft-checkbox-shell;
}

.note-card__checkbox-icon {
  @include soft-checkbox-icon;
}

@include soft-checkbox-states(
  '.note-card__toggle',
  '.note-card__checkbox',
  '.note-card__checkbox-shell',
  '.note-card__checkbox-icon'
);

.note-card__toggle-copy {
  color: $color-muted;
}

.note-card__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.note-card__action {
  @include tactile-button-surface;
  width: fit-content;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-radius: 999px;
  cursor: pointer;

  &:disabled {
    opacity: 0.65;
    cursor: wait;
  }
}

.note-card__action--primary {
  @include soft-accent-action-surface;
}

.note-card__action--secondary {
  border-color: $color-line;
  background: rgba(52, 37, 21, 0.08);
  color: $color-text;
  @include tactile-hover-lift(
    rgba(52, 37, 21, 0.12),
    rgba(52, 37, 21, 0.16),
    $color-text
  );
}

.note-card__action--pin {
  @include soft-warm-action-surface;
}

.note-card__action--danger {
  border-color: rgba(163, 53, 53, 0.18);
  background: rgba(163, 53, 53, 0.1);
  color: #8f2f2f;
  @include tactile-hover-lift(
    rgba(163, 53, 53, 0.16),
    rgba(163, 53, 53, 0.28),
    #7f2929
  );
}

.note-card__action-icon {
  font-size: 0.9rem;
}
</style>
