<script setup lang="ts">
defineProps<{
  habitsCount: number
  completedTodayCount: number
  completionPercent: number
  activeStreaks: number
  weeklyCompletions: number
}>()
</script>

<template>
  <header class="habits-hero">
    <div class="habits-hero__copy">
      <p class="habits-hero__eyebrow">Daily cadence</p>
      <h1 class="habits-hero__title">Habits</h1>
      <p class="habits-hero__lede">
        Build a simple rhythm: choose what matters, check it off, and keep the streaks gentle but visible.
      </p>
    </div>

    <div class="habits-hero__summary">
      <div class="habits-hero__stat">
        <span class="habits-hero__label">Today</span>
        <strong class="habits-hero__value">{{ completedTodayCount }}/{{ habitsCount }}</strong>
      </div>
      <div class="habits-hero__stat">
        <span class="habits-hero__label">Completion</span>
        <strong class="habits-hero__value">{{ completionPercent }}%</strong>
      </div>
      <div class="habits-hero__stat">
        <span class="habits-hero__label">Active streaks</span>
        <strong class="habits-hero__value">{{ activeStreaks }}</strong>
      </div>
      <div class="habits-hero__stat">
        <span class="habits-hero__label">7-day checks</span>
        <strong class="habits-hero__value">{{ weeklyCompletions }}</strong>
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
.habits-hero {
  display: grid;
  grid-template-columns: minmax(0, 1.45fr) minmax(320px, 1fr);
  gap: 18px;

  @include down('lg') {
    grid-template-columns: 1fr;
  }
}

.habits-hero__eyebrow {
  margin: 0 0 10px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.78rem;
  color: $color-accent;
}

.habits-hero__title {
  margin: 0;
  font-family: $font-heading;
  font-size: clamp(2.4rem, 4vw, 4.1rem);
  letter-spacing: -0.03em;
}

.habits-hero__lede,
.habits-hero__label {
  color: $color-muted;
}

.habits-hero__summary {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;

  @include down('sm') {
    grid-template-columns: 1fr 1fr;
  }
}

.habits-hero__stat {
  display: grid;
  gap: 8px;
  padding: 18px;
  border: 1px solid $color-line;
  border-radius: $radius-md;
  background: $color-panel-strong;
}

.habits-hero__label {
  font-size: 0.88rem;
}

.habits-hero__value {
  font-family: $font-heading;
  font-size: clamp(1.5rem, 3vw, 2.3rem);
  line-height: 1;
}
</style>
