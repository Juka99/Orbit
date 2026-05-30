<script setup lang="ts">
defineProps<{
  notesCount: number
  hasNotes: boolean
}>()
</script>

<template>
  <header class="notes-hero">
    <div class="notes-hero__copy">
      <p class="notes-hero__eyebrow">First real module</p>
      <h1 class="notes-hero__title">Notes</h1>
      <p class="notes-hero__lede">
        Capture ideas, scratch notes, and personal reminders in one place.
      </p>
    </div>

    <div class="notes-hero__card">
      <p class="notes-hero__label">Your note space</p>
      <strong class="notes-hero__value">{{ notesCount }}</strong>
      <p class="notes-hero__text">
        {{ hasNotes ? 'Notes loaded from Supabase.' : 'Create your first note to get started.' }}
      </p>
    </div>
  </header>
</template>

<style scoped lang="scss">
.notes-hero {
  display: grid;
  grid-template-columns: minmax(0, 1.7fr) minmax(220px, 0.8fr);
  gap: 18px;

  @include down('lg') {
    grid-template-columns: 1fr;
  }
}

.notes-hero__card {
  padding: 22px;
  border: 1px solid $color-line;
  border-radius: $radius-md;
  background: $color-panel-strong;
}

.notes-hero__eyebrow {
  margin: 0 0 10px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.78rem;
  color: $color-accent;
}

.notes-hero__title {
  margin: 0;
  font-family: $font-heading;
  font-size: clamp(2.3rem, 4vw, 4rem);
  letter-spacing: -0.03em;
}

.notes-hero__lede,
.notes-hero__text,
.notes-hero__label {
  color: $color-muted;
}

.notes-hero__label {
  margin: 0;
  font-size: 0.9rem;
}

.notes-hero__value {
  display: block;
  margin: 12px 0 10px;
  font-family: $font-heading;
  font-size: 3rem;
  line-height: 1;
}

.notes-hero__text {
  margin: 0;
}
</style>
