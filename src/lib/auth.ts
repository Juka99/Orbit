import type { Session } from '@supabase/supabase-js'
import { computed, readonly, ref } from 'vue'

import { hasSupabaseCredentials, supabase } from './supabase'

const session = ref<Session | null>(null)
const isLoading = ref(true)
const isInitialized = ref(false)
const initializationError = ref('')

let authInitialized = false
let resolveInitialization: (() => void) | null = null

const initializationPromise = new Promise<void>((resolve) => {
  resolveInitialization = resolve
})

function markInitialized() {
  isLoading.value = false
  isInitialized.value = true
  resolveInitialization?.()
  resolveInitialization = null
}

export async function ensureActiveSession() {
  if (!supabase) {
    throw new Error('Supabase credentials are missing.')
  }

  const {
    data: { session: currentSession },
    error: sessionError,
  } = await supabase.auth.getSession()

  if (sessionError) {
    throw sessionError
  }

  if (!currentSession) {
    session.value = null
    throw new Error('Sign in to continue.')
  }

  const expiresAt = currentSession.expires_at ? currentSession.expires_at * 1000 : 0
  const shouldRefresh = expiresAt !== 0 && expiresAt <= Date.now() + 60_000

  if (!shouldRefresh) {
    session.value = currentSession
    return currentSession
  }

  const { data, error } = await supabase.auth.refreshSession({
    refresh_token: currentSession.refresh_token,
  })

  if (error || !data.session) {
    session.value = null
    throw error ?? new Error('Sign in to continue.')
  }

  session.value = data.session
  return data.session
}

export function initializeAuth() {
  if (authInitialized) {
    return
  }

  authInitialized = true

  if (!supabase) {
    markInitialized()
    return
  }

  void supabase.auth
    .getSession()
    .then(({ data }) => {
      session.value = data.session
      initializationError.value = ''
      markInitialized()
    })
    .catch((error) => {
      initializationError.value =
        error instanceof Error ? error.message : 'Unable to initialize authentication.'
      markInitialized()
    })

  supabase.auth.onAuthStateChange((_event, nextSession) => {
    session.value = nextSession
    initializationError.value = ''
    markInitialized()
  })
}

export async function waitForAuthInitialization() {
  await initializationPromise
}

export function useAuth() {
  const user = computed(() => session.value?.user ?? null)
  const isAuthenticated = computed(() => Boolean(session.value?.user))

  return {
    hasSupabaseCredentials,
    isAuthenticated: readonly(isAuthenticated),
    initializationError: readonly(initializationError),
    isInitialized: readonly(isInitialized),
    isLoading: readonly(isLoading),
    session: readonly(session),
    user: readonly(user),
  }
}

export async function signInWithPassword(email: string, password: string) {
  if (!supabase) {
    throw new Error('Supabase credentials are missing.')
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    throw error
  }

  session.value = data.session
}

export async function signUpWithPassword(email: string, password: string) {
  if (!supabase) {
    throw new Error('Supabase credentials are missing.')
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    throw error
  }

  session.value = data.session
  return data
}

export async function signOut() {
  if (!supabase) {
    return
  }

  const { error } = await supabase.auth.signOut({ scope: 'local' })

  if (error) {
    throw error
  }

  session.value = null
}
