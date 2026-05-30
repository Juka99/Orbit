<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faDrumstickBite,
  faSeedling,
  faUtensils,
  faWater,
} from '@fortawesome/free-solid-svg-icons'

import DashboardModuleCard from './DashboardModuleCard.vue'

defineProps<{
  isLoading: boolean
  errorText: string
  todayCalories: number
  todayEntriesCount: number
  foodsCount: number
  todayProtein: number
  todayCarbs: number
  todayFats: number
  headline: string
}>()
</script>

<template>
  <DashboardModuleCard
    eyebrow="Calories"
    title="Fuel tracking"
    description="Keep the day’s intake readable at a glance, then dive into meals, foods, and macros when you need detail."
    to="/calories"
    action-label="Open calories"
    class="dashboard-calories-card"
    :action-icon="faUtensils"
    :loading="isLoading"
    loading-text="Loading calories…"
    :error-text="errorText"
  >
    <div class="dashboard-calories-card__hero">
      <div>
        <span class="dashboard-calories-card__label">Today total</span>
        <strong class="dashboard-calories-card__total">{{ todayCalories }} kcal</strong>
      </div>
      <div class="dashboard-calories-card__tags">
        <span class="dashboard-calories-card__tag">{{ todayEntriesCount }} meals</span>
        <span class="dashboard-calories-card__tag">{{ foodsCount }} saved foods</span>
      </div>
    </div>

    <div class="dashboard-calories-card__macro-grid">
      <div class="dashboard-calories-card__macro-card">
        <FontAwesomeIcon
          class="dashboard-calories-card__metric-icon"
          :icon="faDrumstickBite"
        />
        <span class="dashboard-calories-card__label">Protein</span>
        <strong class="dashboard-calories-card__macro-value">{{ todayProtein.toFixed(1) }} g</strong>
      </div>
      <div class="dashboard-calories-card__macro-card">
        <FontAwesomeIcon
          class="dashboard-calories-card__metric-icon"
          :icon="faSeedling"
        />
        <span class="dashboard-calories-card__label">Carbs</span>
        <strong class="dashboard-calories-card__macro-value">{{ todayCarbs.toFixed(1) }} g</strong>
      </div>
      <div class="dashboard-calories-card__macro-card">
        <FontAwesomeIcon
          class="dashboard-calories-card__metric-icon"
          :icon="faWater"
        />
        <span class="dashboard-calories-card__label">Fats</span>
        <strong class="dashboard-calories-card__macro-value">{{ todayFats.toFixed(1) }} g</strong>
      </div>
    </div>

    <p class="dashboard-calories-card__copy">{{ headline }}</p>
  </DashboardModuleCard>
</template>

<style scoped lang="scss">
.dashboard-calories-card__hero {
  display: grid;
  gap: 12px;
}

.dashboard-calories-card__label,
.dashboard-calories-card__copy {
  color: $color-muted;
}

.dashboard-calories-card__label {
  font-size: 0.9rem;
}

.dashboard-calories-card__total,
.dashboard-calories-card__macro-value {
  font-family: $font-heading;
  letter-spacing: -0.03em;
}

.dashboard-calories-card__total {
  display: block;
  font-size: 2.3rem;
}

.dashboard-calories-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: baseline;
  height: fit-content;
}

.dashboard-calories-card__tag {
  padding: 10px 14px;
  border-radius: 999px;
  background: rgba(195, 123, 48, 0.12);
  color: #8a5621;
}

.dashboard-calories-card__macro-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;

  @include down('sm') {
    grid-template-columns: 1fr;
  }
}

.dashboard-calories-card__macro-card {
  display: grid;
  gap: 8px;
  padding: 14px;
  border: 1px solid $color-line;
  border-radius: $radius-sm;
  background: rgba(255, 255, 255, 0.56);
}

.dashboard-calories-card__metric-icon {
  color: #8a5621;
}

.dashboard-calories-card__macro-value {
  font-size: 1.2rem;
}
</style>
