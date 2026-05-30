<script setup lang="ts">
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
  background: rgba(255, 255, 255, 0.76);
  color: $color-text;
  resize: vertical;

  &:focus {
    outline: 2px solid rgba(13, 122, 102, 0.18);
    border-color: $color-accent;
  }
}

.notes-editor__toggle {
  display: inline-flex;
  align-items: center;
  gap: 10px;
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
