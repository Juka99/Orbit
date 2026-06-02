<script setup lang="ts">
  import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';
  import {faArrowsRotate, faListCheck} from '@fortawesome/free-solid-svg-icons';

  import HabitCard from './HabitCard.vue';
  import type {HabitCardViewModel, HabitFormState} from './types';

  defineProps<{
    habits: HabitCardViewModel[];
    isLoading: boolean;
    isRefreshing: boolean;
    isBusy: boolean;
    isUpdating: boolean;
    editingHabitId: string;
    editingForm: HabitFormState;
  }>();

  const emit = defineEmits<{
    (e: 'refresh'): void;
    (e: 'toggle', habitId: string): void;
    (e: 'begin-editing', habitId: string): void;
    (e: 'cancel-editing'): void;
    (e: 'save'): void;
    (e: 'delete', habitId: string): void;
  }>();
</script>

<template>
  <section class="habit-board">
    <div class="habit-board__header">
      <div>
        <p class="habit-board__eyebrow">Today's pass</p>
        <h2 class="habit-board__title">Habit board</h2>
      </div>

      <button
        class="habit-board__refresh"
        type="button"
        :disabled="isLoading || isRefreshing"
        :aria-busy="isRefreshing"
        @click="emit('refresh')"
      >
        <FontAwesomeIcon :icon="faArrowsRotate" />
        <span>{{ isRefreshing ? 'Refreshing...' : 'Refresh' }}</span>
      </button>
    </div>

    <div class="habit-board__content">
      <div v-if="isLoading" class="habit-board__state">Loading habits...</div>

      <div
        v-else-if="!habits.length"
        class="habit-board__state habit-board__state--empty"
      >
        <span class="habit-board__state-icon">
          <FontAwesomeIcon :icon="faListCheck" />
        </span>
        <span class="habit-board__state-copy">
          <strong class="habit-board__state-title">No habits yet</strong>
          <span class="habit-board__state-text">
            Add your first habit and this board will start tracking streaks and daily progress.
          </span>
        </span>
      </div>

      <template v-else>
        <HabitCard
          v-for="habit in habits"
          :key="habit.id"
          :habit="habit"
          :is-editing="editingHabitId === habit.id"
          :editing-form="editingForm"
          :is-busy="isBusy"
          :is-updating="isUpdating"
          @toggle="emit('toggle', $event)"
          @begin-editing="emit('begin-editing', $event)"
          @cancel-editing="emit('cancel-editing')"
          @save="emit('save')"
          @delete="emit('delete', $event)"
        />
      </template>
    </div>
  </section>
</template>

<style scoped lang="scss">
  .habit-board {
    min-height: 0;
    display: grid;
    grid-template-rows: auto minmax(0, 1fr);
    gap: 20px;

    @include above('xl') {
      height: 100%;
      overflow: hidden;
    }

    @include down('xl') {
      height: auto;
      overflow: visible;
      grid-template-rows: auto auto;
    }
  }

  .habit-board__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .habit-board__eyebrow {
    margin: 0 0 10px;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    font-size: 0.78rem;
    color: $color-accent;
  }

  .habit-board__title {
    margin: 0;
    font-family: $font-heading;
    font-size: 1.8rem;
    letter-spacing: -0.03em;
  }

  .habit-board__refresh {
    @include refresh-action-button;
  }

  .habit-board__content {
    @include subtle-scrollbar;
    min-height: 0;
    overflow: auto;
    display: grid;
    align-content: start;
    gap: 16px;
    padding-right: 8px;

    @include down('xl') {
      overflow: visible;
      padding-right: 0;
    }
  }

  .habit-board__state {
    padding: 24px;
    border: 1px solid $color-line;
    border-radius: $radius-md;
    background: $color-panel-strong;
  }

  .habit-board__state--empty {
    @include soft-empty-state(rgb(195, 123, 48));
    align-items: start;
    gap: 16px;
    padding: 20px;
  }

  .habit-board__state-icon {
    @include soft-empty-state-icon(rgb(195, 123, 48));
    width: 50px;
    height: 50px;
    color: #8a5621;
    font-size: 1.1rem;
  }

  .habit-board__state-copy {
    min-width: 0;
    display: grid;
    gap: 6px;
  }

  .habit-board__state-title {
    font-family: $font-heading;
    font-size: 1.25rem;
    letter-spacing: -0.03em;
  }

  .habit-board__state-text {
    color: $color-muted;
    line-height: 1.55;
  }
</style>
