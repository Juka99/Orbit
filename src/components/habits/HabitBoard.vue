<script setup lang="ts">
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
        @click="emit('refresh')"
      >
        {{ isRefreshing ? 'Refreshing...' : 'Refresh' }}
      </button>
    </div>

    <div class="habit-board__content">
      <div v-if="isLoading" class="habit-board__state">Loading habits...</div>

      <div v-else-if="!habits.length" class="habit-board__state">
        No habits yet. Add one to get started on building your streaks!
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

    @media (min-width: 1301px) {
      height: 100%;
      overflow: hidden;
    }

    @media (max-width: 1300px) {
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
    width: fit-content;
    padding: 12px 16px;
    border: 0;
    border-radius: 999px;
    background: rgba(52, 37, 21, 0.08);
    color: $color-text;
    cursor: pointer;

    &:disabled {
      opacity: 0.65;
      cursor: wait;
    }
  }

  .habit-board__content {
    @include subtle-scrollbar;
    min-height: 0;
    overflow: auto;
    display: grid;
    align-content: start;
    gap: 16px;
    padding-right: 8px;

    @media (max-width: 1300px) {
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
</style>
