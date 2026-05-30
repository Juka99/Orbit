import { computed, ref } from 'vue'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'

import type { WaterLogInput } from '../types/water-log'
import { createWaterLog, deleteWaterLog, fetchWaterLogs } from '../lib/water'

const WATER_QUERY_KEY = ['water-logs']
const WATER_GOAL_ML = 2000

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

export function useWater() {
  const queryClient = useQueryClient()
  const mutationError = ref('')

  const waterLogsQuery = useQuery({
    queryKey: WATER_QUERY_KEY,
    queryFn: fetchWaterLogs,
  })

  const createWaterLogMutation = useMutation({
    mutationFn: createWaterLog,
    onMutate: () => {
      mutationError.value = ''
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: WATER_QUERY_KEY })
    },
    onError: (error) => {
      mutationError.value = error instanceof Error ? error.message : 'Unable to log water.'
    },
  })

  const deleteWaterLogMutation = useMutation({
    mutationFn: deleteWaterLog,
    onMutate: () => {
      mutationError.value = ''
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: WATER_QUERY_KEY })
    },
    onError: (error) => {
      mutationError.value = error instanceof Error ? error.message : 'Unable to delete water log.'
    },
  })

  const logs = computed(() => waterLogsQuery.data.value ?? [])
  const queryError = computed(() =>
    waterLogsQuery.error.value instanceof Error ? waterLogsQuery.error.value.message : '',
  )
  const todayKey = getLocalDateKey(new Date().toISOString())
  const todayLogs = computed(() =>
    logs.value.filter((log) => getLocalDateKey(log.logged_at) === todayKey),
  )
  const todayTotal = computed(() =>
    todayLogs.value.reduce((sum, log) => sum + log.amount_ml, 0),
  )
  const glassesToday = computed(() => todayLogs.value.length)
  const goalProgress = computed(() => Math.min(todayTotal.value / WATER_GOAL_ML, 1))
  const remainingToGoal = computed(() => Math.max(WATER_GOAL_ML - todayTotal.value, 0))
  const dailyTotals = computed(() => {
    return logs.value.reduce<Record<string, number>>((totals, log) => {
      const dateKey = getLocalDateKey(log.logged_at)
      totals[dateKey] = (totals[dateKey] ?? 0) + log.amount_ml
      return totals
    }, {})
  })
  const recentDailyTotals = computed(() => {
    return getRecentDateKeys(7).map((dateKey) => ({
      dateKey,
      total: dailyTotals.value[dateKey] ?? 0,
      reachedGoal: (dailyTotals.value[dateKey] ?? 0) >= WATER_GOAL_ML,
      isToday: dateKey === todayKey,
    }))
  })
  const currentStreak = computed(() => {
    let streak = 0

    for (const day of recentDailyTotals.value) {
      if (day.total > 0) {
        streak += 1
      } else {
        break
      }
    }

    return streak
  })

  async function addWaterLog(input: WaterLogInput) {
    await createWaterLogMutation.mutateAsync(input)
  }

  async function removeWaterLog(logId: string) {
    await deleteWaterLogMutation.mutateAsync(logId)
  }

  return {
    currentStreak,
    glassesToday,
    goalMl: WATER_GOAL_ML,
    goalProgress,
    isCreating: createWaterLogMutation.isPending,
    isDeleting: deleteWaterLogMutation.isPending,
    isLoading: waterLogsQuery.isLoading,
    isRefreshing: waterLogsQuery.isFetching,
    logs,
    mutationError,
    queryError,
    recentDailyTotals,
    refetch: waterLogsQuery.refetch,
    remainingToGoal,
    removeWaterLog,
    saveWaterLog: addWaterLog,
    todayLogs,
    todayTotal,
  }
}
