<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faRightToBracket, faUserPlus } from '@fortawesome/free-solid-svg-icons'
import { RouterLink, useRoute, useRouter } from 'vue-router'

import { signInWithPassword, signUpWithPassword, useAuth } from '../lib/auth'

type AuthMode = 'sign-in' | 'sign-up'

const route = useRoute()
const router = useRouter()
const email = ref('')
const password = ref('')
const successMessage = ref('')
const errorMessage = ref('')
const isSubmitting = ref(false)

const { hasSupabaseCredentials, initializationError, isAuthenticated, user } = useAuth()

const userEmail = computed(() => user.value?.email ?? '')
const redirectTarget = computed(() => {
  return typeof route.query.redirect === 'string' ? route.query.redirect : undefined
})
const authMode = computed<AuthMode>(() =>
  route.query.mode === 'sign-up' ? 'sign-up' : 'sign-in',
)
const normalizedRedirectTarget = computed(() =>
  redirectTarget.value && redirectTarget.value !== '/' ? redirectTarget.value : '/dashboard',
)
const authTitle = computed(() =>
  authMode.value === 'sign-in' ? 'Try Orbit.' : 'Create a demo account.',
)
const authHint = computed(() =>
  authMode.value === 'sign-in'
    ? 'Use an existing demo account, or create a fresh one to explore the app.'
    : 'Use any email-style address and a password with at least 6 characters.',
)
const submitLabel = computed(() => {
  if (authMode.value === 'sign-in') {
    return isSubmitting.value ? 'Signing in...' : 'Sign in'
  }

  return isSubmitting.value ? 'Creating account...' : 'Create account'
})
const submitIcon = computed(() =>
  authMode.value === 'sign-in' ? faRightToBracket : faUserPlus,
)

async function handleSubmit() {
  if (!email.value) {
    errorMessage.value = 'Enter your email address first.'
    successMessage.value = ''
    return
  }

  if (password.value.length < 6) {
    errorMessage.value = 'Enter a password with at least 6 characters.'
    successMessage.value = ''
    return
  }

  isSubmitting.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    if (authMode.value === 'sign-in') {
      await signInWithPassword(email.value.trim(), password.value)
      await router.replace(normalizedRedirectTarget.value)
      return
    }

    const { session } = await signUpWithPassword(email.value.trim(), password.value)

    if (session) {
      await router.replace(normalizedRedirectTarget.value)
      return
    }

    successMessage.value = 'Account created. You can sign in with that email and password.'
    password.value = ''
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : 'Unable to complete authentication.'
  } finally {
    isSubmitting.value = false
  }
}

const signInRoute = computed(() => ({
  name: 'auth',
  query: {
    mode: 'sign-in',
    redirect: normalizedRedirectTarget.value,
  },
}))
const signUpRoute = computed(() => ({
  name: 'auth',
  query: {
    mode: 'sign-up',
    redirect: normalizedRedirectTarget.value,
  },
}))

watch(authMode, () => {
  email.value = ''
  password.value = ''
  successMessage.value = ''
  errorMessage.value = ''
})
</script>

<template>
  <section class="auth-page">
      <div class="auth-page__card">
        <p class="auth-page__eyebrow">Private Orbit</p>
      <Transition
        name="auth-copy"
        mode="out-in"
      >
        <h1
          :key="authTitle"
          class="auth-page__title"
        >
          {{ authTitle }}
        </h1>
      </Transition>
      <p class="auth-page__lede">
        This portfolio demo uses Supabase email/password auth, so every reviewer gets their own
        private notes, habits, water logs, and meals while testing.
      </p>

      <div
        v-if="!hasSupabaseCredentials"
        class="auth-page__notice auth-page__notice--warning"
      >
        Supabase credentials are missing. Add them to <code>.env.local</code> first.
      </div>

      <div
        v-else-if="isAuthenticated"
        class="auth-page__notice auth-page__notice--success"
      >
        You are already signed in as <strong>{{ userEmail }}</strong>.
        <RouterLink class="auth-page__notice-link" to="/dashboard">Go to dashboard</RouterLink>
      </div>

      <div
        v-else-if="initializationError"
        class="auth-page__notice auth-page__notice--warning"
      >
        Authentication setup failed: <strong>{{ initializationError }}</strong>
      </div>

      <form
        v-else
        class="auth-page__form"
        @submit.prevent="handleSubmit"
      >
        <div class="auth-page__mode-toggle">
          <RouterLink
            class="auth-page__mode-button"
            :class="{ 'auth-page__mode-button--active': authMode === 'sign-in' }"
            :to="signInRoute"
          >
            Sign in
          </RouterLink>
          <RouterLink
            class="auth-page__mode-button"
            :class="{ 'auth-page__mode-button--active': authMode === 'sign-up' }"
            :to="signUpRoute"
          >
            Create account
          </RouterLink>
        </div>

        <div class="auth-page__form-stage">
          <p
            class="auth-page__hint"
          >
            {{ authHint }}
          </p>

          <p class="auth-page__demo-note">
            No email confirmation is required for this showcase build.
          </p>

          <label class="auth-page__field">
            <span class="auth-page__label">Email address</span>
            <input
              v-model="email"
              class="auth-page__input"
              type="email"
              placeholder="demo@example.com"
              autocomplete="email"
            />
          </label>

          <label class="auth-page__field">
            <span class="auth-page__label">Password</span>
            <input
              v-model="password"
              class="auth-page__input"
              type="password"
              placeholder="At least 6 characters"
              :autocomplete="authMode === 'sign-in' ? 'current-password' : 'new-password'"
            />
          </label>

          <button
            class="auth-page__submit"
            type="submit"
            :disabled="isSubmitting"
          >
            <FontAwesomeIcon
              class="auth-page__submit-icon"
              :icon="submitIcon"
            />
            <span>{{ submitLabel }}</span>
          </button>
        </div>

        <p
          v-if="successMessage"
          class="auth-page__feedback auth-page__feedback--success"
        >
          {{ successMessage }}
        </p>

        <p
          v-if="errorMessage"
          class="auth-page__feedback auth-page__feedback--error"
        >
          {{ errorMessage }}
        </p>
      </form>
    </div>
  </section>
</template>

<style scoped lang="scss">
.auth-page {
  height: 100%;
  min-height: 0;
  display: grid;
  place-items: center;
  overflow: hidden;
}

.auth-page__card {
  @include subtle-scrollbar;
  width: min(100%, 620px);
  max-height: 100%;
  overflow: auto;
  padding: 32px;
  border: 1px solid $color-line;
  border-radius: $radius-lg;
  background: $color-panel-strong;
}

.auth-page__eyebrow {
  margin: 0 0 10px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.78rem;
  color: $color-accent;
}

.auth-page__title {
  margin: 0;
  font-family: $font-heading;
  font-size: clamp(2.3rem, 5vw, 4rem);
  letter-spacing: -0.03em;
  line-height: 0.95;
}

.auth-copy-enter-active,
.auth-copy-leave-active {
  transition:
    opacity 160ms ease,
    transform 200ms cubic-bezier(0.22, 1, 0.36, 1),
    filter 200ms ease;
}

.auth-copy-enter-from {
  opacity: 0;
  transform: translate3d(0, 8px, 0) scale(0.996);
  filter: blur(3px);
}

.auth-copy-leave-to {
  opacity: 0;
  transform: translate3d(0, -4px, 0) scale(0.998);
  filter: blur(2px);
}

.auth-page__lede {
  margin: 14px 0 0;
  color: $color-muted;
  font-size: 1.08rem;
}

.auth-page__form {
  margin-top: 28px;
  display: grid;
  gap: 18px;
}

.auth-page__form-stage {
  display: grid;
  gap: 18px;
}

.auth-page__hint {
  margin: 0;
  color: $color-muted;
}

.auth-page__demo-note {
  margin: -4px 0 0;
  padding: 12px 14px;
  border: 1px solid rgba(13, 122, 102, 0.16);
  border-radius: $radius-sm;
  background: rgba(13, 122, 102, 0.07);
  color: $color-muted;
}

.auth-page__mode-toggle {
  width: fit-content;
  display: inline-flex;
  gap: 6px;
  padding: 6px;
  border: 1px solid $color-line;
  border-radius: 999px;
  background: rgba(52, 37, 21, 0.06);
}

.auth-page__mode-button {
  padding: 10px 14px;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: $color-muted;
  cursor: pointer;
  text-decoration: none;
  transition:
    background-color 0.18s ease,
    color 0.18s ease;

  &:hover,
  &--active {
    background: $color-panel-strong;
    color: $color-text;
  }
}

.auth-page__field {
  display: grid;
  gap: 10px;
}

.auth-page__label {
  font-size: 0.95rem;
  color: $color-muted;
}

.auth-page__input {
  @include soft-form-control;
}

.auth-page__submit {
  @include soft-accent-action-surface;
  width: fit-content;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 20px;
  border-radius: 999px;
  cursor: pointer;

  &:disabled {
    opacity: 0.65;
    cursor: wait;
  }
}

.auth-page__submit-icon {
  font-size: 0.9rem;
}

.auth-page__notice,
.auth-page__feedback {
  margin-top: 24px;
  padding: 14px 16px;
  border-radius: $radius-sm;
}

.auth-page__notice {
  color: $color-text;
  background: rgba(52, 37, 21, 0.06);
}

.auth-page__notice--warning {
  border: 1px solid rgba(193, 126, 56, 0.35);
}

.auth-page__notice--success,
.auth-page__feedback--success {
  border: 1px solid rgba(13, 122, 102, 0.28);
  background: rgba(13, 122, 102, 0.09);
}

.auth-page__feedback--error {
  border: 1px solid rgba(163, 53, 53, 0.25);
  background: rgba(163, 53, 53, 0.08);
  color: #8f2f2f;
}

.auth-page__notice-link {
  margin-left: 8px;
  color: $color-accent;
}

@media (prefers-reduced-motion: reduce) {
  .auth-copy-enter-active,
  .auth-copy-leave-active {
    transition: opacity 120ms linear;
  }

  .auth-copy-enter-from,
  .auth-copy-leave-to {
    transform: none;
    filter: none;
  }
}
</style>
