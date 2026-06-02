<script setup lang="ts">
  import {computed} from 'vue';
  import {RouterLink} from 'vue-router';
  import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';
  import {
    faCompass,
    faGaugeHigh,
    faHouse,
    faRightToBracket,
  } from '@fortawesome/free-solid-svg-icons';

  import {useAuth} from '../lib/auth';

  const {hasSupabaseCredentials, isAuthenticated} = useAuth();

  const primaryAction = computed(() =>
    isAuthenticated.value || !hasSupabaseCredentials
      ? {
          label: 'Open dashboard',
          to: '/dashboard',
          icon: faGaugeHigh,
        }
      : {
          label: 'Sign in',
          to: '/auth?mode=sign-in&redirect=/dashboard',
          icon: faRightToBracket,
        },
  );
</script>

<template>
  <section class="not-found-page">
    <article class="not-found-card">
      <span class="not-found-card__icon">
        <FontAwesomeIcon :icon="faCompass" />
      </span>

      <p class="not-found-card__eyebrow">404</p>
      <h1 class="not-found-card__title">This orbit is empty.</h1>
      <p class="not-found-card__lede">
        The page you tried to open does not exist, or it moved out of this
        little daily system.
      </p>

      <div class="not-found-card__actions">
        <RouterLink
          class="not-found-card__action not-found-card__action--primary"
          :to="primaryAction.to"
        >
          <FontAwesomeIcon
            class="not-found-card__action-icon"
            :icon="primaryAction.icon"
          />
          <span>{{ primaryAction.label }}</span>
        </RouterLink>

        <RouterLink
          class="not-found-card__action not-found-card__action--secondary"
          to="/"
        >
          <FontAwesomeIcon class="not-found-card__action-icon" :icon="faHouse" />
          <span>Back home</span>
        </RouterLink>
      </div>
    </article>
  </section>
</template>

<style scoped lang="scss">
  .not-found-page {
    @include subtle-scrollbar;
    height: 100%;
    min-height: 0;
    overflow: auto;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .not-found-card {
    width: min(100%, 720px);
    padding: 34px;
    border: 1px solid $color-line;
    border-radius: $radius-lg;
    background:
      radial-gradient(
        circle at 88% 12%,
        rgba(13, 122, 102, 0.13),
        transparent 34%
      ),
      radial-gradient(
        circle at 12% 88%,
        rgba(195, 123, 48, 0.14),
        transparent 34%
      ),
      $color-panel-strong;
    box-shadow: 0 24px 70px rgba(61, 39, 17, 0.1);
  }

  .not-found-card__icon {
    width: 54px;
    height: 54px;
    display: inline-grid;
    place-items: center;
    border-radius: 18px;
    background: rgba(13, 122, 102, 0.1);
    color: $color-accent;
    font-size: 1.25rem;
  }

  .not-found-card__eyebrow {
    margin: 24px 0 12px;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    font-size: 0.78rem;
    color: $color-accent;
  }

  .not-found-card__title {
    margin: 0;
    font-family: $font-heading;
    font-size: clamp(2.6rem, 7vw, 5.4rem);
    line-height: 0.9;
    letter-spacing: -0.04em;
  }

  .not-found-card__lede {
    max-width: 56ch;
    margin: 18px 0 0;
    color: $color-muted;
    font-size: 1.08rem;
  }

  .not-found-card__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 28px;
  }

  .not-found-card__action {
    width: fit-content;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
    padding: 13px 18px;
    border-radius: 999px;
    text-decoration: none;
  }

  .not-found-card__action--primary {
    @include soft-accent-action-surface;
  }

  .not-found-card__action--secondary {
    @include soft-warm-action-surface;
  }

  .not-found-card__action-icon {
    font-size: 0.9rem;
  }
</style>
