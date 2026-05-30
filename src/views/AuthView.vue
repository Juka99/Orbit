<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

import { signInWithMagicLink, useAuth } from '../lib/auth'

const route = useRoute()
const email = ref('')
const successMessage = ref('')
const errorMessage = ref('')
const isSubmitting = ref(false)

const { hasSupabaseCredentials, initializationError, isAnonymous, isAuthenticated, user } =
  useAuth()

const userEmail = computed(() => user.value?.email ?? '')
const redirectTarget = computed(() => {
  return typeof route.query.redirect === 'string' ? route.query.redirect : undefined
})

async function handleSubmit() {
  if (!email.value) {
    errorMessage.value = 'Enter your email address first.'
    successMessage.value = ''
    return
  }

  isSubmitting.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    await signInWithMagicLink(email.value.trim(), redirectTarget.value)
    successMessage.value = 'Magic link sent. Check your inbox and open the email on this device.'
    email.value = ''
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Unable to send magic link.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <section class="auth-page">
    <div class="auth-page__card">
      <p class="auth-page__eyebrow">Auth kept in reserve</p>
      <h1 class="auth-page__title">Orbit now enters through a guest session by default.</h1>
      <p class="auth-page__lede">
        The email flow still exists in the codebase, but it is hidden from the main UI while we
        focus on building the app.
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
        You are already signed in as
        <strong>{{ isAnonymous ? 'a guest user' : userEmail }}</strong>.
        <RouterLink class="auth-page__notice-link" to="/">Go to dashboard</RouterLink>
      </div>

      <div
        v-else-if="initializationError"
        class="auth-page__notice auth-page__notice--warning"
      >
        Guest session setup failed: <strong>{{ initializationError }}</strong>
      </div>

      <form
        v-else
        class="auth-page__form"
        @submit.prevent="handleSubmit"
      >
        <p class="auth-page__hint">
          If you still want to use a magic link during development, you can request one here.
        </p>

        <label class="auth-page__field">
          <span class="auth-page__label">Email address</span>
          <input
            v-model="email"
            class="auth-page__input"
            type="email"
            placeholder="you@example.com"
            autocomplete="email"
          />
        </label>

        <button
          class="auth-page__submit"
          type="submit"
          :disabled="isSubmitting"
        >
          {{ isSubmitting ? 'Sending link...' : 'Send magic link' }}
        </button>

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
  min-height: 100%;
  display: grid;
  place-items: center;
}

.auth-page__card {
  width: min(100%, 620px);
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

.auth-page__hint {
  margin: 0;
  color: $color-muted;
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
  width: 100%;
  padding: 14px 16px;
  border: 1px solid $color-line;
  border-radius: $radius-sm;
  background: rgba(255, 255, 255, 0.7);
  color: $color-text;

  &:focus {
    outline: 2px solid rgba(13, 122, 102, 0.2);
    border-color: $color-accent;
  }
}

.auth-page__submit {
  width: fit-content;
  padding: 14px 20px;
  border: 0;
  border-radius: 999px;
  background: linear-gradient(135deg, $color-accent 0%, $color-accent-strong 100%);
  color: $color-white;
  cursor: pointer;

  &:disabled {
    opacity: 0.65;
    cursor: wait;
  }
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
</style>
