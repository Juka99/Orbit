<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faCheck, faFloppyDisk } from '@fortawesome/free-solid-svg-icons'

import type { NotesFormState } from './types'

defineProps<{
  createForm: NotesFormState
  isBusy: boolean
  isCreating: boolean
  isRefreshing: boolean
  notesError: string
}>()

const emit = defineEmits<{
  (e: 'submit'): void
}>()
</script>

<template>
  <article class="notes-editor">
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
      @submit.prevent="emit('submit')"
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
          class="notes-editor__checkbox"
          type="checkbox"
        />
        <span class="notes-editor__checkbox-shell">
          <FontAwesomeIcon
            class="notes-editor__checkbox-icon"
            :icon="faCheck"
          />
        </span>
        <span class="notes-editor__toggle-copy">Pin this note</span>
      </label>

      <button
        class="notes-editor__submit"
        type="submit"
        :disabled="isBusy"
      >
        <FontAwesomeIcon
          class="notes-editor__submit-icon"
          :icon="faFloppyDisk"
        />
        <span>{{ isCreating ? 'Saving note...' : 'Save note' }}</span>
      </button>
    </form>

    <p
      v-if="notesError"
      class="notes-editor__feedback notes-editor__feedback--error"
    >
      {{ notesError }}
    </p>
  </article>
</template>

<style scoped lang="scss">
.notes-editor {
  @include subtle-scrollbar;
  min-height: 0;
  overflow: auto;
  display: grid;
  align-content: start;
  gap: 18px;
  padding: 22px;
  border: 1px solid $color-line;
  border-radius: $radius-md;
  background: $color-panel-strong;
}

.notes-editor__topline {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.notes-editor__eyebrow {
  margin: 0 0 10px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.78rem;
  color: $color-accent;
}

.notes-editor__status,
.notes-editor__label {
  color: $color-muted;
}

.notes-editor__form {
  display: grid;
  gap: 16px;
}

.notes-editor__field {
  display: grid;
  gap: 8px;
}

.notes-editor__input,
.notes-editor__textarea {
  @include soft-form-control;
}

.notes-editor__textarea {
  @include soft-textarea;
}

.notes-editor__toggle {
  @include soft-checkbox-toggle;
}

.notes-editor__checkbox {
  @include soft-checkbox-input;
}

.notes-editor__checkbox-shell {
  @include soft-checkbox-shell;
}

.notes-editor__checkbox-icon {
  @include soft-checkbox-icon;
}

@include soft-checkbox-states(
  '.notes-editor__toggle',
  '.notes-editor__checkbox',
  '.notes-editor__checkbox-shell',
  '.notes-editor__checkbox-icon'
);

.notes-editor__toggle-copy {
  color: $color-muted;
}

.notes-editor__submit {
  @include soft-accent-action-surface;
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

.notes-editor__submit-icon {
  font-size: 0.9rem;
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
</style>
