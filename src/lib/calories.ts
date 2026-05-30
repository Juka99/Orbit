import type { PostgrestError } from '@supabase/supabase-js'

import { ensureActiveSession } from './auth'
import { supabase } from './supabase'
import type { CalorieEntry, CalorieEntryInput, FoodItem, FoodItemInput } from '../types/calories'

const CALORIES_TABLE_HINT =
  'The calories tables may not be applied yet. Run the Supabase migration before using calorie tracking.'

function requireSupabase() {
  if (!supabase) {
    throw new Error('Supabase credentials are missing.')
  }

  return supabase
}

function normalizeCaloriesError(error: PostgrestError | Error | null) {
  if (!error) {
    return 'Something went wrong while working with calorie tracking.'
  }

  if ('code' in error && (error.code === '42P01' || error.code === 'PGRST205')) {
    return CALORIES_TABLE_HINT
  }

  return error.message
}

function isExpiredJwtError(error: PostgrestError | Error | null) {
  if (!error) {
    return false
  }

  return error.message.toLowerCase().includes('jwt expired')
}

async function runCaloriesRequest<T>(
  request: () => Promise<{ data: T | null; error: PostgrestError | null }>,
) {
  const client = requireSupabase()
  let result = await request()

  if (isExpiredJwtError(result.error)) {
    const {
      data: { session: currentSession },
    } = await client.auth.getSession()

    if (currentSession?.refresh_token) {
      await client.auth.refreshSession({
        refresh_token: currentSession.refresh_token,
      })
    }

    await ensureActiveSession()
    result = await request()
  }

  if (result.error) {
    throw new Error(normalizeCaloriesError(result.error))
  }

  return result.data
}

export async function fetchFoods() {
  const client = requireSupabase()
  await ensureActiveSession()

  const data = await runCaloriesRequest(async () =>
    await client
      .from('foods')
      .select('*')
      .order('name', { ascending: true }),
  )

  return (data ?? []) as FoodItem[]
}

export async function createFood(input: FoodItemInput) {
  const client = requireSupabase()
  const activeSession = await ensureActiveSession()
  const user = activeSession.user

  if (!user) {
    throw new Error('You need to be signed in to save foods.')
  }

  const payload = {
    user_id: user.id,
    name: input.name.trim(),
    brand: input.brand?.trim() || null,
    measure_unit: input.measure_unit,
    basis_amount: input.basis_amount,
    calories_per_basis: input.calories_per_basis,
    protein_g_per_basis: input.protein_g_per_basis,
    carbs_g_per_basis: input.carbs_g_per_basis,
    fats_g_per_basis: input.fats_g_per_basis,
  }

  const data = await runCaloriesRequest(async () =>
    await client
      .from('foods')
      .insert(payload)
      .select('*')
      .single(),
  )

  if (!data) {
    throw new Error('Unable to save food.')
  }

  return data as FoodItem
}

export async function updateFood(foodId: string, input: FoodItemInput) {
  const client = requireSupabase()
  await ensureActiveSession()

  const payload = {
    name: input.name.trim(),
    brand: input.brand?.trim() || null,
    measure_unit: input.measure_unit,
    basis_amount: input.basis_amount,
    calories_per_basis: input.calories_per_basis,
    protein_g_per_basis: input.protein_g_per_basis,
    carbs_g_per_basis: input.carbs_g_per_basis,
    fats_g_per_basis: input.fats_g_per_basis,
  }

  const data = await runCaloriesRequest(async () =>
    await client
      .from('foods')
      .update(payload)
      .eq('id', foodId)
      .select('*')
      .single(),
  )

  if (!data) {
    throw new Error('Unable to update food.')
  }

  return data as FoodItem
}

export async function fetchCalorieEntries() {
  const client = requireSupabase()
  await ensureActiveSession()

  const data = await runCaloriesRequest(async () =>
    await client
      .from('calorie_entries')
      .select('*, food:foods(*)')
      .order('logged_at', { ascending: false }),
  )

  return (data ?? []) as CalorieEntry[]
}

export async function createCalorieEntry(input: CalorieEntryInput) {
  const client = requireSupabase()
  const activeSession = await ensureActiveSession()
  const user = activeSession.user

  if (!user) {
    throw new Error('You need to be signed in to log calories.')
  }

  const data = await runCaloriesRequest(async () =>
    await client
      .from('calorie_entries')
      .insert({
        user_id: user.id,
        food_id: input.food_id,
        amount: input.amount,
        meal_type: input.meal_type,
        logged_at: input.logged_at ?? new Date().toISOString(),
      })
      .select('*, food:foods(*)')
      .single(),
  )

  if (!data) {
    throw new Error('Unable to log calories.')
  }

  return data as CalorieEntry
}

export async function deleteCalorieEntry(entryId: string) {
  const client = requireSupabase()
  await ensureActiveSession()

  await runCaloriesRequest(async () =>
    await client
      .from('calorie_entries')
      .delete()
      .eq('id', entryId),
  )
}

export async function deleteFood(foodId: string) {
  const client = requireSupabase()
  await ensureActiveSession()

  await runCaloriesRequest(async () =>
    await client
      .from('foods')
      .delete()
      .eq('id', foodId),
  )
}
