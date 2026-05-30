<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { completeMagicLinkSignIn } from '../lib/auth'

const route = useRoute()
const router = useRouter()

const errorMessage = ref('')

onMounted(async () => {
  try {
    await completeMagicLinkSignIn()

    const redirectTarget =
      typeof route.query.redirect === 'string' && route.query.redirect
        ? route.query.redirect
        : '/'

    await router.replace(redirectTarget)
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : 'Unable to complete the sign-in request.'
  }
})
</script>

<template>
  <section class="auth-callback">
    <div class="auth-callback__card">
      <p class="auth-callback__eyebrow">Signing you in</p>
      <h1 class="auth-callback__title">Completing your Orbit session.</h1>
      <p
        v-if="!errorMessage"
        class="auth-callback__text"
      >
        Hold on for a moment while we validate your magic link.
      </p>
      <p
        v-else
        class="auth-callback__error"
      >
        {{ errorMessage }}
      </p>
    </div>
  </section>
</template>

<style scoped lang="scss">
.auth-callback {
  min-height: 100%;
  display: grid;
  place-items: center;
}

.auth-callback__card {
  width: min(100%, 620px);
  padding: 32px;
  border: 1px solid $color-line;
  border-radius: $radius-lg;
  background: $color-panel-strong;
}

.auth-callback__eyebrow {
  margin: 0 0 10px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.78rem;
  color: $color-accent;
}

.auth-callback__title {
  margin: 0;
  font-family: $font-heading;
  font-size: clamp(2.1rem, 4vw, 3.4rem);
  letter-spacing: -0.03em;
  line-height: 0.95;
}

.auth-callback__text {
  margin: 16px 0 0;
  color: $color-muted;
}

.auth-callback__error {
  margin: 16px 0 0;
  padding: 14px 16px;
  border: 1px solid rgba(163, 53, 53, 0.25);
  border-radius: $radius-sm;
  background: rgba(163, 53, 53, 0.08);
  color: #8f2f2f;
}
</style>
