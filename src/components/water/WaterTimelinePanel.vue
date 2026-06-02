<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faArrowsRotate, faDroplet, faTrashCan } from '@fortawesome/free-solid-svg-icons'

import type { WaterLog } from '../../types/water-log'

defineProps<{
  isLoading: boolean
  isRefreshing: boolean
  isDeleting: boolean
  isCreating: boolean
  hasTodayLogs: boolean
  todayLogs: WaterLog[]
}>()

const emit = defineEmits<{
  (e: 'refresh'): void
  (e: 'remove', logId: string): void
}>()

function formatTimestamp(timestamp: string) {
  return new Intl.DateTimeFormat('en', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(timestamp))
}
</script>

<template>
  <div class="water-timeline">
    <div class="water-timeline__header">
      <div>
        <p class="water-timeline__eyebrow">Today's timeline</p>
        <h2 class="water-timeline__title">Recent pours</h2>
      </div>

      <button
        class="water-timeline__refresh"
        type="button"
        :disabled="isLoading || isRefreshing"
        :aria-busy="isRefreshing"
        @click="emit('refresh')"
      >
        <FontAwesomeIcon :icon="faArrowsRotate" />
        <span>{{ isRefreshing ? 'Refreshing...' : 'Refresh' }}</span>
      </button>
    </div>

    <div class="water-timeline__content">
      <div
        v-if="isLoading"
        class="water-timeline__state"
      >
        Loading water logs...
      </div>

      <div
        v-else-if="!hasTodayLogs"
        class="water-timeline__state water-timeline__state--empty"
      >
        <span class="water-timeline__state-icon">
          <FontAwesomeIcon :icon="faDroplet" />
        </span>
        <span class="water-timeline__state-copy">
          <strong class="water-timeline__state-title">
            No water logged today
          </strong>
          <span class="water-timeline__state-text">
            Start with one quick pour and your timeline will begin filling in here.
          </span>
        </span>
      </div>

      <template v-else>
        <article
          v-for="log in todayLogs"
          :key="log.id"
          class="water-log"
        >
          <div class="water-log__drop"></div>

          <div class="water-log__copy">
            <p class="water-log__amount">{{ log.amount_ml }} ml</p>
            <p class="water-log__time">{{ formatTimestamp(log.logged_at) }}</p>
          </div>

          <button
            class="water-log__delete"
            type="button"
            :disabled="isDeleting || isCreating"
            @click="emit('remove', log.id)"
          >
            <FontAwesomeIcon
              class="water-log__delete-icon"
              :icon="faTrashCan"
            />
            <span>Remove</span>
          </button>
        </article>
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
.water-timeline,
.water-timeline__state,
.water-log {
  border: 1px solid $color-line;
  border-radius: $radius-md;
  background: $color-panel-strong;
}

.water-timeline {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  max-height: min(560px, 62vh);
  padding: 22px;
}

.water-timeline__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
}

.water-timeline__eyebrow {
  margin: 0 0 10px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.78rem;
  color: $color-accent;
}

.water-timeline__title {
  margin: 0;
  font-family: $font-heading;
  font-size: 1.8rem;
  letter-spacing: -0.03em;
}

.water-timeline__refresh {
  @include refresh-action-button;
}

.water-log__delete {
  @include tactile-button-surface(
    rgba(163, 53, 53, 0.18),
    rgba(163, 53, 53, 0.2),
    rgba(61, 39, 17, 0.08)
  );
  width: fit-content;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-radius: 999px;
  background: rgba(163, 53, 53, 0.1);
  color: #8f2f2f;
  cursor: pointer;
  @include tactile-hover-lift(
    rgba(163, 53, 53, 0.16),
    rgba(163, 53, 53, 0.28),
    #7f2929
  );

  &:disabled {
    opacity: 0.65;
    cursor: wait;
  }
}

.water-log__delete-icon {
  font-size: 0.9rem;
}

.water-timeline__content {
  @include subtle-scrollbar;
  min-height: 0;
  overflow: auto;
  display: grid;
  gap: 12px;
  margin-top: 20px;
  padding-right: 6px;
}

.water-timeline__state {
  padding: 24px;
}

.water-timeline__state--empty {
  @include soft-empty-state;
  border-color: rgba(13, 122, 102, 0.18);
  background: rgba(13, 122, 102, 0.1);
}

.water-timeline__state-icon {
  @include soft-empty-state-icon;
  background: rgba(13, 122, 102, 0.14);
}

.water-timeline__state-copy {
  min-width: 0;
  display: grid;
  gap: 6px;
}

.water-timeline__state-title {
  font-family: $font-heading;
  font-size: 1.25rem;
  letter-spacing: -0.03em;
}

.water-timeline__state-text {
  color: $color-muted;
  line-height: 1.55;
}

.water-log {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 14px;
  padding: 16px 18px;

  @include down('sm') {
    grid-template-columns: auto minmax(0, 1fr);
  }
}

.water-log__drop {
  width: 16px;
  height: 22px;
  border-radius: 10px 10px 12px 12px;
  background: linear-gradient(180deg, rgba(34, 161, 137, 0.95) 0%, rgba(13, 122, 102, 0.95) 100%);
  transform: rotate(12deg);
  box-shadow: 0 10px 20px rgba(13, 122, 102, 0.18);
}

.water-log__copy {
  min-width: 0;
}

.water-log__amount,
.water-log__time {
  margin: 0;
}

.water-log__amount {
  font-family: $font-heading;
  font-size: 1.35rem;
}

.water-log__time {
  color: $color-muted;
}

.water-log__delete {
  @include down('sm') {
    grid-column: 2;
    justify-self: start;
  }
}
</style>
