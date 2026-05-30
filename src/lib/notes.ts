import type { PostgrestError } from '@supabase/supabase-js'

import { ensureActiveSession } from './auth'
import type { Note, NoteInput } from '../types/note'
import { supabase } from './supabase'

const NOTES_TABLE_HINT =
  'The notes tables may not be applied yet. Run the Supabase migration before using notes.'

function requireSupabase() {
  if (!supabase) {
    throw new Error('Supabase credentials are missing.')
  }

  return supabase
}

function normalizeNotesError(error: PostgrestError | Error | null) {
  if (!error) {
    return 'Something went wrong while working with notes.'
  }

  if ('code' in error && (error.code === '42P01' || error.code === 'PGRST205')) {
    return NOTES_TABLE_HINT
  }

  return error.message
}

export async function fetchNotes() {
  const client = requireSupabase()
  await ensureActiveSession()

  const { data, error } = await client
    .from('notes')
    .select('*')
    .order('is_pinned', { ascending: false })
    .order('updated_at', { ascending: false })

  if (error) {
    throw new Error(normalizeNotesError(error))
  }

  return (data ?? []) as Note[]
}

export async function createNote(input: NoteInput) {
  const client = requireSupabase()
  const activeSession = await ensureActiveSession()
  const user = activeSession.user

  if (!user) {
    throw new Error('You need to be signed in to create notes.')
  }

  const { data, error } = await client
    .from('notes')
    .insert({
      ...input,
      user_id: user.id,
    })
    .select('*')
    .single()

  if (error) {
    throw new Error(normalizeNotesError(error))
  }

  return data as Note
}

export async function updateNote(noteId: string, input: Partial<NoteInput>) {
  const client = requireSupabase()
  await ensureActiveSession()

  const { data, error } = await client
    .from('notes')
    .update(input)
    .eq('id', noteId)
    .select('*')
    .single()

  if (error) {
    throw new Error(normalizeNotesError(error))
  }

  return data as Note
}

export async function deleteNote(noteId: string) {
  const client = requireSupabase()
  await ensureActiveSession()

  const { error } = await client
    .from('notes')
    .delete()
    .eq('id', noteId)

  if (error) {
    throw new Error(normalizeNotesError(error))
  }
}
