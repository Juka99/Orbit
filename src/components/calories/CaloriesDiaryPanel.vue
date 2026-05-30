<script setup lang="ts">
import type { CalorieEntry, FoodMeasureUnit, MealType } from '../../types/calories'

const props = defineProps<{
  todayEntries: CalorieEntry[]
  hasEntries: boolean
  isLoading: boolean
  isRefreshing: boolean
  isDeletingEntry: boolean
}>()

const emit = defineEmits<{
  (e: 'refresh'): void
  (e: 'remove-entry', entryId: string): void
}>()

function formatEntryAmount(amount: number, unit: FoodMeasureUnit) {
  if (unit === 'pack') {
    return `${amount} pack${amount === 1 ? '' : 's'}`
  }

  return `${amount} ${unit}`
}

function formatMacro(value: number) {
  return Number(value.toFixed(1))
}

function getMealLabel(mealType: MealType) {
  return mealType.charAt(0).toUpperCase() + mealType.slice(1)
}

function formatTimestamp(timestamp: string) {
  return new Intl.DateTimeFormat('en', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(timestamp))
}
</script>

<template>
  <article class="calories-diary-panel">
    <div class="calories-diary-panel__header">
      <div>
        <p class="calories-diary-panel__eyebrow">Today's diary</p>
        <h2 class="calories-diary-panel__title">Recent meals</h2>
      </div>

      <button
        class="calories-diary-panel__refresh"
        type="button"
        :disabled="props.isRefreshing"
        @click="emit('refresh')"
      >
        {{ props.isRefreshing ? 'Refreshing...' : 'Refresh' }}
      </button>
    </div>

    <div class="calories-diary-panel__list">
      <div
        v-if="props.isLoading"
        class="calories-diary-panel__state"
      >
        Loading calorie entries...
      </div>

      <div
        v-else-if="!props.hasEntries"
        class="calories-diary-panel__state"
      >
        No meals logged today yet. Pick a food and add your first intake.
      </div>

      <article
        v-for="entry in props.todayEntries"
        v-else
        :key="entry.id"
        class="calories-entry-card"
      >
        <div class="calories-entry-card__copy">
          <div class="calories-entry-card__topline">
            <h3 class="calories-entry-card__title">
              {{ entry.food?.name ?? 'Food entry' }}
            </h3>
            <span class="calories-entry-card__meal">
              {{ getMealLabel(entry.meal_type) }}
            </span>
          </div>

          <p class="calories-entry-card__meta">
            {{
              formatEntryAmount(
                entry.amount,
                entry.food?.measure_unit ?? 'g',
              )
            }}
            ·
            {{ formatTimestamp(entry.logged_at) }}
          </p>

          <div class="calories-entry-card__macro-row">
            <span>
              {{
                Math.round(
                  ((entry.food?.calories_per_basis ?? 0) * entry.amount) /
                    (entry.food?.basis_amount ?? 1),
                )
              }}
              kcal
            </span>
            <span>
              P
              {{
                formatMacro(
                  ((entry.food?.protein_g_per_basis ?? 0) * entry.amount) /
                    (entry.food?.basis_amount ?? 1),
                )
              }}g
            </span>
            <span>
              C
              {{
                formatMacro(
                  ((entry.food?.carbs_g_per_basis ?? 0) * entry.amount) /
                    (entry.food?.basis_amount ?? 1),
                )
              }}g
            </span>
            <span>
              F
              {{
                formatMacro(
                  ((entry.food?.fats_g_per_basis ?? 0) * entry.amount) /
                    (entry.food?.basis_amount ?? 1),
                )
              }}g
            </span>
          </div>
        </div>

        <button
          class="calories-entry-card__delete"
          type="button"
          :disabled="props.isDeletingEntry"
          @click="emit('remove-entry', entry.id)"
        >
          Remove
        </button>
      </article>
    </div>
  </article>
</template>

<style scoped lang="scss">
.calories-diary-panel,
.calories-diary-panel__state,
.calories-entry-card {
  border: 1px solid $color-line;
  border-radius: $radius-md;
  background: $color-panel-strong;
}

.calories-diary-panel {
  padding: 22px;
}

.calories-diary-panel__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 18px;
}

.calories-diary-panel__eyebrow {
  margin: 0 0 10px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.78rem;
  color: $color-accent;
}

.calories-diary-panel__title {
  margin: 0;
  font-family: $font-heading;
  letter-spacing: -0.03em;
}

.calories-diary-panel__refresh,
.calories-entry-card__delete {
  width: fit-content;
  height: fit-content;
  padding: 12px 16px;
  border-radius: 999px;
  border: 0;
  cursor: pointer;
  background: rgba(52, 37, 21, 0.08);
  color: $color-text;

  &:disabled {
    opacity: 0.65;
    cursor: wait;
  }
}

.calories-diary-panel__list {
  @include subtle-scrollbar;
  max-height: min(460px, 54vh);
  overflow: auto;
  display: grid;
  gap: 12px;
  padding-right: 4px;
}

.calories-diary-panel__state {
  padding: 20px;
}

.calories-entry-card {
  padding: 18px;
  display: grid;
  align-items: center;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 16px;

  @include down('sm') {
    grid-template-columns: 1fr;
  }
}

.calories-entry-card__topline {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.calories-entry-card__title {
  margin: 0;
  font-family: $font-heading;
  font-size: 1.35rem;
}

.calories-entry-card__meal {
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(195, 123, 48, 0.12);
  color: #8a5621;
}

.calories-entry-card__meta {
  margin: 6px 0 10px;
  color: $color-muted;
}

.calories-entry-card__macro-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  color: $color-muted;
}
</style>
