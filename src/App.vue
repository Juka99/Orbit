<script setup lang="ts">
  import {computed, onBeforeUnmount, onMounted, ref} from 'vue';
  import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';
  import {
    faAnglesLeft,
    faAnglesRight,
    faDroplet,
    faGaugeHigh,
    faNoteSticky,
    faUtensils,
  } from '@fortawesome/free-solid-svg-icons';
  import {RouterView, useRoute} from 'vue-router';

  import {useAuth} from './lib/auth';

  const route = useRoute();
  const {hasSupabaseCredentials, isAnonymous, isAuthenticated, user} =
    useAuth();
  const sidebarRef = ref<HTMLElement | null>(null);
  const showFloatingNav = ref(false);
  const isDesktopSidebarCollapsed = ref(false);

  const SIDEBAR_STORAGE_KEY = 'orbit.sidebar.collapsed';

  const navigationItems = [
    {to: '/', label: 'Dashboard', icon: faGaugeHigh},
    {to: '/notes', label: 'Notes', icon: faNoteSticky},
    {to: '/water', label: 'Water', icon: faDroplet},
    {to: '/calories', label: 'Calories', icon: faUtensils},
  ];

  const accountLabel = computed(() => {
    if (isAnonymous.value) {
      return 'Guest session';
    }

    return user.value?.email ?? '';
  });

  const sidebarToggleIcon = computed(() =>
    isDesktopSidebarCollapsed.value ? faAnglesRight : faAnglesLeft,
  );

  const sidebarToggleLabel = computed(() =>
    isDesktopSidebarCollapsed.value ? 'Expand sidebar' : 'Collapse sidebar',
  );

  let sidebarObserver: IntersectionObserver | null = null;
  let mobileMediaQuery: MediaQueryList | null = null;
  const handleViewportChange = () => updateFloatingNavVisibility();

  function updateFloatingNavVisibility(entries?: IntersectionObserverEntry[]) {
    const isCompactViewport = mobileMediaQuery?.matches ?? false;

    if (!isCompactViewport) {
      showFloatingNav.value = false;
      return;
    }

    if (entries?.[0]) {
      showFloatingNav.value = !entries[0].isIntersecting;
      return;
    }

    const sidebarBounds = sidebarRef.value?.getBoundingClientRect();

    if (!sidebarBounds) {
      showFloatingNav.value = false;
      return;
    }

    showFloatingNav.value = sidebarBounds.bottom <= 120;
  }

  function toggleDesktopSidebar() {
    isDesktopSidebarCollapsed.value = !isDesktopSidebarCollapsed.value;
    window.localStorage.setItem(
      SIDEBAR_STORAGE_KEY,
      String(isDesktopSidebarCollapsed.value),
    );
  }

  onMounted(() => {
    mobileMediaQuery = window.matchMedia('(max-width: 1100px)');

    const savedSidebarState = window.localStorage.getItem(SIDEBAR_STORAGE_KEY);
    isDesktopSidebarCollapsed.value = savedSidebarState === 'true';

    mobileMediaQuery.addEventListener('change', handleViewportChange);

    if (sidebarRef.value) {
      sidebarObserver = new IntersectionObserver(updateFloatingNavVisibility, {
        threshold: 0.3,
        rootMargin: '-64px 0px -30% 0px',
      });

      sidebarObserver.observe(sidebarRef.value);
    }

    updateFloatingNavVisibility();
  });

  onBeforeUnmount(() => {
    mobileMediaQuery?.removeEventListener('change', handleViewportChange);
    sidebarObserver?.disconnect();
  });
</script>

<template>
  <div
    class="orbit-shell"
    :class="{'orbit-shell--collapsed': isDesktopSidebarCollapsed}"
  >
    <aside ref="sidebarRef" class="orbit-shell__sidebar">
      <div class="orbit-shell__sidebar-top">
        <a class="orbit-shell__brand" href="/">
          <span class="orbit-shell__brand-mark">O</span>
          <div class="orbit-shell__brand-copy">
            <strong class="orbit-shell__brand-title">Orbit</strong>
            <p class="orbit-shell__brand-text">
              Keep your essentials in check.
            </p>
          </div>
        </a>
      </div>

      <nav class="orbit-shell__nav">
        <RouterLink
          v-for="item in navigationItems"
          :key="item.to"
          :to="item.to"
          class="orbit-shell__nav-link"
          :class="{'orbit-shell__nav-link--active': route.path === item.to}"
        >
          <FontAwesomeIcon class="orbit-shell__nav-icon" :icon="item.icon" />
          <span class="orbit-shell__nav-label">{{ item.label }}</span>
        </RouterLink>
      </nav>

      <div class="orbit-shell__stack-card">
        <template v-if="hasSupabaseCredentials && isAuthenticated">
          <p class="orbit-shell__stack-label">Session</p>
          <p class="orbit-shell__stack-copy">{{ accountLabel }}</p>
          <p class="orbit-shell__stack-hint">
            Orbit now enters through a default guest session while email sign-in
            stays available in the codebase for later.
          </p>
        </template>

        <template v-else-if="hasSupabaseCredentials">
          <p class="orbit-shell__stack-label">Session</p>
          <p class="orbit-shell__stack-copy">
            Orbit is preparing a guest session for this browser.
          </p>
        </template>

        <template v-else>
          <p class="orbit-shell__stack-label">Starter stack</p>
          <ul class="orbit-shell__stack-list">
            <li>Vue 3 + TypeScript</li>
            <li>Vue Router</li>
            <li>Vue Query</li>
            <li>Supabase-ready</li>
          </ul>
        </template>
      </div>

      <button
        class="orbit-shell__collapse-button"
        type="button"
        :aria-label="sidebarToggleLabel"
        @click="toggleDesktopSidebar"
      >
        <FontAwesomeIcon
          class="orbit-shell__collapse-icon"
          :icon="sidebarToggleIcon"
        />
      </button>
    </aside>

    <main class="orbit-shell__main">
      <RouterView v-slot="{Component, route: activeRoute}">
        <Transition name="orbit-route" mode="out-in">
          <div :key="activeRoute.fullPath" class="orbit-shell__route-stage">
            <component :is="Component" />
          </div>
        </Transition>
      </RouterView>
    </main>

    <Transition name="orbit-floating-nav">
      <nav
        v-if="showFloatingNav"
        class="orbit-shell__floating-nav"
        aria-label="Quick navigation"
      >
        <RouterLink
          v-for="item in navigationItems"
          :key="`${item.to}-floating`"
          :to="item.to"
          class="orbit-shell__floating-link"
          :class="{
            'orbit-shell__floating-link--active': route.path === item.to,
          }"
        >
          <FontAwesomeIcon
            class="orbit-shell__floating-icon"
            :icon="item.icon"
          />
          <span class="orbit-shell__floating-label">{{ item.label }}</span>
        </RouterLink>
      </nav>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
  .orbit-shell {
    --orbit-sidebar-width: 280px;
    height: 100vh;
    display: grid;
    grid-template-columns: var(--orbit-sidebar-width) minmax(0, 1fr);
    gap: 24px;
    padding: 24px;
    transition: grid-template-columns 280ms cubic-bezier(0.22, 1, 0.36, 1);

    &.orbit-shell--collapsed {
      --orbit-sidebar-width: 108px;
    }

    @include down('lg') {
      height: auto;
      min-height: 100vh;
      grid-template-columns: 1fr;
      align-content: start;
      padding: 18px 18px 108px;
    }

    @include down('sm') {
      padding: 14px 14px 98px;
      gap: 14px;
    }
  }

  .orbit-shell__sidebar-top {
    display: flex;
    align-items: flex-start;
    gap: 12px;
  }

  .orbit-shell__sidebar,
  .orbit-shell__main {
    @include glass-panel;
  }

  .orbit-shell__sidebar {
    position: relative;
    border-radius: $radius-lg;
    padding: 24px;
    min-height: 0;
    display: flex;
    flex-direction: column;
    gap: 24px;
    transition:
      padding 280ms cubic-bezier(0.22, 1, 0.36, 1),
      border-radius 280ms cubic-bezier(0.22, 1, 0.36, 1);

    @include down('sm') {
      padding: 18px;
      border-radius: 24px;
    }

    @include down('lg') {
      gap: 12px;
      padding: 18px 20px;
    }
  }

  .orbit-shell__collapse-button {
    width: 42px;
    height: 42px;
    position: absolute;
    top: calc(50% + 200px);
    right: -21px;
    transform: translateY(-50%);
    flex: 0 0 auto;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid $color-line;
    border-radius: 999px;
    background: rgba(255, 248, 241, 0.92);
    color: $color-muted;
    cursor: pointer;
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.76),
      0 14px 28px rgba(61, 39, 17, 0.12);
    z-index: 3;
    transition:
      background-color 0.2s ease,
      color 0.2s ease,
      transform 0.2s ease,
      box-shadow 0.2s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.96);
      color: $color-text;
      transform: translateY(calc(-50% - 1px));
    }

    @include down('lg') {
      display: none;
    }
  }

  .orbit-shell__collapse-icon {
    font-size: 0.95rem;
  }

  .orbit-shell__main {
    position: relative;
    overflow: hidden;
    min-height: 0;
    border-radius: 36px;
    padding: 32px;

    @include down('sm') {
      padding: 18px;
      border-radius: 24px;
    }

    @include down('lg') {
      padding: 20px;
    }
  }

  .orbit-shell__route-stage {
    height: 100%;
    min-height: 0;
  }

  .orbit-route-enter-active,
  .orbit-route-leave-active {
    transition:
      opacity 160ms ease,
      transform 200ms cubic-bezier(0.22, 1, 0.36, 1),
      filter 200ms ease;
  }

  .orbit-route-enter-from {
    opacity: 0;
    transform: translate3d(0, 8px, 0) scale(0.996);
    filter: blur(3px);
  }

  .orbit-route-leave-to {
    opacity: 0;
    transform: translate3d(0, -4px, 0) scale(0.998);
    filter: blur(2px);
  }

  .orbit-floating-nav-enter-active,
  .orbit-floating-nav-leave-active {
    transition:
      opacity 180ms ease,
      transform 220ms cubic-bezier(0.22, 1, 0.36, 1),
      filter 220ms ease;
  }

  .orbit-floating-nav-enter-from,
  .orbit-floating-nav-leave-to {
    opacity: 0;
    transform: translate3d(0, 14px, 0) scale(0.96);
    filter: blur(10px);
  }

  @media (prefers-reduced-motion: reduce) {
    .orbit-route-enter-active,
    .orbit-route-leave-active,
    .orbit-floating-nav-enter-active,
    .orbit-floating-nav-leave-active {
      transition: opacity 120ms linear;
    }

    .orbit-route-enter-from,
    .orbit-route-leave-to,
    .orbit-floating-nav-enter-from,
    .orbit-floating-nav-leave-to {
      transform: none;
      filter: none;
    }
  }

  .orbit-shell__brand {
    display: flex;
    align-items: center;
    gap: 14px;
    min-width: 0;
    transition: gap 280ms cubic-bezier(0.22, 1, 0.36, 1);

    @include down('lg') {
      gap: 12px;
    }
  }

  .orbit-shell__brand-title {
    display: block;
    font-family: $font-heading;
    font-size: 1.8rem;
    letter-spacing: -0.03em;

    @include down('lg') {
      font-size: 1.45rem;
    }
  }

  .orbit-shell__brand-copy {
    min-width: 0;
    transition:
      opacity 200ms ease,
      transform 240ms cubic-bezier(0.22, 1, 0.36, 1),
      max-width 280ms cubic-bezier(0.22, 1, 0.36, 1);
  }

  .orbit-shell__brand-text {
    margin: 0;
    color: $color-muted;

    @include down('lg') {
      font-size: 0.92rem;
    }

    @include down('sm') {
      display: none;
    }
  }

  .orbit-shell__brand-mark {
    width: 52px;
    height: 52px;
    display: grid;
    place-items: center;
    border-radius: 16px;
    background: linear-gradient(
      135deg,
      $color-accent 0%,
      $color-accent-strong 100%
    );
    color: $color-white;
    font-family: $font-heading;
    font-size: 1.8rem;

    @include down('lg') {
      width: 44px;
      height: 44px;
      border-radius: 14px;
      font-size: 1.5rem;
    }
  }

  .orbit-shell__nav {
    display: grid;
    gap: 10px;
    transition: gap 280ms cubic-bezier(0.22, 1, 0.36, 1);

    @include down('lg') {
      display: flex;
      gap: 8px;
      align-items: stretch;
      justify-content: space-between;
    }
  }

  .orbit-shell__nav-link {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 12px 14px;
    border-radius: $radius-sm;
    color: $color-muted;
    transition:
      transform 0.2s ease,
      background-color 0.2s ease,
      color 0.2s ease;

    &:hover,
    &--active {
      background: $color-accent-soft;
      color: $color-text;
      transform: translateX(3px);
    }

    @include down('lg') {
      flex: 1 1 0;
      min-width: 0;
      justify-content: center;
      flex-direction: column;
      gap: 6px;
      padding: 10px 8px;
      border-radius: 18px;

      &:hover,
      &--active {
        transform: none;
      }
    }
  }

  .orbit-shell__nav-icon {
    font-size: 0.98rem;
    transition: transform 220ms cubic-bezier(0.22, 1, 0.36, 1);

    @include down('lg') {
      font-size: 1rem;
    }
  }

  .orbit-shell__nav-label {
    transition:
      opacity 180ms ease,
      transform 220ms cubic-bezier(0.22, 1, 0.36, 1),
      max-width 280ms cubic-bezier(0.22, 1, 0.36, 1);

    @include down('lg') {
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 0.75rem;
      line-height: 1.1;
    }
  }

  .orbit-shell__stack-card {
    margin-top: auto;
    padding: 18px;
    border: 1px solid $color-line;
    border-radius: $radius-md;
    background: $color-panel-strong;
    transition:
      opacity 180ms ease,
      transform 220ms cubic-bezier(0.22, 1, 0.36, 1),
      max-height 280ms cubic-bezier(0.22, 1, 0.36, 1),
      padding 220ms ease,
      margin 220ms ease;

    @include down('lg') {
      margin-top: 0;
      padding: 12px 14px;
    }
  }

  .orbit-shell__stack-label {
    margin: 0 0 10px;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    font-size: 0.78rem;
    color: $color-accent;

    @include down('lg') {
      margin-bottom: 6px;
    }
  }

  .orbit-shell__stack-list {
    margin: 12px 0 0;
    padding-left: 18px;
    color: $color-muted;
  }

  .orbit-shell__stack-copy {
    margin: 0;
    color: $color-muted;

    @include down('lg') {
      font-size: 0.9rem;
    }
  }

  .orbit-shell__stack-hint {
    margin: 12px 0 0;
    color: $color-muted;
    font-size: 0.95rem;

    @include down('lg') {
      display: none;
    }
  }

@media (min-width: 1101px) {
  .orbit-shell--collapsed {
    .orbit-shell__sidebar {
      padding: 24px 18px;
      align-items: center;
    }

    .orbit-shell__sidebar-top {
      width: 100%;
      justify-content: center;
    }

    .orbit-shell__brand {
      width: 100%;
      justify-content: center;
      gap: 0;
    }

    .orbit-shell__brand-copy {
      opacity: 0;
      max-width: 0;
      overflow: hidden;
      transform: translateX(-8px);
      pointer-events: none;
    }

    .orbit-shell__nav {
      width: 100%;
    }

    .orbit-shell__nav-link {
      justify-content: center;
      gap: 0;
      padding: 14px 12px;

      &:hover,
      &--active {
        transform: translateY(-1px);
      }
    }

    .orbit-shell__nav-icon {
      transform: scale(1.04);
    }

    .orbit-shell__nav-label {
      opacity: 0;
      max-width: 0;
      overflow: hidden;
      transform: translateX(-6px);
      pointer-events: none;
    }

    .orbit-shell__stack-card {
      width: 100%;
      max-height: 0;
      margin: 0;
      padding-top: 0;
      padding-bottom: 0;
      overflow: hidden;
      opacity: 0;
      transform: translateY(8px);
      border-color: transparent;
    }

    .orbit-shell__collapse-button {
      right: -18px;
    }
  }
}

  .orbit-shell__floating-nav {
    display: none;

    @include down('lg') {
      @include glass-panel;
      position: fixed;
      left: 16px;
      right: 16px;
      bottom: 14px;
      z-index: 24;
      display: flex;
      align-items: stretch;
      justify-content: space-between;
      gap: 8px;
      padding: 10px;
      border-radius: 24px;
      background: rgba(255, 248, 241, 0.72);
      box-shadow:
        0 20px 44px rgba(61, 39, 17, 0.16),
        inset 0 1px 0 rgba(255, 255, 255, 0.72);
    }
  }

  .orbit-shell__floating-link {
    flex: 1 1 0;
    min-width: 0;
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 10px 8px;
    border-radius: 18px;
    color: $color-muted;
    transition:
      background-color 0.2s ease,
      color 0.2s ease,
      transform 0.2s ease,
      box-shadow 0.2s ease;

    &:hover,
    &--active {
      color: $color-text;
      background: rgba(255, 255, 255, 0.5);
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.72),
        0 10px 22px rgba(61, 39, 17, 0.08);
      transform: translateY(-1px);
    }
  }

  .orbit-shell__floating-icon {
    font-size: 1rem;
  }

  .orbit-shell__floating-label {
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 0.75rem;
    line-height: 1.1;
  }

  @media (prefers-reduced-motion: reduce) {
    .orbit-shell,
    .orbit-shell__sidebar,
    .orbit-shell__brand,
    .orbit-shell__brand-copy,
    .orbit-shell__nav,
    .orbit-shell__nav-icon,
    .orbit-shell__nav-label,
    .orbit-shell__stack-card,
    .orbit-shell__collapse-button {
      transition: none;
    }
  }
</style>
