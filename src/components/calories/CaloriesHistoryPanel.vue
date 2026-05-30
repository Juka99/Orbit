<script setup lang="ts">
import type { RecentDailyCaloriesItem } from './types'

const props = defineProps<{
  recentDailyCalories: RecentDailyCaloriesItem[]
}>()

function formatDailyDate(dateKey: string) {
  const [year, month, day] = dateKey.split('-').map(Number)
  return new Intl.DateTimeFormat('en', {
    weekday: 'short',
  }).format(new Date(year, month - 1, day))
}
</script>

<template>
  <article class="calories-history-panel">
    <div class="calories-history-panel__header">
      <div>
        <p class="calories-history-panel__eyebrow">Seven-day energy</p>
        <h2 class="calories-history-panel__title">Recent totals</h2>
      </div>
    </div>

    <div class="calories-history-panel__chart">
      <article
        v-for="day in props.recentDailyCalories"
        :key="day.dateKey"
        class="calories-history-panel__day"
        :class="{ 'calories-history-panel__day--today': day.isToday }"
      >
        <div class="calories-history-panel__bar-track">
          <div
            class="calories-history-panel__bar-fill"
            :style="{
              height: `${Math.min(Math.max((day.total / 2500) * 100, day.total ? 12 : 0), 100)}%`,
            }"
          ></div>
        </div>
        <div class="calories-history-panel__copy">
          <p class="calories-history-panel__name">
            {{ formatDailyDate(day.dateKey) }}
          </p>
          <strong class="calories-history-panel__value">{{ day.total }}</strong>
          <span class="calories-history-panel__unit">kcal</span>
        </div>
      </article>
    </div>
  </article>
</template>

<style scoped lang="scss">
.calories-history-panel {
  border: 1px solid $color-line;
  border-radius: $radius-md;
  background: $color-panel-strong;
  padding: 22px;
}

.calories-history-panel__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 18px;
}

.calories-history-panel__eyebrow {
  margin: 0 0 10px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.78rem;
  color: $color-accent;
}

.calories-history-panel__title {
  margin: 0;
  font-family: $font-heading;
  letter-spacing: -0.03em;
}

.calories-history-panel__chart {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 12px;
  justify-content: space-between;
}

.calories-history-panel__day {
  width: 100%;
  max-width: 124px;
  display: grid;
  gap: 12px;
  justify-items: center;
  justify-self: center;
}

.calories-history-panel__bar-track {
  width: 100%;
  min-height: 164px;
  padding: 8px;
  border-radius: 20px;
  background: rgba(52, 37, 21, 0.06);
  display: flex;
  align-items: flex-end;
}

.calories-history-panel__bar-fill {
  width: 100%;
  border-radius: 14px;
  min-height: 0;
  background: linear-gradient(
    180deg,
    rgba(255, 230, 194, 0.98) 0%,
    rgba(221, 170, 103, 0.95) 40%,
    rgba(195, 123, 48, 0.96) 100%
  );
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.34),
    0 10px 22px rgba(195, 123, 48, 0.16);
}

.calories-history-panel__copy {
  display: grid;
  gap: 2px;
  justify-items: center;
  text-align: center;
}

.calories-history-panel__name,
.calories-history-panel__value {
  margin: 0;
}

.calories-history-panel__value {
  font-family: $font-heading;
  font-size: 1.35rem;
}

.calories-history-panel__unit {
  color: $color-muted;
}

.calories-history-panel__day--today .calories-history-panel__bar-track {
  background: rgba(195, 123, 48, 0.1);
}
</style>
