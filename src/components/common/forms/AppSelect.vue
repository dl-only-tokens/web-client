<script setup lang="ts">
import { FormKit } from '@formkit/vue'
import { onClickOutside } from '@vueuse/core'
import { onMounted, ref } from 'vue'

import { FORM_ERROR_MESSAGE, ICON_NAME } from '@/enums'

import AppIcon from '../AppIcon.vue'
import FormKitStyledContainer from './FormKitStyledContainer.vue'

const props = defineProps<{
  name: string
  label: string
  defaultValue?: string
  options?: string[]
  placeholder?: string
  validation?: string
  disabled?: boolean
}>()

const emit = defineEmits(['change'])

const selectValue = ref(props.defaultValue)
const element = ref<HTMLElement | undefined>()
const isActive = ref(false)

const onInputClick = () => {
  if (props.disabled) {
    return
  }

  isActive.value = !isActive.value
}

onMounted(() => {
  if (element.value) {
    onClickOutside(element, () => {
      isActive.value = false
    })
  }
})
</script>

<template>
  <div :class="{ 'app-select': true, 'app-select_disabled': disabled }">
    <form-kit-styled-container :disabled="disabled">
      <form-kit
        ref="element"
        v-model="selectValue"
        type="text"
        :name="name"
        :label="label"
        :placeholder="placeholder"
        :validation="validation"
        :validation-messages="FORM_ERROR_MESSAGE"
        readonly="true"
        :config="{ validationVisibility: 'submit' }"
        @input="() => emit('change', selectValue)"
        @click="onInputClick"
      />
      <app-icon :name="ICON_NAME.arrowSelect" :class="{ active: isActive }" />
      <transition name="options">
        <div v-if="isActive && options?.length" class="app-select__options">
          <div
            v-for="option in options"
            :key="option"
            class="app-select__options__item"
            @click="() => (selectValue = option)"
          >
            <p class="app-select__options__item__name">{{ option }}</p>
          </div>
        </div>
      </transition>
    </form-kit-styled-container>
  </div>
</template>

<style lang="scss">
.options-enter-active,
.options-leave-active {
  transition: 0.2s ease-out;
  transition-property: opacity;
}

.options-enter-from,
.options-leave-to {
  opacity: 0;
}

.app-select {
  position: relative;

  &.app-select_disabled input {
    cursor: unset;

    color: var(--disable-primary);
    border: 1px solid var(--disable-primary);

    &:focus-visible {
      color: var(--disable-primary);
      border: 1px solid var(--disable-primary);
    }
  }

  input {
    cursor: pointer;
    user-select: none;

    height: 46px;
    width: 100%;
    padding: 0 16px;

    border-radius: 8px;
    border: 1px solid var(--border-secondary);
    background: transparent;

    font-family: var(--font-family-primary);
    color: var(--text-primary);
    font-size: 14px;
    line-height: 20px;

    &:focus-visible {
      border: 1px solid var(--text-secondary);
      color: var(--text-primary);
      outline: none;
    }
  }

  &__options {
    position: absolute;
    top: 82px;
    right: 0;
    width: 100%;
    border-radius: 8px;
    border: 1px solid var(--border-secondary);
    background: var(--bg-secondary);
    z-index: 10;
    overflow: hidden;

    &__item {
      cursor: pointer;
      user-select: none;

      height: 46px;
      display: flex;
      align-items: center;
      width: 100%;
      padding: 0 16px;

      transition: all 0.2s ease-in;

      &:not(:first-child) {
        border-top: 1px solid var(--border-secondary);
      }

      &:hover {
        background: var(--bg-tertiary);
      }
    }

    &__name {
      font-family: var(--font-family-primary);
      color: var(--text-primary);
      font-size: 14px;
      line-height: 20px;
      overflow: hidden;
      white-space: nowrap;
    }
  }

  .app-icon {
    position: absolute;
    top: 41px;
    right: 16px;

    transition: all 0.2s ease-in;

    &.active {
      transform: rotate(180deg);
    }
  }
}
</style>
