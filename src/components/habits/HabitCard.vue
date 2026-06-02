<script setup lang="ts">
  import {computed} from 'vue';
  import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';
  import {
    faCheck,
    faFloppyDisk,
    faPen,
    faTrashCan,
    faXmark,
  } from '@fortawesome/free-solid-svg-icons';

  import HabitWeekStrip from './HabitWeekStrip.vue';
  import {
    HABIT_ICON_OPTIONS,
    HABIT_TONE_OPTIONS,
    getHabitIcon,
    getHabitToneStyles,
  } from './meta';
  import type {HabitCardViewModel, HabitFormState} from './types';

  const props = defineProps<{
    habit: HabitCardViewModel;
    isEditing: boolean;
    editingForm: HabitFormState;
    isBusy: boolean;
    isUpdating: boolean;
  }>();

  const emit = defineEmits<{
    (e: 'toggle', habitId: string): void;
    (e: 'begin-editing', habitId: string): void;
    (e: 'cancel-editing'): void;
    (e: 'save'): void;
    (e: 'delete', habitId: string): void;
  }>();

  const toneStyles = computed(() => getHabitToneStyles(props.habit.tone));
</script>

<template>
  <article class="habit-card" :style="toneStyles">
    <template v-if="props.isEditing">
      <form class="habit-card__edit-form" @submit.prevent="emit('save')">
        <div class="habit-card__edit-header">
          <p class="habit-card__eyebrow">Editing habit</p>
        </div>

        <label class="habit-card__field">
          <span class="habit-card__label">Name</span>
          <input
            v-model="props.editingForm.name"
            class="habit-card__input"
            type="text"
            maxlength="80"
          />
        </label>

        <label class="habit-card__field">
          <span class="habit-card__label">Description</span>
          <textarea
            v-model="props.editingForm.description"
            class="habit-card__textarea"
            rows="4"
            maxlength="220"
          ></textarea>
        </label>

        <label class="habit-card__field">
          <span class="habit-card__label">Tone</span>
          <select v-model="props.editingForm.tone" class="habit-card__select">
            <option
              v-for="tone in HABIT_TONE_OPTIONS"
              :key="tone.value"
              :value="tone.value"
            >
              {{ tone.label }}
            </option>
          </select>
        </label>

        <label class="habit-card__field">
          <span class="habit-card__label">Icon</span>
          <select
            v-model="props.editingForm.icon_key"
            class="habit-card__select"
          >
            <option
              v-for="icon in HABIT_ICON_OPTIONS"
              :key="icon.value"
              :value="icon.value"
            >
              {{ icon.label }}
            </option>
          </select>
        </label>

        <div class="habit-card__actions">
          <button
            class="habit-card__action habit-card__action--primary"
            type="submit"
            :disabled="props.isBusy"
          >
            <FontAwesomeIcon
              class="habit-card__action-icon"
              :icon="faFloppyDisk"
            />
            <span>{{ props.isUpdating ? 'Saving...' : 'Save changes' }}</span>
          </button>
          <button
            class="habit-card__action habit-card__action--secondary"
            type="button"
            :disabled="props.isBusy"
            @click="emit('cancel-editing')"
          >
            <FontAwesomeIcon
              class="habit-card__action-icon"
              :icon="faXmark"
            />
            <span>Cancel</span>
          </button>
        </div>
      </form>
    </template>

    <template v-else>
      <div class="habit-card__topline">
        <div class="habit-card__identity">
          <span class="habit-card__icon-badge">
            <FontAwesomeIcon
              class="habit-card__icon"
              :icon="getHabitIcon(props.habit.icon_key)"
            />
          </span>
          <div>
            <h3 class="habit-card__title">{{ props.habit.name }}</h3>
            <p class="habit-card__description">
              {{
                props.habit.description || 'Keep the cue short and repeatable.'
              }}
            </p>
          </div>
        </div>

        <div class="habit-card__meta">
          <span class="habit-card__streak"
            >{{ props.habit.streak }} day streak</span
          >
          <span
            class="habit-card__status"
            :class="{'habit-card__status--done': props.habit.isDoneToday}"
          >
            {{ props.habit.isDoneToday ? 'Done today' : 'Still open' }}
          </span>
        </div>
      </div>

      <div class="habit-card__body">
        <div class="habit-card__weekly">
          <div class="habit-card__weekly-header">
            <p class="habit-card__weekly-label">Last seven days</p>
            <p class="habit-card__weekly-value">
              {{ props.habit.weeklyCompletionCount }}/7
            </p>
          </div>

          <HabitWeekStrip :marks="props.habit.weeklyMarks" />
        </div>

        <div class="habit-card__actions">
          <button
            class="habit-card__action habit-card__action--primary"
            type="button"
            :disabled="props.isBusy"
            @click="emit('toggle', props.habit.id)"
          >
            <FontAwesomeIcon class="habit-card__action-icon" :icon="faCheck" />
            <span>{{
              props.habit.isDoneToday ? 'Undo today' : 'Mark done'
            }}</span>
          </button>

          <button
            class="habit-card__action habit-card__action--edit"
            type="button"
            :disabled="props.isBusy"
            @click="emit('begin-editing', props.habit.id)"
          >
            <FontAwesomeIcon class="habit-card__action-icon" :icon="faPen" />
            <span>Edit</span>
          </button>

          <button
            class="habit-card__action habit-card__action--danger"
            type="button"
            :disabled="props.isBusy"
            @click="emit('delete', props.habit.id)"
          >
            <FontAwesomeIcon
              class="habit-card__action-icon"
              :icon="faTrashCan"
            />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </template>
  </article>
</template>

<style scoped lang="scss">
  .habit-card {
    display: grid;
    gap: 18px;
    padding: 20px;
    border: 1px solid $color-line;
    border-radius: $radius-md;
    background: $color-panel-strong;
  }

  .habit-card__topline {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 18px;

    @include down('sm') {
      flex-direction: column;
    }
  }

  .habit-card__identity {
    min-width: 0;
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    gap: 14px;
    align-items: start;
  }

  .habit-card__icon-badge {
    width: 44px;
    height: 44px;
    display: grid;
    place-items: center;
    border-radius: 14px;
    background: var(--habit-accent-soft, rgba(13, 122, 102, 0.1));
    color: var(--habit-accent, $color-accent);
  }

  .habit-card__title {
    margin: 0;
    font-family: $font-heading;
    font-size: 1.5rem;
    letter-spacing: -0.03em;
  }

  .habit-card__description,
  .habit-card__weekly-label,
  .habit-card__label,
  .habit-card__eyebrow {
    color: $color-muted;
  }

  .habit-card__description {
    margin: 8px 0 0;
  }

  .habit-card__meta {
    display: grid;
    gap: 8px;
    justify-items: end;

    @include down('sm') {
      justify-items: start;
    }
  }

  .habit-card__streak,
  .habit-card__status {
    padding: 8px 12px;
    border-radius: 999px;
  }

  .habit-card__streak {
    background: var(--habit-accent-soft, rgba(13, 122, 102, 0.1));
    color: var(--habit-accent, $color-accent);
    white-space: nowrap;
  }

  .habit-card__status {
    background: rgba(52, 37, 21, 0.08);
    color: $color-muted;
  }

  .habit-card__status--done {
    background: color-mix(
      in srgb,
      var(--habit-accent-soft, rgba(13, 122, 102, 0.1)) 92%,
      white
    );
    color: var(--habit-accent, $color-accent);
  }

  .habit-card__body,
  .habit-card__weekly,
  .habit-card__edit-form {
    display: grid;
    gap: 16px;
  }

  .habit-card__weekly-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .habit-card__weekly-label,
  .habit-card__weekly-value {
    margin: 0;
  }

  .habit-card__weekly-value {
    font-family: $font-heading;
  }

  .habit-card__field {
    display: grid;
    gap: 8px;
  }

  .habit-card__input,
  .habit-card__textarea,
  .habit-card__select {
    @include soft-form-control(
      var(--habit-accent, $color-accent),
      color-mix(in srgb, var(--habit-accent, $color-accent) 14%, transparent)
    );
  }

  .habit-card__textarea {
    @include soft-textarea;
  }

  .habit-card__select {
    @include soft-select;
  }

  .habit-card__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .habit-card__action {
    @include tactile-button-surface(
      var(--habit-accent-soft, $color-line),
      color-mix(in srgb, var(--habit-accent, $color-accent) 18%, transparent),
      rgba(61, 39, 17, 0.08)
    );
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

  .habit-card__action--primary {
    border-color: color-mix(
      in srgb,
      var(--habit-accent, $color-accent) 20%,
      transparent
    );
    background: color-mix(
      in srgb,
      var(--habit-accent-soft, rgba(13, 122, 102, 0.1)) 88%,
      white
    );
    color: var(--habit-accent, $color-accent);
    @include tactile-hover-lift(
      color-mix(
        in srgb,
        var(--habit-accent-soft, rgba(13, 122, 102, 0.1)) 72%,
        var(--habit-accent, $color-accent)
      ),
      color-mix(in srgb, var(--habit-accent, $color-accent) 32%, transparent),
      var(--habit-accent, $color-accent)
    );
  }

  .habit-card__action--secondary {
    border-color: $color-line;
    background: rgba(52, 37, 21, 0.08);
    color: $color-text;
    @include tactile-hover-lift(
      rgba(52, 37, 21, 0.12),
      rgba(52, 37, 21, 0.16),
      $color-text
    );
  }

  .habit-card__action--edit {
    @include soft-warm-action-surface;
  }

  .habit-card__action--danger {
    @include soft-danger-action-surface;
  }

  .habit-card__action-icon {
    font-size: 0.9rem;
  }
</style>
