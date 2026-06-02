<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'

import HabitBoard from '../components/habits/HabitBoard.vue'
import HabitCreatePanel from '../components/habits/HabitCreatePanel.vue'
import HabitHero from '../components/habits/HabitHero.vue'
import type { HabitFormState } from '../components/habits/types'
import { useHabits } from '../composables/useHabits'

const {
  activeStreaks,
  completedTodayCount,
  completionPercent,
  editHabit,
  habitsCount,
  habitsWithState,
  isCreating,
  isDeleting,
  isLoading,
  isRefreshing,
  isToggling,
  isUpdating,
  mutationError,
  queryError,
  refetch,
  removeHabit,
  saveHabit,
  toggleHabitForToday,
  weeklyCompletions,
} = useHabits()

const createForm = reactive<HabitFormState>({
  name: '',
  description: '',
  tone: 'sage',
  icon_key: 'spark',
})

const editingHabitId = ref('')
const editingForm = reactive<HabitFormState>({
  name: '',
  description: '',
  tone: 'sage',
  icon_key: 'spark',
})

const isBusy = computed(
  () =>
    isCreating.value ||
    isUpdating.value ||
    isDeleting.value ||
    isToggling.value,
)
const habitsError = computed(() => queryError.value || mutationError.value)

watch(
  () => editingHabitId.value,
  (habitId) => {
    if (!habitId) {
      editingForm.name = ''
      editingForm.description = ''
      editingForm.tone = 'sage'
      editingForm.icon_key = 'spark'
    }
  },
)

async function handleCreateHabit() {
  await saveHabit({
    name: createForm.name.trim() || 'Untitled habit',
    description: createForm.description.trim() || null,
    tone: createForm.tone,
    icon_key: createForm.icon_key,
  })

  createForm.name = ''
  createForm.description = ''
  createForm.tone = 'sage'
  createForm.icon_key = 'spark'
}

function beginEditing(habitId: string) {
  const habit = habitsWithState.value.find((item) => item.id === habitId)

  if (!habit) {
    return
  }

  editingHabitId.value = habitId
  editingForm.name = habit.name
  editingForm.description = habit.description ?? ''
  editingForm.tone = habit.tone
  editingForm.icon_key = habit.icon_key
}

function cancelEditing() {
  editingHabitId.value = ''
}

async function handleSaveHabit() {
  if (!editingHabitId.value) {
    return
  }

  await editHabit(editingHabitId.value, {
    name: editingForm.name.trim() || 'Untitled habit',
    description: editingForm.description.trim() || null,
    tone: editingForm.tone,
    icon_key: editingForm.icon_key,
  })

  cancelEditing()
}

async function handleDeleteHabit(habitId: string) {
  if (editingHabitId.value === habitId) {
    cancelEditing()
  }

  await removeHabit(habitId)
}
</script>

<template>
  <section class="habits-page">
    <HabitHero
      :habits-count="habitsCount"
      :completed-today-count="completedTodayCount"
      :completion-percent="completionPercent"
      :active-streaks="activeStreaks"
      :weekly-completions="weeklyCompletions"
    />

    <section class="habits-page__layout">
      <div class="habits-page__panel habits-page__panel--create">
        <HabitCreatePanel
          :create-form="createForm"
          :is-busy="isBusy"
          :is-creating="isCreating"
          :habits-error="habitsError"
          @submit="handleCreateHabit"
        />
      </div>

      <div class="habits-page__panel habits-page__panel--board">
        <HabitBoard
          :habits="habitsWithState"
          :is-loading="isLoading"
          :is-refreshing="isRefreshing"
          :is-busy="isBusy"
          :is-updating="isUpdating"
          :editing-habit-id="editingHabitId"
          :editing-form="editingForm"
          @refresh="refetch()"
          @toggle="toggleHabitForToday"
          @begin-editing="beginEditing"
          @cancel-editing="cancelEditing"
          @save="handleSaveHabit"
          @delete="handleDeleteHabit"
        />
      </div>
    </section>
  </section>
</template>

<style scoped lang="scss">
.habits-page {
  height: 100%;
  min-height: 0;
  overflow: hidden;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  gap: 24px;

  @include down('xl') {
    @include subtle-scrollbar;
    height: 100%;
    min-height: 0;
    overflow: auto;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  @include down('lg') {
    height: auto;
    overflow: visible;
  }
}

.habits-page__layout {
  min-height: 0;
  display: grid;
  grid-template-columns: minmax(320px, 0.95fr) minmax(0, 1.35fr);
  gap: 20px;

  @include down('xl') {
    min-height: auto;
    display: flex;
    flex-direction: column;
    flex: 0 0 auto;
  }
}

.habits-page__panel {
  min-height: 0;
  min-width: 0;

  @include down('xl') {
    min-height: auto;
    flex: 0 0 auto;
  }
}

.habits-page__panel--board {
  @include down('xl') {
    order: -1;
  }
}
</style>
