<script setup lang="ts">
import type { WaterCustomFormState } from './types'
import WaterProgressCard from './WaterProgressCard.vue'

defineProps<{
  quickAddOptions: number[]
  glassesToday: number
  currentStreak: number
  goalMl: number
  isRefreshing: boolean
  isCreating: boolean
  isDeleting: boolean
  customForm: WaterCustomFormState
  goalProgress: number
  todayTotal: number
  progressLabel: string
  encouragementText: string
}>()

const emit = defineEmits<{
  (e: 'quick-add', amountMl: number): void
  (e: 'submit-custom'): void
}>()
</script>

<template>
  <header class="water-hero">
    <div class="water-hero__copy">
      <p class="water-hero__eyebrow">Hydration ritual</p>
      <h1 class="water-hero__title">Water intake</h1>
      <p class="water-hero__lede">
        Keep hydration easy: tap a quick pour, glance at your progress, and watch the day fill
        up.
      </p>

      <div class="water-hero__chips">
        <span class="water-hero__chip">{{ glassesToday }} pours today</span>
        <span class="water-hero__chip">{{ currentStreak }} day streak</span>
        <span class="water-hero__chip">Goal {{ goalMl }} ml</span>
      </div>

      <div class="water-hero__actions">
        <div class="water-hero__actions-header">
          <div>
            <p class="water-hero__actions-eyebrow">Quick pour</p>
            <h2 class="water-hero__actions-title">Log in one tap</h2>
          </div>

          <span
            v-if="isRefreshing"
            class="water-hero__status"
          >
            Syncing...
          </span>
        </div>

        <div class="water-hero__quick-grid">
          <button
            v-for="option in quickAddOptions"
            :key="option"
            class="water-hero__quick-button"
            type="button"
            :disabled="isCreating || isDeleting"
            @click="emit('quick-add', option)"
          >
            <span class="water-hero__quick-value">+{{ option }}</span>
            <span class="water-hero__quick-unit">ml</span>
          </button>
        </div>

        <form
          class="water-hero__custom-form"
          @submit.prevent="emit('submit-custom')"
        >
          <label class="water-hero__field">
            <span class="water-hero__label">Custom amount</span>
            <input
              v-model.number="customForm.amountMl"
              class="water-hero__input"
              type="number"
              min="50"
              max="5000"
              step="50"
            />
          </label>

          <button
            class="water-hero__submit"
            type="submit"
            :disabled="isCreating || isDeleting"
          >
            {{ isCreating ? 'Pouring...' : 'Add custom pour' }}
          </button>
        </form>
      </div>
    </div>

    <WaterProgressCard
      :goal-progress="goalProgress"
      :today-total="todayTotal"
      :progress-label="progressLabel"
      :encouragement-text="encouragementText"
    />
  </header>
</template>

<style scoped lang="scss">
.water-hero {
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) minmax(280px, 0.95fr);
  gap: 22px;
  padding: 28px;
  border: 1px solid $color-line;
  border-radius: $radius-md;
  background: $color-panel-strong;

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

.water-hero__copy {
  @include down('lg') {
    display: contents;
  }
}

.water-hero__eyebrow,
.water-hero__actions-eyebrow {
  margin: 0 0 10px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.78rem;
  color: $color-accent;

  @include down('lg') {
    grid-area: eyebrow;
  }
}

.water-hero__title,
.water-hero__actions-title {
  margin: 0;
  font-family: $font-heading;
  letter-spacing: -0.03em;
}

.water-hero__title {
  font-size: clamp(2.4rem, 5vw, 4.6rem);
  line-height: 0.95;

  @include down('lg') {
    grid-area: title;
  }
}

.water-hero__lede,
.water-hero__status,
.water-hero__label {
  color: $color-muted;
}

.water-hero__lede {
  @include down('lg') {
    grid-area: lede;
  }
}

.water-hero__chips {
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

.water-hero__chip {
  padding: 10px 14px;
  border-radius: 999px;
  background: rgba(13, 122, 102, 0.1);
  color: $color-accent;
}

.water-hero__actions {
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

.water-hero__actions-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
}

.water-hero__actions-eyebrow {
  margin-bottom: 8px;
}

.water-hero__quick-grid {
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

.water-hero__quick-button,
.water-hero__submit {
  border: 0;
  cursor: pointer;

  &:disabled {
    opacity: 0.65;
    cursor: wait;
  }
}

.water-hero__quick-button {
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

.water-hero__quick-value {
  display: block;
  font-family: $font-heading;
  font-size: 1.7rem;
  line-height: 1;
}

.water-hero__quick-unit {
  color: $color-muted;
}

.water-hero__custom-form {
  display: grid;
  gap: 14px;
}

.water-hero__field {
  display: grid;
  gap: 8px;
}

.water-hero__input {
  width: 100%;
  padding: 14px 16px;
  border: 1px solid $color-line;
  border-radius: $radius-sm;
  background: rgba(255, 252, 247, 0.86);
  color: $color-text;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.7);
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: $color-accent;
    background: rgba(255, 253, 249, 0.95);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.78),
      0 0 0 3px rgba(13, 122, 102, 0.1);
  }
}

.water-hero__submit {
  width: fit-content;
  padding: 12px 16px;
  border-radius: 999px;
  background: linear-gradient(135deg, $color-accent 0%, $color-accent-strong 100%);
  color: $color-white;
}
</style>
