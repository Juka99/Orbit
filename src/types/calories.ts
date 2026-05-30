export type FoodMeasureUnit = 'g' | 'ml' | 'pack'
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack'

export interface FoodItem {
  id: string
  user_id: string
  name: string
  brand: string | null
  measure_unit: FoodMeasureUnit
  basis_amount: number
  calories_per_basis: number
  protein_g_per_basis: number
  carbs_g_per_basis: number
  fats_g_per_basis: number
  created_at: string
}

export interface FoodItemInput {
  name: string
  brand?: string
  measure_unit: FoodMeasureUnit
  basis_amount: number
  calories_per_basis: number
  protein_g_per_basis: number
  carbs_g_per_basis: number
  fats_g_per_basis: number
}

export interface CalorieEntry {
  id: string
  user_id: string
  food_id: string
  amount: number
  meal_type: MealType
  logged_at: string
  created_at: string
  food?: FoodItem
}

export interface CalorieEntryInput {
  food_id: string
  amount: number
  meal_type: MealType
  logged_at?: string
}
