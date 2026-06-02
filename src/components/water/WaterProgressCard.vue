<script setup lang="ts">
defineProps<{
  goalProgress: number
  todayTotal: number
  progressLabel: string
  encouragementText: string
}>()
</script>

<template>
  <div class="water-progress">
    <div
      class="water-progress__ring"
      :style="{ '--water-progress-value': goalProgress }"
    >
      <div class="water-progress__core">
        <span class="water-progress__value">{{ todayTotal }}</span>
        <span class="water-progress__unit">ml today</span>
      </div>
    </div>

    <div class="water-progress__copy">
      <p class="water-progress__eyebrow">Daily progress</p>
      <strong class="water-progress__percent">{{ progressLabel }}</strong>
      <p class="water-progress__text">{{ encouragementText }}</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
@property --water-progress-value {
  syntax: '<number>';
  inherits: false;
  initial-value: 0;
}

.water-progress {
  display: grid;
  gap: 18px;
  align-content: center;
  justify-items: center;
  padding: 12px;

  @include down('lg') {
    grid-area: progress;
    padding: 0;
    gap: 14px;
    align-self: center;
    justify-self: center;
  }

  @include down('phone') {
    justify-self: stretch;
  }
}

.water-progress__ring {
  --water-progress-value: 0;
  position: relative;
  isolation: isolate;
  overflow: hidden;
  width: min(240px, 52vw);
  aspect-ratio: 1;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background:
    radial-gradient(circle at center, rgba(255, 250, 244, 0.98) 52%, transparent 53%),
    conic-gradient(
      from -90deg,
      $color-accent 0turn,
      $color-accent-strong calc(var(--water-progress-value) * 1turn),
      rgba(13, 122, 102, 0.12) calc(var(--water-progress-value) * 1turn),
      rgba(13, 122, 102, 0.12) 360deg
    );
  box-shadow:
    inset 0 0 0 14px rgba(255, 255, 255, 0.6),
    0 18px 40px rgba(61, 39, 17, 0.08);
  transition:
    --water-progress-value 700ms cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 240ms ease;

  @include down('lg') {
    width: clamp(210px, 28vw, 260px);
  }

  @include down('phone') {
    width: min(220px, 58vw);
    justify-self: center;
  }
}

.water-progress__ring::after {
  content: '';
  width: 72%;
  height: 72%;
  border-radius: 50%;
  position: absolute;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0) 52%),
    radial-gradient(circle at 30% 25%, rgba(255, 255, 255, 0.75), transparent 28%);
  mix-blend-mode: screen;
  pointer-events: none;
}

.water-progress__ring:hover {
  box-shadow:
    inset 0 0 0 14px rgba(255, 255, 255, 0.64),
    0 22px 46px rgba(61, 39, 17, 0.1);
}

.water-progress__core {
  position: relative;
  z-index: 1;
  display: grid;
  gap: 4px;
  justify-items: center;
  text-align: center;
}

.water-progress__value {
  font-family: $font-heading;
  font-size: clamp(2.2rem, 5vw, 3.6rem);
  line-height: 0.95;
  color: $color-text;
  text-shadow: none;
}

.water-progress__unit,
.water-progress__percent {
  display: block;
}

.water-progress__unit,
.water-progress__text {
  color: $color-muted;
}

.water-progress__copy {
  text-align: center;
  max-width: 28ch;

  @include down('lg') {
    max-width: 20ch;
  }

  @include down('phone') {
    max-width: 24ch;
  }
}

.water-progress__eyebrow {
  margin: 0 0 10px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.78rem;
  color: $color-accent;
}

.water-progress__percent {
  margin-bottom: 10px;
  font-family: $font-heading;
  font-size: 2rem;
}
</style>
