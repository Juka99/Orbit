<script setup lang="ts">
defineProps<{
  marks: Array<{
    dateKey: string
    label: string
    isComplete: boolean
    isToday: boolean
  }>
}>()
</script>

<template>
  <div class="habit-week-strip">
    <div
      v-for="mark in marks"
      :key="mark.dateKey"
      class="habit-week-strip__day"
      :class="{
        'habit-week-strip__day--complete': mark.isComplete,
        'habit-week-strip__day--today': mark.isToday,
      }"
    >
      <span class="habit-week-strip__dot"></span>
      <span class="habit-week-strip__label">{{ mark.label }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.habit-week-strip {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 8px;
}

.habit-week-strip__day {
  display: grid;
  justify-items: center;
  gap: 6px;
}

.habit-week-strip__dot {
  width: 18px;
  height: 18px;
  border-radius: 999px;
  border: 1px solid rgba(52, 37, 21, 0.14);
  background: rgba(52, 37, 21, 0.05);
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease;
}

.habit-week-strip__day--complete .habit-week-strip__dot {
  border-color: rgba(255, 255, 255, 0);
  background: linear-gradient(
    135deg,
    var(--habit-accent, #2f7e67) 0%,
    var(--habit-accent-strong, #41a386) 100%
  );
  box-shadow: 0 10px 18px color-mix(in srgb, var(--habit-accent, #2f7e67) 24%, transparent);
}

.habit-week-strip__day--today .habit-week-strip__dot {
  transform: scale(1.08);
}

.habit-week-strip__label {
  font-size: 0.76rem;
  color: $color-muted;
}
</style>
