<script setup lang="ts">
import { computed, reactive } from 'vue'

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

const customForm = reactive({
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

function formatTimestamp(timestamp: string) {
  return new Intl.DateTimeFormat('en', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(timestamp))
}

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
</script>

<template>
  <section class="water-page">
    <header class="water-page__hero">
      <div class="water-page__hero-copy">
        <p class="water-page__eyebrow">Hydration ritual</p>
        <h1 class="water-page__title">Water intake</h1>
        <p class="water-page__lede">
          Keep hydration easy: tap a quick pour, glance at your progress, and watch the day fill
          up.
        </p>

        <div class="water-page__hero-chips">
          <span class="water-page__hero-chip">{{ glassesToday }} pours today</span>
          <span class="water-page__hero-chip">{{ currentStreak }} day streak</span>
          <span class="water-page__hero-chip">Goal {{ goalMl }} ml</span>
        </div>

        <div class="water-page__hero-actions">
          <div class="water-page__hero-actions-header">
            <div>
              <p class="water-page__hero-actions-eyebrow">Quick pour</p>
              <h2 class="water-page__hero-actions-title">Log in one tap</h2>
            </div>

            <span
              v-if="isRefreshing"
              class="water-page__hero-status"
            >
              Syncing...
            </span>
          </div>

          <div class="water-page__quick-grid">
            <button
              v-for="option in quickAddOptions"
              :key="option"
              class="water-page__quick-button"
              type="button"
              :disabled="isCreating || isDeleting"
              @click="addQuickWater(option)"
            >
              <span class="water-page__quick-value">+{{ option }}</span>
              <span class="water-page__quick-unit">ml</span>
            </button>
          </div>

          <form
            class="water-page__custom-form"
            @submit.prevent="handleCustomSubmit"
          >
            <label class="water-page__field">
              <span class="water-page__label">Custom amount</span>
              <input
                v-model.number="customForm.amountMl"
                class="water-page__input"
                type="number"
                min="50"
                max="5000"
                step="50"
              />
            </label>

            <button
              class="water-page__submit"
              type="submit"
              :disabled="isCreating || isDeleting"
            >
              {{ isCreating ? 'Pouring...' : 'Add custom pour' }}
            </button>
          </form>
        </div>
      </div>

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
    </header>

    <p
      v-if="waterError"
      class="water-page__feedback water-page__feedback--error"
    >
      {{ waterError }}
    </p>

    <section class="water-page__layout">
      <section class="water-feed">
        <div class="water-feed__panel">
          <div class="water-feed__panel-header">
            <div>
              <p class="water-feed__eyebrow">Today's timeline</p>
              <h2 class="water-feed__title">Recent pours</h2>
            </div>

            <button
              class="water-feed__refresh"
              type="button"
              :disabled="isLoading || isRefreshing"
              @click="refetch()"
            >
              {{ isRefreshing ? 'Refreshing...' : 'Refresh' }}
            </button>
          </div>

          <div class="water-feed__timeline">
            <div
              v-if="isLoading"
              class="water-feed__state"
            >
              Loading water logs...
            </div>

            <div
              v-else-if="!hasTodayLogs"
              class="water-feed__state"
            >
              No water logged yet today. Start with one quick pour.
            </div>

            <template v-else>
              <article
                v-for="log in todayLogs"
                :key="log.id"
                class="water-log"
              >
                <div class="water-log__drop"></div>

                <div class="water-log__copy">
                  <p class="water-log__amount">{{ log.amount_ml }} ml</p>
                  <p class="water-log__time">{{ formatTimestamp(log.logged_at) }}</p>
                </div>

                <button
                  class="water-log__delete"
                  type="button"
                  :disabled="isDeleting || isCreating"
                  @click="removeWaterLog(log.id)"
                >
                  Remove
                </button>
              </article>
            </template>
          </div>
        </div>

        <div class="water-history">
          <div class="water-history__header">
            <div>
              <p class="water-feed__eyebrow">Seven-day pulse</p>
              <h2 class="water-feed__title">Recent rhythm</h2>
            </div>
          </div>

          <div class="water-history__bars">
            <article
              v-for="(day, index) in recentDailyTotals"
              :key="day.dateKey"
              class="water-history__day"
              :class="{
                'water-history__day--today': day.isToday,
                'water-history__day--goal': day.reachedGoal,
                [`water-history__day--variant-${(index % 3) + 1}`]: true,
              }"
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
      </section>
    </section>
  </section>
</template>

<style scoped lang="scss">
@property --water-progress-value {
  syntax: '<number>';
  inherits: false;
  initial-value: 0;
}

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

.water-page__hero,
.water-feed__panel,
.water-history,
.water-feed__state,
.water-log {
  border: 1px solid $color-line;
  border-radius: $radius-md;
  background: $color-panel-strong;
}

.water-page__hero {
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) minmax(280px, 0.95fr);
  gap: 22px;
  padding: 28px;

  @include down('lg') {
    grid-template-columns: 1fr;
  }

  @include down('sm') {
    padding: 22px;
  }

  @include down('lg') {
    grid-template-columns: minmax(220px, 280px) minmax(220px, 1fr);
    grid-template-areas:
      'eyebrow eyebrow'
      'title title'
      'lede lede'
      'chips chips'
      'actions progress';
    align-items: start;
  }

  @media (max-width: 580px) {
    grid-template-columns: 1fr;
    grid-template-areas:
      'eyebrow'
      'title'
      'lede'
      'chips'
      'progress'
      'actions';
    gap: 18px;
  }
}

.water-page__hero-copy {
  @include down('lg') {
    display: contents;
  }
}

.water-page__eyebrow,
.water-actions__eyebrow,
.water-progress__eyebrow,
.water-feed__eyebrow {
  margin: 0 0 10px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.78rem;
  color: $color-accent;

  @include down('lg') {
    grid-area: eyebrow;
  }
}

.water-page__title,
.water-actions__title,
.water-feed__title {
  margin: 0;
  font-family: $font-heading;
  letter-spacing: -0.03em;
}

.water-page__title {
  font-size: clamp(2.4rem, 5vw, 4.6rem);
  line-height: 0.95;

  @include down('lg') {
    grid-area: title;
  }
}

.water-page__lede,
.water-progress__text,
.water-page__hero-status,
.water-page__label,
.water-log__time,
.water-history__day-date,
.water-history__day-unit {
  color: $color-muted;
}

.water-page__lede {
  @include down('lg') {
    grid-area: lede;
  }
}

.water-page__hero-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 22px;

  @include down('lg') {
    grid-area: chips;
    margin-top: 12px;
    margin-bottom: 2px;
  }
}

.water-page__hero-chip {
  padding: 10px 14px;
  border-radius: 999px;
  background: rgba(13, 122, 102, 0.1);
  color: $color-accent;
}

.water-page__hero-actions {
  margin-top: 24px;
  display: grid;
  gap: 16px;

  @include down('lg') {
    grid-area: actions;
    margin-top: 0;
    align-content: start;
    max-width: 260px;
    padding-right: 8px;
  }

  @media (max-width: 580px) {
    max-width: none;
    padding-right: 0;
  }
}

.water-page__hero-actions-header,
.water-feed__panel-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
}

.water-page__hero-actions-eyebrow,
.water-feed__eyebrow {
  margin: 0 0 8px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.78rem;
  color: $color-accent;
}

.water-page__hero-actions-title,
.water-feed__title {
  margin: 0;
  font-family: $font-heading;
  letter-spacing: -0.03em;
}

.water-page__quick-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;

  @media (min-width: 1101px) and (max-width: 1300px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @include down('lg') {
    grid-template-columns: 1fr;
    gap: 10px;
  }
}

.water-page__quick-button,
.water-page__submit,
.water-feed__refresh,
.water-log__delete {
  border: 0;
  cursor: pointer;

  &:disabled {
    opacity: 0.65;
    cursor: wait;
  }
}

.water-page__quick-button {
  padding: 18px;
  border-radius: $radius-md;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(228, 245, 241, 0.92) 100%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.72),
    0 12px 26px rgba(61, 39, 17, 0.06);
  text-align: left;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.8),
      0 16px 30px rgba(61, 39, 17, 0.1);
  }
}

.water-page__quick-value {
  display: block;
  font-family: $font-heading;
  font-size: 1.7rem;
  line-height: 1;
}

.water-page__quick-unit {
  color: $color-muted;
}

.water-page__custom-form {
  display: grid;
  gap: 14px;
}

.water-page__field {
  display: grid;
  gap: 8px;
}

.water-page__input {
  width: 100%;
  padding: 14px 16px;
  border: 1px solid $color-line;
  border-radius: $radius-sm;
  background: rgba(255, 255, 255, 0.76);
  color: $color-text;

  &:focus {
    outline: 2px solid rgba(13, 122, 102, 0.18);
    border-color: $color-accent;
  }
}

.water-page__submit,
.water-feed__refresh {
  width: fit-content;
  padding: 12px 16px;
  border-radius: 999px;
}

.water-page__submit {
  background: linear-gradient(135deg, $color-accent 0%, $color-accent-strong 100%);
  color: $color-white;
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

  @media (max-width: 580px) {
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

  @media (max-width: 580px) {
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

.water-progress__unit {
  color: $color-muted;
}

.water-progress__copy {
  text-align: center;
  max-width: 28ch;

  @include down('lg') {
    max-width: 20ch;
  }

  @media (max-width: 580px) {
    max-width: 24ch;
  }
}

.water-progress__percent {
  margin-bottom: 10px;
  font-family: $font-heading;
  font-size: 2rem;
}

.water-page__layout {
  display: grid;
  gap: 20px;
}

.water-feed__refresh,
.water-log__delete {
  background: rgba(52, 37, 21, 0.08);
  color: $color-text;
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
  display: grid;
  gap: 20px;
}

.water-feed__panel,
.water-history {
  padding: 22px;
}

.water-feed__panel {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  max-height: min(560px, 62vh);
}

.water-feed__timeline {
  @include subtle-scrollbar;
  min-height: 0;
  overflow: auto;
  display: grid;
  gap: 12px;
  margin-top: 20px;
  padding-right: 6px;
}

.water-feed__state {
  padding: 24px;
}

.water-log {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 14px;
  padding: 16px 18px;

  @include down('sm') {
    grid-template-columns: auto minmax(0, 1fr);
  }
}

.water-log__drop {
  width: 16px;
  height: 22px;
  border-radius: 10px 10px 12px 12px;
  background: linear-gradient(180deg, rgba(34, 161, 137, 0.95) 0%, rgba(13, 122, 102, 0.95) 100%);
  transform: rotate(12deg);
  box-shadow: 0 10px 20px rgba(13, 122, 102, 0.18);
}

.water-log__copy {
  min-width: 0;
}

.water-log__amount,
.water-log__time {
  margin: 0;
}

.water-log__amount {
  font-family: $font-heading;
  font-size: 1.35rem;
}

.water-log__delete {
  padding: 10px 14px;
  border-radius: 999px;

  @include down('sm') {
    grid-column: 2;
    justify-self: start;
  }
}

.water-history__bars {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 12px;
  margin-top: 18px;
  justify-content: space-between;

  @include down('sm') {
    gap: 8px;
  }
}

.water-history__day {
  width: 100%;
  max-width: 138px;
  display: grid;
  gap: 12px;
  justify-items: center;
  justify-self: center;
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
