<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'

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
  width: 100%;
  padding: 14px 16px;
  border: 1px solid $color-line;
  border-radius: $radius-sm;
  background: rgba(255, 252, 247, 0.86);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.7);
  color: $color-text;
  resize: vertical;
  transition:
    border-color 0.18s ease,
    box-shadow 0.18s ease,
    background-color 0.18s ease;

  &:focus {
    outline: none;
    border-color: $color-accent;
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.76),
      0 0 0 3px rgba(13, 122, 102, 0.1);
  }
}

.notes-editor__toggle {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: $color-text;
  cursor: pointer;
  width: fit-content;
}

.notes-editor__checkbox {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.notes-editor__checkbox-shell {
  width: 20px;
  height: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(13, 122, 102, 0.2);
  border-radius: 6px;
  background: rgba(255, 252, 247, 0.88);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.76),
    0 6px 14px rgba(61, 39, 17, 0.04);
  transition:
    border-color 0.18s ease,
    background-color 0.18s ease,
    box-shadow 0.18s ease,
    transform 0.18s ease;
}

.notes-editor__checkbox-icon {
  font-size: 0.7rem;
  color: $color-white;
  opacity: 0;
  transform: scale(0.75);
  transition:
    opacity 0.16s ease,
    transform 0.16s ease;
}

.notes-editor__toggle:hover .notes-editor__checkbox-shell {
  border-color: rgba(13, 122, 102, 0.32);
  transform: translateY(-1px);
}

.notes-editor__checkbox:checked + .notes-editor__checkbox-shell {
  border-color: rgba(13, 122, 102, 0.04);
  background: linear-gradient(135deg, $color-accent 0%, $color-accent-strong 100%);
  box-shadow:
    0 8px 18px rgba(13, 122, 102, 0.14),
    inset 0 1px 0 rgba(255, 255, 255, 0.22);
}

.notes-editor__checkbox:checked + .notes-editor__checkbox-shell .notes-editor__checkbox-icon {
  opacity: 1;
  transform: scale(1);
}

.notes-editor__checkbox:focus-visible + .notes-editor__checkbox-shell {
  outline: 2px solid rgba(13, 122, 102, 0.16);
  outline-offset: 3px;
}

.notes-editor__toggle-copy {
  color: $color-muted;
}

.notes-editor__submit {
  width: fit-content;
  padding: 12px 16px;
  border: 0;
  border-radius: 999px;
  background: linear-gradient(135deg, $color-accent 0%, $color-accent-strong 100%);
  color: $color-white;
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
</style>
