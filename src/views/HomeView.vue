<script setup lang="ts">
import { hasSupabaseCredentials } from '../lib/supabase'

const modules = [
  {
    title: 'Notes',
    blurb: 'Capture ideas, lists, and things you do not want to lose.',
    status: 'Ready to build',
  },
  {
    title: 'Water intake',
    blurb: 'Log glasses or milliliters and keep a simple daily streak.',
    status: 'Ready to build',
  },
  {
    title: 'Calories',
    blurb: 'Track meals quickly first, then add smarter summaries later.',
    status: 'Ready to build',
  },
]
</script>

<template>
  <section class="page">
    <div class="hero-panel">
      <div>
        <p class="eyebrow">Orbit MVP</p>
        <h1>A grounded home for your daily essentials.</h1>
        <p class="lede">
          This starter is ready for a modular productivity and health app with Vue Query,
          Supabase, and clear room to grow feature by feature.
        </p>
      </div>

      <div class="status-card">
        <p class="eyebrow">Backend status</p>
        <strong>{{ hasSupabaseCredentials ? 'Configured' : 'Awaiting env setup' }}</strong>
        <p>
          Add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> to start
          wiring real data.
        </p>
      </div>
    </div>

    <section class="section-grid">
      <article
        v-for="module in modules"
        :key="module.title"
        class="feature-card"
      >
        <p class="eyebrow">{{ module.status }}</p>
        <h2>{{ module.title }}</h2>
        <p>{{ module.blurb }}</p>
      </article>
    </section>

    <section class="plan-panel">
      <div>
        <p class="eyebrow">Suggested next move</p>
        <h2>Build notes first</h2>
        <p>
          Notes are the fastest way to validate auth, user-scoped tables, create/read/update/delete
          flows, and the overall app shell.
        </p>
      </div>

      <div class="checklist">
        <span>Supabase auth</span>
        <span>`profiles` + `notes` tables</span>
        <span>Vue Query hooks</span>
        <span>Protected routes</span>
      </div>
    </section>
  </section>
</template>

<style scoped lang="scss">
.page {
  display: grid;
  gap: 24px;
}

.hero-panel,
.feature-card,
.status-card,
.plan-panel {
  border: 1px solid $color-line;
  border-radius: $radius-md;
  background: $color-panel-strong;
}

.hero-panel {
  display: grid;
  grid-template-columns: minmax(0, 1.6fr) minmax(280px, 0.9fr);
  gap: 20px;
  padding: 28px;

  @include down('lg') {
    grid-template-columns: 1fr;
  }
}

.status-card,
.feature-card {
  padding: 22px;
}

.section-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;

  @include down('lg') {
    grid-template-columns: 1fr;
  }
}

.plan-panel {
  padding: 24px 28px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;

  @include down('lg') {
    flex-direction: column;
  }
}

.checklist {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: flex-end;

  @include down('lg') {
    justify-content: flex-start;
  }

  span {
    padding: 10px 14px;
    border-radius: 999px;
    background: $color-accent-soft;
    color: $color-accent;
    white-space: nowrap;
  }
}

h1 {
  margin: 0;
  font-family: $font-heading;
  font-size: clamp(2.5rem, 5vw, 4.8rem);
  line-height: 0.95;
  letter-spacing: -0.03em;

  @include down('sm') {
    font-size: 2.5rem;
  }
}

h2 {
  margin: 0 0 10px;
  font-family: $font-heading;
  font-size: 1.6rem;
  letter-spacing: -0.03em;
}

.lede {
  max-width: 62ch;
}
</style>
