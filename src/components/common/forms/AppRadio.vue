<script setup lang="ts">
import { FormKit } from '@formkit/vue'
import { ref, watch } from 'vue'

import { FORM_ERROR_MESSAGES } from '@/enums'

import FormKitStyledContainer from './FormKitStyledContainer.vue'
import { AppRadioOptions } from './types'

const props = defineProps<{
  name: string
  label: string
  options: AppRadioOptions[]
  validation?: string
  disabled?: boolean
}>()

const radioValue = ref()

const emit = defineEmits(['change'])

const onChange = (v: string) => {
  if (props.disabled) {
    return
  }

  emit('change', v)
}

watch(
  () => props.options,
  () => {
    radioValue.value = undefined
  },
)
</script>

<template>
  <div :class="{ 'app-radio': true, disabled: disabled }">
    <form-kit-styled-container>
      <form-kit
        v-model="radioValue"
        type="radio"
        :name="name"
        :label="label"
        :options="options"
        :validation="validation"
        :validation-messages="FORM_ERROR_MESSAGES"
        :disabled="disabled"
        @input="onChange"
      />
    </form-kit-styled-container>
  </div>
</template>

<style lang="scss">
@mixin disabled-options {
  color: var(--disable-secondary);
  cursor: default;

  &:after {
    background: var(--disable-secondary);
  }

  &:hover {
    border-color: var(--border-tertiary);
  }
}
.app-radio {
  &.disabled {
    legend {
      color: var(--disable-primary);
    }

    .formkit-options {
      .formkit-option .formkit-label {
        @include disabled-options;
      }
    }
  }

  legend {
    color: var(--text-primary);
    font-family: var(--font-family-inter);
    font-size: 14px;
    line-height: 20px;

    display: block;
    margin-bottom: 12px;
  }

  .formkit-options {
    display: flex;
    gap: 12px;

    .formkit-wrapper[data-checked='true'] {
      .formkit-label {
        background: var(--gradient-primary);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        color: transparent;

        &:hover {
          border-color: unset;
        }
      }
    }

    .formkit-option[data-disabled='true'] .formkit-label {
      @include disabled-options;
    }

    .formkit-inner {
      display: none;
    }

    .formkit-label {
      cursor: pointer;
      user-select: none;

      display: flex;
      padding: 0 16px;
      justify-content: center;
      align-items: center;
      border-radius: 15px;
      width: max-content;
      min-height: 46px;
      height: 46px;

      color: var(--text-primary);
      font-size: 16px;
      font-weight: 500;
      line-height: 24px;

      position: relative;

      z-index: 0;

      border: 1px solid var(--border-tertiary);

      &:before {
        content: '';
        position: absolute;
        z-index: -1;
        inset: 0;
        border: 2px solid transparent;
        border-radius: 15px;
        background: inherit;
        background-origin: border-box;
        background-clip: border-box;
        mask:
          linear-gradient(#fff 0 0) padding-box,
          linear-gradient(#fff 0 0);
        -webkit-mask:
          linear-gradient(#fff 0 0) padding-box,
          linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        mask-composite: exclude;
        mask-repeat: no-repeat;
        -webkit-mask-repeat: no-repeat;
      }

      &:hover {
        border-color: var(--text-primary);
      }
    }
  }
}
</style>
