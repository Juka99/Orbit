<script setup lang="ts">
import { computed, reactive } from 'vue'

import WaterHero from '../components/water/WaterHero.vue'
import WaterHistoryPanel from '../components/water/WaterHistoryPanel.vue'
import WaterTimelinePanel from '../components/water/WaterTimelinePanel.vue'
import type { WaterCustomFormState } from '../components/water/types'
import { useWater } from '../composables/useWater'

const quickAddOptions = [250, 350, 500, 750]

const {
  currentStreak,
  glassesToday,
  goalMl,
  goalProgress,
  isCreating,
  isDeleting,
  isLoading,
  isRefreshing,
  mutationError,
  queryError,
  recentDailyTotals,
  refetch,
  remainingToGoal,
  removeWaterLog,
  saveWaterLog,
  todayLogs,
  todayTotal,
} = useWater()

const customForm = reactive<WaterCustomFormState>({
  amountMl: 400,
})

const waterError = computed(() => queryError.value || mutationError.value)
const progressLabel = computed(() => `${Math.round(goalProgress.value * 100)}%`)
const encouragementText = computed(() => {
  if (todayTotal.value >= goalMl) {
    return 'Goal reached. Coast through the rest of the day.'
  }

  if (todayTotal.value === 0) {
    return 'Start soft. One quick glass is enough to get momentum going.'
  }

  return `${remainingToGoal.value} ml left to hit today's target.`
})
const hasTodayLogs = computed(() => todayLogs.value.length > 0)

async function addQuickWater(amountMl: number) {
  await saveWaterLog({ amount_ml: amountMl })
}

async function handleCustomSubmit() {
  const requestedAmount = Number.isFinite(customForm.amountMl) ? customForm.amountMl : 400
  const normalizedAmount = Math.max(50, Math.min(5000, Math.round(requestedAmount)))

  await saveWaterLog({ amount_ml: normalizedAmount })
  customForm.amountMl = 400
}
</script>

<template>
  <section class="water-page">
    <WaterHero
      :quick-add-options="quickAddOptions"
      :glasses-today="glassesToday"
      :current-streak="currentStreak"
      :goal-ml="goalMl"
      :is-refreshing="isRefreshing"
      :is-creating="isCreating"
      :is-deleting="isDeleting"
      :custom-form="customForm"
      :goal-progress="goalProgress"
      :today-total="todayTotal"
      :progress-label="progressLabel"
      :encouragement-text="encouragementText"
      @quick-add="addQuickWater"
      @submit-custom="handleCustomSubmit"
    />

    <p
      v-if="waterError"
      class="water-page__feedback water-page__feedback--error"
    >
      {{ waterError }}
    </p>

    <section class="water-page__layout">
      <section class="water-feed">
        <WaterTimelinePanel
          :is-loading="isLoading"
          :is-refreshing="isRefreshing"
          :is-deleting="isDeleting"
          :is-creating="isCreating"
          :has-today-logs="hasTodayLogs"
          :today-logs="todayLogs"
          @refresh="refetch()"
          @remove="removeWaterLog"
        />

        <WaterHistoryPanel
          :recent-daily-totals="recentDailyTotals"
          :goal-ml="goalMl"
        />
      </section>
    </section>
  </section>
</template>

<style scoped lang="scss">
.water-page {
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

.water-page__layout {
  min-width: 0;
  display: grid;
  gap: 20px;
}

.water-page__feedback {
  margin: 0;
  padding: 14px 16px;
  border-radius: $radius-sm;
}

.water-page__feedback--error {
  border: 1px solid rgba(163, 53, 53, 0.25);
  background: rgba(163, 53, 53, 0.08);
  color: #8f2f2f;
}

.water-feed {
  min-width: 0;
  display: grid;
  gap: 20px;
}
</style>
