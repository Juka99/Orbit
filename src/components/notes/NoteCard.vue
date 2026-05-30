<script setup lang="ts">
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
            type="checkbox"
          />
          <span>{{ props.note.is_pinned ? 'Keep pinned' : 'Pin this note' }}</span>
        </label>
        <div class="note-card__actions">
          <button
            class="note-card__action note-card__action--primary"
            type="submit"
            :disabled="props.isBusy"
          >
            {{ props.isUpdating ? 'Saving...' : 'Save changes' }}
          </button>
          <button
            class="note-card__action note-card__action--secondary"
            type="button"
            :disabled="props.isBusy"
            @click="emit('cancel-editing')"
          >
            Cancel
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
          Edit
        </button>
        <button
          class="note-card__action note-card__action--secondary"
          type="button"
          :disabled="props.isBusy"
          @click="emit('toggle-pinned', props.note)"
        >
          {{ props.pinToggleLabel }}
        </button>
        <button
          class="note-card__action note-card__action--danger"
          type="button"
          :disabled="props.isBusy"
          @click="emit('delete', props.note.id)"
        >
          Delete
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

.note-card__toggle {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: $color-muted;
}

.note-card__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.note-card__action {
  width: fit-content;
  padding: 12px 16px;
  border: 0;
  border-radius: 999px;
  cursor: pointer;

  &:disabled {
    opacity: 0.65;
    cursor: wait;
  }
}

.note-card__action--primary {
  background: linear-gradient(135deg, $color-accent 0%, $color-accent-strong 100%);
  color: $color-white;
}

.note-card__action--secondary {
  background: rgba(52, 37, 21, 0.08);
  color: $color-text;
}

.note-card__action--danger {
  background: rgba(163, 53, 53, 0.1);
  color: #8f2f2f;
}
</style>
