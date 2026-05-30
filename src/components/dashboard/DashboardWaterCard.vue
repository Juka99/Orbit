<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faDroplet, faWaveSquare } from '@fortawesome/free-solid-svg-icons'

import DashboardModuleCard from './DashboardModuleCard.vue'

defineProps<{
  isLoading: boolean
  errorText: string
  todayTotal: number
  goalMl: number
  currentStreak: number
  progressPercent: number
  headline: string
  glassesToday: number
  remainingToGoal: number
}>()
</script>

<template>
  <DashboardModuleCard
    eyebrow="Water"
    title="Hydration rhythm"
    description="See how close you are to the goal, how often you poured, and whether the streak still feels alive."
    to="/water"
    action-label="Open water"
    :action-icon="faDroplet"
    :loading="isLoading"
    loading-text="Loading water…"
    :error-text="errorText"
  >
    <div class="dashboard-water-card__metric-strip">
      <div class="dashboard-water-card__metric-pill dashboard-water-card__metric-pill--wide">
        <FontAwesomeIcon
          class="dashboard-water-card__metric-icon"
          :icon="faDroplet"
        />
        <div class="dashboard-water-card__metric-label-value">
          <span class="dashboard-water-card__metric-label">Progress</span>
          <strong class="dashboard-water-card__metric-value">{{ todayTotal }} / {{ goalMl }} ml</strong>
        </div>
      </div>

      <div class="dashboard-water-card__metric-pill dashboard-water-card__metric-pill--wide">
        <FontAwesomeIcon
          class="dashboard-water-card__metric-icon"
          :icon="faWaveSquare"
        />
        <div class="dashboard-water-card__metric-label-value">
          <span class="dashboard-water-card__metric-label">Streak</span>
          <strong class="dashboard-water-card__metric-value">{{ currentStreak }} days</strong>
        </div>
      </div>
    </div>

    <div class="dashboard-water-card__progress">
      <div class="dashboard-water-card__progress-track">
        <span
          class="dashboard-water-card__progress-fill"
          :style="{ width: `${progressPercent}%` }"
        ></span>
      </div>
      <span class="dashboard-water-card__progress-text">{{ progressPercent }}%</span>
    </div>

    <p class="dashboard-water-card__copy">{{ headline }}</p>

    <div class="dashboard-water-card__tags">
      <span class="dashboard-water-card__tag">{{ glassesToday }} pours today</span>
      <span class="dashboard-water-card__tag">{{ remainingToGoal }} ml remaining</span>
    </div>
  </DashboardModuleCard>
</template>

<style scoped lang="scss">
.dashboard-water-card__metric-strip {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;

  @include down('sm') {
    grid-template-columns: 1fr;
  }
}

.dashboard-water-card__metric-pill {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  border: 1px solid $color-line;
  border-radius: $radius-sm;
  background: rgba(255, 255, 255, 0.56);
}

.dashboard-water-card__metric-pill--wide {
  grid-column: span 2;

  @include down('sm') {
    grid-column: span 1;
  }
}

.dashboard-water-card__metric-label-value {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.dashboard-water-card__metric-icon {
  color: #8a5621;
}

.dashboard-water-card__metric-label,
.dashboard-water-card__progress-text,
.dashboard-water-card__copy {
  color: $color-muted;
}

.dashboard-water-card__metric-label {
  font-size: 0.9rem;
}

.dashboard-water-card__metric-value {
  font-family: $font-heading;
  font-size: 1.2rem;
  letter-spacing: -0.03em;
}

.dashboard-water-card__progress {
  display: flex;
  align-items: center;
  gap: 12px;
}

.dashboard-water-card__progress-track {
  flex: 1 1 auto;
  height: 10px;
  border-radius: 999px;
  background: rgba(52, 37, 21, 0.08);
  overflow: hidden;
}

.dashboard-water-card__progress-fill {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(135deg, rgba(13, 122, 102, 0.86) 0%, rgba(72, 176, 161, 0.9) 100%);
}

.dashboard-water-card__progress-text {
  min-width: 46px;
  text-align: right;
}

.dashboard-water-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: baseline;
  height: fit-content;
}

.dashboard-water-card__tag {
  padding: 10px 14px;
  border-radius: 999px;
  background: rgba(195, 123, 48, 0.12);
  color: #8a5621;
}
</style>
