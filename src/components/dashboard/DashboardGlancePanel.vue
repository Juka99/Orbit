<script setup lang="ts">
defineProps<{
  todayTotal: number
  waterProgressPercent: number
  mealsCount: number
  todayCalories: number
  recentNotesCount: number
  moodLabel: string
}>()
</script>

<template>
  <article class="dashboard-glance-panel">
    <div class="dashboard-glance-panel__header">
      <div>
        <p class="dashboard-glance-panel__eyebrow">Today at a glance</p>
        <h2 class="dashboard-glance-panel__title">The shape of the day</h2>
      </div>
    </div>

    <div class="dashboard-glance-panel__grid">
      <div class="dashboard-glance-panel__card">
        <span class="dashboard-glance-panel__label">Hydration</span>
        <strong class="dashboard-glance-panel__value">{{ todayTotal }} ml</strong>
        <span class="dashboard-glance-panel__meta">{{ waterProgressPercent }}% of goal</span>
      </div>
      <div class="dashboard-glance-panel__card">
        <span class="dashboard-glance-panel__label">Meals</span>
        <strong class="dashboard-glance-panel__value">{{ mealsCount }}</strong>
        <span class="dashboard-glance-panel__meta">{{ todayCalories }} kcal tracked</span>
      </div>
      <div class="dashboard-glance-panel__card">
        <span class="dashboard-glance-panel__label">Capture</span>
        <strong class="dashboard-glance-panel__value">{{ recentNotesCount }}</strong>
        <span class="dashboard-glance-panel__meta">recent notes in motion</span>
      </div>
      <div class="dashboard-glance-panel__card">
        <span class="dashboard-glance-panel__label">Orbit mood</span>
        <strong class="dashboard-glance-panel__value">{{ moodLabel }}</strong>
        <span class="dashboard-glance-panel__meta">steady, modular, and ready</span>
      </div>
    </div>
  </article>
</template>

<style scoped lang="scss">
.dashboard-glance-panel {
  display: grid;
  gap: 18px;
  padding: 24px;
  border: 1px solid $color-line;
  border-radius: $radius-md;
  background: $color-panel-strong;
}

.dashboard-glance-panel__eyebrow {
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.78rem;
  color: $color-accent;
}

.dashboard-glance-panel__title {
  margin: 10px 0 0;
  font-family: $font-heading;
  font-size: 1.8rem;
  letter-spacing: -0.03em;
}

.dashboard-glance-panel__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;

  @include down('sm') {
    grid-template-columns: 1fr;
  }
}

.dashboard-glance-panel__card {
  display: grid;
  gap: 6px;
  padding: 14px;
  border: 1px solid $color-line;
  border-radius: $radius-sm;
  background: rgba(255, 255, 255, 0.56);
}

.dashboard-glance-panel__label,
.dashboard-glance-panel__meta {
  color: $color-muted;
}

.dashboard-glance-panel__label {
  font-size: 0.9rem;
}

.dashboard-glance-panel__value {
  font-family: $font-heading;
  font-size: 1.55rem;
  letter-spacing: -0.03em;
}
</style>
