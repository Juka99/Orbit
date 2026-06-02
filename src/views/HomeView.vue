<script setup lang="ts">
import { computed } from 'vue'

import DashboardActivityPanel from '../components/dashboard/DashboardActivityPanel.vue'
import DashboardCaloriesCard from '../components/dashboard/DashboardCaloriesCard.vue'
import DashboardGlancePanel from '../components/dashboard/DashboardGlancePanel.vue'
import DashboardHero from '../components/dashboard/DashboardHero.vue'
import DashboardNotesCard from '../components/dashboard/DashboardNotesCard.vue'
import type {
  DashboardActivityItem,
  DashboardNotePreview,
} from '../components/dashboard/types'
import DashboardWaterCard from '../components/dashboard/DashboardWaterCard.vue'
import { useCalories } from '../composables/useCalories'
import { useNotes } from '../composables/useNotes'
import { useWater } from '../composables/useWater'
import { useAuth } from '../lib/auth'
import {
  formatCalendar,
  formatClock,
  formatUpdatedLabel,
  truncate,
} from '../lib/dashboard'
import { hasSupabaseCredentials } from '../lib/supabase'

const { isAuthenticated, user } = useAuth()

const {
  isLoading: isLoadingNotes,
  notes,
  notesCount,
  pinnedNotes,
  queryError: notesError,
} = useNotes()

const {
  currentStreak,
  glassesToday,
  goalMl,
  goalProgress,
  isLoading: isLoadingWater,
  logs,
  queryError: waterError,
  remainingToGoal,
  todayTotal,
} = useWater()

const {
  entries,
  foods,
  isLoadingEntries,
  isLoadingFoods,
  queryError: caloriesError,
  todayCalories,
  todayCarbs,
  todayEntries,
  todayFats,
  todayProtein,
} = useCalories()

const todayLabel = computed(() =>
  new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(new Date()),
)

const authStatusText = computed(() => {
  if (!hasSupabaseCredentials) {
    return 'Awaiting env setup'
  }

  return isAuthenticated.value ? 'Private data is live' : 'Preparing Orbit session'
})

const authStatusBody = computed(() => {
  if (!hasSupabaseCredentials) {
    return 'Add your Supabase URL and publishable key to turn the dashboard on.'
  }

  if (!isAuthenticated.value) {
    return 'Sign in to unlock your private dashboard data.'
  }

  return `Signed in as ${user.value?.email ?? 'your account'}, with personal data ready to flow through the app.`
})

const recentNotes = computed<DashboardNotePreview[]>(() => {
  return [...notes.value]
    .sort((left, right) => Date.parse(right.updated_at) - Date.parse(left.updated_at))
    .slice(0, 3)
    .map((note) => ({
      id: note.id,
      title: note.title || 'Untitled note',
      updatedAtLabel: formatUpdatedLabel(note.updated_at),
    }))
})

const latestWaterLog = computed(() => {
  return [...logs.value]
    .sort((left, right) => Date.parse(right.logged_at) - Date.parse(left.logged_at))[0]
})

const latestMealEntry = computed(() => {
  return [...entries.value]
    .sort((left, right) => Date.parse(right.logged_at) - Date.parse(left.logged_at))[0]
})

const waterProgressPercent = computed(() => Math.round(goalProgress.value * 100))

const averageCaloriesPerMeal = computed(() =>
  todayEntries.value.length > 0 ? Math.round(todayCalories.value / todayEntries.value.length) : 0,
)

const notesHeadline = computed(() => {
  if (notesCount.value === 0) {
    return 'Start with a pinned idea or a quick scratch note.'
  }

  if (pinnedNotes.value.length > 0) {
    return `${pinnedNotes.value.length} pinned note${pinnedNotes.value.length === 1 ? '' : 's'} keeping key things visible.`
  }

  return 'Your note space is warming up nicely.'
})

const waterHeadline = computed(() => {
  if (todayTotal.value === 0) {
    return 'Nothing poured yet today.'
  }

  if (remainingToGoal.value === 0) {
    return 'Hydration goal reached for today.'
  }

  return `${remainingToGoal.value} ml left to hit your daily goal.`
})

const caloriesHeadline = computed(() => {
  if (todayEntries.value.length === 0) {
    return 'No meals logged yet today.'
  }

  return `${todayEntries.value.length} meal${todayEntries.value.length === 1 ? '' : 's'} logged today, averaging ${averageCaloriesPerMeal.value} kcal each.`
})

const activityItems = computed<DashboardActivityItem[]>(() => {
  return [
    latestMealEntry.value
      ? {
          id: 'meal',
          label: 'Latest meal',
          title: latestMealEntry.value.food?.name ?? 'Food entry',
          meta: `${formatClock(latestMealEntry.value.logged_at)} · ${latestMealEntry.value.meal_type}`,
        }
      : {
          id: 'meal-empty',
          label: 'Latest meal',
          title: 'No calorie entries yet',
          meta: 'Add the first meal from Calories.',
        },
    latestWaterLog.value
      ? {
          id: 'water',
          label: 'Latest pour',
          title: `${latestWaterLog.value.amount_ml} ml added`,
          meta: `${formatClock(latestWaterLog.value.logged_at)} · ${formatCalendar(latestWaterLog.value.logged_at)}`,
        }
      : {
          id: 'water-empty',
          label: 'Latest pour',
          title: 'No water logged yet',
          meta: 'A quick 250 ml pour would start the day.',
        },
    recentNotes.value[0]
      ? {
          id: 'note',
          label: 'Latest note',
          title: recentNotes.value[0].title,
          meta: `${recentNotes.value[0].updatedAtLabel} · ${truncate(notes.value.find((note) => note.id === recentNotes.value[0].id)?.content || 'Freshly created note.', 48)}`,
        }
      : {
          id: 'note-empty',
          label: 'Latest note',
          title: 'No notes yet',
          meta: 'Capture an idea to start building your orbit.',
        },
  ]
})

const moodLabel = computed(() => {
  return todayEntries.value.length > 0 || todayTotal.value > 0 || notesCount.value > 0
    ? 'Active'
    : 'Quiet'
})
</script>

<template>
  <section class="dashboard">
    <DashboardHero
      :today-label="todayLabel"
      :notes-count="notesCount"
      :foods-count="foods.length"
      :auth-status-text="authStatusText"
      :auth-status-body="authStatusBody"
      :today-total="todayTotal"
      :today-calories="todayCalories"
      :meals-today-count="todayEntries.length"
    />

    <section class="dashboard__module-grid">
      <DashboardNotesCard
        :is-loading="isLoadingNotes"
        :error-text="notesError"
        :notes-count="notesCount"
        :pinned-notes-count="pinnedNotes.length"
        :headline="notesHeadline"
        :recent-notes="recentNotes"
      />

      <DashboardWaterCard
        :is-loading="isLoadingWater"
        :error-text="waterError"
        :today-total="todayTotal"
        :goal-ml="goalMl"
        :current-streak="currentStreak"
        :progress-percent="waterProgressPercent"
        :headline="waterHeadline"
        :glasses-today="glassesToday"
        :remaining-to-goal="remainingToGoal"
      />

      <DashboardCaloriesCard
        class="dashboard__module-card--calories"
        :is-loading="isLoadingFoods || isLoadingEntries"
        :error-text="caloriesError"
        :today-calories="todayCalories"
        :today-entries-count="todayEntries.length"
        :foods-count="foods.length"
        :today-protein="todayProtein"
        :today-carbs="todayCarbs"
        :today-fats="todayFats"
        :headline="caloriesHeadline"
      />
    </section>

    <section class="dashboard__lower-grid">
      <DashboardActivityPanel :items="activityItems" />

      <DashboardGlancePanel
        :today-total="todayTotal"
        :water-progress-percent="waterProgressPercent"
        :meals-count="todayEntries.length"
        :today-calories="todayCalories"
        :recent-notes-count="recentNotes.length"
        :mood-label="moodLabel"
      />
    </section>
  </section>
</template>

<style scoped lang="scss">
.dashboard {
  @include subtle-scrollbar;
  height: 100%;
  min-height: 0;
  overflow: auto;
  display: grid;
  gap: 24px;

  @include down('lg') {
    height: auto;
    overflow: visible;
  }
}

.dashboard__module-grid,
.dashboard__lower-grid {
  display: grid;
  gap: 18px;
}

.dashboard__module-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));

  @include down('xl') {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @include down('lg') {
    grid-template-columns: 1fr;
  }
}

.dashboard__module-card--calories {
  @include down('xl') {
    grid-column: 1 / -1;
  }

  @include down('lg') {
    grid-column: auto;
  }
}

.dashboard__lower-grid {
  grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.95fr);

  @include down('lg') {
    grid-template-columns: 1fr;
  }
}
</style>
