<script setup lang="ts">
import emblaCarouselVue from 'embla-carousel-vue'

defineProps<{
  recentDailyTotals: Array<{
    dateKey: string
    total: number
    reachedGoal: boolean
    isToday: boolean
  }>
  goalMl: number
}>()

function formatDayLabel(dateKey: string) {
  const [year, month, day] = dateKey.split('-').map(Number)
  const date = new Date(year, month - 1, day)

  return new Intl.DateTimeFormat('en', {
    weekday: 'short',
  }).format(date)
}

function formatFullDate(dateKey: string) {
  const [year, month, day] = dateKey.split('-').map(Number)
  const date = new Date(year, month - 1, day)

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
  }).format(date)
}

function getDayClasses(
  day: { reachedGoal: boolean; isToday: boolean },
  index: number,
) {
  return {
    'water-history__day--today': day.isToday,
    'water-history__day--goal': day.reachedGoal,
    [`water-history__day--variant-${(index % 3) + 1}`]: true,
  }
}

const [emblaRef] = emblaCarouselVue({
  align: 'start',
  containScroll: 'trimSnaps',
  dragFree: true,
})
void emblaRef
</script>

<template>
  <div class="water-history">
    <div class="water-history__header">
      <div>
        <p class="water-history__eyebrow">Seven-day pulse</p>
        <h2 class="water-history__title">Recent rhythm</h2>
      </div>
    </div>

    <div class="water-history__bars water-history__bars--desktop">
      <article
        v-for="(day, index) in recentDailyTotals"
        :key="day.dateKey"
        class="water-history__day"
        :class="getDayClasses(day, index)"
      >
        <div class="water-history__bar-track">
          <div
            class="water-history__bar-fill"
            :style="{ height: `${Math.min(Math.max((day.total / goalMl) * 100, day.total ? 12 : 0), 100)}%` }"
          ></div>
        </div>

        <div class="water-history__day-copy">
          <p class="water-history__day-name">{{ formatDayLabel(day.dateKey) }}</p>
          <p class="water-history__day-date">{{ formatFullDate(day.dateKey) }}</p>
          <strong class="water-history__day-total">{{ day.total }}</strong>
          <span class="water-history__day-unit">ml</span>
        </div>
      </article>
    </div>

    <div
      ref="emblaRef"
      class="water-history__carousel"
    >
      <div class="water-history__carousel-track">
        <article
          v-for="(day, index) in recentDailyTotals"
          :key="`${day.dateKey}-mobile`"
          class="water-history__day water-history__slide"
          :class="getDayClasses(day, index)"
        >
          <div class="water-history__bar-track">
            <div
              class="water-history__bar-fill"
              :style="{ height: `${Math.min(Math.max((day.total / goalMl) * 100, day.total ? 12 : 0), 100)}%` }"
            ></div>
          </div>

          <div class="water-history__day-copy">
            <p class="water-history__day-name">{{ formatDayLabel(day.dateKey) }}</p>
            <p class="water-history__day-date">{{ formatFullDate(day.dateKey) }}</p>
            <strong class="water-history__day-total">{{ day.total }}</strong>
            <span class="water-history__day-unit">ml</span>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.water-history {
  min-width: 0;
  padding: 22px;
  border: 1px solid $color-line;
  border-radius: $radius-md;
  background: $color-panel-strong;
  overflow: hidden;
}

.water-history__eyebrow {
  margin: 0 0 10px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.78rem;
  color: $color-accent;
}

.water-history__title {
  margin: 0;
  font-family: $font-heading;
  font-size: 1.8rem;
  letter-spacing: -0.03em;
}

.water-history__bars {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 12px;
  margin-top: 18px;
  justify-content: space-between;

  @include down('sm') {
    display: none;
  }
}

.water-history__carousel {
  display: none;
  margin-top: 18px;
  min-width: 0;
  max-width: 100%;

  @include down('sm') {
    display: block;
    overflow: hidden;
  }
}

.water-history__carousel-track {
  display: flex;
  gap: 10px;
  min-width: 0;
}

.water-history__day {
  width: 100%;
  max-width: 138px;
  display: grid;
  gap: 12px;
  justify-items: center;
  justify-self: center;
}

.water-history__slide {
  flex: 0 0 92px;
  width: 92px;
  min-width: 92px;
  max-width: none;
}

.water-history__bar-track {
  width: 100%;
  min-height: 180px;
  padding: 8px;
  border-radius: 20px;
  background: rgba(52, 37, 21, 0.06);
  display: flex;
  align-items: flex-end;

  @include down('sm') {
    min-height: 148px;
  }
}

.water-history__bar-fill {
  width: 100%;
  border-radius: 14px;
  min-height: 0;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.34),
    0 10px 20px rgba(67, 157, 177, 0.14);
}

.water-history__day--variant-1 .water-history__bar-fill {
  background: linear-gradient(180deg, rgba(238, 248, 247, 0.98) 0%, rgba(192, 225, 221, 0.96) 34%, rgba(113, 188, 191, 0.95) 68%, rgba(67, 157, 177, 0.96) 100%);
}

.water-history__day--variant-2 .water-history__bar-fill {
  background: linear-gradient(180deg, rgba(239, 248, 242, 0.98) 0%, rgba(198, 228, 211, 0.96) 34%, rgba(124, 191, 166, 0.95) 68%, rgba(70, 154, 131, 0.96) 100%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.32),
    0 10px 20px rgba(70, 154, 131, 0.14);
}

.water-history__day--variant-3 .water-history__bar-fill {
  background: linear-gradient(180deg, rgba(246, 246, 239, 0.98) 0%, rgba(219, 228, 202, 0.96) 34%, rgba(170, 193, 150, 0.95) 68%, rgba(122, 153, 103, 0.96) 100%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.3),
    0 10px 20px rgba(122, 153, 103, 0.12);
}

.water-history__day-copy {
  display: grid;
  gap: 2px;
  justify-items: center;
  text-align: center;
}

.water-history__day-name,
.water-history__day-date,
.water-history__day-total {
  margin: 0;
}

.water-history__day-date,
.water-history__day-unit {
  color: $color-muted;
}

.water-history__day-name {
  font-size: 0.9rem;
}

.water-history__day-total {
  font-family: $font-heading;
  font-size: 1.35rem;
  line-height: 1;
}

.water-history__day--today .water-history__bar-track {
  background: rgba(13, 122, 102, 0.1);
}

.water-history__day--goal .water-history__bar-fill {
  background: linear-gradient(180deg, rgba(247, 252, 251, 0.99) 0%, rgba(212, 236, 231, 0.97) 28%, rgba(150, 206, 206, 0.96) 62%, rgba(86, 174, 187, 0.98) 100%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.4),
    0 12px 24px rgba(86, 174, 187, 0.16);
}
</style>
