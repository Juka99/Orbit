import { computed, ref } from 'vue'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'

import {
  createCalorieEntry,
  createFood,
  deleteFood,
  deleteCalorieEntry,
  fetchCalorieEntries,
  fetchFoods,
  updateFood,
} from '../lib/calories'
import type { CalorieEntry, CalorieEntryInput, FoodItem, FoodItemInput } from '../types/calories'

const FOODS_QUERY_KEY = ['foods']
const CALORIE_ENTRIES_QUERY_KEY = ['calorie-entries']

function getLocalDateKey(timestamp: string) {
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function getRecentDateKeys(days: number) {
  return Array.from({ length: days }, (_, index) => {
    const date = new Date()
    date.setHours(0, 0, 0, 0)
    date.setDate(date.getDate() - index)
    return getLocalDateKey(date.toISOString())
  })
}

function getEntryCalories(entry: CalorieEntry) {
  const food = entry.food
  if (!food) return 0
  return Math.round((food.calories_per_basis * entry.amount) / food.basis_amount)
}

function getEntryMacro(entry: CalorieEntry, macro: 'protein_g_per_basis' | 'carbs_g_per_basis' | 'fats_g_per_basis') {
  const food = entry.food
  if (!food) return 0
  return Number(((food[macro] * entry.amount) / food.basis_amount).toFixed(1))
}

export function useCalories() {
  const queryClient = useQueryClient()
  const mutationError = ref('')

  const foodsQuery = useQuery({
    queryKey: FOODS_QUERY_KEY,
    queryFn: fetchFoods,
  })

  const entriesQuery = useQuery({
    queryKey: CALORIE_ENTRIES_QUERY_KEY,
    queryFn: fetchCalorieEntries,
  })

  const createFoodMutation = useMutation({
    mutationFn: createFood,
    onMutate: () => {
      mutationError.value = ''
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: FOODS_QUERY_KEY })
      void queryClient.invalidateQueries({ queryKey: CALORIE_ENTRIES_QUERY_KEY })
    },
    onError: (error) => {
      mutationError.value = error instanceof Error ? error.message : 'Unable to save food.'
    },
  })

  const updateFoodMutation = useMutation({
    mutationFn: ({ foodId, input }: { foodId: string; input: FoodItemInput }) =>
      updateFood(foodId, input),
    onMutate: () => {
      mutationError.value = ''
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: FOODS_QUERY_KEY })
      void queryClient.invalidateQueries({ queryKey: CALORIE_ENTRIES_QUERY_KEY })
    },
    onError: (error) => {
      mutationError.value = error instanceof Error ? error.message : 'Unable to update food.'
    },
  })

  const createEntryMutation = useMutation({
    mutationFn: createCalorieEntry,
    onMutate: () => {
      mutationError.value = ''
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: CALORIE_ENTRIES_QUERY_KEY })
    },
    onError: (error) => {
      mutationError.value = error instanceof Error ? error.message : 'Unable to log calories.'
    },
  })

  const deleteEntryMutation = useMutation({
    mutationFn: deleteCalorieEntry,
    onMutate: () => {
      mutationError.value = ''
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: CALORIE_ENTRIES_QUERY_KEY })
    },
    onError: (error) => {
      mutationError.value = error instanceof Error ? error.message : 'Unable to delete entry.'
    },
  })

  const deleteFoodMutation = useMutation({
    mutationFn: deleteFood,
    onMutate: () => {
      mutationError.value = ''
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: FOODS_QUERY_KEY })
      void queryClient.invalidateQueries({ queryKey: CALORIE_ENTRIES_QUERY_KEY })
    },
    onError: (error) => {
      mutationError.value = error instanceof Error ? error.message : 'Unable to delete food.'
    },
  })

  const foods = computed(() => foodsQuery.data.value ?? [])
  const entries = computed(() => entriesQuery.data.value ?? [])
  const queryError = computed(() => {
    const error = foodsQuery.error.value ?? entriesQuery.error.value
    return error instanceof Error ? error.message : ''
  })

  const todayKey = getLocalDateKey(new Date().toISOString())
  const todayEntries = computed(() =>
    entries.value.filter((entry) => getLocalDateKey(entry.logged_at) === todayKey),
  )

  const selectedFoodById = computed(() =>
    foods.value.reduce<Record<string, FoodItem>>((acc, food) => {
      acc[food.id] = food
      return acc
    }, {}),
  )

  const todayCalories = computed(() =>
    todayEntries.value.reduce((sum, entry) => sum + getEntryCalories(entry), 0),
  )
  const todayProtein = computed(() =>
    todayEntries.value.reduce((sum, entry) => sum + getEntryMacro(entry, 'protein_g_per_basis'), 0),
  )
  const todayCarbs = computed(() =>
    todayEntries.value.reduce((sum, entry) => sum + getEntryMacro(entry, 'carbs_g_per_basis'), 0),
  )
  const todayFats = computed(() =>
    todayEntries.value.reduce((sum, entry) => sum + getEntryMacro(entry, 'fats_g_per_basis'), 0),
  )

  const recentDailyCalories = computed(() => {
    const totals = entries.value.reduce<Record<string, number>>((acc, entry) => {
      const dateKey = getLocalDateKey(entry.logged_at)
      acc[dateKey] = (acc[dateKey] ?? 0) + getEntryCalories(entry)
      return acc
    }, {})

    return getRecentDateKeys(7).map((dateKey) => ({
      dateKey,
      total: totals[dateKey] ?? 0,
      isToday: dateKey === todayKey,
    }))
  })

  async function saveFood(input: FoodItemInput) {
    return createFoodMutation.mutateAsync(input)
  }

  async function editFood(foodId: string, input: FoodItemInput) {
    return updateFoodMutation.mutateAsync({ foodId, input })
  }

  async function saveCalorieEntry(input: CalorieEntryInput) {
    return createEntryMutation.mutateAsync(input)
  }

  async function removeCalorieEntry(entryId: string) {
    return deleteEntryMutation.mutateAsync(entryId)
  }

  async function removeFood(foodId: string) {
    return deleteFoodMutation.mutateAsync(foodId)
  }

  return {
    entries,
    foods,
    isCreatingEntry: createEntryMutation.isPending,
    isCreatingFood: createFoodMutation.isPending,
    isDeletingFood: deleteFoodMutation.isPending,
    isDeletingEntry: deleteEntryMutation.isPending,
    isLoadingEntries: entriesQuery.isLoading,
    isLoadingFoods: foodsQuery.isLoading,
    isRefreshing: foodsQuery.isFetching || entriesQuery.isFetching,
    isUpdatingFood: updateFoodMutation.isPending,
    mutationError,
    queryError,
    editFood,
    recentDailyCalories,
    refetchEntries: entriesQuery.refetch,
    refetchFoods: foodsQuery.refetch,
    removeCalorieEntry,
    removeFood,
    saveCalorieEntry,
    saveFood,
    selectedFoodById,
    todayCalories,
    todayCarbs,
    todayEntries,
    todayFats,
    todayProtein,
  }
}
