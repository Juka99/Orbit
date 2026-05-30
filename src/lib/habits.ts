import type { PostgrestError } from '@supabase/supabase-js'

import { ensureActiveSession } from './auth'
import { supabase } from './supabase'
import type {
  Habit,
  HabitCompletion,
  HabitInput,
  HabitSnapshot,
} from '../types/habit'

const HABITS_TABLE_HINT =
  'The habits tables may not be applied yet. Run the Supabase migration before using habits.'

function requireSupabase() {
  if (!supabase) {
    throw new Error('Supabase credentials are missing.')
  }

  return supabase
}

function normalizeHabitsError(error: PostgrestError | Error | null) {
  if (!error) {
    return 'Something went wrong while working with habits.'
  }

  if ('code' in error && (error.code === '42P01' || error.code === 'PGRST205')) {
    return HABITS_TABLE_HINT
  }

  return error.message
}

function isExpiredJwtError(error: PostgrestError | Error | null) {
  if (!error) {
    return false
  }

  return error.message.toLowerCase().includes('jwt expired')
}

async function runHabitsRequest<T>(
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
    throw new Error(normalizeHabitsError(result.error))
  }

  return result.data
}

export async function fetchHabitsSnapshot() {
  const client = requireSupabase()
  await ensureActiveSession()

  const [habitsData, completionsData] = await Promise.all([
    runHabitsRequest(async () =>
      await client
        .from('habits')
        .select('*')
        .order('created_at', { ascending: false }),
    ),
    runHabitsRequest(async () =>
      await client
        .from('habit_completions')
        .select('*')
        .order('completed_on', { ascending: false }),
    ),
  ])

  return {
    habits: (habitsData ?? []) as Habit[],
    completions: (completionsData ?? []) as HabitCompletion[],
  } satisfies HabitSnapshot
}

export async function createHabit(input: HabitInput) {
  const client = requireSupabase()
  const activeSession = await ensureActiveSession()
  const user = activeSession.user

  if (!user) {
    throw new Error('You need to be signed in to save habits.')
  }

  const data = await runHabitsRequest(async () =>
    await client
      .from('habits')
      .insert({
        user_id: user.id,
        name: input.name.trim(),
        description: input.description?.trim() || null,
        tone: input.tone,
        icon_key: input.icon_key,
      })
      .select('*')
      .single(),
  )

  if (!data) {
    throw new Error('Unable to save habit.')
  }

  return data as Habit
}

export async function updateHabit(habitId: string, input: HabitInput) {
  const client = requireSupabase()
  await ensureActiveSession()

  const data = await runHabitsRequest(async () =>
    await client
      .from('habits')
      .update({
        name: input.name.trim(),
        description: input.description?.trim() || null,
        tone: input.tone,
        icon_key: input.icon_key,
      })
      .eq('id', habitId)
      .select('*')
      .single(),
  )

  if (!data) {
    throw new Error('Unable to update habit.')
  }

  return data as Habit
}

export async function deleteHabit(habitId: string) {
  const client = requireSupabase()
  await ensureActiveSession()

  await runHabitsRequest(async () =>
    await client
      .from('habits')
      .delete()
      .eq('id', habitId),
  )
}

export async function toggleHabitCompletion(habitId: string, completedOn: string) {
  const client = requireSupabase()
  const activeSession = await ensureActiveSession()
  const user = activeSession.user

  if (!user) {
    throw new Error('You need to be signed in to track habits.')
  }

  const existingCompletion = (await runHabitsRequest(async () =>
    await client
      .from('habit_completions')
      .select('id')
      .eq('habit_id', habitId)
      .eq('completed_on', completedOn)
      .maybeSingle(),
  )) as { id: string } | null

  if (existingCompletion?.id) {
    await runHabitsRequest(async () =>
      await client
        .from('habit_completions')
        .delete()
        .eq('id', existingCompletion.id),
    )

    return { completed: false }
  }

  await runHabitsRequest(async () =>
    await client
      .from('habit_completions')
      .insert({
        habit_id: habitId,
        user_id: user.id,
        completed_on: completedOn,
      })
      .select('id')
      .single(),
  )

  return { completed: true }
}
