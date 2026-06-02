<script setup lang="ts">
  import {computed} from 'vue';
  import {RouterLink} from 'vue-router';
  import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';
  import {
    faGaugeHigh,
    faRightToBracket,
    faUserPlus,
  } from '@fortawesome/free-solid-svg-icons';

  import orbitLogo from '../assets/orbitLogoMain.png';
  import orbitShowcase from '../assets/orbitShowcase.mp4';
  import {useAuth} from '../lib/auth';

  const {isAuthenticated} = useAuth();

  const primaryAction = computed(() =>
    isAuthenticated.value
      ? {label: 'Open dashboard', to: '/dashboard', icon: faGaugeHigh}
      : {
          label: 'Create demo account',
          to: '/auth?mode=sign-up&redirect=/dashboard',
          icon: faUserPlus,
        },
  );
</script>

<template>
  <section class="landing-page">
    <header class="landing-hero">
      <div class="landing-hero__brand">
        <img class="landing-hero__logo" :src="orbitLogo" alt="Orbit" />
        <span class="landing-hero__brand-name">Orbit</span>
      </div>

      <div class="landing-hero__body">
        <div class="landing-hero__copy">
          <p class="landing-hero__eyebrow">Portfolio productivity app</p>
          <h1 class="landing-hero__title">Orbit</h1>
          <p class="landing-hero__lede">
            A calm daily dashboard for notes, hydration, calories, and habits,
            built as a full-stack Vue and Supabase showcase.
          </p>
          <div class="landing-hero__actions">
            <RouterLink
              class="landing-hero__action landing-hero__action--primary"
              :to="primaryAction.to"
            >
              <FontAwesomeIcon
                class="landing-hero__action-icon"
                :icon="primaryAction.icon"
              />
              <span>{{ primaryAction.label }}</span>
            </RouterLink>
            <RouterLink
              v-if="!isAuthenticated"
              class="landing-hero__action landing-hero__action--secondary"
              to="/auth?mode=sign-in&redirect=/dashboard"
            >
              <FontAwesomeIcon
                class="landing-hero__action-icon"
                :icon="faRightToBracket"
              />
              <span>Sign in</span>
            </RouterLink>
          </div>
        </div>

        <div class="landing-hero__showcase">
          <video
            class="landing-hero__video"
            :src="orbitShowcase"
            autoplay
            muted
            loop
            playsinline
            preload="metadata"
            aria-label="Orbit app showcase"
          ></video>
        </div>
      </div>
    </header>
  </section>
</template>

<style scoped lang="scss">
  .landing-page {
    @include subtle-scrollbar;
    height: 100%;
    min-height: 0;
    overflow: auto;
    display: grid;
    gap: 24px;
  }

  .landing-hero {
    min-height: min(640px, calc(100vh - 64px));
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 30px;
    padding: 34px;
    border: 1px solid $color-line;
    border-radius: $radius-lg;
    background:
      linear-gradient(
        135deg,
        rgba(255, 250, 244, 0.9),
        rgba(240, 231, 216, 0.66)
      ),
      radial-gradient(
        circle at 75% 18%,
        rgba(13, 122, 102, 0.16),
        transparent 34%
      ),
      radial-gradient(
        circle at 18% 78%,
        rgba(193, 126, 56, 0.18),
        transparent 36%
      ),
      $color-panel-strong;
    overflow: auto;

    @include down('sm') {
      padding: 24px;
    }
  }

  .landing-hero__brand {
    width: min(100%, 1720px);
    display: inline-flex;
    align-items: center;
    gap: 14px;
    align-self: center;
  }

  .landing-hero__logo {
    width: 72px;

    @include down('sm') {
      width: 56px;
    }
  }

  .landing-hero__brand-name {
    font-family: $font-heading;
    font-size: 1.65rem;
    letter-spacing: -0.03em;
  }

  .landing-hero__copy {
    flex: 0 1 760px;
    max-width: 760px;
    display: flex;
    flex-direction: column;
    gap: 20px;

    @include down('lg') {
      flex-basis: auto;
    }
  }

  .landing-hero__body {
    width: min(100%, 1720px);
    flex: 1 1 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    align-self: center;
    gap: clamp(28px, 5vw, 82px);
    transform: translateY(-40px);

    @include down('lg') {
      flex-direction: column;
      align-items: stretch;
      transform: unset;
    }
  }

  .landing-hero__showcase {
    flex: 1 1 680px;
    min-width: 460px;
    width: 100%;
    max-width: 1040px;
    border: 1px solid rgba(13, 122, 102, 0.14);
    border-radius: 28px;
    padding: 8px;
    background: rgba(255, 252, 247, 0.72);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.7),
      0 28px 70px rgba(61, 39, 17, 0.14);

    @include down('lg') {
      min-width: 0;
      max-width: none;
      flex: 0;
    }
  }

  .landing-hero__video {
    width: 100%;
    display: block;
    aspect-ratio: 16 / 9;
    border-radius: 22px;
    // background: rgba(13, 122, 102, 0.08);
    object-fit: contain;
  }

  .landing-hero__eyebrow {
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    font-size: 0.78rem;
    color: $color-accent;
  }

  .landing-hero__title {
    margin: 0;
    font-family: $font-heading;
    font-size: clamp(4rem, 14vw, 9rem);
    line-height: 0.82;
    letter-spacing: -0.04em;
  }

  .landing-hero__lede {
    max-width: 58ch;
    margin: 0;
    color: $color-muted;
    font-size: clamp(1.05rem, 2vw, 1.28rem);
  }

  .landing-hero__actions {
    width: min(100%, 1720px);
    display: flex;
    flex-wrap: wrap;
    align-self: center;
    gap: 12px;
    margin-top: 8px;
  }

  .landing-hero__action {
    width: fit-content;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
    padding: 13px 18px;
    border-radius: 999px;
    text-decoration: none;
    &:hover {
      transform: translateY(-1px);
    }
  }

  .landing-hero__action--primary {
    @include soft-accent-action-surface;
  }

  .landing-hero__action--secondary {
    @include soft-warm-action-surface;
  }

  .landing-hero__action-icon {
    font-size: 0.9rem;
  }
</style>
