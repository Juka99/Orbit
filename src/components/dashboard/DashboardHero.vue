<script setup lang="ts">
defineProps<{
  todayLabel: string
  notesCount: number
  foodsCount: number
  authStatusText: string
  authStatusBody: string
  todayTotal: number
  todayCalories: number
  mealsTodayCount: number
}>()
</script>

<template>
  <header class="dashboard-hero">
    <div class="dashboard-hero__copy">
      <p class="dashboard-hero__eyebrow">Daily overview</p>
      <h1 class="dashboard-hero__title">Keep the day in orbit.</h1>
      <p class="dashboard-hero__lede">
        One calm screen for your notes, hydration, and food tracking, with today’s
        pulse surfaced first.
      </p>

      <div class="dashboard-hero__chips">
        <span class="dashboard-hero__chip">{{ todayLabel }}</span>
        <span class="dashboard-hero__chip">{{ notesCount }} notes saved</span>
        <span class="dashboard-hero__chip">{{ foodsCount }} foods in library</span>
      </div>
    </div>

    <article class="dashboard-hero__status-card">
      <p class="dashboard-hero__eyebrow">Orbit pulse</p>
      <strong class="dashboard-hero__status-title">{{ authStatusText }}</strong>
      <p class="dashboard-hero__status-text">{{ authStatusBody }}</p>

      <div class="dashboard-hero__status-metrics">
        <div class="dashboard-hero__status-metric">
          <span class="dashboard-hero__status-label">Water today</span>
          <strong class="dashboard-hero__status-value">{{ todayTotal }} ml</strong>
        </div>
        <div class="dashboard-hero__status-metric">
          <span class="dashboard-hero__status-label">Calories today</span>
          <strong class="dashboard-hero__status-value">{{ todayCalories }} kcal</strong>
        </div>
        <div class="dashboard-hero__status-metric">
          <span class="dashboard-hero__status-label">Meals logged</span>
          <strong class="dashboard-hero__status-value">{{ mealsTodayCount }}</strong>
        </div>
      </div>
    </article>
  </header>
</template>

<style scoped lang="scss">
.dashboard-hero,
.dashboard-hero__status-card {
  border: 1px solid $color-line;
  border-radius: $radius-md;
  background: $color-panel-strong;
}

.dashboard-hero {
  display: grid;
  grid-template-columns: minmax(0, 1.45fr) minmax(320px, 0.95fr);
  gap: 22px;
  padding: 28px;

  @include down('lg') {
    grid-template-columns: 1fr;
  }
}

.dashboard-hero__copy {
  display: grid;
  gap: 14px;
}

.dashboard-hero__eyebrow {
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.78rem;
  color: $color-accent;
}

.dashboard-hero__title {
  margin: 0;
  font-family: $font-heading;
  font-size: clamp(2.7rem, 5vw, 5rem);
  line-height: 0.94;
  letter-spacing: -0.04em;
}

.dashboard-hero__lede,
.dashboard-hero__status-text {
  color: $color-muted;
}

.dashboard-hero__lede {
  max-width: 56ch;
  font-size: 1.04rem;
}

.dashboard-hero__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: baseline;
  height: fit-content;
}

.dashboard-hero__chip {
  padding: 10px 14px;
  border-radius: 999px;
  background: rgba(195, 123, 48, 0.12);
  color: #8a5621;
}

.dashboard-hero__status-card {
  display: grid;
  gap: 16px;
  padding: 22px;
}

.dashboard-hero__status-title {
  font-family: $font-heading;
  font-size: 1.8rem;
  letter-spacing: -0.03em;
}

.dashboard-hero__status-metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;

  @include down('sm') {
    grid-template-columns: 1fr;
  }
}

.dashboard-hero__status-metric {
  display: grid;
  gap: 6px;
  padding: 14px;
  border: 1px solid $color-line;
  border-radius: $radius-sm;
  background: rgba(255, 255, 255, 0.56);
}

.dashboard-hero__status-label {
  font-size: 0.9rem;
  color: $color-muted;
}

.dashboard-hero__status-value {
  font-family: $font-heading;
  font-size: 1.55rem;
  letter-spacing: -0.03em;
}
</style>
