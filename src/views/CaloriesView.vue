<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'

import CaloriesDeleteFoodModal from '../components/calories/CaloriesDeleteFoodModal.vue'
import CaloriesDiaryPanel from '../components/calories/CaloriesDiaryPanel.vue'
import CaloriesFoodModal from '../components/calories/CaloriesFoodModal.vue'
import CaloriesHero from '../components/calories/CaloriesHero.vue'
import CaloriesHistoryPanel from '../components/calories/CaloriesHistoryPanel.vue'
import FoodSelectorPanel from '../components/calories/FoodSelectorPanel.vue'
import SelectedFoodPanel from '../components/calories/SelectedFoodPanel.vue'
import type {
  EntryFormState,
  FoodFormState,
  MeasureOption,
} from '../components/calories/types'
import { useCalories } from '../composables/useCalories'
import type { FoodItem, FoodMeasureUnit, MealType } from '../types/calories'

type FoodModalMode = 'create' | 'edit'

const mealTypeOptions: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack']
const measureOptions: MeasureOption[] = [
  { value: 'g', label: 'Per grams', defaultAmount: 100 },
  { value: 'ml', label: 'Per milliliters', defaultAmount: 100 },
  { value: 'pack', label: 'Per pack', defaultAmount: 1 },
]

const {
  editFood,
  foods,
  isCreatingEntry,
  isCreatingFood,
  isDeletingEntry,
  isDeletingFood,
  isLoadingEntries,
  isLoadingFoods,
  isRefreshing,
  isUpdatingFood,
  mutationError,
  queryError,
  recentDailyCalories,
  refetchEntries,
  refetchFoods,
  removeCalorieEntry,
  removeFood,
  saveCalorieEntry,
  saveFood,
  todayCalories,
  todayCarbs,
  todayEntries,
  todayFats,
  todayProtein,
} = useCalories()

const selectedFoodId = ref('')
const foodModalMode = ref<FoodModalMode | null>(null)
const foodPendingRemoval = ref<FoodItem | null>(null)
const foodSearchTerm = ref('')

const foodForm = reactive<FoodFormState>({
  name: '',
  brand: '',
  measure_unit: 'g' as FoodMeasureUnit,
  basis_amount: 100,
  calories_per_basis: 0,
  protein_g_per_basis: 0,
  carbs_g_per_basis: 0,
  fats_g_per_basis: 0,
})

const entryForm = reactive<EntryFormState>({
  amount: 100,
  meal_type: 'lunch' as MealType,
})

const caloriesError = computed(() => queryError.value || mutationError.value)
const hasFoods = computed(() => foods.value.length > 0)
const normalizedFoodSearchTerm = computed(() =>
  foodSearchTerm.value.trim().toLowerCase(),
)
const filteredFoods = computed(() => {
  const term = normalizedFoodSearchTerm.value

  if (!term) {
    return foods.value
  }

  return foods.value.filter((food) => {
    const haystack = `${food.name} ${food.brand ?? ''}`.toLowerCase()
    return haystack.includes(term)
  })
})
const hasFilteredFoods = computed(() => filteredFoods.value.length > 0)
const hasTodayEntries = computed(() => todayEntries.value.length > 0)
const selectedFood = computed(
  () => foods.value.find((food) => food.id === selectedFoodId.value) ?? null,
)
const isFoodLibraryOpen = computed(() => foodModalMode.value !== null)
const isFoodModalBusy = computed(
  () => isCreatingFood.value || isUpdatingFood.value,
)
const foodModalEyebrow = computed(() =>
  foodModalMode.value === 'edit' ? 'Food editor' : 'Food library',
)
const foodModalTitle = computed(() =>
  foodModalMode.value === 'edit' ? 'Edit food' : 'Add a food',
)
const foodModalSubmitLabel = computed(() => {
  if (foodModalMode.value === 'edit') {
    return isUpdatingFood.value ? 'Saving changes...' : 'Save changes'
  }

  return isCreatingFood.value ? 'Saving food...' : 'Save food to library'
})

watch(
  () => foods.value,
  (nextFoods) => {
    if (!nextFoods.length) {
      selectedFoodId.value = ''
      return
    }

    if (
      !selectedFoodId.value ||
      !nextFoods.some((food) => food.id === selectedFoodId.value)
    ) {
      selectedFoodId.value = nextFoods[0].id
    }
  },
  { immediate: true },
)

watch(
  () => selectedFood.value?.id,
  (foodId) => {
    if (!foodId || !selectedFood.value) {
      return
    }

    entryForm.amount =
      selectedFood.value.measure_unit === 'pack'
        ? 1
        : selectedFood.value.basis_amount
  },
  { immediate: true },
)

watch(
  () => foodForm.measure_unit,
  (unit) => {
    const nextDefault =
      measureOptions.find((option) => option.value === unit)?.defaultAmount ??
      100
    foodForm.basis_amount = nextDefault
  },
)

function resetFoodForm() {
  foodForm.name = ''
  foodForm.brand = ''
  foodForm.measure_unit = 'g'
  foodForm.basis_amount = 100
  foodForm.calories_per_basis = 0
  foodForm.protein_g_per_basis = 0
  foodForm.carbs_g_per_basis = 0
  foodForm.fats_g_per_basis = 0
}

function populateFoodForm(food: FoodItem) {
  foodForm.name = food.name
  foodForm.brand = food.brand ?? ''
  foodForm.measure_unit = food.measure_unit
  foodForm.basis_amount = food.basis_amount
  foodForm.calories_per_basis = food.calories_per_basis
  foodForm.protein_g_per_basis = food.protein_g_per_basis
  foodForm.carbs_g_per_basis = food.carbs_g_per_basis
  foodForm.fats_g_per_basis = food.fats_g_per_basis
}

function getFoodFormPayload() {
  return {
    ...foodForm,
    name: foodForm.name.trim(),
    brand: foodForm.brand.trim(),
  }
}

async function handleCreateFood() {
  const createdFood = await saveFood(getFoodFormPayload())
  selectedFoodId.value = createdFood.id
  resetFoodForm()
  foodModalMode.value = null
}

async function handleUpdateFood() {
  if (!selectedFood.value) {
    return
  }

  const updatedFood = await editFood(
    selectedFood.value.id,
    getFoodFormPayload(),
  )
  selectedFoodId.value = updatedFood.id
  foodModalMode.value = null
}

async function handleSubmitFood() {
  if (foodModalMode.value === 'edit') {
    await handleUpdateFood()
    return
  }

  await handleCreateFood()
}

async function handleCreateEntry() {
  if (!selectedFood.value) {
    return
  }

  await saveCalorieEntry({
    food_id: selectedFood.value.id,
    amount: entryForm.amount,
    meal_type: entryForm.meal_type,
  })
}

async function handleDeleteFood() {
  if (!foodPendingRemoval.value) {
    return
  }

  await removeFood(foodPendingRemoval.value.id)
  foodPendingRemoval.value = null
}

function openFoodLibrary() {
  resetFoodForm()
  foodModalMode.value = 'create'
}

function openFoodEditor(food: FoodItem) {
  selectedFoodId.value = food.id
  populateFoodForm(food)
  foodModalMode.value = 'edit'
}

function requestFoodRemoval(food: FoodItem) {
  foodPendingRemoval.value = food
}

function closeFoodLibrary() {
  foodModalMode.value = null
}

function closeFoodRemoval() {
  foodPendingRemoval.value = null
}
</script>

<template>
  <section class="calories-page">
    <CaloriesHero
      :foods-count="foods.length"
      :meals-today-count="todayEntries.length"
      :today-calories="todayCalories"
      :today-protein="todayProtein"
      :today-carbs="todayCarbs"
      :today-fats="todayFats"
    />

    <p
      v-if="caloriesError"
      class="calories-page__feedback calories-page__feedback--error"
    >
      {{ caloriesError }}
    </p>

    <section class="calories-page__layout">
      <section class="calories-page__top-row">
        <FoodSelectorPanel
          :foods="filteredFoods"
          :search-term="foodSearchTerm"
          :selected-food-id="selectedFoodId"
          :is-loading="isLoadingFoods"
          :is-refreshing="isRefreshing"
          :has-foods="hasFoods"
          :has-results="hasFilteredFoods"
          @refresh="refetchFoods()"
          @add-food="openFoodLibrary"
          @update:search-term="foodSearchTerm = $event"
          @select-food="selectedFoodId = $event"
          @edit-food="openFoodEditor"
          @remove-food="requestFoodRemoval"
        />

        <SelectedFoodPanel
          :selected-food="selectedFood"
          :entry-form="entryForm"
          :meal-type-options="mealTypeOptions"
          :is-creating-entry="isCreatingEntry"
          @submit="handleCreateEntry"
        />
      </section>

      <section class="calories-page__diary">
        <CaloriesDiaryPanel
          :today-entries="todayEntries"
          :has-entries="hasTodayEntries"
          :is-loading="isLoadingEntries"
          :is-refreshing="isRefreshing"
          :is-deleting-entry="isDeletingEntry"
          @refresh="refetchEntries()"
          @remove-entry="removeCalorieEntry"
        />

        <CaloriesHistoryPanel :recent-daily-calories="recentDailyCalories" />
      </section>
    </section>

    <CaloriesFoodModal
      :is-open="isFoodLibraryOpen"
      :mode="foodModalMode"
      :title="foodModalTitle"
      :eyebrow="foodModalEyebrow"
      :submit-label="foodModalSubmitLabel"
      :is-busy="isFoodModalBusy"
      :food-form="foodForm"
      :measure-options="measureOptions"
      @close="closeFoodLibrary"
      @submit="handleSubmitFood"
    />

    <CaloriesDeleteFoodModal
      :is-open="Boolean(foodPendingRemoval)"
      :food-name="foodPendingRemoval?.name ?? ''"
      :is-deleting="isDeletingFood"
      @close="closeFoodRemoval"
      @confirm="handleDeleteFood"
    />
  </section>
</template>

<style scoped lang="scss">
.calories-page {
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

.calories-page__feedback {
  margin: 0;
  padding: 14px 16px;
  border: 1px solid rgba(163, 53, 53, 0.25);
  border-radius: $radius-md;
  background: rgba(163, 53, 53, 0.08);
  color: #8f2f2f;
}

.calories-page__layout,
.calories-page__diary {
  display: grid;
  gap: 20px;
}

.calories-page__top-row {
  display: grid;
  grid-template-columns: minmax(320px, 0.86fr) minmax(0, 1.14fr);
  gap: 20px;

  @include down('lg') {
    grid-template-columns: 1fr;
  }
}
</style>
