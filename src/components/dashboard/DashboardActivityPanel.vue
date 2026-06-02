<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faNoteSticky } from '@fortawesome/free-solid-svg-icons'

import type { DashboardActivityItem } from './types'

defineProps<{
  items: DashboardActivityItem[]
}>()
</script>

<template>
  <article class="dashboard-activity-panel">
    <div class="dashboard-activity-panel__header">
      <div>
        <p class="dashboard-activity-panel__eyebrow">Recently touched</p>
        <h2 class="dashboard-activity-panel__title">What moved most recently</h2>
      </div>
      <RouterLink
        class="dashboard-activity-panel__link"
        to="/notes"
      >
        <FontAwesomeIcon
          class="dashboard-activity-panel__link-icon"
          :icon="faNoteSticky"
        />
        <span>View notes</span>
      </RouterLink>
    </div>

    <ul class="dashboard-activity-panel__list">
      <li
        v-for="item in items"
        :key="item.id"
        class="dashboard-activity-panel__item"
      >
        <span class="dashboard-activity-panel__label">{{ item.label }}</span>
        <strong class="dashboard-activity-panel__item-title">{{ item.title }}</strong>
        <span class="dashboard-activity-panel__meta">{{ item.meta }}</span>
      </li>
    </ul>
  </article>
</template>

<style scoped lang="scss">
.dashboard-activity-panel {
  display: grid;
  gap: 18px;
  padding: 24px;
  border: 1px solid $color-line;
  border-radius: $radius-md;
  background: $color-panel-strong;
}

.dashboard-activity-panel__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;

  @include down('sm') {
    flex-direction: column;
  }
}

.dashboard-activity-panel__eyebrow {
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.78rem;
  color: $color-accent;
}

.dashboard-activity-panel__title {
  margin: 10px 0 0;
  font-family: $font-heading;
  font-size: 1.8rem;
  letter-spacing: -0.03em;
}

.dashboard-activity-panel__link {
  @include tactile-button-surface(rgba(13, 122, 102, 0.18), rgba(13, 122, 102, 0.22));
  width: fit-content;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-radius: 999px;
  background: rgba(13, 122, 102, 0.1);
  color: $color-accent;
  text-decoration: none;
  white-space: nowrap;

  &:hover {
    transform: translateY(-1px);
    background: rgba(13, 122, 102, 0.16);
  }
}

.dashboard-activity-panel__link-icon {
  font-size: 0.92rem;
  padding-right: 4px;
}

.dashboard-activity-panel__list {
  display: grid;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.dashboard-activity-panel__item {
  display: grid;
  gap: 6px;
  padding: 14px;
  border: 1px solid $color-line;
  border-radius: $radius-sm;
  background: rgba(255, 255, 255, 0.56);
}

.dashboard-activity-panel__label,
.dashboard-activity-panel__meta {
  color: $color-muted;
}

.dashboard-activity-panel__label {
  font-size: 0.9rem;
}

.dashboard-activity-panel__item-title {
  font-family: $font-heading;
  font-size: 1.2rem;
  letter-spacing: -0.03em;
}
</style>
