<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faCheck, faTrashCan, faXmark } from '@fortawesome/free-solid-svg-icons'

import CaloriesOverlayModal from './CaloriesOverlayModal.vue'

const props = defineProps<{
  isOpen: boolean
  foodName: string
  isDeleting: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'confirm'): void
}>()
</script>

<template>
  <CaloriesOverlayModal
    :is-open="props.isOpen"
    compact
    @close="emit('close')"
  >
    <article class="calories-delete-modal">
      <div class="calories-delete-modal__header">
        <div>
          <p class="calories-delete-modal__eyebrow">Remove food</p>
          <h2 class="calories-delete-modal__title">Delete this food?</h2>
        </div>

        <button
          class="calories-delete-modal__close"
          type="button"
          aria-label="Close delete food dialog"
          @click="emit('close')"
        >
          <FontAwesomeIcon
            class="calories-delete-modal__button-icon"
            :icon="faXmark"
          />
        </button>
      </div>

      <div class="calories-confirm">
        <p class="calories-confirm__copy">
          <strong>{{ props.foodName }}</strong> will be removed from your food
          library. Any calorie entries linked to it will be removed as well.
        </p>

        <div class="calories-confirm__actions">
          <button
            class="calories-confirm__button calories-confirm__button--ghost"
            type="button"
            @click="emit('close')"
          >
            <FontAwesomeIcon
              class="calories-confirm__button-icon"
              :icon="faCheck"
            />
            <span>Keep food</span>
          </button>
          <button
            class="calories-confirm__button calories-confirm__button--danger"
            type="button"
            :disabled="props.isDeleting"
            @click="emit('confirm')"
          >
            <FontAwesomeIcon
              class="calories-confirm__button-icon"
              :icon="faTrashCan"
            />
            <span>{{ props.isDeleting ? 'Removing...' : 'Delete food' }}</span>
          </button>
        </div>
      </div>
    </article>
  </CaloriesOverlayModal>
</template>

<style scoped lang="scss">
.calories-delete-modal {
  border: 1px solid $color-line;
  border-radius: $radius-md;
  background: $color-panel-strong;
  padding: 22px;
  box-shadow: 0 32px 80px rgba(46, 31, 15, 0.18);
}

.calories-delete-modal__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 18px;
}

.calories-delete-modal__eyebrow {
  margin: 0 0 10px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.78rem;
  color: $color-accent;
}

.calories-delete-modal__title {
  margin: 0;
  font-family: $font-heading;
  letter-spacing: -0.03em;
}

.calories-delete-modal__close {
  @include soft-warm-action-surface;
  width: 42px;
  height: 42px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0;
  border-radius: 999px;
  cursor: pointer;
}

.calories-confirm {
  display: grid;
  gap: 18px;
}

.calories-confirm__copy {
  margin: 0;
  color: $color-muted;
  line-height: 1.6;
}

.calories-confirm__actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;

  @include down('sm') {
    flex-direction: column-reverse;
  }
}

.calories-confirm__button {
  @include tactile-button-surface;
  width: fit-content;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  border-radius: 999px;
  cursor: pointer;

  &:disabled {
    opacity: 0.65;
    cursor: wait;
  }

  @include down('sm') {
    width: 100%;
  }
}

.calories-confirm__button--ghost {
  @include soft-accent-action-surface;
}

.calories-confirm__button--danger {
  @include soft-danger-action-surface;
}

.calories-delete-modal__button-icon,
.calories-confirm__button-icon {
  font-size: 0.9rem;
}
</style>
