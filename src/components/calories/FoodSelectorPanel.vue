<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faArrowsRotate, faCirclePlus, faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons'

import type { FoodItem, FoodMeasureUnit } from '../../types/calories'

const props = defineProps<{
  foods: FoodItem[]
  searchTerm: string
  selectedFoodId: string
  isLoading: boolean
  isRefreshing: boolean
  hasFoods: boolean
  hasResults: boolean
}>()

const emit = defineEmits<{
  (e: 'refresh'): void
  (e: 'add-food'): void
  (e: 'update:searchTerm', value: string): void
  (e: 'select-food', foodId: string): void
  (e: 'edit-food', food: FoodItem): void
  (e: 'remove-food', food: FoodItem): void
}>()

function formatBasisLabel(amount: number, unit: FoodMeasureUnit) {
  if (unit === 'pack') {
    return '1 pack'
  }

  return `${amount} ${unit}`
}

function handleSearchInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:searchTerm', target.value)
}
</script>

<template>
  <article class="calories-selector">
    <div class="calories-selector__header">
      <div>
        <p class="calories-selector__eyebrow">Food selector</p>
        <h2 class="calories-selector__title">Choose a food</h2>
      </div>

      <button
        class="calories-selector__refresh"
        type="button"
        :disabled="props.isRefreshing"
        :aria-busy="props.isRefreshing"
        @click="emit('refresh')"
      >
        <FontAwesomeIcon :icon="faArrowsRotate" />
        <span>{{ props.isRefreshing ? 'Refreshing...' : 'Refresh' }}</span>
      </button>
    </div>

    <button
      class="calories-selector__add-food"
      type="button"
      @click="emit('add-food')"
    >
      <FontAwesomeIcon
        class="calories-selector__add-food-icon"
        :icon="faCirclePlus"
      />
      <span>Add food</span>
    </button>

    <label class="calories-selector__search">
      <span class="calories-selector__search-label">Search foods</span>
      <input
        :value="props.searchTerm"
        class="calories-selector__search-input"
        type="search"
        placeholder="Search by name or brand"
        @input="handleSearchInput"
      />
    </label>

    <div class="calories-selector__list">
      <div
        v-if="props.isLoading"
        class="calories-selector__state"
      >
        Loading foods...
      </div>

      <div
        v-else-if="!props.hasFoods"
        class="calories-selector__state"
      >
        Save your first food to start the calories module.
      </div>

      <div
        v-else-if="!props.hasResults"
        class="calories-selector__state"
      >
        No foods match "{{ props.searchTerm.trim() }}".
      </div>

      <article
        v-for="food in props.foods"
        v-else
        :key="food.id"
        class="calories-selector__row"
        :class="{ 'calories-selector__row--active': props.selectedFoodId === food.id }"
      >
        <button
          class="calories-selector__item"
          type="button"
          @click="emit('select-food', food.id)"
        >
          <span class="calories-selector__content">
            <span class="calories-selector__name">{{ food.name }}</span>
            <span class="calories-selector__meta">
              {{ food.brand || 'Personal food' }} ·
              {{ food.calories_per_basis }} kcal /
              {{ formatBasisLabel(food.basis_amount, food.measure_unit) }}
            </span>
          </span>
        </button>

        <div class="calories-selector__actions">
          <button
            class="calories-selector__action-button"
            type="button"
            aria-label="Edit food"
            @click="emit('edit-food', food)"
          >
            <FontAwesomeIcon :icon="faPenToSquare" />
          </button>
          <button
            class="calories-selector__action-button calories-selector__action-button--danger"
            type="button"
            aria-label="Remove food"
            @click="emit('remove-food', food)"
          >
            <FontAwesomeIcon :icon="faTrashCan" />
          </button>
        </div>
      </article>
    </div>
  </article>
</template>

<style scoped lang="scss">
.calories-selector {
  border: 1px solid $color-line;
  border-radius: $radius-md;
  background: $color-panel-strong;
  padding: 22px;
}

.calories-selector__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 18px;
}

.calories-selector__eyebrow {
  margin: 0 0 10px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.78rem;
  color: $color-accent;
}

.calories-selector__title {
  margin: 0;
  font-family: $font-heading;
  letter-spacing: -0.03em;
}

.calories-selector__refresh {
  @include refresh-action-button;
}

.calories-selector__add-food {
  @include soft-warm-action-surface;
  width: fit-content;
  height: fit-content;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-radius: 999px;
  cursor: pointer;

  &:disabled {
    opacity: 0.65;
    cursor: wait;
  }
}

.calories-selector__add-food {
  margin-bottom: 18px;
}

.calories-selector__add-food-icon {
  font-size: 0.9rem;
}

.calories-selector__search {
  display: grid;
  gap: 8px;
  margin-bottom: 18px;
}

.calories-selector__search-label {
  color: $color-muted;
  font-size: 0.95rem;
}

.calories-selector__search-input {
  @include soft-form-control(rgba(195, 123, 48, 0.45), rgba(195, 123, 48, 0.1));
}

.calories-selector__search-input::-webkit-search-cancel-button {
  appearance: none;
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background:
    linear-gradient(
      45deg,
      transparent 43%,
      #8a5621 43%,
      #8a5621 57%,
      transparent 57%
    ),
    linear-gradient(
      -45deg,
      transparent 43%,
      #8a5621 43%,
      #8a5621 57%,
      transparent 57%
    );
  cursor: pointer;
}

.calories-selector__search-input::-webkit-search-cancel-button:hover {
  background:
    linear-gradient(
      45deg,
      transparent 43%,
      #6e4319 43%,
      #6e4319 57%,
      transparent 57%
    ),
    linear-gradient(
      -45deg,
      transparent 43%,
      #6e4319 43%,
      #6e4319 57%,
      transparent 57%
    );
}

.calories-selector__list {
  @include subtle-scrollbar;
  max-height: min(460px, 56vh);
  overflow: auto;
  display: grid;
  gap: 10px;
  padding-top: 1px;
}

.calories-selector__state {
  padding: 20px;
}

.calories-selector__row {
  position: relative;
}

.calories-selector__item {
  @include tactile-button-surface($color-line, rgba(195, 123, 48, 0.18), rgba(61, 39, 17, 0.05));
  appearance: none;
  -webkit-appearance: none;
  position: relative;
  display: block;
  width: 100%;
  text-align: left;
  padding: 16px 118px 16px 16px;
  border: 1px solid $color-line;
  border-radius: $radius-sm;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;

  &:hover,
  .calories-selector__row--active & {
    border-color: rgba(195, 123, 48, 0.45);
    background: rgba(255, 245, 231, 0.78);
    transform: translateY(-1px);
  }
}

.calories-selector__content {
  display: block;
  min-width: 0;
}

.calories-selector__name {
  display: block;
  margin-bottom: 4px;
  font-family: $font-heading;
  font-size: 1.2rem;
}

.calories-selector__meta {
  color: $color-muted;
}

.calories-selector__actions {
  position: absolute;
  top: 50%;
  right: 14px;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  gap: 8px;
}

.calories-selector__action-button {
  @include tactile-button-surface($color-line, rgba(195, 123, 48, 0.18), rgba(61, 39, 17, 0.06));
  width: 44px;
  height: 44px;
  min-width: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border-radius: 14px;
  background: rgba(255, 251, 245, 0.78);
  color: $color-muted;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  &:hover {
    transform: translateY(-1px);
    border-color: rgba(195, 123, 48, 0.3);
    background: rgba(255, 245, 231, 0.78);
    color: $color-text;
  }
}

.calories-selector__action-button :deep(svg) {
  font-size: 0.98rem;
}

.calories-selector__action-button--danger:hover {
  border-color: rgba(163, 53, 53, 0.24);
  background: rgba(163, 53, 53, 0.08);
  color: #8f2f2f;
}

@include down('sm') {
  .calories-selector__item {
    padding-right: 16px;
    padding-bottom: 74px;
  }

  .calories-selector__actions {
    top: auto;
    right: 14px;
    bottom: 14px;
    transform: none;
  }
}
</style>
