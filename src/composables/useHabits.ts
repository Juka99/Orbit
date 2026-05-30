import { computed, ref } from 'vue'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'

import {
  createHabit,
  deleteHabit,
  fetchHabitsSnapshot,
  toggleHabitCompletion,
  updateHabit,
} from '../lib/habits'
import type {
  Habit,
  HabitInput,
} from '../types/habit'

const HABITS_QUERY_KEY = ['habits']

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

function getWeekdayLabel(dateKey: string) {
  const [year, month, day] = dateKey.split('-').map(Number)
  const date = new Date(year, month - 1, day)

  return new Intl.DateTimeFormat('en', {
    weekday: 'narrow',
  }).format(date)
}

export interface HabitWeekMark {
  dateKey: string
  label: string
  isComplete: boolean
  isToday: boolean
}

export interface HabitCardModel extends Habit {
  isDoneToday: boolean
  streak: number
  weeklyMarks: HabitWeekMark[]
  weeklyCompletionCount: number
}

export function useHabits() {
  const queryClient = useQueryClient()
  const mutationError = ref('')

  const habitsQuery = useQuery({
    queryKey: HABITS_QUERY_KEY,
    queryFn: fetchHabitsSnapshot,
  })

  const createHabitMutation = useMutation({
    mutationFn: createHabit,
    onMutate: () => {
      mutationError.value = ''
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: HABITS_QUERY_KEY })
    },
    onError: (error) => {
      mutationError.value = error instanceof Error ? error.message : 'Unable to save habit.'
    },
  })

  const updateHabitMutation = useMutation({
    mutationFn: ({ habitId, input }: { habitId: string; input: HabitInput }) =>
      updateHabit(habitId, input),
    onMutate: () => {
      mutationError.value = ''
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: HABITS_QUERY_KEY })
    },
    onError: (error) => {
      mutationError.value = error instanceof Error ? error.message : 'Unable to update habit.'
    },
  })

  const deleteHabitMutation = useMutation({
    mutationFn: deleteHabit,
    onMutate: () => {
      mutationError.value = ''
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: HABITS_QUERY_KEY })
    },
    onError: (error) => {
      mutationError.value = error instanceof Error ? error.message : 'Unable to delete habit.'
    },
  })

  const toggleHabitMutation = useMutation({
    mutationFn: ({ habitId, completedOn }: { habitId: string; completedOn: string }) =>
      toggleHabitCompletion(habitId, completedOn),
    onMutate: () => {
      mutationError.value = ''
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: HABITS_QUERY_KEY })
    },
    onError: (error) => {
      mutationError.value = error instanceof Error ? error.message : 'Unable to update habit progress.'
    },
  })

  const habits = computed(() => habitsQuery.data.value?.habits ?? [])
  const completions = computed(() => habitsQuery.data.value?.completions ?? [])
  const queryError = computed(() =>
    habitsQuery.error.value instanceof Error ? habitsQuery.error.value.message : '',
  )

  const todayKey = getLocalDateKey(new Date().toISOString())
  const recentDateKeys = computed(() => getRecentDateKeys(7))

  const completionsByHabit = computed(() => {
    return completions.value.reduce<Record<string, Set<string>>>((acc, completion) => {
      if (!acc[completion.habit_id]) {
        acc[completion.habit_id] = new Set()
      }

      acc[completion.habit_id].add(completion.completed_on)
      return acc
    }, {})
  })

  const habitsWithState = computed<HabitCardModel[]>(() => {
    const completionSets = completionsByHabit.value

    return habits.value.map((habit) => {
      const dates = completionSets[habit.id] ?? new Set<string>()
      const isDoneToday = dates.has(todayKey)

      let streak = 0
      for (const dateKey of recentDateKeys.value) {
        if (dates.has(dateKey)) {
          streak += 1
        } else {
          break
        }
      }

      const weeklyMarks = [...recentDateKeys.value]
        .reverse()
        .map((dateKey) => ({
          dateKey,
          label: getWeekdayLabel(dateKey),
          isComplete: dates.has(dateKey),
          isToday: dateKey === todayKey,
        }))

      return {
        ...habit,
        isDoneToday,
        streak,
        weeklyMarks,
        weeklyCompletionCount: weeklyMarks.filter((mark) => mark.isComplete).length,
      }
    })
  })

  const habitsCount = computed(() => habits.value.length)
  const completedTodayCount = computed(() =>
    habitsWithState.value.filter((habit) => habit.isDoneToday).length,
  )
  const completionPercent = computed(() =>
    habitsCount.value > 0 ? Math.round((completedTodayCount.value / habitsCount.value) * 100) : 0,
  )
  const activeStreaks = computed(() =>
    habitsWithState.value.filter((habit) => habit.streak > 0).length,
  )
  const weeklyCompletions = computed(() =>
    completions.value.filter((completion) => recentDateKeys.value.includes(completion.completed_on)).length,
  )

  async function saveHabit(input: HabitInput) {
    return createHabitMutation.mutateAsync(input)
  }

  async function editHabit(habitId: string, input: HabitInput) {
    return updateHabitMutation.mutateAsync({ habitId, input })
  }

  async function removeHabit(habitId: string) {
    return deleteHabitMutation.mutateAsync(habitId)
  }

  async function toggleHabitForToday(habitId: string) {
    return toggleHabitMutation.mutateAsync({ habitId, completedOn: todayKey })
  }

  return {
    activeStreaks,
    completedTodayCount,
    completionPercent,
    completions,
    editHabit,
    habits,
    habitsCount,
    habitsWithState,
    isCreating: createHabitMutation.isPending,
    isDeleting: deleteHabitMutation.isPending,
    isLoading: habitsQuery.isLoading,
    isRefreshing: habitsQuery.isFetching,
    isToggling: toggleHabitMutation.isPending,
    isUpdating: updateHabitMutation.isPending,
    mutationError,
    queryError,
    refetch: habitsQuery.refetch,
    removeHabit,
    saveHabit,
    toggleHabitForToday,
    weeklyCompletions,
  }
}
