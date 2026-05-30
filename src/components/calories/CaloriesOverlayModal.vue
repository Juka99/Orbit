<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    isOpen: boolean
    compact?: boolean
  }>(),
  {
    compact: false,
  },
)

const emit = defineEmits<{
  (e: 'close'): void
}>()
</script>

<template>
  <Teleport to="body">
    <Transition name="calories-modal">
      <div
        v-if="props.isOpen"
        class="calories-overlay-modal"
      >
        <div
          class="calories-overlay-modal__backdrop"
          @click="emit('close')"
        ></div>

        <div
          class="calories-overlay-modal__dialog"
          :class="{
            'calories-overlay-modal__dialog--compact': props.compact,
          }"
        >
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.calories-overlay-modal {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: grid;
  place-items: center;
  padding: 24px;

  @include down('sm') {
    padding: 12px;
  }
}

.calories-overlay-modal__backdrop {
  position: absolute;
  inset: 0;
  background: rgba(44, 31, 19, 0.28);
  backdrop-filter: blur(10px);
  will-change: opacity, backdrop-filter;
}

.calories-overlay-modal__dialog {
  position: relative;
  width: min(920px, calc(100vw - 48px));
  max-height: min(88vh, 920px);
  will-change: opacity, transform, filter;

  @include down('sm') {
    width: 100%;
    max-height: min(90vh, 1000px);
  }
}

.calories-overlay-modal__dialog--compact {
  width: min(520px, calc(100vw - 48px));
}

.calories-modal-enter-active .calories-overlay-modal__backdrop,
.calories-modal-leave-active .calories-overlay-modal__backdrop {
  transition:
    opacity 220ms ease,
    backdrop-filter 260ms ease;
}

.calories-modal-enter-active .calories-overlay-modal__dialog,
.calories-modal-leave-active .calories-overlay-modal__dialog {
  transition:
    opacity 220ms ease,
    transform 280ms cubic-bezier(0.22, 1, 0.36, 1),
    filter 280ms ease;
}

.calories-modal-enter-from .calories-overlay-modal__backdrop,
.calories-modal-leave-from .calories-overlay-modal__backdrop,
.calories-modal-leave-to .calories-overlay-modal__backdrop {
  transition-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
}

.calories-modal-enter-from .calories-overlay-modal__backdrop,
.calories-modal-leave-to .calories-overlay-modal__backdrop {
  opacity: 0;
  backdrop-filter: blur(0);
}

.calories-modal-leave-from .calories-overlay-modal__backdrop {
  opacity: 1;
  backdrop-filter: blur(10px);
}

.calories-modal-enter-from .calories-overlay-modal__dialog,
.calories-modal-leave-from .calories-overlay-modal__dialog,
.calories-modal-leave-to .calories-overlay-modal__dialog {
  transition-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
}

.calories-modal-enter-from .calories-overlay-modal__dialog,
.calories-modal-leave-to .calories-overlay-modal__dialog {
  opacity: 0;
  transform: translate3d(0, 18px, 0) scale(0.97);
  filter: blur(8px);
}

.calories-modal-leave-from .calories-overlay-modal__dialog {
  opacity: 1;
  transform: translate3d(0, 0, 0) scale(1);
  filter: blur(0);
}
</style>
