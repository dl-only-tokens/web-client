<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'
import { onMounted, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    isShown: boolean
    isCloseByClickOutside: boolean
    title?: string
  }>(),
  {
    isShown: false,
    isCloseByClickOutside: true,
    title: undefined,
  },
)
const emit = defineEmits(['update:is-shown'])

const modalPane = ref<HTMLElement | undefined>()

onMounted(() => {
  if (modalPane.value) {
    if (props.isCloseByClickOutside) {
      onClickOutside(modalPane, () => {
        closeModal()
      })
    }
  }
})

const closeModal = () => {
  emit('update:is-shown', false)
}
</script>

<template>
  <teleport to="body">
    <transition name="modal">
      <div v-show="isShown" class="modal">
        <div ref="modalPane" class="modal-pane">
          <slot />
        </div>
      </div>
    </transition>
  </teleport>
</template>

<style lang="scss" scoped>
$modal-z-index: 10;

.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: var(--overlay);
  backdrop-filter: blur(4px);
  z-index: 10;
  overflow-y: auto;

  @include respond-to(medium) {
    padding: 0 24px;
  }

  .modal-pane {
    background: var(--bg-primary);
    max-width: 612px;
    width: 612px;
    border-radius: 16px;

    @include respond-to(medium) {
      max-width: 516px;
      width: 100%;
    }
  }
}

.modal-enter-active,
.modal-leave-active {
  transition: 0.3s ease-out;
  transition-property: opacity, transform;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(1.1);
}
</style>
