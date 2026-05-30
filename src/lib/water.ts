import type { PostgrestError } from '@supabase/supabase-js'

import { ensureActiveSession } from './auth'
import type { WaterLog, WaterLogInput } from '../types/water-log'
import { supabase } from './supabase'

const WATER_TABLE_HINT =
  'The water tracking tables may not be applied yet. Run the Supabase migration before using water tracking.'

function requireSupabase() {
  if (!supabase) {
    throw new Error('Supabase credentials are missing.')
  }

  return supabase
}

function normalizeWaterError(error: PostgrestError | Error | null) {
  if (!error) {
    return 'Something went wrong while working with water tracking.'
  }

  if ('code' in error && (error.code === '42P01' || error.code === 'PGRST205')) {
    return WATER_TABLE_HINT
  }

  return error.message
}

export async function fetchWaterLogs() {
  const client = requireSupabase()
  await ensureActiveSession()

  const { data, error } = await client
    .from('water_logs')
    .select('*')
    .order('logged_at', { ascending: false })

  if (error) {
    throw new Error(normalizeWaterError(error))
  }

  return (data ?? []) as WaterLog[]
}

export async function createWaterLog(input: WaterLogInput) {
  const client = requireSupabase()
  const activeSession = await ensureActiveSession()
  const user = activeSession.user

  if (!user) {
    throw new Error('You need to be signed in to log water.')
  }

  const { data, error } = await client
    .from('water_logs')
    .insert({
      user_id: user.id,
      amount_ml: input.amount_ml,
      logged_at: input.logged_at ?? new Date().toISOString(),
    })
    .select('*')
    .single()

  if (error) {
    throw new Error(normalizeWaterError(error))
  }

  return data as WaterLog
}

export async function deleteWaterLog(logId: string) {
  const client = requireSupabase()
  await ensureActiveSession()

  const { error } = await client
    .from('water_logs')
    .delete()
    .eq('id', logId)

  if (error) {
    throw new Error(normalizeWaterError(error))
  }
}
