<script setup lang="ts">
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
        @click="emit('refresh')"
      >
        {{ isRefreshing ? 'Refreshing...' : 'Refresh' }}
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
        class="water-timeline__state"
      >
        No water logged yet today. Start with one quick pour.
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
            Remove
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

.water-timeline__refresh,
.water-log__delete {
  width: fit-content;
  padding: 12px 16px;
  border: 0;
  border-radius: 999px;
  background: rgba(52, 37, 21, 0.08);
  color: $color-text;
  cursor: pointer;

  &:disabled {
    opacity: 0.65;
    cursor: wait;
  }
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
