import type { FoodMeasureUnit, MealType } from '../../types/calories'

export interface FoodFormState {
  name: string
  brand: string
  measure_unit: FoodMeasureUnit
  basis_amount: number
  calories_per_basis: number
  protein_g_per_basis: number
  carbs_g_per_basis: number
  fats_g_per_basis: number
}

export interface EntryFormState {
  amount: number
  meal_type: MealType
}

export interface MeasureOption {
  value: FoodMeasureUnit
  label: string
  defaultAmount: number
}

export interface RecentDailyCaloriesItem {
  dateKey: string
  total: number
  isToday: boolean
}
