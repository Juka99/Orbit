import type { Session } from '@supabase/supabase-js'
import { computed, readonly, ref } from 'vue'

import { hasSupabaseCredentials, supabase } from './supabase'

const session = ref<Session | null>(null)
const isLoading = ref(true)
const isInitialized = ref(false)
const initializationError = ref('')

let authInitialized = false
let isBootstrappingSession = false
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

async function ensureAnonymousSession() {
  if (!supabase) {
    return null
  }

  const {
    data: { session: currentSession },
  } = await supabase.auth.getSession()

  if (currentSession) {
    session.value = currentSession
    return currentSession
  }

  const { data, error } = await supabase.auth.signInAnonymously()

  if (error) {
    throw error
  }

  session.value = data.session
  return data.session
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
    const restoredSession = await ensureAnonymousSession()

    if (!restoredSession) {
      throw new Error('Unable to restore the guest session.')
    }

    return restoredSession
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
    const restoredSession = await ensureAnonymousSession()

    if (!restoredSession) {
      throw error ?? new Error('Unable to restore the guest session.')
    }

    return restoredSession
  }

  session.value = data.session
  return data.session
}

export function initializeAuth() {
  if (authInitialized) {
    return
  }

  authInitialized = true
  isBootstrappingSession = true

  if (!supabase) {
    isBootstrappingSession = false
    markInitialized()
    return
  }

  void supabase.auth
    .getSession()
    .then(async ({ data }) => {
      session.value = data.session

      if (!data.session) {
        await ensureAnonymousSession()
      }

      initializationError.value = ''
      isBootstrappingSession = false
      markInitialized()
    })
    .catch((error) => {
      initializationError.value =
        error instanceof Error ? error.message : 'Unable to initialize the guest session.'
      isBootstrappingSession = false
      markInitialized()
    })

  supabase.auth.onAuthStateChange(async (event, nextSession) => {
    if (event === 'INITIAL_SESSION' && isBootstrappingSession) {
      return
    }

    session.value = nextSession

    if (!nextSession && event === 'SIGNED_OUT') {
      try {
        await ensureAnonymousSession()
        initializationError.value = ''
      } catch (error) {
        initializationError.value =
          error instanceof Error ? error.message : 'Unable to restore the guest session.'
      }
    }

    markInitialized()
  })
}

export async function waitForAuthInitialization() {
  await initializationPromise
}

export function useAuth() {
  const user = computed(() => session.value?.user ?? null)
  const isAuthenticated = computed(() => Boolean(session.value?.user))
  const isAnonymous = computed(() => {
    if (!session.value?.user) {
      return false
    }

    return Boolean((session.value.user as { is_anonymous?: boolean }).is_anonymous)
  })

  return {
    hasSupabaseCredentials,
    isAuthenticated: readonly(isAuthenticated),
    isAnonymous: readonly(isAnonymous),
    initializationError: readonly(initializationError),
    isInitialized: readonly(isInitialized),
    isLoading: readonly(isLoading),
    session: readonly(session),
    user: readonly(user),
  }
}

function getAuthRedirectUrl(redirectPath?: string) {
  const redirectUrl = new URL('/auth/callback', window.location.origin)

  if (redirectPath) {
    redirectUrl.searchParams.set('redirect', redirectPath)
  }

  return redirectUrl.toString()
}

export async function signInWithMagicLink(email: string, redirectPath?: string) {
  if (!supabase) {
    throw new Error('Supabase credentials are missing.')
  }

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: getAuthRedirectUrl(redirectPath),
    },
  })

  if (error) {
    throw error
  }
}

export async function signInWithGoogle(redirectPath?: string) {
  if (!supabase) {
    throw new Error('Supabase credentials are missing.')
  }

  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: getAuthRedirectUrl(redirectPath),
    },
  })

  if (error) {
    throw error
  }
}

export async function completeMagicLinkSignIn() {
  if (!supabase) {
    throw new Error('Supabase credentials are missing.')
  }

  const currentUrl = new URL(window.location.href)
  const authCode = currentUrl.searchParams.get('code')
  const tokenHash = currentUrl.searchParams.get('token_hash')
  const type = currentUrl.searchParams.get('type')

  if (authCode) {
    const { error } = await supabase.auth.exchangeCodeForSession(authCode)

    if (error) {
      throw error
    }

    return
  }

  if (tokenHash && type === 'email') {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: 'email',
    })

    if (error) {
      throw error
    }

    return
  }

  const {
    data: { session: activeSession },
  } = await supabase.auth.getSession()

  if (!activeSession) {
    throw new Error('This sign-in link is missing the expected authentication data.')
  }
}

export async function signOut() {
  if (!supabase) {
    return
  }

  const { error } = await supabase.auth.signOut({ scope: 'local' })

  if (error) {
    throw error
  }
}
