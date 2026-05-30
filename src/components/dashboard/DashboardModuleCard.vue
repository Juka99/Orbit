<script setup lang="ts">
  import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';
  import type {IconDefinition} from '@fortawesome/fontawesome-svg-core';

  defineProps<{
    eyebrow: string;
    title: string;
    description: string;
    to: string;
    actionLabel: string;
    actionIcon?: IconDefinition;
    loading?: boolean;
    loadingText?: string;
    errorText?: string;
  }>();
</script>

<template>
  <article class="dashboard-module-card">
    <div class="dashboard-module-card__header">
      <p class="dashboard-module-card__eyebrow">{{ eyebrow }}</p>
      <h2 class="dashboard-module-card__title">{{ title }}</h2>
      <p class="dashboard-module-card__description">{{ description }}</p>
    </div>

    <div class="dashboard-module-card__content">
      <p
        v-if="errorText"
        class="dashboard-module-card__state dashboard-module-card__state--error"
      >
        {{ errorText }}
      </p>
      <p v-else-if="loading" class="dashboard-module-card__state">
        {{ loadingText ?? 'Loading module…' }}
      </p>
      <slot v-else />
    </div>

    <RouterLink class="dashboard-module-card__link" :to="to">
      <FontAwesomeIcon
        v-if="actionIcon"
        class="dashboard-module-card__link-icon"
        :icon="actionIcon"
      />
      <span>{{ actionLabel }}</span>
    </RouterLink>
  </article>
</template>

<style scoped lang="scss">
  .dashboard-module-card {
    display: grid;
    gap: 18px;
    border: 1px solid $color-line;
    border-radius: $radius-md;
    background: $color-panel-strong;
    padding: 22px;
  }

  .dashboard-module-card__header {
    display: grid;
    gap: 10px;
  }

  .dashboard-module-card__eyebrow {
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    font-size: 0.78rem;
    color: $color-accent;
  }

  .dashboard-module-card__title {
    margin: 0;
    font-family: $font-heading;
    font-size: 1.7rem;
    letter-spacing: -0.03em;
  }

  .dashboard-module-card__description,
  .dashboard-module-card__state {
    margin: 0;
    color: $color-muted;
  }

  .dashboard-module-card__state--error {
    color: #9a4f3f;
  }

  .dashboard-module-card__content {
    display: grid;
    gap: 14px;
  }

  .dashboard-module-card__link {
    width: fit-content;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    border-radius: 999px;
    background: rgba(13, 122, 102, 0.1);
    color: $color-accent;
    text-decoration: none;
    align-self: end;
    transition:
      transform 180ms ease,
      background-color 180ms ease;

    &:hover {
      transform: translateY(-1px);
      background: rgba(13, 122, 102, 0.16);
    }
  }

  .dashboard-module-card__link-icon {
    font-size: 0.92rem;
    padding-right: 4px;
  }
</style>
