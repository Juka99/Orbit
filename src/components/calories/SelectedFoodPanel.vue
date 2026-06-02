<script setup lang="ts">
  import {computed} from 'vue';
  import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';
  import {
    faBolt,
    faDrumstickBite,
    faSeedling,
    faUtensils,
    faWater,
  } from '@fortawesome/free-solid-svg-icons';

  import type {FoodItem, FoodMeasureUnit, MealType} from '../../types/calories';
  import type {EntryFormState} from './types';

  const props = defineProps<{
    selectedFood: FoodItem | null;
    entryForm: EntryFormState;
    mealTypeOptions: MealType[];
    isCreatingEntry: boolean;
  }>();

  const emit = defineEmits<{
    (e: 'submit'): void;
  }>();

  const selectedFoodBasisLabel = computed(() => {
    if (!props.selectedFood) {
      return '';
    }

    return formatBasisLabel(
      props.selectedFood.basis_amount,
      props.selectedFood.measure_unit,
    );
  });

  const selectedEntryCalories = computed(() => {
    if (!props.selectedFood) return 0;
    return Math.round(
      (props.selectedFood.calories_per_basis * props.entryForm.amount) /
        props.selectedFood.basis_amount,
    );
  });

  const selectedEntryProtein = computed(() => {
    if (!props.selectedFood) return 0;
    return formatMacro(
      (props.selectedFood.protein_g_per_basis * props.entryForm.amount) /
        props.selectedFood.basis_amount,
    );
  });

  const selectedEntryCarbs = computed(() => {
    if (!props.selectedFood) return 0;
    return formatMacro(
      (props.selectedFood.carbs_g_per_basis * props.entryForm.amount) /
        props.selectedFood.basis_amount,
    );
  });

  const selectedEntryFats = computed(() => {
    if (!props.selectedFood) return 0;
    return formatMacro(
      (props.selectedFood.fats_g_per_basis * props.entryForm.amount) /
        props.selectedFood.basis_amount,
    );
  });

  function formatBasisLabel(amount: number, unit: FoodMeasureUnit) {
    if (unit === 'pack') {
      return '1 pack';
    }

    return `${amount} ${unit}`;
  }

  function formatMacro(value: number) {
    return Number(value.toFixed(1));
  }

  function getMealLabel(mealType: MealType) {
    return mealType.charAt(0).toUpperCase() + mealType.slice(1);
  }
</script>

<template>
  <article class="calories-selected-panel">
    <div class="calories-selected-panel__header">
      <div>
        <p class="calories-selected-panel__eyebrow">Selected food</p>
        <h2 class="calories-selected-panel__title">
          {{ props.selectedFood?.name ?? 'Pick a food first' }}
        </h2>
      </div>
    </div>

    <template v-if="props.selectedFood">
      <div class="selected-food">
        <div class="selected-food__meta-line">
          <span class="selected-food__chip">
            {{ props.selectedFood.brand || 'Personal food' }}
          </span>
          <span class="selected-food__chip">{{ selectedFoodBasisLabel }}</span>
        </div>

        <div class="selected-food__nutrition-grid">
          <article
            class="selected-food__nutrition-card selected-food__nutrition-card--calories"
          >
            <span class="selected-food__nutrition-label">
              <FontAwesomeIcon
                class="selected-food__nutrition-icon"
                :icon="faBolt"
              />
              Calories
            </span>
            <div class="selected-food__nutrition-figure">
              <strong class="selected-food__nutrition-value">
                {{ props.selectedFood.calories_per_basis }}
              </strong>
              <span class="selected-food__nutrition-unit">kcal</span>
            </div>
          </article>

          <article class="selected-food__nutrition-card">
            <span class="selected-food__nutrition-label">
              <FontAwesomeIcon
                class="selected-food__nutrition-icon"
                :icon="faDrumstickBite"
              />
              Protein
            </span>
            <div class="selected-food__nutrition-figure">
              <strong class="selected-food__nutrition-value">
                {{ props.selectedFood.protein_g_per_basis }}
              </strong>
              <span class="selected-food__nutrition-unit">g</span>
            </div>
          </article>

          <article class="selected-food__nutrition-card">
            <span class="selected-food__nutrition-label">
              <FontAwesomeIcon
                class="selected-food__nutrition-icon"
                :icon="faSeedling"
              />
              Carbs
            </span>
            <div class="selected-food__nutrition-figure">
              <strong class="selected-food__nutrition-value">
                {{ props.selectedFood.carbs_g_per_basis }}
              </strong>
              <span class="selected-food__nutrition-unit">g</span>
            </div>
          </article>

          <article class="selected-food__nutrition-card">
            <span class="selected-food__nutrition-label">
              <FontAwesomeIcon
                class="selected-food__nutrition-icon"
                :icon="faWater"
              />
              Fats
            </span>
            <div class="selected-food__nutrition-figure">
              <strong class="selected-food__nutrition-value">
                {{ props.selectedFood.fats_g_per_basis }}
              </strong>
              <span class="selected-food__nutrition-unit">g</span>
            </div>
          </article>
        </div>
      </div>

      <form class="entry-form" @submit.prevent="emit('submit')">
        <div class="entry-form__split">
          <label class="entry-form__field">
            <span class="entry-form__label">Amount eaten</span>
            <input
              v-model.number="props.entryForm.amount"
              class="entry-form__input"
              type="number"
              min="0.1"
              step="0.1"
            />
          </label>

          <label class="entry-form__field">
            <span class="entry-form__label">Meal type</span>
            <select
              v-model="props.entryForm.meal_type"
              class="entry-form__select"
            >
              <option
                v-for="meal in props.mealTypeOptions"
                :key="meal"
                :value="meal"
              >
                {{ getMealLabel(meal) }}
              </option>
            </select>
          </label>
        </div>

        <div class="entry-preview">
          <div class="entry-preview__metric">
            <span class="entry-preview__label">Preview calories</span>
            <strong class="entry-preview__value"
              >{{ selectedEntryCalories }} kcal</strong
            >
          </div>
          <div class="entry-preview__macro-row">
            <span>P {{ selectedEntryProtein }}g</span>
            <span>C {{ selectedEntryCarbs }}g</span>
            <span>F {{ selectedEntryFats }}g</span>
          </div>
        </div>

        <button
          class="entry-form__submit"
          type="submit"
          :disabled="props.isCreatingEntry"
        >
          <FontAwesomeIcon
            class="entry-form__submit-icon"
            :icon="faUtensils"
          />
          <span>{{ props.isCreatingEntry ? 'Logging meal...' : 'Log this intake' }}</span>
        </button>
      </form>
    </template>

    <div
      v-else
      class="selected-food-empty"
    >
      <span class="selected-food-empty__icon">
        <FontAwesomeIcon :icon="faUtensils" />
      </span>
      <div class="selected-food-empty__copy">
        <h3 class="selected-food-empty__title">Choose a food to log</h3>
        <p class="selected-food-empty__text">
          Pick an item from the food list, or add a new food, then this panel
          will show calories, macros, amount, and meal type.
        </p>
      </div>
    </div>
  </article>
</template>

<style scoped lang="scss">
  .calories-selected-panel,
  .selected-food__nutrition-card,
  .entry-preview {
    border: 1px solid $color-line;
    border-radius: $radius-md;
    background: $color-panel-strong;
  }

  .calories-selected-panel {
    padding: 22px;
  }

  .selected-food-empty {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    align-items: center;
    gap: 14px;
    padding: 18px;
    border: 1px solid rgba(195, 123, 48, 0.16);
    border-radius: $radius-md;
    background: rgba(195, 123, 48, 0.08);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.56);

    @include down('sm') {
      grid-template-columns: 1fr;
    }
  }

  .selected-food-empty__icon {
    width: 46px;
    height: 46px;
    display: inline-grid;
    place-items: center;
    border-radius: 15px;
    background: rgba(195, 123, 48, 0.14);
    color: #8a5621;
    font-size: 1.05rem;
  }

  .selected-food-empty__copy {
    display: grid;
    gap: 6px;
  }

  .selected-food-empty__title {
    margin: 0;
    font-family: $font-heading;
    font-size: 1.25rem;
    letter-spacing: -0.03em;
  }

  .selected-food-empty__text {
    max-width: 56ch;
    margin: 0;
    color: $color-muted;
    line-height: 1.55;
  }

  .calories-selected-panel__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 14px;
    margin-bottom: 18px;
  }

  .calories-selected-panel__eyebrow {
    margin: 0 0 10px;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    font-size: 0.78rem;
    color: $color-accent;
  }

  .calories-selected-panel__title {
    margin: 0;
    font-family: $font-heading;
    letter-spacing: -0.03em;
  }

  .selected-food {
    display: grid;
    gap: 16px;
    margin-bottom: 18px;
  }

  .selected-food__meta-line {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .selected-food__chip {
    padding: 10px 14px;
    border-radius: 999px;
    background: rgba(195, 123, 48, 0.12);
    color: #8a5621;
  }

  .selected-food__nutrition-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 10px;

    .selected-food__nutrition-card--calories {
      grid-column: 1 / -1;
    }

    .selected-food__nutrition-card:not(
      .selected-food__nutrition-card--calories
    ) {
      min-width: 0;
    }

    @include down('sm') {
      grid-template-columns: 1fr;

      .selected-food__nutrition-card--calories {
        grid-column: auto;
      }
    }
  }

  .selected-food__nutrition-label,
  .entry-preview__label {
    color: $color-muted;
  }

  .selected-food__nutrition-label {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
  }

  .selected-food__nutrition-icon {
    color: #8a5621;
    font-size: 0.92rem;
  }

  .selected-food__nutrition-card {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
    padding: 14px;
    min-height: 110px;
  }

  .selected-food__nutrition-card--calories {
    min-height: auto;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }

  .selected-food__nutrition-card--calories .selected-food__nutrition-label {
    margin-bottom: 0;
    flex: 1 1 auto;
  }

  .selected-food__nutrition-card--calories .selected-food__nutrition-figure {
    margin-left: auto;
  }

  .selected-food__nutrition-figure {
    display: inline-flex;
    align-items: baseline;
    gap: 6px;
  }

  .selected-food__nutrition-value,
  .entry-preview__value {
    font-family: $font-heading;
    font-size: 1.35rem;
  }

  .entry-preview__metric {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .selected-food__nutrition-unit {
    color: $color-muted;
  }

  @include down('sm') {
    .selected-food__nutrition-card,
    .selected-food__nutrition-card--calories {
      min-height: auto;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }

    .selected-food__nutrition-card .selected-food__nutrition-label,
    .selected-food__nutrition-card--calories .selected-food__nutrition-label {
      margin-bottom: 0;
      flex: 1 1 auto;
    }

    .selected-food__nutrition-card .selected-food__nutrition-figure,
    .selected-food__nutrition-card--calories .selected-food__nutrition-figure {
      margin-left: auto;
    }
  }

  .entry-form {
    display: grid;
    gap: 16px;
  }

  .entry-form__split {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;

    @include down('sm') {
      grid-template-columns: 1fr;
    }
  }

  .entry-form__field {
    display: grid;
    gap: 8px;
  }

  .entry-form__label {
    color: $color-muted;
  }

  .entry-form__input,
  .entry-form__select {
    @include soft-form-control(rgba(195, 123, 48, 0.45), rgba(195, 123, 48, 0.1));
  }

  .entry-form__select {
    @include soft-select($select-chevron-amber);
  }

  .entry-preview {
    padding: 16px;
    display: grid;
    gap: 10px;
  }

  .entry-preview__macro-row {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    color: $color-muted;
  }

  .entry-form__submit {
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

  .entry-form__submit-icon {
    font-size: 0.9rem;
  }
</style>
