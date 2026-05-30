<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import { HABIT_ICON_OPTIONS, HABIT_TONE_OPTIONS, getHabitIcon, getHabitToneStyles } from './meta'
import type { HabitFormState } from './types'

defineProps<{
  createForm: HabitFormState
  isBusy: boolean
  isCreating: boolean
  habitsError: string
}>()

const emit = defineEmits<{
  (e: 'submit'): void
}>()
</script>

<template>
  <section class="habit-create">
    <div class="habit-create__header">
      <div>
        <p class="habit-create__eyebrow">Design the routine</p>
        <h2 class="habit-create__title">Add a habit</h2>
      </div>
    </div>

    <p
      v-if="habitsError"
      class="habit-create__feedback habit-create__feedback--error"
    >
      {{ habitsError }}
    </p>

    <form
      class="habit-create__form"
      @submit.prevent="emit('submit')"
    >
      <label class="habit-create__field">
        <span class="habit-create__label">Habit name</span>
        <input
          v-model="createForm.name"
          class="habit-create__input"
          type="text"
          maxlength="80"
          placeholder="Morning walk"
        />
      </label>

      <label class="habit-create__field">
        <span class="habit-create__label">Description</span>
        <textarea
          v-model="createForm.description"
          class="habit-create__textarea"
          rows="4"
          maxlength="220"
          placeholder="A short cue that helps the habit feel grounded."
        ></textarea>
      </label>

      <div class="habit-create__field">
        <span class="habit-create__label">Tone</span>
        <div class="habit-create__tone-grid">
          <button
            v-for="tone in HABIT_TONE_OPTIONS"
            :key="tone.value"
            class="habit-create__tone"
            :class="{ 'habit-create__tone--active': createForm.tone === tone.value }"
            :style="getHabitToneStyles(tone.value)"
            type="button"
            @click="createForm.tone = tone.value"
          >
            <span class="habit-create__tone-dot"></span>
            <span>{{ tone.label }}</span>
          </button>
        </div>
      </div>

      <div class="habit-create__field">
        <span class="habit-create__label">Icon</span>
        <div class="habit-create__icon-grid">
          <button
            v-for="icon in HABIT_ICON_OPTIONS"
            :key="icon.value"
            class="habit-create__icon-option"
            :class="{ 'habit-create__icon-option--active': createForm.icon_key === icon.value }"
            type="button"
            @click="createForm.icon_key = icon.value"
          >
            <FontAwesomeIcon
              class="habit-create__icon-symbol"
              :icon="getHabitIcon(icon.value)"
            />
            <span>{{ icon.label }}</span>
          </button>
        </div>
      </div>

      <button
        class="habit-create__submit"
        type="submit"
        :disabled="isBusy"
      >
        {{ isCreating ? 'Saving habit...' : 'Save habit' }}
      </button>
    </form>
  </section>
</template>

<style scoped lang="scss">
.habit-create {
  min-height: 0;
  display: grid;
  gap: 18px;
  padding: 22px;
  border: 1px solid $color-line;
  border-radius: $radius-md;
  background: $color-panel-strong;

  @media (min-width: 1301px) {
    @include subtle-scrollbar;
    height: 100%;
    overflow: auto;
    align-content: start;
  }

  @media (max-width: 1300px) {
    height: auto;
    overflow: visible;
  }
}

.habit-create__eyebrow {
  margin: 0 0 10px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.78rem;
  color: $color-accent;
}

.habit-create__title {
  margin: 0;
  font-family: $font-heading;
  font-size: 1.8rem;
  letter-spacing: -0.03em;
}

.habit-create__feedback {
  margin: 0;
  padding: 14px 16px;
  border-radius: $radius-sm;
}

.habit-create__feedback--error {
  border: 1px solid rgba(163, 53, 53, 0.25);
  background: rgba(163, 53, 53, 0.08);
  color: #8f2f2f;
}

.habit-create__form {
  display: grid;
  gap: 16px;
}

.habit-create__field {
  display: grid;
  gap: 8px;
}

.habit-create__label {
  color: $color-muted;
}

.habit-create__input,
.habit-create__textarea {
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

.habit-create__tone-grid,
.habit-create__icon-grid {
  display: grid;
  gap: 10px;
}

.habit-create__tone-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));

  @include down('sm') {
    grid-template-columns: 1fr;
  }
}

.habit-create__icon-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));

  @include down('sm') {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.habit-create__tone,
.habit-create__icon-option {
  border: 1px solid $color-line;
  border-radius: $radius-sm;
  background: rgba(255, 255, 255, 0.74);
  color: $color-text;
  cursor: pointer;
}

.habit-create__tone {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  transition:
    border-color 0.18s ease,
    background-color 0.18s ease,
    transform 0.18s ease;

  &:hover,
  &--active {
    border-color: var(--habit-accent, $color-accent);
    background: color-mix(in srgb, var(--habit-accent-soft, rgba(13, 122, 102, 0.1)) 85%, white);
    transform: translateY(-1px);
  }
}

.habit-create__tone-dot {
  width: 12px;
  height: 12px;
  border-radius: 999px;
  background: var(--habit-accent, $color-accent);
}

.habit-create__icon-option {
  display: grid;
  justify-items: center;
  gap: 8px;
  padding: 14px 10px;
  transition:
    border-color 0.18s ease,
    background-color 0.18s ease,
    transform 0.18s ease;

  &:hover,
  &--active {
    border-color: $color-accent;
    background: rgba(13, 122, 102, 0.08);
    transform: translateY(-1px);
  }
}

.habit-create__icon-symbol {
  font-size: 1rem;
}

.habit-create__submit {
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
</style>
