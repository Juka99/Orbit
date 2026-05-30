<script setup lang="ts">
import CaloriesOverlayModal from './CaloriesOverlayModal.vue'
import type { FoodFormState, MeasureOption } from './types'

const props = defineProps<{
  isOpen: boolean
  mode: 'create' | 'edit' | null
  title: string
  eyebrow: string
  submitLabel: string
  isBusy: boolean
  foodForm: FoodFormState
  measureOptions: MeasureOption[]
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit'): void
}>()
</script>

<template>
  <CaloriesOverlayModal
    :is-open="props.isOpen"
    @close="emit('close')"
  >
    <article class="calories-food-modal">
      <div class="calories-food-modal__header">
        <div>
          <p class="calories-food-modal__eyebrow">{{ props.eyebrow }}</p>
          <h2 class="calories-food-modal__title">{{ props.title }}</h2>
        </div>

        <button
          class="calories-food-modal__close"
          type="button"
          @click="emit('close')"
        >
          Close
        </button>
      </div>

      <form
        class="food-form"
        @submit.prevent="emit('submit')"
      >
        <div class="food-form__split food-form__split--identity">
          <label class="food-form__field">
            <span class="food-form__label">Food name</span>
            <input
              v-model="props.foodForm.name"
              class="food-form__input"
              type="text"
              placeholder="Greek yogurt"
              required
            />
          </label>

          <label class="food-form__field">
            <span class="food-form__label">Brand</span>
            <input
              v-model="props.foodForm.brand"
              class="food-form__input"
              type="text"
              placeholder="Optional"
            />
          </label>
        </div>

        <div class="food-form__split">
          <label class="food-form__field">
            <span class="food-form__label">Nutrition basis</span>
            <select
              v-model="props.foodForm.measure_unit"
              class="food-form__select"
            >
              <option
                v-for="option in props.measureOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </label>

          <label class="food-form__field">
            <span class="food-form__label">Basis amount</span>
            <input
              v-model.number="props.foodForm.basis_amount"
              class="food-form__input"
              type="number"
              min="1"
              step="1"
              :disabled="props.foodForm.measure_unit === 'pack'"
            />
          </label>
        </div>

        <div class="food-form__split food-form__split--nutrition">
          <label class="food-form__field">
            <span class="food-form__label">Calories</span>
            <input
              v-model.number="props.foodForm.calories_per_basis"
              class="food-form__input"
              type="number"
              min="0"
              step="1"
              required
            />
          </label>
          <label class="food-form__field">
            <span class="food-form__label">Protein</span>
            <input
              v-model.number="props.foodForm.protein_g_per_basis"
              class="food-form__input"
              type="number"
              min="0"
              step="0.1"
            />
          </label>
          <label class="food-form__field">
            <span class="food-form__label">Carbs</span>
            <input
              v-model.number="props.foodForm.carbs_g_per_basis"
              class="food-form__input"
              type="number"
              min="0"
              step="0.1"
            />
          </label>
          <label class="food-form__field">
            <span class="food-form__label">Fats</span>
            <input
              v-model.number="props.foodForm.fats_g_per_basis"
              class="food-form__input"
              type="number"
              min="0"
              step="0.1"
            />
          </label>
        </div>

        <button
          class="food-form__submit"
          type="submit"
          :disabled="props.isBusy"
        >
          {{ props.submitLabel }}
        </button>
      </form>
    </article>
  </CaloriesOverlayModal>
</template>

<style scoped lang="scss">
.calories-food-modal {
  @include subtle-scrollbar;
  max-height: inherit;
  overflow: auto;
  border: 1px solid $color-line;
  border-radius: $radius-md;
  background: $color-panel-strong;
  padding: 22px;
  box-shadow: 0 32px 80px rgba(46, 31, 15, 0.18);

  @include down('sm') {
    border-radius: 24px 24px 18px 18px;
  }
}

.calories-food-modal__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 18px;
}

.calories-food-modal__eyebrow {
  margin: 0 0 10px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.78rem;
  color: $color-accent;
}

.calories-food-modal__title {
  margin: 0;
  font-family: $font-heading;
  letter-spacing: -0.03em;
}

.calories-food-modal__close,
.food-form__submit {
  width: fit-content;
  padding: 12px 16px;
  border-radius: 999px;
  border: 0;
  cursor: pointer;
}

.calories-food-modal__close {
  background: rgba(52, 37, 21, 0.08);
  color: $color-text;
}

.food-form {
  display: grid;
  gap: 16px;
}

.food-form__split {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;

  @include down('sm') {
    grid-template-columns: 1fr;
  }
}

.food-form__split--nutrition {
  grid-template-columns: repeat(4, minmax(0, 1fr));

  @include down('lg') {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @include down('sm') {
    grid-template-columns: 1fr;
  }
}

.food-form__field {
  display: grid;
  gap: 8px;
}

.food-form__label {
  color: $color-muted;
}

.food-form__input,
.food-form__select {
  width: 100%;
  padding: 14px 16px;
  border: 1px solid $color-line;
  border-radius: $radius-sm;
  background: rgba(255, 255, 255, 0.76);
  color: $color-text;

  &:focus {
    outline: 2px solid rgba(195, 123, 48, 0.14);
    border-color: rgba(195, 123, 48, 0.45);
  }
}

.food-form__submit {
  background: linear-gradient(135deg, #c37b30 0%, #d89d52 100%);
  color: $color-white;

  &:disabled {
    opacity: 0.65;
    cursor: wait;
  }
}
</style>
