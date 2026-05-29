<script setup lang="ts">
  import {RouterLink, RouterView, useRoute} from 'vue-router';

  // Comment for first commit
  const route = useRoute();

  const navigationItems = [
    {to: '/', label: 'Dashboard'},
    {to: '/notes', label: 'Notes'},
    {to: '/water', label: 'Water'},
    {to: '/calories', label: 'Calories'},
  ];
</script>

<template>
  <div class="app-shell">
    <aside class="sidebar">
      <RouterLink class="brand" to="/">
        <span class="brand__mark">O</span>
        <div>
          <strong>Orbit</strong>
          <p>Keep your essentials in check.</p>
        </div>
      </RouterLink>

      <nav class="nav">
        <RouterLink
          v-for="item in navigationItems"
          :key="item.to"
          :to="item.to"
          class="nav__link"
          :class="{'nav__link--active': route.path === item.to}"
        >
          {{ item.label }}
        </RouterLink>
      </nav>

      <div class="sidebar-card">
        <p class="eyebrow">Starter stack</p>
        <ul>
          <li>Vue 3 + TypeScript</li>
          <li>Vue Router</li>
          <li>Vue Query</li>
          <li>Supabase-ready</li>
        </ul>
      </div>
    </aside>

    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped lang="scss">
  .app-shell {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 280px minmax(0, 1fr);
    gap: 24px;
    padding: 24px;

    @include down('lg') {
      grid-template-columns: 1fr;
    }

    @include down('sm') {
      padding: 14px;
      gap: 14px;
    }
  }

  .sidebar,
  .main-content {
    @include glass-panel;
  }

  .sidebar {
    border-radius: $radius-lg;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 24px;

    @include down('sm') {
      padding: 18px;
      border-radius: 24px;
    }
  }

  .main-content {
    border-radius: 36px;
    padding: 32px;

    @include down('sm') {
      padding: 18px;
      border-radius: 24px;
    }
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 14px;

    strong {
      display: block;
      font-family: $font-heading;
      font-size: 1.8rem;
      letter-spacing: -0.03em;
    }

    p {
      margin: 0;
      color: $color-muted;
    }
  }

  .brand__mark {
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
  }

  .nav {
    display: grid;
    gap: 10px;
  }

  .nav__link {
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
  }

  .sidebar-card {
    margin-top: auto;
    padding: 18px;
    border: 1px solid $color-line;
    border-radius: $radius-md;
    background: $color-panel-strong;

    ul {
      margin: 12px 0 0;
      padding-left: 18px;
      color: $color-muted;
    }
  }
</style>
