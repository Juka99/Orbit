<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faNoteSticky, faThumbtack } from '@fortawesome/free-solid-svg-icons'

import DashboardModuleCard from './DashboardModuleCard.vue'
import type { DashboardNotePreview } from './types'

defineProps<{
  isLoading: boolean
  errorText: string
  notesCount: number
  pinnedNotesCount: number
  headline: string
  recentNotes: DashboardNotePreview[]
}>()
</script>

<template>
  <DashboardModuleCard
    eyebrow="Notes"
    title="Thoughts and capture"
    description="Keep important ideas within reach, then jump back into editing when something needs attention."
    to="/notes"
    action-label="Open notes"
    :action-icon="faNoteSticky"
    :loading="isLoading"
    loading-text="Loading notes…"
    :error-text="errorText"
  >
    <div class="dashboard-notes-card__metric-strip">
      <div class="dashboard-notes-card__metric-pill">
        <FontAwesomeIcon
          class="dashboard-notes-card__metric-icon"
          :icon="faNoteSticky"
        />
        <div class="dashboard-notes-card__metric-label-value">
          <span class="dashboard-notes-card__metric-label">Saved</span>
          <strong class="dashboard-notes-card__metric-value">{{ notesCount }}</strong>
        </div>
      </div>

      <div class="dashboard-notes-card__metric-pill">
        <FontAwesomeIcon
          class="dashboard-notes-card__metric-icon"
          :icon="faThumbtack"
        />
        <div class="dashboard-notes-card__metric-label-value">
          <span class="dashboard-notes-card__metric-label">Pinned</span>
          <strong class="dashboard-notes-card__metric-value">{{ pinnedNotesCount }}</strong>
        </div>
      </div>
    </div>

    <p class="dashboard-notes-card__copy">{{ headline }}</p>

    <ul
      v-if="recentNotes.length > 0"
      class="dashboard-notes-card__list"
    >
      <li
        v-for="note in recentNotes"
        :key="note.id"
        class="dashboard-notes-card__item"
      >
        <span class="dashboard-notes-card__item-icon">
          <FontAwesomeIcon :icon="faNoteSticky" />
        </span>
        <span class="dashboard-notes-card__item-copy">
          <strong class="dashboard-notes-card__item-title">
            {{ note.title || 'Untitled note' }}
          </strong>
          <span class="dashboard-notes-card__item-meta">{{ note.updatedAtLabel }}</span>
        </span>
      </li>
    </ul>
  </DashboardModuleCard>
</template>

<style scoped lang="scss">
.dashboard-notes-card__metric-strip {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;

  @include down('sm') {
    grid-template-columns: 1fr;
  }
}

.dashboard-notes-card__metric-pill {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  border: 1px solid $color-line;
  border-radius: $radius-sm;
  background: rgba(255, 255, 255, 0.56);
}

.dashboard-notes-card__metric-label-value {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.dashboard-notes-card__metric-icon {
  color: #8a5621;
}

.dashboard-notes-card__metric-label,
.dashboard-notes-card__item-meta,
.dashboard-notes-card__copy {
  color: $color-muted;
}

.dashboard-notes-card__metric-label {
  font-size: 0.9rem;
}

.dashboard-notes-card__metric-value,
.dashboard-notes-card__item-title {
  font-family: $font-heading;
  letter-spacing: -0.03em;
}

.dashboard-notes-card__metric-value {
  font-size: 1.2rem;
}

.dashboard-notes-card__list {
  display: grid;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.dashboard-notes-card__item {
  display: grid;
  align-items: center;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 10px;
  padding: 12px;
  border: 1px solid rgba(195, 123, 48, 0.16);
  border-radius: $radius-sm;
  background: rgba(195, 123, 48, 0.08);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.54);
}

.dashboard-notes-card__item-icon {
  width: 34px;
  height: 34px;
  display: inline-grid;
  place-items: center;
  border-radius: 12px;
  background: rgba(195, 123, 48, 0.14);
  color: #8a5621;
}

.dashboard-notes-card__item-copy {
  min-width: 0;
  display: grid;
  gap: 3px;
}

.dashboard-notes-card__item-title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 600;
}

.dashboard-notes-card__item-meta {
  font-size: 0.88rem;
}
</style>
